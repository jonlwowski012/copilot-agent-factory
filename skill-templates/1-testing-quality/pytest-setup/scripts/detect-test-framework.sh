#!/bin/bash
# detect-test-framework.sh
# Helper script to detect test framework configuration in a Python project

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🔍 Detecting test framework configuration..."
echo ""

# Check for pytest
if command -v pytest &> /dev/null; then
    PYTEST_VERSION=$(pytest --version 2>&1 | head -n 1)
    echo -e "${GREEN}✓${NC} pytest is installed: ${PYTEST_VERSION}"
else
    echo -e "${RED}✗${NC} pytest is not installed"
    echo "  Install with: pip install pytest pytest-cov"
fi

# Check for test directories
if [ -d "tests" ]; then
    TEST_COUNT=$(find tests -name "test_*.py" -o -name "*_test.py" | wc -l)
    echo -e "${GREEN}✓${NC} tests/ directory exists (${TEST_COUNT} test files)"
elif [ -d "test" ]; then
    TEST_COUNT=$(find test -name "test_*.py" -o -name "*_test.py" | wc -l)
    echo -e "${GREEN}✓${NC} test/ directory exists (${TEST_COUNT} test files)"
else
    echo -e "${YELLOW}!${NC} No test directory found"
    echo "  Create with: mkdir tests && touch tests/__init__.py"
fi

# Check for pytest configuration
if [ -f "pytest.ini" ]; then
    echo -e "${GREEN}✓${NC} pytest.ini configuration file exists"
elif [ -f "pyproject.toml" ] && grep -q "\[tool.pytest.ini_options\]" pyproject.toml 2>/dev/null; then
    echo -e "${GREEN}✓${NC} pytest configuration in pyproject.toml"
elif [ -f "setup.cfg" ] && grep -q "\[tool:pytest\]" setup.cfg 2>/dev/null; then
    echo -e "${GREEN}✓${NC} pytest configuration in setup.cfg"
else
    echo -e "${YELLOW}!${NC} No pytest configuration file found"
    echo "  Create pytest.ini or add [tool.pytest.ini_options] to pyproject.toml"
fi

# Check for coverage configuration
if [ -f ".coveragerc" ]; then
    echo -e "${GREEN}✓${NC} .coveragerc configuration exists"
elif [ -f "pyproject.toml" ] && grep -q "\[tool.coverage" pyproject.toml 2>/dev/null; then
    echo -e "${GREEN}✓${NC} coverage configuration in pyproject.toml"
else
    echo -e "${YELLOW}!${NC} No coverage configuration found"
fi

# Check for conftest.py
if [ -f "tests/conftest.py" ] || [ -f "test/conftest.py" ]; then
    echo -e "${GREEN}✓${NC} conftest.py exists"
else
    echo -e "${YELLOW}!${NC} No conftest.py found"
    echo "  Create with: touch tests/conftest.py"
fi

# Check for pytest in dependencies
if [ -f "requirements.txt" ] && grep -q "pytest" requirements.txt; then
    echo -e "${GREEN}✓${NC} pytest in requirements.txt"
elif [ -f "pyproject.toml" ] && grep -q "pytest" pyproject.toml; then
    echo -e "${GREEN}✓${NC} pytest in pyproject.toml dependencies"
elif [ -f "Pipfile" ] && grep -q "pytest" Pipfile; then
    echo -e "${GREEN}✓${NC} pytest in Pipfile"
else
    echo -e "${YELLOW}!${NC} pytest not found in dependency files"
fi

echo ""
echo "📋 Recommendation:"
if command -v pytest &> /dev/null; then
    if [ -d "tests" ] || [ -d "test" ]; then
        echo "  Your project has pytest configured. Run: pytest -v"
    else
        echo "  pytest is installed but no tests directory. Create with: mkdir tests"
    fi
else
    echo "  pytest is not set up. Use pytest-setup skill to configure it."
fi
