---
name: ci-pipeline
description: "Understanding and debugging CI/CD pipelines in this project"
auto-activates:
  - "CI pipeline"
  - "GitHub Actions"
  - "CI failing"
  - "workflow failing"
  - "pipeline error"
---

# Skill: CI/CD Pipeline

## When to Use This Skill

This skill activates when you need to:
- Understand the project's CI/CD setup
- Debug failing CI/CD pipelines
- Fix workflow errors
- Add or modify CI checks
- Understand why checks are failing on your PR

## Prerequisites

- Basic understanding of CI/CD concepts
- Access to repository (to view workflow runs)
- Understanding of project's tech stack

## Step-by-Step Workflow

### Step 1: Identify CI/CD Platform

**Check for CI configuration files:**
```bash
# GitHub Actions
.github/workflows/*.yml

# GitLab CI
.gitlab-ci.yml

# CircleCI
.circleci/config.yml

# Travis CI
.travis.yml

# Jenkins
Jenkinsfile

# Azure Pipelines
azure-pipelines.yml
```

### Step 2: View CI Pipeline Status

**GitHub Actions (via CLI):**
```bash
# Install GitHub CLI if needed
# https://cli.github.com/

# List recent workflow runs
gh run list

# View specific run
gh run view <run-id>

# Watch a running workflow
gh run watch
```

**GitHub Actions (via Web):**
1. Go to repository on GitHub
2. Click "Actions" tab
3. Select workflow run
4. View job details and logs

### Step 3: Understand Common CI Workflows

#### Typical CI Pipeline Stages

```yaml
# .github/workflows/ci.yml example
name: CI
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup
        # Install dependencies
      - name: Lint
        # Run linter
      - name: Test
        # Run tests
      - name: Build
        # Build project
```

**Common stages:**
1. **Checkout** - Clone repository code
2. **Setup** - Install language/dependencies
3. **Lint** - Check code style
4. **Test** - Run test suite
5. **Build** - Compile/build project
6. **Deploy** - Deploy to environment (optional)

### Step 4: Debug Failing CI Checks

#### Step 4a: Identify Which Check Failed

**Look at PR checks:**
- ✅ Green check - Passed
- ❌ Red X - Failed
- 🟡 Yellow dot - Running
- ⚪ Gray circle - Pending

**Click on failed check to see:**
- Job name
- Failure step
- Error message
- Logs

#### Step 4b: Common Failure Patterns

**Pattern 1: Linting Failures**

**Error example:**
```
Error: Format check failed
black --check . returned non-zero exit code
```

**Fix:**
```bash
# Run formatter locally
black .
# or
prettier --write .

# Commit and push
git add .
git commit -m "style: fix formatting"
git push
```

**Pattern 2: Test Failures**

**Error example:**
```
FAILED tests/test_user.py::test_login - AssertionError
```

**Fix:**
```bash
# Run tests locally
pytest tests/test_user.py::test_login -v

# Debug and fix
# Re-run all tests
pytest

# Commit fix
git add .
git commit -m "fix: resolve test failure in login"
git push
```

**Pattern 3: Build Failures**

**Error example:**
```
Error: Module not found: 'missing-package'
npm ERR! code ELIFECYCLE
```

**Fix:**
```bash
# Add missing dependency
npm install missing-package --save

# Or fix import
# Commit and push
git add package.json package-lock.json
git commit -m "fix: add missing dependency"
git push
```

**Pattern 4: Timeout Errors**

**Error example:**
```
Error: The job exceeded the maximum execution time
```

**Fix:**
```yaml
# Increase timeout in workflow
jobs:
  test:
    timeout-minutes: 30  # Increase from default 360
```

**Pattern 5: Environment Issues**

**Error example:**
```
Error: Environment variable DATABASE_URL not set
```

**Fix:**
```yaml
# Add secret/env var in workflow
jobs:
  test:
    env:
      DATABASE_URL: postgresql://localhost/test
```

**Or add in GitHub repository settings:**
- Settings → Secrets and variables → Actions
- Add new secret

#### Step 4c: View Detailed Logs

**Download logs:**
```bash
# GitHub Actions
gh run download <run-id>

# Or via web UI
# Click on failed step → View raw logs → Download
```

**Key things to look for in logs:**
- Last successful step before failure
- Exact error message
- Stack trace
- Environment variables
- Dependency versions

### Step 5: Fix Common CI Issues

#### Issue: Tests pass locally but fail in CI

