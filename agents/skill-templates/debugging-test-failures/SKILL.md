---
name: debugging-test-failures
description: Systematic approach to debugging failing tests, analyzing error messages, isolating failures, and identifying root causes. Use when tests fail, break, or produce unexpected results.
---

# Debugging Test Failures

## When to Use This Skill

- Tests are failing after code changes
- Tests produce unexpected results
- Intermittent or flaky test failures
- Understanding cryptic error messages
- Isolating the root cause of test failures

## Systematic Debugging Workflow

### Step 1: Read the Error Message Carefully

**Extract key information:**
- Which test failed? (test name, file, line number)
- What was the assertion? (expected vs actual)
- What was the error type? (AssertionError, TypeError, etc.)
- Stack trace location (where did it fail?)

**Example Analysis:**

```python
# Error message
FAILED tests/test_calculator.py::TestCalculator::test_divide - AssertionError: assert 2.0 == 2
```

**What this tells us:**
- Test file: `tests/test_calculator.py`
- Test class: `TestCalculator`
- Test method: `test_divide`
- Issue: Type mismatch (2.0 vs 2)

### Step 2: Reproduce the Failure

**Run the specific failing test:**

```bash
# Python (pytest)
pytest tests/test_calculator.py::TestCalculator::test_divide -v

# JavaScript (Jest)
npm test -- calculator.test.js -t "divide"

# Run with more verbose output
pytest -vv --tb=long  # Python: full traceback
npm test -- --verbose # JavaScript: verbose
```

**If test failure is intermittent:**
```bash
# Run multiple times to reproduce
pytest tests/test_flaky.py --count=10  # pytest-repeat plugin
npm test -- --runInBand  # Jest: disable parallelization
```

### Step 3: Isolate the Problem

**A. Run only the failing test**
```bash
# Disable other tests
pytest -k "test_divide"
npm test -- -t "divide"
```

**B. Check test dependencies**
- Does test depend on previous test state?
- Are fixtures/setup working correctly?
- Are mocks configured properly?

**C. Add debugging output**

```python
# Python
def test_divide(self):
    calc = Calculator()
    result = calc.divide(10, 5)
    print(f"DEBUG: result={result}, type={type(result)}")  # Add debug output
    assert result == 2
```

```javascript
// JavaScript
test('divide', () => {
  const calc = new Calculator();
  const result = calc.divide(10, 5);
  console.log('DEBUG:', { result, type: typeof result });
  expect(result).toBe(2);
});
```

**Run with debug output:**
```bash
pytest -s  # Python: show print statements
npm test -- --verbose  # JavaScript: show console.log
```

### Step 4: Common Failure Patterns & Solutions

#### Pattern 1: Type Mismatch
```python
# Error: assert 2.0 == 2
# Solution: Use appropriate comparison or fix return type
assert result == pytest.approx(2.0)  # For floating point
# OR fix the implementation to return int
```

#### Pattern 2: Mock Not Working
```python
# Error: Expected mock to be called but wasn't
# Check: Is mock patched in correct location?

# ❌ Wrong
@patch('test_module.APIClient')  # Patches where it's defined

# ✅ Correct
@patch('my_module.APIClient')  # Patches where it's imported
```

#### Pattern 3: Async Issues
```javascript
// Error: Test timeout or unhandled promise rejection
// Solution: Ensure async/await is used correctly

// ❌ Wrong
test('async test', () => {
  const result = fetchData();  // Missing await
  expect(result).toBeDefined();
});

// ✅ Correct
test('async test', async () => {
  const result = await fetchData();
  expect(result).toBeDefined();
});
```

#### Pattern 4: Test Order Dependency
```python
# Error: Test passes individually but fails in suite
# Cause: Tests sharing state

# ❌ Wrong - shared state
class TestUser:
    user = None  # Class variable shared across tests
    
# ✅ Correct - isolated state
class TestUser:
    def setup_method(self):
        self.user = User()  # New instance per test
```

#### Pattern 5: Fixture/Setup Issues
```python
# Error: AttributeError or NoneType
# Cause: Fixture not running or returning wrong value

@pytest.fixture
def database():
    db = Database()
    db.connect()
    yield db  # Don't forget yield
    db.disconnect()
```

### Step 5: Use Debugger

**Python (pdb)**
```python
def test_complex_logic(self):
    import pdb; pdb.set_trace()  # Add breakpoint
    result = complex_function()
    assert result == expected
```

**Run with debugger:**
```bash
pytest --pdb  # Drop into pdb on failure
pytest --pdb-trace  # Start pdb at beginning of test
```

