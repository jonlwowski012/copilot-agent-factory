---
name: pytest-setup
description: "Setup pytest with coverage reporting and watch mode for this Python project"
auto-activates:
  - "set up pytest"
  - "configure pytest"
  - "install pytest"
  - "setup test framework"
  - "configure testing"
---

# Skill: Test Framework Setup (pytest)

## When to Use This Skill

This skill activates when you need to:
- Set up pytest from scratch in a Python project
- Add coverage reporting to existing tests
- Configure watch mode for test-driven development
- Fix broken pytest configurations

## Prerequisites

Check if testing is already configured:
- Look for {{test_dirs}} (e.g., `tests/`, `test/`, or `__tests__/`)
- Check for `pytest` in `requirements.txt`, `pyproject.toml`, or `Pipfile`
- Verify {{test_command}} exists in project configuration

**If already configured:** This skill provides configuration improvements and troubleshooting.

## Step-by-Step Workflow

### Step 1: Install pytest and Extensions

**If using pip (requirements.txt):**
```bash
pip install pytest pytest-cov pytest-watch
```

Add to `requirements.txt` or `requirements-dev.txt`:
```
pytest>=7.4.0
pytest-cov>=4.1.0
pytest-watch>=4.2.0
```

**If using Poetry:**
```bash
poetry add --group dev pytest pytest-cov pytest-watch
```

**If using Pipenv:**
```bash
pipenv install --dev pytest pytest-cov pytest-watch
```

**If using conda:**
```bash
conda install pytest pytest-cov
pip install pytest-watch
```

### Step 2: Create Test Directory Structure

```bash
# Create main test directory
mkdir -p tests

# Create __init__.py to make it a package
touch tests/__init__.py

# Create conftest.py for shared fixtures
touch tests/conftest.py

# Create your first test file
touch tests/test_example.py
```

Add a sample test to `tests/test_example.py`:
```python
def test_basic_example():
    """Basic example test to verify pytest is working."""
    assert 1 + 1 == 2
    
def test_string_operations():
    """Test string operations."""
    assert "hello".upper() == "HELLO"
```

### Step 3: Add pytest Configuration

**Option A: pytest.ini (Recommended)**

Create `pytest.ini` in project root:
```ini
[pytest]
testpaths = tests
python_files = test_*.py *_test.py
python_classes = Test*
python_functions = test_*
addopts = 
    -v
    --strict-markers
    --cov=src
    --cov-report=html
    --cov-report=term-missing
    --cov-report=xml
markers =
    slow: marks tests as slow (deselect with '-m "not slow"')
    integration: marks tests as integration tests
```

**Option B: pyproject.toml**

If using `pyproject.toml`, add:
```toml
[tool.pytest.ini_options]
testpaths = ["tests"]
python_files = ["test_*.py", "*_test.py"]
python_classes = ["Test*"]
python_functions = ["test_*"]
addopts = [
    "-v",
    "--strict-markers",
    "--cov=src",
    "--cov-report=html",
    "--cov-report=term-missing",
]
markers = [
    "slow: marks tests as slow",
    "integration: marks tests as integration tests",
]
```

**Note:** Update `--cov=src` to match your source directory:
- `--cov=src` if source is in `src/`
- `--cov=app` if source is in `app/`
- `--cov=.` for current directory
- `--cov=mypackage` for package name

### Step 4: Create conftest.py with Shared Fixtures

Add to `tests/conftest.py`:
```python
"""
Shared pytest fixtures and configuration.
"""
import pytest


@pytest.fixture
def sample_data():
    """Provide sample data for tests."""
    return {
        "name": "Test User",
        "email": "test@example.com",
        "age": 25
    }


@pytest.fixture
def temp_directory(tmp_path):
    """Provide a temporary directory for tests."""
    test_dir = tmp_path / "test_workspace"
    test_dir.mkdir()
    return test_dir
```

### Step 5: Run Tests

**Basic test run:**
```bash
pytest
```

**Verbose output:**
```bash
pytest -v
```

**With coverage:**
```bash
pytest --cov=src --cov-report=html
```

**Run specific test file:**
```bash
pytest tests/test_example.py
```

