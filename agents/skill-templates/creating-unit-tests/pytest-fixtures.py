# Common pytest fixture patterns for test setup and teardown

import pytest
from your_module import Database, APIClient, User

# Basic fixture - runs once per test
@pytest.fixture
def sample_user():
    """Provides a sample user for testing."""
    return User(id=1, username="testuser", email="test@example.com")

# Fixture with setup and teardown
@pytest.fixture
def database_connection():
    """Provides a database connection with cleanup."""
    # Setup
    db = Database.connect("test_db")
    db.create_tables()
    
    yield db  # Test runs here
    
    # Teardown
    db.drop_tables()
    db.close()

# Fixture with parameters
@pytest.fixture(params=["sqlite", "postgres", "mysql"])
def database_engine(request):
    """Test against multiple database engines."""
    return Database(engine=request.param)

# Scope fixtures - runs once per module/session
@pytest.fixture(scope="module")
def api_client():
    """Reuse API client across all tests in module."""
    client = APIClient(base_url="http://test.example.com")
    yield client
    client.close()

@pytest.fixture(scope="session")
def test_config():
    """Load config once for entire test session."""
    return {
        "api_key": "test_key",
        "timeout": 30,
        "retry_count": 3
    }

# Autouse fixture - automatically used by all tests
@pytest.fixture(autouse=True)
def reset_state():
    """Reset global state before each test."""
    # Setup
    clear_cache()
    reset_counters()
    
    yield
    
    # Teardown (runs after each test)
    cleanup_temp_files()

# Fixture using other fixtures
@pytest.fixture
def authenticated_user(sample_user, api_client):
    """Provides an authenticated user with API client."""
    token = api_client.login(sample_user.username, "password123")
    sample_user.token = token
    return sample_user

# Example usage in tests
class TestUserService:
    def test_create_user(self, database_connection):
        """Test user creation with database fixture."""
        user = User.create(db=database_connection, username="newuser")
        assert user.id is not None
    
    def test_multiple_engines(self, database_engine):
        """Test runs 3 times with different engines."""
        assert database_engine.connect() is True
    
    def test_api_call(self, authenticated_user, api_client):
        """Test with authenticated user and API client."""
        response = api_client.get("/profile", token=authenticated_user.token)
        assert response.status_code == 200
