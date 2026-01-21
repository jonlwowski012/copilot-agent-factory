# pytest-setup Skill

**Auto-activates on:** "set up pytest", "configure pytest", "install pytest", "setup test framework", "configure testing"

## Description

This skill provides step-by-step instructions for setting up pytest with coverage reporting and watch mode in Python projects. It includes fallback logic for unconfigured environments and covers multiple package managers.

## What It Does

- Installs pytest, pytest-cov, and pytest-watch
- Creates proper test directory structure
- Configures pytest.ini or pyproject.toml
- Sets up shared fixtures in conftest.py
- Provides troubleshooting for common issues

## Tech Stack Coverage

- **Package Managers:** pip, Poetry, Pipenv, conda
- **Config Formats:** pytest.ini, pyproject.toml
- **Python Versions:** 3.8+

## Usage Example

When a user types:
```
"I need to set up pytest with coverage in this project"
```

The skill will automatically activate and guide them through:
1. Installing pytest and extensions
2. Creating test directory structure
3. Configuring pytest
4. Creating sample tests
5. Running tests with coverage

## Related Skills

- **run-tests** - Execute tests once configured
- **debug-test-failures** - Debug failing tests
- **code-formatting** - Format code with black/ruff

## Maintenance Notes

- Keep pytest version recommendations current
- Update configuration examples with latest best practices
- Add new troubleshooting patterns as discovered
