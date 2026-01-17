---
name: run-tests
description: "Commands to execute tests in this project with various options and configurations"
auto-activates:
  - "run tests"
  - "execute tests"
  - "how do I run tests"
  - "test command"
  - "running tests"
---

# Skill: Run Tests

## When to Use This Skill

This skill activates when you need to:
- Run tests in an already-configured project
- Execute tests with specific options (coverage, verbose, specific files)
- Run tests in CI/CD or locally
- Understand test execution commands for this project

## Prerequisites

This skill assumes tests are already configured. If not, use the **pytest-setup** or **jest-setup** skill first.

## Step-by-Step Workflow

### Step 1: Detect Test Framework and Command

**Check for configured test command:**

Look in project configuration files:
- `package.json` → `scripts.test`
- `pyproject.toml` → `[tool.pytest]` or custom scripts
- `Makefile` → `test` target
- `.github/workflows/` → CI test commands
- `tox.ini` → test commands

**If {{test_command}} is defined:**
```bash
{{test_command}}
```

### Step 2: Run Tests by Tech Stack

#### Python (pytest)

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
pytest --cov=src --cov-report=html --cov-report=term
```

**Specific file:**
```bash
pytest tests/test_example.py
```

**Specific test:**
```bash
pytest tests/test_example.py::test_function_name
```

**Pattern matching:**
```bash
pytest -k "test_user"  # Run tests matching pattern
```

**Markers:**
```bash
pytest -m "not slow"  # Skip slow tests
pytest -m "integration"  # Only integration tests
```

**Parallel execution:**
```bash
pytest -n auto  # Requires pytest-xdist
```

**Stop on first failure:**
```bash
pytest -x
```

**Show print output:**
```bash
pytest -s
```

#### JavaScript/TypeScript (Jest)

**Basic test run:**
```bash
npm test
# or
yarn test
```

**Watch mode:**
```bash
npm test -- --watch
```

**Coverage:**
```bash
npm test -- --coverage
```

**Specific file:**
```bash
npm test -- tests/example.test.js
```

**Pattern matching:**
```bash
npm test -- --testNamePattern="user"
```

**Update snapshots:**
```bash
npm test -- --updateSnapshot
```

**Verbose:**
```bash
npm test -- --verbose
```

#### JavaScript/TypeScript (Vitest)

**Run tests:**
```bash
npm run test
# or
vitest
```

**Watch mode:**
```bash
vitest --watch
```

**Coverage:**
```bash
vitest --coverage
```

**UI mode:**
```bash
vitest --ui
```

#### Go

**Run all tests:**
```bash
go test ./...
```

**Verbose:**
```bash
go test -v ./...
```

**Coverage:**
```bash
go test -cover ./...
go test -coverprofile=coverage.out ./...
go tool cover -html=coverage.out
```

**Specific package:**
```bash
go test ./pkg/mypackage
```

**Run specific test:**
```bash
go test -run TestFunctionName
```

**Parallel:**
```bash
go test -parallel 4 ./...
```

**Benchmarks:**
```bash
go test -bench=. ./...
```

#### Rust

**Run all tests:**
```bash
cargo test
```

**Verbose:**
```bash
cargo test -- --nocapture
```

**Specific test:**
```bash
cargo test test_name
```

**Documentation tests:**
```bash
cargo test --doc
```

**Integration tests:**
```bash
cargo test --test integration_test_name
```

#### Ruby (RSpec)

**Run all tests:**
```bash
rspec
```

**Specific file:**
```bash
rspec spec/models/user_spec.rb
```

**Specific test:**
```bash
rspec spec/models/user_spec.rb:42
```

**Format:**
```bash
rspec --format documentation
```

#### Java (Maven)

**Run tests:**
```bash
mvn test
```

**Skip tests:**
```bash
mvn install -DskipTests
```

**Specific test:**
```bash
mvn test -Dtest=TestClassName
```

#### Java (Gradle)

**Run tests:**
```bash
./gradlew test
```

**Continuous:**
```bash
./gradlew test --continuous
```

**Specific test:**
```bash
./gradlew test --tests TestClassName
```

### Step 3: Common Test Execution Patterns

**Run tests before commit:**
```bash
# Add to pre-commit hook
git add -A
{{test_command}}
git commit -m "message"
```

**Run tests with timeout:**
```bash
# Python
pytest --timeout=300

# JavaScript
npm test -- --testTimeout=5000
```

**Run failed tests only:**
```bash
# Python
pytest --lf  # last failed
pytest --ff  # failed first

# Jest
npm test -- --onlyFailures
```

**Generate coverage report:**
```bash
# Python
pytest --cov=src --cov-report=html
open htmlcov/index.html

# JavaScript
npm test -- --coverage
open coverage/lcov-report/index.html
```

## Common Issues and Solutions

### Issue: Tests not found or not running

**Solutions:**
1. Verify you're in the project root directory
2. Check test file naming conventions match framework expectations
3. Ensure test dependencies are installed: `pip install -r requirements.txt` or `npm install`
4. Check test configuration files (pytest.ini, jest.config.js)

### Issue: Tests failing locally but pass in CI

**Solutions:**
1. Check environment variables (`.env` files)
2. Verify Python/Node version matches CI
3. Clear caches: `pytest --cache-clear` or `jest --clearCache`
4. Check for local-only fixtures or data
5. Review CI logs for differences in test execution

### Issue: Tests timing out

**Solutions:**
1. Increase timeout: `pytest --timeout=600` or jest testTimeout
2. Check for infinite loops or blocking operations
3. Use async/await properly in async tests
4. Mock external API calls
5. Use fixtures to avoid expensive setup

### Issue: Import/module errors

**Solutions:**
1. Install in development mode: `pip install -e .` or `npm install`
2. Check PYTHONPATH or NODE_PATH
3. Verify package.json "type" field for ES modules
4. Check tsconfig.json paths configuration

### Issue: Coverage not accurate

**Solutions:**
1. Ensure all source files are included in coverage config
2. Check .coveragerc or jest.config.js coverage settings
3. Run with coverage flags: `--cov=src` or `--coverage`
4. Clear coverage cache and re-run

## Success Criteria

- ✅ Tests execute without errors
- ✅ Test results are displayed clearly
- ✅ Failed tests show helpful error messages
- ✅ Coverage reports generated (if requested)
- ✅ Test execution time is reasonable

## Quick Reference

### Common Commands by Framework

| Framework | Run Tests | Coverage | Specific Test |
|-----------|-----------|----------|---------------|
| pytest | `pytest -v` | `pytest --cov=src` | `pytest tests/test_file.py::test_name` |
| Jest | `npm test` | `npm test -- --coverage` | `npm test -- file.test.js` |
| Vitest | `vitest` | `vitest --coverage` | `vitest file.test.ts` |
| Go | `go test ./...` | `go test -cover ./...` | `go test -run TestName` |
| Rust | `cargo test` | `cargo tarpaulin` | `cargo test test_name` |
| RSpec | `rspec` | `rspec --coverage` | `rspec spec/file_spec.rb:42` |

## Related Skills

- **pytest-setup** - Set up pytest from scratch
- **debug-test-failures** - Debug failing tests
- **ci-pipeline** - Configure CI/CD test execution

## Documentation References

- [pytest Documentation](https://docs.pytest.org/)
- [Jest Documentation](https://jestjs.io/)
- [Vitest Documentation](https://vitest.dev/)
- [Go Testing Package](https://pkg.go.dev/testing)
