from fastapi import FastAPI, HTTPException, Depends, status, Header
from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional, List
import uuid
from datetime import datetime

app = FastAPI(title="API Service", version="1.0.0")

# ===== REQUEST/RESPONSE SCHEMAS =====

class UserCreate(BaseModel):
    """Schema for creating a new user."""
    username: str = Field(..., min_length=3, max_length=50, description="Unique username")
    email: EmailStr = Field(..., description="Valid email address")
    password: str = Field(..., min_length=8, description="Password (min 8 characters)")
    full_name: Optional[str] = Field(None, max_length=100, description="User's full name")
    
    @validator('username')
    def username_alphanumeric(cls, v):
        if not v.isalnum():
            raise ValueError('Username must be alphanumeric')
        return v.lower()

class UserUpdate(BaseModel):
    """Schema for updating user (all fields optional)."""
    email: Optional[EmailStr] = None
    full_name: Optional[str] = Field(None, max_length=100)
    password: Optional[str] = Field(None, min_length=8)

class UserResponse(BaseModel):
    """Schema for user response (excludes sensitive data)."""
    id: str
    username: str
    email: str
    full_name: Optional[str]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True  # For SQLAlchemy models

class UserListResponse(BaseModel):
    """Schema for paginated user list."""
    data: List[UserResponse]
    pagination: dict

class ErrorResponse(BaseModel):
    """Standard error response."""
    error: str
    code: str
    details: Optional[dict] = None

# ===== DEPENDENCIES =====

async def get_current_user(authorization: str = Header(None)) -> dict:
    """
    Dependency to get current authenticated user from JWT token.
    
    Raises:
        HTTPException: 401 if token is invalid or missing
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    token = authorization.replace("Bearer ", "")
    
    try:
        # Validate token and get user
        user = await validate_jwt_token(token)
        return user
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )

async def require_admin(current_user: dict = Depends(get_current_user)) -> dict:
    """
    Dependency to require admin role.
    
    Raises:
        HTTPException: 403 if user is not admin
    """
    if not current_user.get("is_admin"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user

# ===== CRUD ENDPOINTS =====

@app.post(
    "/api/users",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["users"],
    summary="Create a new user",
    responses={
        201: {"description": "User created successfully"},
        400: {"model": ErrorResponse, "description": "Validation error"},
        401: {"model": ErrorResponse, "description": "Unauthorized"},
        409: {"model": ErrorResponse, "description": "User already exists"}
    }
)
async def create_user(
    user_data: UserCreate,
    current_user: dict = Depends(get_current_user)
):
    """
    Create a new user account.
    
    Requirements:
    - Username must be unique and alphanumeric (3-50 chars)
    - Email must be valid and unique
    - Password must be at least 8 characters
    - Requires authentication
    """
    # Check if username or email already exists
    existing_user = await db.find_user_by_username_or_email(
        user_data.username, 
        user_data.email
    )
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Username or email already exists"
        )
    
    # Hash password
    password_hash = await hash_password(user_data.password)
    
    # Create user record
    new_user = await db.create_user(
        id=str(uuid.uuid4()),
        username=user_data.username,
        email=user_data.email,
        password_hash=password_hash,
        full_name=user_data.full_name,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    
    return new_user

@app.get(
    "/api/users",
    response_model=UserListResponse,
    tags=["users"],
    summary="List users with pagination"
)
async def list_users(
    page: int = 1,
    limit: int = 20,
    search: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    """
    List users with pagination and optional search.
    
    Query parameters:
    - page: Page number (default: 1)
    - limit: Items per page (default: 20, max: 100)
    - search: Search by username or email
    """
    if limit > 100:
        limit = 100
    
    offset = (page - 1) * limit
    
    users, total = await db.list_users(
        offset=offset,
        limit=limit,
        search=search
    )
    
    return {
        "data": users,
        "pagination": {
            "page": page,
            "per_page": limit,
            "total": total,
            "total_pages": (total + limit - 1) // limit
        }
    }

@app.get(
    "/api/users/{user_id}",
    response_model=UserResponse,
    tags=["users"],
    summary="Get user by ID"
)
async def get_user(
    user_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Get a specific user by ID."""
    user = await db.get_user(user_id)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with ID {user_id} not found"
        )
    
    return user

@app.patch(
    "/api/users/{user_id}",
    response_model=UserResponse,
    tags=["users"],
    summary="Update user"
)
async def update_user(
    user_id: str,
    user_data: UserUpdate,
    current_user: dict = Depends(get_current_user)
):
    """
    Update user fields (partial update).
    
    Only provided fields will be updated.
    Users can only update their own profile unless they're admin.
    """
    # Check authorization
    if user_id != current_user["id"] and not current_user.get("is_admin"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Can only update own profile"
        )
    
    # Check if user exists
    existing_user = await db.get_user(user_id)
    if not existing_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with ID {user_id} not found"
        )
    
    # Prepare update data
    update_data = user_data.dict(exclude_unset=True)
    
    # Hash password if provided
    if "password" in update_data:
        update_data["password_hash"] = await hash_password(update_data.pop("password"))
    
    # Update timestamp
    update_data["updated_at"] = datetime.utcnow()
    
    # Perform update
    updated_user = await db.update_user(user_id, update_data)
    
    return updated_user

@app.delete(
    "/api/users/{user_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    tags=["users"],
    summary="Delete user"
)
async def delete_user(
    user_id: str,
    admin: dict = Depends(require_admin)
):
    """
    Delete a user (admin only).
    
    Returns: 204 No Content on success
    """
    existing_user = await db.get_user(user_id)
    if not existing_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with ID {user_id} not found"
        )
    
    await db.delete_user(user_id)
    return None  # 204 returns no content

# ===== ERROR HANDLERS =====

@app.exception_handler(Exception)
async def generic_exception_handler(request, exc):
    """Catch-all exception handler for unexpected errors."""
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "code": "INTERNAL_ERROR"
        }
    )

# ===== HEALTH CHECK =====

@app.get("/health", tags=["health"])
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "timestamp": datetime.utcnow()}
