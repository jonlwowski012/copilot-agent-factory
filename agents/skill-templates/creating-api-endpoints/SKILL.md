---
name: creating-api-endpoints
description: Guide for creating RESTful API endpoints with proper request validation, error handling, authentication, and documentation. Use when implementing new API routes, adding endpoints, or building REST APIs.
---

# Creating API Endpoints

## When to Use This Skill

- Implementing new REST API endpoints
- Adding routes to existing APIs
- Creating CRUD operations
- Designing API request/response contracts
- Adding validation and error handling to endpoints

## API Framework Detection

**Configured Framework:** {{api_framework}}

**If not configured, auto-detect from common patterns:**

### Python
- **FastAPI**: `from fastapi import FastAPI` in code
- **Flask**: `from flask import Flask` in code
- **Django REST**: `rest_framework` in INSTALLED_APPS

### JavaScript/TypeScript
- **Express**: `express` in package.json dependencies
- **NestJS**: `@nestjs/core` in package.json
- **Fastify**: `fastify` in package.json

### Other Languages
- **Go**: `net/http`, `gin-gonic/gin`, `gorilla/mux`
- **Ruby**: `rails`, `sinatra`
- **Java**: `spring-boot-starter-web`
- **C#**: `Microsoft.AspNetCore`

## Step-by-Step Endpoint Creation

### 1. Define the Endpoint Contract

**Before writing code, specify:**
- HTTP method (GET, POST, PUT, PATCH, DELETE)
- URL path and parameters
- Request body schema
- Response schema
- Status codes
- Authentication requirements

**Example specification:**

```yaml
POST /api/users
Description: Create a new user account
Authentication: Required (Bearer token)

Request Body:
  username: string (3-50 chars, required)
  email: string (valid email, required)
  password: string (min 8 chars, required)
  full_name: string (optional)

Responses:
  201 Created:
    {
      "id": "uuid",
      "username": "string",
      "email": "string",
      "full_name": "string",
      "created_at": "ISO8601 timestamp"
    }
  400 Bad Request: { "error": "Validation error message" }
  401 Unauthorized: { "error": "Invalid or missing token" }
  409 Conflict: { "error": "Username or email already exists" }
```

### 2. Framework-Specific Implementation

#### FastAPI (Python)

[See complete template](./fastapi-endpoint-template.py)

```python
from fastapi import FastAPI, HTTPException, Depends, status
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
import uuid
from datetime import datetime

app = FastAPI()

# Request/Response schemas
class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=8)
    full_name: Optional[str] = None

class UserResponse(BaseModel):
    id: str
    username: str
    email: str
    full_name: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True

# Dependency for authentication
async def get_current_user(token: str = Depends(oauth2_scheme)):
    # Validate token and return user
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing token"
        )
    return user

# Endpoint implementation
@app.post(
    "/api/users",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["users"],
    summary="Create a new user"
)
async def create_user(
    user_data: UserCreate,
    current_user: User = Depends(get_current_user)
):
    """
    Create a new user account with the following requirements:
    
    - Username must be unique and 3-50 characters
    - Email must be valid and unique
    - Password must be at least 8 characters
    - Full name is optional
    """
    # Check if username/email already exists
    if await db.user_exists(user_data.username, user_data.email):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Username or email already exists"
        )
    
    # Hash password
    hashed_password = hash_password(user_data.password)
    
    # Create user
    user = await db.create_user(
        id=str(uuid.uuid4()),
        username=user_data.username,
        email=user_data.email,
        password_hash=hashed_password,
        full_name=user_data.full_name,
        created_at=datetime.utcnow()
    )
    
    return user
```

#### Express (JavaScript/TypeScript)

[See complete template](./express-endpoint-template.js)

```javascript
const express = require('express');
const { body, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Validation middleware
const validateUserCreate = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be 3-50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Must be a valid email'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
  body('full_name')
    .optional()
    .trim()
];

// Authentication middleware
const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Invalid or missing token' });
  }
  
  try {
    req.user = await validateToken(token);
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// POST /api/users
router.post(
  '/api/users',
  authenticate,
  validateUserCreate,
  async (req, res) => {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: errors.array()
      });
    }
    
    const { username, email, password, full_name } = req.body;
    
    // Check if user exists
    const existingUser = await db.findUserByUsernameOrEmail(username, email);
    if (existingUser) {
      return res.status(409).json({ 
        error: 'Username or email already exists' 
      });
    }
    
    // Hash password
    const passwordHash = await hashPassword(password);
    
    // Create user
    const user = await db.createUser({
      id: uuidv4(),
      username,
      email,
      password_hash: passwordHash,
      full_name: full_name || null,
      created_at: new Date()
    });
    
    // Return response (don't include password_hash)
    const response = {
      id: user.id,
      username: user.username,
      email: user.email,
      full_name: user.full_name,
      created_at: user.created_at
    };
    
    return res.status(201).json(response);
  }
);

module.exports = router;
```

### 3. Request Validation

**Always validate:**
- Required fields are present
- Data types are correct
- String lengths are within bounds
- Email/URL formats are valid
- Enums match allowed values
- Numeric ranges are valid

