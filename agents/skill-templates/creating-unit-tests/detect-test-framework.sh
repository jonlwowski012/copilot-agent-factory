#!/bin/bash
# Auto-detect test framework based on project files and dependencies

# Python test framework detection
detect_python_test_framework() {
    if [ -f "pytest.ini" ] || [ -f "pyproject.toml" ] && grep -q "pytest" pyproject.toml 2>/dev/null; then
        echo "pytest"
        return 0
    fi
    
    if [ -d "tests" ] && [ -f "tests/__init__.py" ]; then
        echo "unittest"
        return 0
    fi
    
    if command -v pytest &> /dev/null; then
        echo "pytest"
        return 0
    fi
    
    echo "unittest"  # Default Python framework
}

# JavaScript test framework detection
detect_js_test_framework() {
    if [ -f "jest.config.js" ] || [ -f "jest.config.json" ]; then
        echo "jest"
        return 0
    fi
    
    if [ -f "package.json" ]; then
        if grep -q "\"jest\"" package.json; then
            echo "jest"
            return 0
        elif grep -q "\"mocha\"" package.json; then
            echo "mocha"
            return 0
        elif grep -q "\"vitest\"" package.json; then
            echo "vitest"
            return 0
        fi
    fi
    
    echo "jest"  # Default JS framework
}

# Detect primary language
if [ -f "requirements.txt" ] || [ -f "pyproject.toml" ] || [ -f "setup.py" ]; then
    echo "Language: Python"
    echo "Framework: $(detect_python_test_framework)"
    echo "Command: pytest"
elif [ -f "package.json" ]; then
    echo "Language: JavaScript/TypeScript"
    echo "Framework: $(detect_js_test_framework)"
    echo "Command: npm test"
elif [ -f "go.mod" ]; then
    echo "Language: Go"
    echo "Framework: go test"
    echo "Command: go test ./..."
elif [ -f "Cargo.toml" ]; then
    echo "Language: Rust"
    echo "Framework: cargo test"
    echo "Command: cargo test"
elif [ -f "pom.xml" ] || [ -f "build.gradle" ]; then
    echo "Language: Java"
    echo "Framework: JUnit"
    echo "Command: mvn test"
else
    echo "Language: Unknown"
    echo "Framework: Unable to detect"
    echo "Command: Please specify manually"
fi
