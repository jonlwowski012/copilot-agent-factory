---
name: designing-with-tdd
description: Test-Driven Development workflow including red-green-refactor cycle, writing tests first, and TDD best practices. Use when practicing TDD, writing tests before code, or following test-first development.
---

# Designing with TDD (Test-Driven Development)

## When to Use This Skill

- Starting new feature development with TDD
- Writing tests before implementation
- Following test-first methodology
- Designing APIs and interfaces through tests
- Ensuring comprehensive test coverage from the start

## TDD Cycle: Red-Green-Refactor

```
┌─────────────┐
│   1. RED    │  Write a failing test
│   (Fail)    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  2. GREEN   │  Write minimal code to pass
│   (Pass)    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ 3. REFACTOR │  Improve code while keeping tests green
│  (Improve)  │
└──────┬──────┘
       │
       └──────► Repeat for next behavior
```

## Step 1: RED - Write a Failing Test

### Start with Requirements

**Example requirement:**
"Create a calculator that can add two numbers"

### Write the Test First

**Python (pytest):**
```python
# test_calculator.py
from calculator import Calculator

def test_add_two_positive_numbers():
    # Arrange
    calc = Calculator()
    
    # Act
    result = calc.add(2, 3)
    
    # Assert
    assert result == 5
```

**JavaScript (Jest):**
```javascript
// calculator.test.js
const Calculator = require('./calculator');

test('adds two positive numbers', () => {
  const calc = new Calculator();
  const result = calc.add(2, 3);
  expect(result).toBe(5);
});
```

### Run Test - Expect Failure

```bash
# Should fail because Calculator doesn't exist yet
{{test_command}}

# Expected output:
# ImportError: cannot import name 'Calculator'
# OR
# Error: Cannot find module './calculator'
```

✅ **Good failure** - Test fails because code doesn't exist
❌ **Bad failure** - Test fails due to syntax error in test

## Step 2: GREEN - Make It Pass

### Write Minimum Code

**Only write enough code to make THIS test pass:**

```python
# calculator.py
class Calculator:
    def add(self, a, b):
        return 5  # Hardcoded! But test passes...
```

This seems silly, but it forces you to:
1. Write another test for different inputs
2. Think about the actual implementation

### Add More Tests

```python
def test_add_different_numbers():
    calc = Calculator()
    result = calc.add(10, 20)
    assert result == 30  # Now hardcoded 5 won't work!
```

### Implement Real Logic

```python
class Calculator:
    def add(self, a, b):
        return a + b  # Now both tests pass
```

### Verify Tests Pass

```bash
{{test_command}}

# Expected:
# ✓ test_add_two_positive_numbers
# ✓ test_add_different_numbers
# 2 passed
```

## Step 3: REFACTOR - Improve Code

**Now that tests are green, improve the code:**

### Refactoring Checklist

- ✅ Remove duplication
- ✅ Improve naming
- ✅ Extract methods
- ✅ Simplify logic
- ✅ Add documentation

**Keep running tests after each refactor!**

```bash
# After each change
{{test_command}}  # Must stay green!
```

### Example Refactoring

**Before:**
```python
def test_add_two_positive_numbers():
    calc = Calculator()
    result = calc.add(2, 3)
    assert result == 5

def test_add_different_numbers():
    calc = Calculator()  # Duplicate!
    result = calc.add(10, 20)
    assert result == 30
```

**After:**
```python
import pytest

@pytest.fixture
def calculator():
    return Calculator()

def test_add_two_positive_numbers(calculator):
    result = calculator.add(2, 3)
    assert result == 5

def test_add_different_numbers(calculator):
    result = calculator.add(10, 20)
    assert result == 30
```

## TDD Best Practices

### 1. Write Tests for Behaviors, Not Implementation

**❌ Bad (testing implementation):**
```python
def test_add_uses_plus_operator():
    calc = Calculator()
    assert '+' in inspect.getsource(calc.add)  # Brittle!
```

**✅ Good (testing behavior):**
```python
def test_add_returns_sum_of_two_numbers():
    calc = Calculator()
    assert calc.add(2, 3) == 5
```

### 2. One Test, One Assertion (Guideline)

**❌ Less ideal:**
```python
def test_calculator_operations():
    calc = Calculator()
    assert calc.add(2, 3) == 5
    assert calc.subtract(5, 3) == 2
    assert calc.multiply(2, 3) == 6
```

**✅ Better:**
```python
def test_add():
    calc = Calculator()
    assert calc.add(2, 3) == 5

def test_subtract():
    calc = Calculator()
    assert calc.subtract(5, 3) == 2

def test_multiply():
    calc = Calculator()
    assert calc.multiply(2, 3) == 6
```

### 3. Test Edge Cases

**Always test:**
- ✅ Zero values
- ✅ Negative numbers
- ✅ Empty inputs
- ✅ Null/None values
- ✅ Maximum/minimum values
- ✅ Invalid inputs

```python
def test_add_with_zero():
    calc = Calculator()
    assert calc.add(5, 0) == 5

def test_add_negative_numbers():
    calc = Calculator()
    assert calc.add(-2, -3) == -5

def test_add_mixed_signs():
    calc = Calculator()
    assert calc.add(-5, 10) == 5
```

