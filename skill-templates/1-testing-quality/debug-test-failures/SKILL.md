---
name: debug-test-failures
description: "Workflow for investigating and fixing failing tests in this project"
auto-activates:
  - "debug test"
  - "test failing"
  - "fix failing test"
  - "why is test failing"
  - "test not passing"
---

# Skill: Debug Test Failures

## When to Use This Skill

This skill activates when you need to:
- Investigate why tests are failing
- Debug specific test failures
- Understand test error messages
- Fix flaky or intermittent test failures

## Prerequisites

This assumes tests are configured and running. Use **run-tests** skill to execute tests first.

## Step-by-Step Workflow

### Step 1: Run Tests and Identify Failures

**Run tests with verbose output:**
```bash
# Python
pytest -v

# JavaScript
npm test -- --verbose

# Go
go test -v ./...
```

**Identify the failing test(s):**
- Note the test file and function name
- Read the error message carefully
- Check the assertion that failed

### Step 2: Run Only the Failing Test

**Python (pytest):**
```bash
pytest tests/test_file.py::test_function_name -v
```

**JavaScript (Jest):**
```bash
npm test -- tests/example.test.js -t "test name pattern"
```

**Go:**
```bash
go test -run TestFunctionName -v
```

### Step 3: Add Debug Output

**Python - Add print statements:**
```python
def test_example():
    result = my_function(input_data)
    print(f"DEBUG: result = {result}")  # Debug output
    print(f"DEBUG: type = {type(result)}")
    assert result == expected
```

**Run with output visible:**
```bash
pytest -s tests/test_file.py::test_function_name
```

**Python - Use pytest's debugging:**
```bash
# Drop into debugger on failure
pytest --pdb

# Drop into debugger on first failure
pytest -x --pdb
```

**JavaScript - Add console.log:**
```javascript
test('example', () => {
  const result = myFunction(inputData);
  console.log('DEBUG: result =', result);
  expect(result).toBe(expected);
});
```

### Step 4: Common Failure Patterns

#### AssertionError / Unexpected Value

**Cause:** Expected value doesn't match actual value

**Debug steps:**
1. Print both expected and actual values
2. Check data types match (string vs int, etc.)
3. Check for whitespace, case sensitivity
4. Verify test data setup

**Example fix:**
```python
# Before - fails due to extra whitespace
assert result == "hello"

# After - strip whitespace
assert result.strip() == "hello"
```

#### Import / Module Not Found

**Cause:** Module path issues or missing dependencies

**Debug steps:**
1. Check if module is installed: `pip list | grep module`
2. Verify PYTHONPATH or NODE_PATH
3. Install in development mode: `pip install -e .`
4. Check import statement spelling

**Example fix:**
```python
# Add to tests/conftest.py
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))
```

#### Timeout Errors

**Cause:** Test taking too long or blocking operation

**Debug steps:**
1. Check for infinite loops
2. Verify async/await used correctly
3. Mock external API calls
4. Increase timeout temporarily to see if test passes

**Example fix:**
```python
# Pytest - increase timeout
@pytest.mark.timeout(300)
def test_slow_operation():
    result = slow_function()
    assert result is not None
```

#### Fixture / Setup Errors

**Cause:** Test fixtures or setup not working

**Debug steps:**
1. Check fixture names match exactly
2. Verify fixture scope (function, class, module)
3. Print fixture values in test
4. Check conftest.py is in correct location

**Example fix:**
```python
# Check fixture is working
def test_example(sample_data):
    print(f"Fixture value: {sample_data}")  # Debug
    assert sample_data is not None
```

#### Flaky / Intermittent Failures

**Cause:** Race conditions, timing issues, or external dependencies

**Debug steps:**
1. Run test multiple times: `pytest --count=10`
2. Check for shared state between tests
3. Verify test isolation (each test is independent)
4. Mock time-dependent or random operations
5. Check for test order dependencies

**Example fix:**
```python
# Mock random values
from unittest.mock import patch

@patch('random.randint', return_value=5)
def test_with_random(mock_random):
    result = function_using_random()
    assert result == expected_value
```

### Step 5: Use Debugging Tools

#### Python Debugger (pdb)

**Drop into debugger on failure:**
```bash
pytest --pdb
```

**Add breakpoint in code:**
```python
def test_example():
    data = prepare_data()
    breakpoint()  # Python 3.7+
    # or: import pdb; pdb.set_trace()
    result = process(data)
    assert result == expected
```

**pdb commands:**
- `l` - list code
- `n` - next line
- `s` - step into function
- `c` - continue execution
- `p variable` - print variable
- `pp variable` - pretty print
- `q` - quit debugger

#### JavaScript Debugger

**Node.js debugger:**
```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

**Add debugger statement:**
```javascript
test('example', () => {
  const data = prepareData();
  debugger;  // Pauses here in debugger
  const result = process(data);
  expect(result).toBe(expected);
});
```

#### VS Code Debugging

**Python .vscode/launch.json:**
```json
{
  "name": "Python: Debug Tests",
  "type": "python",
  "request": "launch",
  "module": "pytest",
  "args": ["tests/test_file.py", "-v"]
}
```

**JavaScript .vscode/launch.json:**
```json
{
  "name": "Jest: Debug",
  "type": "node",
  "request": "launch",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand", "--no-cache"],
  "console": "integratedTerminal"
}
```

### Step 6: Fix and Verify

1. Make minimal changes to fix the issue
2. Run the failing test again
3. Run all related tests
4. Run full test suite to ensure no regressions

## Common Issues and Solutions

### Issue: Test passes locally but fails in CI

**Solutions:**
1. Check environment variables
2. Verify versions match (Python, Node, etc.)
3. Check for file system case sensitivity
4. Review CI logs for warnings
5. Test with same database/fixtures as CI

### Issue: Can't reproduce failure locally

**Solutions:**
1. Clear caches: `pytest --cache-clear` or `jest --clearCache`
2. Run in clean environment (new virtualenv)
3. Check for environment-specific config
4. Run with same seed/random state
5. Check system resources (memory, disk space)

### Issue: Error message unclear

**Solutions:**
1. Add custom error messages to assertions
2. Use pytest's `-vv` for extra verbose output
3. Check test framework documentation
4. Add logging before assertions
5. Simplify test to isolate issue

## Success Criteria

- ✅ Identified root cause of test failure
- ✅ Fixed the issue with minimal changes
- ✅ Failing test now passes
- ✅ Related tests still pass
- ✅ Understanding why it failed to prevent future issues

## Related Skills

- **run-tests** - Execute tests
- **pytest-setup** - Configure test framework
- **code-formatting** - Fix linting/formatting issues

## Documentation References

- [pytest Debugging](https://docs.pytest.org/en/stable/how-to/failures.html)
- [Jest Troubleshooting](https://jestjs.io/docs/troubleshooting)
- [Python pdb Documentation](https://docs.python.org/3/library/pdb.html)
