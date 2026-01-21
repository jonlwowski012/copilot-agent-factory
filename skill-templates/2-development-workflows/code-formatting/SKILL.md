---
name: code-formatting
description: "Format code according to project standards and fix linting issues"
auto-activates:
  - "format code"
  - "fix formatting"
  - "run formatter"
  - "code style"
  - "linting errors"
---

# Skill: Code Formatting

## When to Use This Skill

This skill activates when you need to:
- Format code to match project style guidelines
- Fix linting errors
- Set up automatic code formatting
- Understand project formatting standards

## Prerequisites

Check project for existing formatting configuration:
- `.prettierrc`, `.eslintrc` (JavaScript/TypeScript)
- `.black`, `pyproject.toml`, `ruff.toml` (Python)
- `.rustfmt.toml` (Rust)
- `.gofmt` settings (Go)

## Step-by-Step Workflow

### Step 1: Detect Formatting Tools

**Check {{lint_command}} or look for:**
- `package.json` scripts: `"format"`, `"lint"`, `"lint:fix"`
- Configuration files in project root
- `.pre-commit-config.yaml` for pre-commit hooks
- CI/CD workflows for formatting checks

### Step 2: Format Code by Tech Stack

#### Python

**Option A: Black (Opinionated)**
```bash
# Install
pip install black

# Format all Python files
black .

# Format specific file
black myfile.py

# Check without modifying
black --check .

# Preview changes
black --diff .
```

**Add to pyproject.toml:**
```toml
[tool.black]
line-length = 88
target-version = ['py310']
include = '\.pyi?$'
extend-exclude = '''
/(
  # directories
  \.eggs
  | \.git
  | \.venv
  | build
  | dist
)/
'''
```

**Option B: Ruff (Fast, Modern)**
```bash
# Install
pip install ruff

# Format code
ruff format .

# Check and fix linting
ruff check --fix .

# Check only
ruff check .
```

**Add ruff.toml:**
```toml
line-length = 88
target-version = "py310"

[lint]
select = ["E", "F", "I", "N", "W"]
ignore = ["E501"]

[format]
quote-style = "double"
indent-style = "space"
```

**Option C: autopep8**
```bash
# Install
pip install autopep8

# Format file
autopep8 --in-place --aggressive --aggressive myfile.py

# Format all files
find . -name '*.py' -exec autopep8 --in-place --aggressive --aggressive {} \;
```

#### JavaScript/TypeScript

**Option A: Prettier**
```bash
# Install
npm install --save-dev prettier

# Format all files
npx prettier --write .

# Format specific files
npx prettier --write "src/**/*.{js,jsx,ts,tsx,json,css,md}"

# Check formatting
npx prettier --check .
```

**Add .prettierrc:**
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

**Option B: ESLint (with autofix)**
```bash
# Install
npm install --save-dev eslint

# Fix all fixable issues
npx eslint --fix .

# Fix specific files
npx eslint --fix src/**/*.js
```

**Combined (Prettier + ESLint):**
```bash
# Format with Prettier, then lint with ESLint
npx prettier --write . && npx eslint --fix .
```

**Add to package.json:**
```json
{
  "scripts": {
    "format": "prettier --write .",
    "lint": "eslint .",
    "lint:fix": "eslint --fix ."
  }
}
```

#### Go

**Built-in gofmt:**
```bash
# Format all Go files
gofmt -w .

# Format specific file
gofmt -w main.go

# Check formatting (returns files that need formatting)
gofmt -l .
```

**Alternative: goimports (adds/removes imports)**
```bash
# Install
go install golang.org/x/tools/cmd/goimports@latest

# Format and fix imports
goimports -w .
```

**Option: golangci-lint (comprehensive)**
```bash
# Install
go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest

# Run linters and auto-fix
golangci-lint run --fix
```

#### Rust

**Built-in rustfmt:**
```bash
# Format all Rust files
cargo fmt

# Check formatting without modifying
cargo fmt -- --check
```

**Add rustfmt.toml:**
```toml
max_width = 100
hard_tabs = false
tab_spaces = 4
edition = "2021"
```

**Clippy (Rust linter):**
```bash
# Run Clippy
cargo clippy

# Auto-fix some issues
cargo clippy --fix
```

#### Ruby

**RuboCop:**
```bash
# Install
gem install rubocop

# Auto-fix
rubocop -A

# Check only
rubocop

# Fix safe issues only
rubocop --safe-auto-correct
```