**Use framework validation:**
- **FastAPI**: Pydantic models with Field validators
- **Express**: express-validator or joi
- **Flask**: flask-marshmallow or pydantic
- **Django REST**: serializers with field validation

### 4. Error Handling

**Return appropriate HTTP status codes:**

| Code | Usage |
|------|-------|
| 200 OK | Successful GET, PUT, PATCH |
| 201 Created | Successful POST creating resource |
| 204 No Content | Successful DELETE |
| 400 Bad Request | Invalid input/validation error |
| 401 Unauthorized | Missing or invalid authentication |
| 403 Forbidden | Authenticated but not authorized |
| 404 Not Found | Resource doesn't exist |
| 409 Conflict | Resource conflict (duplicate) |
| 422 Unprocessable Entity | Validation error (alternative to 400) |
| 500 Internal Server Error | Unexpected server error |

**Error response format:**
```json
{
  "error": "Human-readable error message",
  "code": "ERROR_CODE",
  "details": {
    "field": "Specific field error"
  }
}
```

### 5. Authentication & Authorization

**Common patterns:**

```python
# FastAPI dependency injection
async def require_admin(current_user: User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user

@app.delete("/api/users/{user_id}")
async def delete_user(
    user_id: str,
    admin: User = Depends(require_admin)
):
    # Only admins can delete users
    await db.delete_user(user_id)
    return {"message": "User deleted"}
```

```javascript
// Express middleware
const requireAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

router.delete('/api/users/:userId', authenticate, requireAdmin, async (req, res) => {
  await db.deleteUser(req.params.userId);
  res.status(204).send();
});
```

### 6. Database Operations

**Best practices:**
- Use parameterized queries (prevent SQL injection)
- Handle database errors gracefully
- Use transactions for multi-step operations
- Return meaningful errors for constraint violations

**Example with error handling:**

```python
try:
    user = await db.create_user(user_data)
except UniqueViolationError as e:
    if 'username' in str(e):
        raise HTTPException(409, "Username already exists")
    elif 'email' in str(e):
        raise HTTPException(409, "Email already exists")
except DatabaseError:
    raise HTTPException(500, "Database error occurred")
```

### 7. Response Formatting

**DO:**
- Use consistent response structure
- Include only necessary fields
- Format dates consistently (ISO 8601)
- Don't expose internal IDs or sensitive data
- Include pagination metadata for lists

**Example list response:**
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 150,
    "total_pages": 8
  }
}
```

## Common Endpoint Patterns

### CRUD Operations

```python
# CREATE
POST /api/users          → Create new user (201 Created)

# READ
GET /api/users           → List all users (200 OK)
GET /api/users/{id}      → Get specific user (200 OK or 404)

# UPDATE
PUT /api/users/{id}      → Replace entire user (200 OK)
PATCH /api/users/{id}    → Update partial fields (200 OK)

# DELETE
DELETE /api/users/{id}   → Delete user (204 No Content)
```

### Search & Filtering

```python
GET /api/users?search=john&role=admin&page=1&limit=20
```

### Nested Resources

```python
GET /api/users/{user_id}/posts           → User's posts
POST /api/users/{user_id}/posts          → Create post for user
GET /api/users/{user_id}/posts/{post_id} → Specific post
```

## Testing Your Endpoint

**Manual testing:**
```bash
# Using curl
curl -X POST http://localhost:8000/api/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'

# Using httpie (more readable)
http POST localhost:8000/api/users \
  Authorization:"Bearer <token>" \
  username=testuser \
  email=test@example.com \
  password=password123
```

**Automated testing:**

See [API testing examples](./examples/api-testing.md) for comprehensive test patterns.

```python
# FastAPI test example
def test_create_user(client):
    response = client.post(
        "/api/users",
        json={
            "username": "testuser",
            "email": "test@example.com",
            "password": "password123"
        },
        headers={"Authorization": "Bearer valid_token"}
    )
    assert response.status_code == 201
    assert response.json()["username"] == "testuser"
```

## Documentation

**Auto-generated docs:**
- **FastAPI**: Automatic OpenAPI/Swagger at `/docs`
- **Express**: Use swagger-jsdoc + swagger-ui-express
- **Django REST**: Built-in browsable API

**Document in code:**
- Docstrings explaining endpoint purpose
- Parameter descriptions
- Example requests/responses
- Possible error scenarios

## Additional Resources

- [FastAPI endpoint template](./fastapi-endpoint-template.py)
- [Express endpoint template](./express-endpoint-template.js)
- [Validation examples](./examples/validation-patterns.md)
- [Authentication patterns](./examples/auth-patterns.md)
- [Error handling guide](./examples/error-handling.md)
- [API testing guide](./examples/api-testing.md)

## Project-Specific Configuration

**Detected API directories:** {{api_dirs}}
**Tech stack:** {{tech_stack}}
**Source directories:** {{source_dirs}}

If not configured, typical locations:
- Python: `app/`, `src/`, `api/`, `routes/`
- JavaScript: `src/routes/`, `src/controllers/`, `api/`