**Run specific test:**
```bash
pytest tests/test_example.py::test_basic_example
```

**Run tests matching pattern:**
```bash
pytest -k "test_string"
```

**Skip slow tests:**
```bash
pytest -m "not slow"
```

### Step 6: Set Up Watch Mode (Optional)

**Run pytest-watch for continuous testing:**
```bash
# Watch for changes and re-run tests
ptw

# Watch with verbose output
ptw -- -v

# Watch specific directory
ptw tests/
```

**Alternative: pytest-xdist for parallel execution:**
```bash
pip install pytest-xdist
pytest -n auto  # Auto-detect CPU count
pytest -n 4     # Use 4 workers
```

## Common Issues and Solutions

### Issue: Tests not discovered

**Symptoms:** pytest finds 0 tests or can't find test files

**Solutions:**
1. Verify test file naming: `test_*.py` or `*_test.py`
2. Check test function naming: must start with `test_`
3. Ensure `tests/` directory has `__init__.py`
4. Check `testpaths` in pytest configuration
5. Run with verbose discovery: `pytest --collect-only -v`

### Issue: Coverage not showing or incorrect

**Symptoms:** Coverage report shows 0% or doesn't include your code

**Solutions:**
1. Verify `--cov=` points to correct source directory
2. Check that source code is in the specified directory
3. Ensure `__init__.py` exists in source directories
4. Run: `pytest --cov=. --cov-report=term` to see detailed report
5. Check `.coveragerc` or `pyproject.toml` coverage config

### Issue: Import errors in tests

**Symptoms:** `ModuleNotFoundError` when running tests

**Solutions:**
1. Install package in development mode: `pip install -e .`
2. Add project root to PYTHONPATH: `export PYTHONPATH="${PYTHONPATH}:${PWD}"`
3. Create `conftest.py` with path modifications:
```python
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))
```
4. Ensure `setup.py` or `pyproject.toml` is configured correctly

### Issue: Fixtures not found

**Symptoms:** `fixture 'name' not found`

**Solutions:**
1. Ensure `conftest.py` exists in `tests/` directory
2. Check fixture name spelling matches exactly
3. Verify fixture is defined with `@pytest.fixture` decorator
4. Check fixture scope if using scoped fixtures

### Issue: Slow test execution

**Solutions:**
1. Use pytest-xdist for parallel execution: `pytest -n auto`
2. Mark slow tests: `@pytest.mark.slow` and skip: `pytest -m "not slow"`
3. Use fixtures to share expensive setup
4. Cache database/API responses in tests
5. Profile tests: `pytest --durations=10` to see slowest tests

## Success Criteria

- ✅ pytest runs successfully with `pytest -v`
- ✅ Coverage report generated in `htmlcov/` directory
- ✅ Tests are discovered automatically
- ✅ Sample test passes
- ✅ Coverage percentage displayed in terminal
- ✅ Watch mode works (if installed)

## Additional Configuration

### Integration with VS Code

Add to `.vscode/settings.json`:
```json
{
    "python.testing.pytestEnabled": true,
    "python.testing.unittestEnabled": false,
    "python.testing.pytestArgs": [
        "tests",
        "-v"
    ]
}
```

### Integration with CI/CD

**GitHub Actions example:**
```yaml
- name: Run tests with pytest
  run: |
    pip install pytest pytest-cov
    pytest --cov=src --cov-report=xml
    
- name: Upload coverage to Codecov
  uses: codecov/codecov-action@v3
  with:
    file: ./coverage.xml
```

### Pre-commit Hook

Add to `.pre-commit-config.yaml`:
```yaml
- repo: local
  hooks:
    - id: pytest-check
      name: pytest
      entry: pytest
      language: system
      pass_filenames: false
      always_run: true
```

## Related Skills

- **run-tests** - Commands to execute tests in configured projects
- **debug-test-failures** - Debugging failing tests
- **code-formatting** - Code formatting with black/ruff

## Documentation References

- [pytest Documentation](https://docs.pytest.org/)
- [pytest-cov Documentation](https://pytest-cov.readthedocs.io/)
- [pytest-watch GitHub](https://github.com/joeyespo/pytest-watch)