**Add .rubocop.yml:**
```yaml
AllCops:
  TargetRubyVersion: 3.0
  NewCops: enable

Style/StringLiterals:
  EnforcedStyle: single_quotes
```

#### Java

**Google Java Format:**
```bash
# Download
wget https://github.com/google/google-java-format/releases/download/v1.17.0/google-java-format-1.17.0-all-deps.jar

# Format file
java -jar google-java-format-1.17.0-all-deps.jar -i MyFile.java

# Format all Java files
find . -name "*.java" -exec java -jar google-java-format-1.17.0-all-deps.jar -i {} \;
```

### Step 3: Set Up Automatic Formatting

#### VS Code

**Create .vscode/settings.json:**
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[python]": {
    "editor.defaultFormatter": "ms-python.black-formatter",
    "editor.formatOnSave": true
  },
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[go]": {
    "editor.formatOnSave": true
  }
}
```

#### Pre-commit Hooks

**Install pre-commit:**
```bash
pip install pre-commit
```

**Create .pre-commit-config.yaml:**

**For Python:**
```yaml
repos:
  - repo: https://github.com/psf/black
    rev: 23.7.0
    hooks:
      - id: black
  - repo: https://github.com/charliermarsh/ruff-pre-commit
    rev: v0.0.280
    hooks:
      - id: ruff
        args: [--fix, --exit-non-zero-on-fix]
```

**For JavaScript/TypeScript:**
```yaml
repos:
  - repo: https://github.com/pre-commit/mirrors-prettier
    rev: v3.0.0
    hooks:
      - id: prettier
        types_or: [javascript, jsx, ts, tsx, json, css, markdown]
  - repo: https://github.com/pre-commit/mirrors-eslint
    rev: v8.44.0
    hooks:
      - id: eslint
        args: [--fix]
```

**Install hooks:**
```bash
pre-commit install
```

**Run on all files:**
```bash
pre-commit run --all-files
```

### Step 4: Check Formatting in CI

**GitHub Actions example (.github/workflows/format-check.yml):**

**Python:**
```yaml
name: Format Check
on: [push, pull_request]
jobs:
  format:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.10'
      - run: pip install black ruff
      - run: black --check .
      - run: ruff check .
```

**JavaScript:**
```yaml
name: Format Check
on: [push, pull_request]
jobs:
  format:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
      - run: npx prettier --check .
```

## Common Issues and Solutions

### Issue: Formatter not found or command fails

**Solutions:**
1. Install formatter: `pip install black` or `npm install -D prettier`
2. Check if it's in package.json/requirements.txt
3. Activate virtual environment (Python)
4. Clear npm cache: `npm cache clean --force`

### Issue: Formatting conflicts between tools

**Solutions:**
1. Choose one primary formatter (Black/Prettier)
2. Configure linter to defer to formatter
3. Use prettier-eslint or eslint-config-prettier for JS
4. Disable formatting rules in linter config

### Issue: Files keep getting reformatted back and forth

**Solutions:**
1. Ensure all developers use same formatter version
2. Commit .prettierrc, .black, etc. to repo
3. Run formatter in CI to enforce
4. Check for conflicting editor settings

### Issue: Some files excluded from formatting

**Solutions:**
1. Check .prettierignore, .gitignore, exclude patterns
2. Verify file extensions are included
3. Check formatter configuration
4. Run with verbose flag to see what's excluded

## Success Criteria

- ✅ Code formatted consistently across all files
- ✅ No formatting errors in output
- ✅ Linting errors fixed or documented
- ✅ Format-on-save configured (optional)
- ✅ Pre-commit hooks working (optional)

## Quick Reference Commands

| Language | Format Command | Check Command |
|----------|----------------|---------------|
| Python (Black) | `black .` | `black --check .` |
| Python (Ruff) | `ruff format .` | `ruff check .` |
| JavaScript | `prettier --write .` | `prettier --check .` |
| Go | `gofmt -w .` | `gofmt -l .` |
| Rust | `cargo fmt` | `cargo fmt -- --check` |
| Ruby | `rubocop -A` | `rubocop` |

## Related Skills

- **local-dev-setup** - Initial project setup
- **git-workflow** - Git pre-commit integration
- **ci-pipeline** - CI formatting checks

## Documentation References

- [Black Documentation](https://black.readthedocs.io/)
- [Ruff Documentation](https://beta.ruff.rs/docs/)
- [Prettier Documentation](https://prettier.io/docs/)
- [ESLint Documentation](https://eslint.org/docs/)
- [pre-commit](https://pre-commit.com/)
