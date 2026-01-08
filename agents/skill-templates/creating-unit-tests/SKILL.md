---
name: creating-unit-tests
description: Step-by-step workflow for writing unit tests with proper structure, assertions, and coverage. Activates when creating, writing, or adding unit tests for functions, methods, or classes.
---

# Creating Unit Tests

## When to Use This Skill

- Writing new unit tests for functions, methods, or classes
- Adding test coverage for untested code
- Following test-driven development (TDD) practices
- Ensuring proper test structure and assertions

## Test Framework Detection

**Configured Framework:** {{test_framework}}

**If not configured, auto-detect:**

### Python
```bash
# Check for config files
pytest.ini, pyproject.toml, tox.ini → pytest
unittest/ directory → unittest

# Common command patterns
pytest                    # Most common
python -m pytest          # Explicit module
python -m unittest        # Standard library
```

### JavaScript/TypeScript
```bash
# Check for config files
jest.config.js, package.json → jest
.mocharc.json → mocha
karma.conf.js → karma

# Common command patterns
npm test                  # Check package.json scripts
jest                      # Direct Jest
npx jest                  # NPX execution
```

### Other Languages
- **Java:** JUnit (junit-*.jar), TestNG (testng.xml)
- **Go:** Built-in testing (go test)
- **Ruby:** RSpec (spec/ directory), Minitest (test/ directory)
- **C#:** NUnit, xUnit, MSTest

## Test Directory Location

**Configured Test Directories:** {{test_dirs}}

**If not configured, search for:**
- `tests/`, `test/`, `__tests__/`
- Files matching: `*_test.py`, `test_*.py`, `*.test.ts`, `*.spec.js`
- Adjacent to source: `src/**/*.test.*`

## Step-by-Step Test Creation Workflow

### 1. Identify What to Test

**For a Function/Method:**
- Normal inputs → expected outputs
- Edge cases (empty, null, zero, max values)
- Error conditions (invalid input, exceptions)
- Boundary conditions

**For a Class:**
- Constructor initialization
- Public method behavior
- State changes
- Interactions with dependencies

### 2. Use AAA Pattern (Arrange-Act-Assert)

**Arrange:** Set up test data and preconditions
**Act:** Execute the code under test
**Assert:** Verify expected outcomes

### 3. Framework-Specific Examples

#### Python (pytest)

```python
# test_calculator.py
import pytest
from calculator import Calculator

class TestCalculator:
    def test_add_positive_numbers(self):
        # Arrange
        calc = Calculator()
        
        # Act
        result = calc.add(2, 3)
        
        # Assert
        assert result == 5
    
    def test_add_with_zero(self):
        # Arrange
        calc = Calculator()
        
        # Act
        result = calc.add(5, 0)
        
        # Assert
        assert result == 5
    
    def test_divide_by_zero_raises_error(self):
        # Arrange
        calc = Calculator()
        
        # Act & Assert
        with pytest.raises(ZeroDivisionError):
            calc.divide(10, 0)
    
    @pytest.mark.parametrize("a,b,expected", [
        (1, 1, 2),
        (0, 0, 0),
        (-1, 1, 0),
        (100, 200, 300),
    ])
    def test_add_parametrized(self, a, b, expected):
        calc = Calculator()
        assert calc.add(a, b) == expected
```

See [pytest fixtures template](./pytest-fixtures.py) for advanced setup.

#### JavaScript (Jest)

```javascript
// calculator.test.js
const Calculator = require('./calculator');

describe('Calculator', () => {
  describe('add', () => {
    test('adds two positive numbers', () => {
      // Arrange
      const calc = new Calculator();
      
      // Act
      const result = calc.add(2, 3);
      
      // Assert
      expect(result).toBe(5);
    });
    
    test('adds with zero', () => {
      // Arrange
      const calc = new Calculator();
      
      // Act
      const result = calc.add(5, 0);
      
      // Assert
      expect(result).toBe(5);
    });
  });
  
  describe('divide', () => {
    test('throws error when dividing by zero', () => {
      // Arrange
      const calc = new Calculator();
      
      // Act & Assert
      expect(() => calc.divide(10, 0)).toThrow('Division by zero');
    });
  });
  
  test.each([
    [1, 1, 2],
    [0, 0, 0],
    [-1, 1, 0],
    [100, 200, 300],
  ])('add(%i, %i) returns %i', (a, b, expected) => {
    const calc = new Calculator();
    expect(calc.add(a, b)).toBe(expected);
  });
});
```

See [jest test template](./jest-test-template.js) for more patterns.

### 4. Testing Best Practices

✅ **DO:**
- Test one behavior per test
- Use descriptive test names (test_add_returns_sum_of_two_positive_numbers)
- Keep tests independent (no shared state)
- Mock external dependencies (APIs, databases, filesystem)
- Use fixtures/setup for common test data
- Test edge cases and error conditions

❌ **DON'T:**
- Test multiple behaviors in one test
- Depend on test execution order
- Use production data or real external services
- Test implementation details (private methods)
- Ignore edge cases
- Write overly complex test logic

### 5. Running Tests

**Run Command:** {{test_command}}

**If not configured:**

```bash
# Python
pytest                           # Run all tests
pytest tests/test_calculator.py  # Run specific file
pytest -k "test_add"             # Run tests matching pattern
pytest -v                        # Verbose output

# JavaScript
npm test                         # Run all tests
npm test calculator.test.js      # Run specific file
npm test -- --watch              # Watch mode
npm test -- --coverage           # With coverage

# Other detection methods
# 1. Check package.json "scripts.test"
# 2. Look for test config files
# 3. Try framework-specific commands
```

See [framework detection script](./detect-test-framework.sh) for auto-detection logic.

### 6. Verify Test Coverage

After writing tests, check coverage:

```bash
# Python
pytest --cov={{source_dirs}} --cov-report=html

# JavaScript
npm test -- --coverage

# View coverage report
# Python: open htmlcov/index.html
# JavaScript: open coverage/lcov-report/index.html
```

**Target Coverage:** Aim for 80%+ line coverage for critical code paths.

## Test Naming Conventions

**Pattern:** `test_<method>_<scenario>_<expected_result>`

**Examples:**
- `test_add_positive_numbers_returns_sum`
- `test_divide_by_zero_raises_exception`
- `test_process_empty_list_returns_empty_list`
- `test_authenticate_invalid_token_returns_401`

## Common Assertions

### Python (pytest)
```python
assert value == expected
assert value is True
assert value in collection
assert len(items) == 5
assert "substring" in string
with pytest.raises(Exception):
    risky_function()
```

### JavaScript (Jest)
```javascript
expect(value).toBe(expected)
expect(value).toEqual(expected)
expect(value).toBeTruthy()
expect(array).toContain(item)
expect(array).toHaveLength(5)
expect(fn).toThrow(Error)
expect(mock).toHaveBeenCalledWith(arg)
```

## Additional Resources

- [Mocking dependencies guide](./examples/mocking-guide.md)
- [Fixture patterns](./examples/fixture-patterns.md)
- [Parameterized tests](./examples/parameterized-tests.md)
- [Testing async code](./examples/async-testing.md)

## Integration with TDD Workflow

If following test-driven development:
1. Write failing test first
2. Run test to confirm it fails
3. Write minimal code to make it pass
4. Refactor while keeping tests green
5. Repeat for next behavior

For comprehensive TDD workflow, see the `designing-with-tdd` skill.