**JavaScript (Node debugger)**
```javascript
test('complex logic', () => {
  debugger;  // Add breakpoint
  const result = complexFunction();
  expect(result).toBe(expected);
});
```

**Run with debugger:**
```bash
node --inspect-brk node_modules/.bin/jest --runInBand
# Then open chrome://inspect in Chrome
```

### Step 6: Check Test Data & Fixtures

**Verify test data is correct:**
```python
def test_user_creation(self, sample_data):
    print(f"DEBUG: sample_data = {sample_data}")  # Inspect fixture data
    user = create_user(sample_data)
    assert user.name == sample_data['name']
```

**Common fixture issues:**
- Fixture scope too broad (session/module instead of function)
- Fixture not cleaning up properly
- Fixture returning None instead of value

### Step 7: Compare Working vs Failing State

**If test was working before:**

```bash
# Check what changed
git diff main tests/test_file.py

# Run tests on previous commit
git checkout HEAD~1
pytest tests/test_file.py
git checkout -

# Use bisect to find breaking commit
git bisect start
git bisect bad  # Current state fails
git bisect good <commit>  # Last known good commit
# Git will check out commits for testing
```

## Common Test Failure Causes

### 1. Environment Issues
- Wrong Python version or dependencies
- Missing environment variables
- Database not running or in wrong state
- File permissions or missing test data files

**Check environment:**
```bash
# Python
python --version
pip list | grep <package>

# JavaScript
node --version
npm list <package>

# Environment variables
echo $TEST_DATABASE_URL
```

### 2. Race Conditions & Timing
- Tests failing intermittently
- Different behavior in CI vs local
- Async operations not awaited properly

**Solution: Add proper waits**
```python
# ❌ Wrong
def test_async_operation():
    start_background_task()
    assert task_completed()  # May not be done yet

# ✅ Correct
def test_async_operation():
    start_background_task()
    wait_for_condition(lambda: task_completed(), timeout=5)
    assert task_completed()
```

### 3. External Dependencies
- API endpoints unavailable
- Database in wrong state
- Network issues

**Solution: Use mocks**
```python
@patch('requests.get')
def test_api_call(mock_get):
    mock_get.return_value.json.return_value = {'data': 'test'}
    result = fetch_user_data(user_id=1)
    assert result == {'data': 'test'}
```

### 4. Stale Test Assumptions
- Code changed but test expectations didn't update
- Business logic changed
- API contracts changed

**Solution: Update test assertions to match new behavior**

## Debugging Commands Reference

### Run Configuration: {{test_command}}

### If not configured:

**Python (pytest)**
```bash
pytest tests/ -v                    # Verbose output
pytest tests/ -vv                   # Extra verbose
pytest tests/ --tb=short            # Shorter traceback
pytest tests/ --tb=long             # Full traceback
pytest tests/ -x                    # Stop on first failure
pytest tests/ --lf                  # Run last failed tests
pytest tests/ --ff                  # Run failures first
pytest tests/ -k "test_name"        # Run matching tests
pytest tests/ --pdb                 # Drop into debugger on failure
pytest tests/ -s                    # Show print statements
```

**JavaScript (Jest)**
```bash
npm test -- --verbose               # Verbose output
npm test -- --no-coverage           # Skip coverage
npm test -- --onlyFailures          # Run only failed tests
npm test -- -t "test name"          # Run specific test
npm test -- --runInBand             # Disable parallel execution
npm test -- --detectOpenHandles     # Find async handles
npm test -- --forceExit             # Exit after tests (useful for hangs)
```

## Prevention: Writing Debuggable Tests

✅ **DO:**
- Use descriptive test names that explain what's being tested
- Add comments explaining complex test logic
- Use meaningful variable names in tests
- Keep tests simple and focused
- Log important intermediate values

❌ **DON'T:**
- Write tests with complex logic that's hard to follow
- Use cryptic variable names (x, y, temp)
- Chain multiple operations without intermediate checks
- Ignore intermittent failures

## When to Ask for Help

If after systematic debugging you still can't identify the issue:

1. **Gather information:**
   - Full error message and stack trace
   - Steps to reproduce
   - Environment details (OS, language version, dependencies)
   - What you've already tried

2. **Create minimal reproduction:**
   - Simplify test to minimal failing case
   - Remove unrelated code
   - Isolate the specific assertion that fails

3. **Document findings:**
   - What works vs what doesn't
   - Any patterns noticed (fails on CI but not local, etc.)
   - Relevant code context

Then share with team or community with full context.