### 4. Test Error Conditions

```python
def test_divide_by_zero_raises_error():
    calc = Calculator()
    with pytest.raises(ZeroDivisionError):
        calc.divide(10, 0)
```

Then implement:
```python
def divide(self, a, b):
    if b == 0:
        raise ZeroDivisionError("Cannot divide by zero")
    return a / b
```

## TDD for Different Scenarios

### API Endpoint Development

**1. Write test for endpoint:**
```python
def test_create_user_endpoint():
    response = client.post('/api/users', json={
        'username': 'testuser',
        'email': 'test@example.com'
    })
    assert response.status_code == 201
    assert response.json()['username'] == 'testuser'
```

**2. Implement endpoint:**
```python
@app.post('/api/users')
def create_user(user_data: UserCreate):
    # Minimal implementation to pass test
    return {'username': user_data.username}, 201
```

**3. Add more tests, expand implementation**

### Database Operations

**1. Write test:**
```python
def test_user_repository_creates_user():
    repo = UserRepository()
    user = repo.create(username='test', email='test@example.com')
    
    assert user.id is not None
    assert user.username == 'test'
```

**2. Implement repository:**
```python
class UserRepository:
    def create(self, username, email):
        # Minimal implementation
        user = User(id=1, username=username, email=email)
        db.save(user)
        return user
```

### Class Design

**1. Write tests defining interface:**
```python
def test_user_can_be_created_with_username():
    user = User(username='test')
    assert user.username == 'test'

def test_user_validates_email_format():
    with pytest.raises(ValueError):
        User(username='test', email='invalid')
```

**2. Implement class:**
```python
class User:
    def __init__(self, username, email=None):
        self.username = username
        if email and not self._is_valid_email(email):
            raise ValueError("Invalid email format")
        self.email = email
    
    def _is_valid_email(self, email):
        return '@' in email  # Simplified
```

## TDD Workflow Example

**Complete cycle for adding subtraction:**

```python
# Step 1: RED - Write failing test
def test_subtract_returns_difference():
    calc = Calculator()
    result = calc.subtract(5, 3)
    assert result == 2

# Run: FAILS (method doesn't exist)
# {{test_command}}

# Step 2: GREEN - Minimal implementation
class Calculator:
    # ... existing methods ...
    
    def subtract(self, a, b):
        return 2  # Hardcoded to pass first test

# Run: PASSES
# {{test_command}}

# Add another test to force real implementation
def test_subtract_different_numbers():
    calc = Calculator()
    result = calc.subtract(10, 3)
    assert result == 7

# Run: FAILS (hardcoded value)

# Real implementation
def subtract(self, a, b):
    return a - b

# Run: PASSES
# {{test_command}}

# Step 3: REFACTOR
# Add edge cases
def test_subtract_with_zero():
    calc = Calculator()
    assert calc.subtract(5, 0) == 5

def test_subtract_negative_numbers():
    calc = Calculator()
    assert calc.subtract(-5, -3) == -2

# All tests still pass
# {{test_command}}
```

## Common TDD Mistakes

### ❌ Mistake 1: Writing Too Much Code at Once

```python
# Don't write entire class before any tests
class Calculator:
    def add(self, a, b): return a + b
    def subtract(self, a, b): return a - b
    def multiply(self, a, b): return a * b
    def divide(self, a, b): return a / b
    # ... 10 more methods
```

### ❌ Mistake 2: Not Running Tests After Each Change

Write test → ❌ forgot to run → Write code → ❌ forgot to run → Hours later: "Why doesn't this work?"

✅ Run tests constantly!

### ❌ Mistake 3: Testing Implementation Details

```python
# Don't test private methods directly
def test_internal_validation():
    calc = Calculator()
    assert calc._internal_helper(5) == True
```

### ❌ Mistake 4: Skipping Refactor Step

Don't move on with messy code just because tests pass!

## Benefits of TDD

1. **Better Design** - Writing tests first forces you to think about interfaces
2. **Higher Coverage** - Tests exist for all code by definition
3. **Faster Debugging** - Tests pinpoint exactly what broke
4. **Living Documentation** - Tests show how to use the code
5. **Confidence** - Refactor freely knowing tests catch regressions

## Tools & Commands

**Run tests:** {{test_command}}

**If not configured:**
```bash
# Python
pytest                      # Run all tests
pytest -v                   # Verbose
pytest --watch             # Re-run on changes (pytest-watch)
pytest -k "test_add"       # Run specific tests

# JavaScript
npm test                   # Run all tests
npm test -- --watch        # Watch mode
npm test -- calculator     # Run specific file
```

**Coverage:**
```bash
# Python
pytest --cov={{source_dirs}} --cov-report=html

# JavaScript
npm test -- --coverage
```

## Additional Resources

For detailed test implementation patterns, see:
- [Creating Unit Tests skill](../creating-unit-tests/SKILL.md)
- [Debugging Test Failures skill](../debugging-test-failures/SKILL.md)

## Project Configuration

**Test framework:** {{test_framework}}
**Test directories:** {{test_dirs}}
**Source directories:** {{source_dirs}}
