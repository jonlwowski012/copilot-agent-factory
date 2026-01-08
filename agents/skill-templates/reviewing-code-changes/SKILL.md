---
name: reviewing-code-changes
description: Structured code review checklist covering functionality, security, performance, maintainability, and best practices. Use when reviewing pull requests, code changes, or conducting code reviews.
---

# Reviewing Code Changes

## When to Use This Skill

- Reviewing pull requests before merge
- Conducting code review sessions
- Self-reviewing code before pushing
- Performing security audits
- Ensuring code quality standards

## Code Review Checklist

### 1. Functionality & Correctness

**Core Questions:**
- ✅ Does the code do what it's supposed to do?
- ✅ Are all requirements met?
- ✅ Are edge cases handled?
- ✅ Are error conditions properly handled?

**Check For:**
```python
# ❌ Unhandled edge case
def divide(a, b):
    return a / b  # What if b is 0?

# ✅ Edge case handled
def divide(a, b):
    if b == 0:
        raise ValueError("Cannot divide by zero")
    return a / b
```

### 2. Code Logic & Design

**Questions:**
- ✅ Is the code logic clear and easy to follow?
- ✅ Are there overly complex conditionals?
- ✅ Is the code DRY (Don't Repeat Yourself)?
- ✅ Are functions/methods appropriately sized?
- ✅ Is responsibility properly separated?

**Red Flags:**
```python
# ❌ Too complex, multiple responsibilities
def process_user_data(user_id):
    user = db.get_user(user_id)
    if user and user.active and user.verified:
        if user.subscription == "premium":
            if datetime.now() < user.expiry:
                # Send email
                # Update database
                # Log activity
                # ... 50 more lines

# ✅ Better: Extract methods, single responsibility
def process_user_data(user_id):
    user = get_verified_active_user(user_id)
    if is_premium_active(user):
        notify_user(user)
        update_user_status(user)
        log_activity(user)
```

### 3. Testing

**Requirements:**
- ✅ Are there tests for new functionality?
- ✅ Do tests cover edge cases?
- ✅ Are existing tests still passing?
- ✅ Is test coverage adequate (>80%)?

**Test Quality:**
```python
# ❌ Weak test
def test_user_creation():
    user = create_user()
    assert user is not None

# ✅ Comprehensive test
def test_user_creation():
    user = create_user(username="test", email="test@example.com")
    assert user.id is not None
    assert user.username == "test"
    assert user.email == "test@example.com"
    assert user.created_at <= datetime.utcnow()
```

### 4. Security

**Critical Checks:**
- ✅ No hardcoded secrets or API keys
- ✅ User input is validated and sanitized
- ✅ SQL injection prevention (use parameterized queries)
- ✅ XSS prevention (escape output)
- ✅ Authentication/authorization checks present
- ✅ Sensitive data is encrypted
- ✅ No exposure of internal error details

**Security Issues:**
```python
# ❌ SQL injection vulnerability
query = f"SELECT * FROM users WHERE username = '{username}'"

# ✅ Parameterized query
query = "SELECT * FROM users WHERE username = ?"
cursor.execute(query, (username,))

# ❌ Hardcoded secret
API_KEY = "sk_live_abc123xyz"

# ✅ Environment variable
API_KEY = os.getenv("API_KEY")

# ❌ Exposing sensitive error details
except Exception as e:
    return {"error": str(e)}  # May expose internal paths, etc.

# ✅ Generic error message
except Exception as e:
    logger.error(f"Error processing request: {e}")
    return {"error": "An error occurred processing your request"}
```

### 5. Performance

**Questions:**
- ✅ Are there unnecessary database queries (N+1 problem)?
- ✅ Are large datasets handled efficiently?
- ✅ Are there memory leaks?
- ✅ Could operations be cached?
- ✅ Are blocking operations handled asynchronously?

**Performance Issues:**
```python
# ❌ N+1 query problem
users = User.query.all()
for user in users:
    posts = user.posts.all()  # Query per user!

# ✅ Eager loading
users = User.query.options(joinedload(User.posts)).all()

# ❌ Loading entire file into memory
with open('large_file.txt') as f:
    lines = f.readlines()  # Loads everything!

# ✅ Stream processing
with open('large_file.txt') as f:
    for line in f:  # Reads line by line
        process(line)
```

### 6. Error Handling

**Requirements:**
- ✅ Appropriate exception handling
- ✅ Errors are logged
- ✅ User-friendly error messages
- ✅ No silent failures
- ✅ Resources are cleaned up

**Error Handling Patterns:**
```python
# ❌ Too broad exception catching
try:
    result = complex_operation()
except Exception:
    pass  # Silent failure!

# ✅ Specific exceptions, proper logging
try:
    result = complex_operation()
except ValueError as e:
    logger.error(f"Invalid value: {e}")
    raise
except DatabaseError as e:
    logger.error(f"Database error: {e}")
    return None
```

### 7. Code Style & Readability

**Standards:**
- ✅ Follows project coding conventions
- ✅ Consistent naming ({{naming_convention}})
- ✅ Clear variable and function names
- ✅ Appropriate comments (why, not what)
- ✅ No commented-out code
- ✅ Proper formatting and indentation

**Readability:**
```python
# ❌ Unclear names, no structure
def f(x, y):
    z = x + y
    if z > 100:
        return True
    return False

# ✅ Clear names, well-structured
def exceeds_threshold(value1, value2, threshold=100):
    """Check if sum of two values exceeds threshold."""
    total = value1 + value2
    return total > threshold
```

### 8. Documentation

**Check For:**
- ✅ Public APIs have docstrings
- ✅ Complex logic is explained
- ✅ README updated if needed
- ✅ API documentation updated
- ✅ Changelog/release notes updated

**Documentation Quality:**
```python
# ❌ Useless docstring
def calculate_price(items):
    """Calculate price."""
    pass

# ✅ Helpful docstring
def calculate_price(items, tax_rate=0.08, discount_code=None):
    """
    Calculate total price including tax and discounts.
    
    Args:
        items: List of items with 'price' and 'quantity' keys
        tax_rate: Tax rate as decimal (default: 0.08 for 8%)
        discount_code: Optional discount code string
        
    Returns:
        float: Total price after tax and discounts
        
    Raises:
        ValueError: If items list is empty or tax_rate is negative
    """
    pass
```

### 9. Dependencies

**Questions:**
- ✅ Are new dependencies necessary?
- ✅ Are dependencies up to date?
- ✅ Are dependency versions pinned?
- ✅ Are licenses compatible?
- ✅ Are there security vulnerabilities?

**Check dependencies:**
```bash
# Python
pip list --outdated
pip-audit  # Check for vulnerabilities

# JavaScript
npm audit
npm outdated
```

### 10. Breaking Changes

**Critical Checks:**
- ✅ Is existing API compatibility maintained?
- ✅ Are database migrations included?
- ✅ Is backward compatibility preserved?
- ✅ Are breaking changes documented?

## Review Process

### Step 1: Understand Context

**Before reviewing:**
- Read the PR/MR description
- Understand the problem being solved
- Check linked issues/tickets
- Review acceptance criteria

### Step 2: High-Level Review

**Quick pass for:**
- Overall approach and design
- Major architectural concerns
- Security red flags
- Scope creep (unrelated changes)

### Step 3: Detailed Line-by-Line Review

**Focus on:**
- Logic correctness
- Edge cases
- Error handling
- Code quality
- Performance implications

### Step 4: Run and Test

**Verify:**
```bash
# Checkout PR branch
git fetch origin pull/123/head:pr-123
git checkout pr-123

# Run tests
{{test_command}}

# Run linter
{{lint_command}}

# Build and test locally
{{build_command}}

# Test manually if needed
```

### Step 5: Provide Feedback

**Feedback Guidelines:**
- Be specific and constructive
- Explain "why" not just "what"
- Suggest alternatives
- Acknowledge good code
- Use appropriate tone

**Feedback Templates:**

```markdown
# 🔴 Critical (Must Fix)
**Issue:** SQL injection vulnerability on line 42
**Reason:** User input is not sanitized
**Suggestion:** Use parameterized queries: `cursor.execute(query, (username,))`

# 🟡 Important (Should Fix)
**Issue:** N+1 query problem in `get_users_with_posts()`
**Reason:** This will cause performance issues with many users
**Suggestion:** Use eager loading: `.options(joinedload(User.posts))`

# 🟢 Nitpick (Optional)
**Suggestion:** Consider extracting this 50-line function into smaller methods
**Reason:** Would improve readability and testability

# 💬 Question
**Question:** Why did you choose approach X over Y?
**Context:** Just curious about the tradeoff analysis

# ✅ Praise
**Nice work** on the comprehensive test coverage!
```

## Common Review Patterns

### API Changes

**Check:**
- Backward compatibility
- Versioning strategy
- Documentation updates
- Client migration path

### Database Changes

**Check:**
- Migration scripts included
- Rollback strategy
- Index performance impact
- Data migration tested

### Frontend Changes

**Check:**
- Responsive design
- Accessibility (a11y)
- Browser compatibility
- Loading states
- Error states

## Automated Checks

**Before manual review, run:**

```bash
# Linting
{{lint_command}}

# Type checking (if applicable)
mypy .  # Python
tsc --noEmit  # TypeScript

# Tests
{{test_command}}

# Security scanning
bandit -r .  # Python
npm audit  # JavaScript

# Coverage
pytest --cov={{source_dirs}}
```

## Review Checklist Template

```markdown
## Functionality
- [ ] Code achieves stated purpose
- [ ] Edge cases handled
- [ ] Error cases handled
- [ ] Tests included and passing

## Security
- [ ] No hardcoded secrets
- [ ] Input validation present
- [ ] SQL injection prevented
- [ ] Authentication/authorization correct

## Performance
- [ ] No N+1 queries
- [ ] Large datasets handled efficiently
- [ ] No obvious bottlenecks

## Code Quality
- [ ] DRY principle followed
- [ ] Clear naming
- [ ] Appropriate comments
- [ ] Follows style guide

## Documentation
- [ ] README updated if needed
- [ ] API docs updated
- [ ] Docstrings present

## Testing
- [ ] Unit tests included
- [ ] Integration tests if needed
- [ ] Coverage adequate

## Breaking Changes
- [ ] None OR properly documented
- [ ] Migration path provided
```

## When to Approve vs Request Changes

**Approve:**
- ✅ All critical issues resolved
- ✅ Minor suggestions are optional
- ✅ Tests pass
- ✅ Code quality meets standards

**Request Changes:**
- ❌ Security vulnerabilities
- ❌ Critical bugs
- ❌ Breaking changes without documentation
- ❌ Missing tests for new functionality
- ❌ Significant code quality issues

**Comment (No Approval):**
- 💬 Questions about approach
- 💬 Suggestions for future improvements
- 💬 Minor style nitpicks

## Project Configuration

**Lint command:** {{lint_command}}
**Test command:** {{test_command}}
**Build command:** {{build_command}}
**Coding standards:** {{naming_convention}}
**Source directories:** {{source_dirs}}