**Possible causes:**
- Different Python/Node version
- Missing environment variables
- Different OS (Mac vs Linux)
- Cached dependencies
- Timezone differences

**Solutions:**
```yaml
# Match local versions in CI
- uses: actions/setup-python@v4
  with:
    python-version: '3.10'  # Match your local version

# Clear cache
- name: Clear pip cache
  run: pip cache purge

# Set environment variables
env:
  TZ: America/New_York
  DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

#### Issue: Linter fails in CI but passes locally

**Cause:** Different linter version or configuration

**Solutions:**
```bash
# Pin linter version
# requirements.txt
black==23.7.0
ruff==0.0.280

# package.json
"devDependencies": {
  "prettier": "3.0.0",
  "eslint": "8.44.0"
}

# Run same command as CI locally
npm run lint
black --check .
```

#### Issue: Build succeeds but deploy fails

**Cause:** Environment-specific issues

**Solutions:**
- Check deployment credentials
- Verify target environment is accessible
- Check for deployment-specific env vars
- Review deploy step logs carefully

### Step 6: Run CI Checks Locally

**GitHub Actions with act:**
```bash
# Install act
brew install act  # macOS
# or download from github.com/nektos/act

# Run workflow locally
act

# Run specific job
act -j test

# Run with secrets
act --secret-file .env.secrets
```

**Pre-commit hooks (mimics CI):**
```bash
# Install pre-commit
pip install pre-commit

# Install hooks
pre-commit install

# Run all hooks
pre-commit run --all-files
```

### Step 7: Modify CI Workflow

**Add a new check:**
```yaml
# .github/workflows/ci.yml
jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run security scan
        run: |
          pip install bandit
          bandit -r src/
```

**Add caching:**
```yaml
- name: Cache dependencies
  uses: actions/cache@v3
  with:
    path: ~/.cache/pip
    key: ${{ runner.os }}-pip-${{ hashFiles('requirements.txt') }}
```

**Matrix strategy (test multiple versions):**
```yaml
jobs:
  test:
    strategy:
      matrix:
        python-version: ['3.8', '3.9', '3.10', '3.11']
    steps:
      - uses: actions/setup-python@v4
        with:
          python-version: ${{ matrix.python-version }}
```

## Common CI/CD Patterns

### Pattern 1: PR Checks

```yaml
name: PR Checks
on: pull_request

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm run lint
  
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm test
  
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm run build
```

### Pattern 2: Main Branch Deploy

```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to production
        run: ./deploy.sh
        env:
          DEPLOY_KEY: ${{ secrets.DEPLOY_KEY }}
```

### Pattern 3: Release on Tag

```yaml
name: Release
on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build and publish
        run: npm publish
```

## Common Issues and Solutions

### Issue: CI is stuck or taking too long

**Solutions:**
1. Check for infinite loops in tests
2. Verify no blocking operations
3. Increase timeout
4. Use caching for dependencies
5. Cancel and restart workflow

### Issue: Secrets not accessible

**Solutions:**
1. Add secret in repository settings
2. Reference correctly: `${{ secrets.SECRET_NAME }}`
3. Check secret is available for forks (if applicable)
4. Verify workflow has correct permissions

### Issue: Workflow not triggering

**Solutions:**
1. Check `on:` triggers match your action
2. Verify workflow file syntax is valid
3. Check branch name matches filter
4. Look for syntax errors in YAML

## Success Criteria

- ✅ Understand why CI checks failed
- ✅ Can reproduce CI failure locally
- ✅ Fixed the issue
- ✅ CI checks pass on re-run
- ✅ Know how to prevent similar failures

## Quick Reference

### GitHub Actions Commands

```bash
# View runs
gh run list
gh run view <run-id>

# Re-run failed jobs
gh run rerun <run-id>

# Download logs
gh run download <run-id>

# Watch live
gh run watch
```

### Common Workflow Triggers

```yaml
# On push to any branch
on: push

# On pull request
on: pull_request

# On push to specific branch
on:
  push:
    branches: [main, develop]

# On tag
on:
  push:
    tags: ['v*']

# On schedule (cron)
on:
  schedule:
    - cron: '0 0 * * *'
```

## Related Skills

- **run-tests** - Run tests locally before pushing
- **code-formatting** - Fix linting issues
- **git-workflow** - Push changes to fix CI

## Documentation References

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Actions Syntax](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions)
- [act - Local GitHub Actions](https://github.com/nektos/act)
- [pre-commit Documentation](https://pre-commit.com/)
