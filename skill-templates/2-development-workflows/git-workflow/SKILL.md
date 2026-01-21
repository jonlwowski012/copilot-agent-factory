---
name: git-workflow
description: "Git branch strategy, commit conventions, and PR process for this project"
auto-activates:
  - "git workflow"
  - "commit message"
  - "branch strategy"
  - "how to commit"
  - "pull request process"
---

# Skill: Git Workflow

## When to Use This Skill

This skill activates when you need to:
- Understand the project's Git workflow
- Create branches following project conventions
- Write commit messages properly
- Submit pull requests correctly
- Manage Git history

## Prerequisites

- Git installed
- Repository cloned
- Understand basic Git commands

## Step-by-Step Workflow

### Step 1: Check Project Git Conventions

**Look for documentation:**
- `CONTRIBUTING.md` - Contribution guidelines
- `.github/PULL_REQUEST_TEMPLATE.md` - PR template
- `.github/ISSUE_TEMPLATE/` - Issue templates
- `README.md` - Git workflow section

**Common patterns to detect:**
- Branch naming: `feature/`, `bugfix/`, `hotfix/`
- Commit conventions: Conventional Commits, Angular style
- PR requirements: Tests, documentation, reviews

### Step 2: Create a New Branch

**Check current branch:**
```bash
git branch
git status
```

**Update main/master branch:**
```bash
# Switch to main branch
git checkout main  # or master

# Pull latest changes
git pull origin main
```

**Create new branch:**

**Common naming conventions:**
```bash
# Feature branch
git checkout -b feature/add-user-authentication
git checkout -b feature/issue-123-add-login

# Bug fix
git checkout -b bugfix/fix-login-redirect
git checkout -b fix/issue-456-memory-leak

# Hotfix (urgent production fix)
git checkout -b hotfix/security-patch-v1.2.1

# Refactor
git checkout -b refactor/improve-database-queries

# Documentation
git checkout -b docs/update-api-documentation

# Release branch
git checkout -b release/v1.2.0
```

**Branch naming best practices:**
- Lowercase with hyphens
- Include issue/ticket number if available
- Descriptive but concise
- Follow project pattern

### Step 3: Make Changes and Commit

**Check changes:**
```bash
git status
git diff
```

**Stage changes:**
```bash
# Stage specific files
git add file1.py file2.js

# Stage all changes
git add .

# Stage interactively
git add -p
```

**Write commit messages:**

**Conventional Commits format:**
```bash
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, no logic change)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks
- `perf:` - Performance improvements
- `ci:` - CI/CD changes

**Examples:**

**Simple commit:**
```bash
git commit -m "feat: add user authentication"
```

**With scope:**
```bash
git commit -m "fix(auth): resolve login redirect issue"
```

**With body:**
```bash
git commit -m "feat(api): add rate limiting

Implements token bucket algorithm for API rate limiting.
- 100 requests per minute per API key
- Returns 429 status when limit exceeded
- Adds X-RateLimit headers to responses

Closes #123"
```

**Breaking change:**
```bash
git commit -m "feat(api)!: change authentication to OAuth2

BREAKING CHANGE: API now requires OAuth2 tokens instead of API keys.
Users must migrate to OAuth2 authentication."
```

**Common patterns:**
```bash
# Feature
git commit -m "feat: add search functionality"

# Bug fix
git commit -m "fix: resolve null pointer exception in user service"

# Documentation
git commit -m "docs: update installation instructions"

# Tests
git commit -m "test: add unit tests for authentication module"

# Refactor
git commit -m "refactor: extract validation logic into separate module"

# Performance
git commit -m "perf: optimize database queries for user lookup"

# Multiple changes (avoid this, prefer atomic commits)
git commit -m "chore: update dependencies and fix linting issues"
```

### Step 4: Push Branch

**First push:**
```bash
git push -u origin feature/my-feature
```

**Subsequent pushes:**
```bash
git push
```

**Force push (use carefully!):**
```bash
# After rebase or amend
git push --force-with-lease origin feature/my-feature
```

### Step 5: Create Pull Request

**Via GitHub CLI:**
```bash
# Install gh CLI if needed
# https://cli.github.com/

# Create PR
gh pr create --title "Add user authentication" --body "Implements user authentication with JWT tokens"

# With template
gh pr create --fill

# Draft PR
gh pr create --draft
```

**Via Web UI:**
1. Go to repository on GitHub
2. Click "Pull requests" tab
3. Click "New pull request"
4. Select your branch
5. Fill in title and description
6. Add reviewers
7. Add labels
8. Create pull request

**PR Title best practices:**
- Start with capital letter
- Be concise but descriptive
- Include issue number if applicable
- Follow commit message conventions

**PR Description should include:**
- **What:** What changes were made
- **Why:** Why these changes were needed
- **How:** How the changes were implemented
- **Testing:** How to test the changes
- **Screenshots:** If UI changes
- **Closes #123:** Link to related issues

**Example PR description:**
```markdown
## Description
Implements user authentication using JWT tokens.

## Changes
- Added authentication middleware
- Created user login/logout endpoints
- Implemented JWT token generation and validation
- Added password hashing with bcrypt

## Testing
1. Run `npm test` to execute unit tests
2. Start server and test login at POST /api/auth/login
3. Verify token is returned and can access protected routes

## Related Issues
Closes #123
```

### Step 6: Address Review Comments

**Update your branch:**
```bash
# Make changes based on feedback
git add .
git commit -m "refactor: improve error handling per review"
git push
```

**Amend last commit (if needed):**
```bash
# Make changes
git add .
git commit --amend --no-edit
git push --force-with-lease
```

**Rebase to clean up history (optional):**
```bash
# Interactive rebase last 3 commits
git rebase -i HEAD~3

# In editor, mark commits to squash/fixup/reword
# Save and close

# Force push
git push --force-with-lease
```

### Step 7: Keep Branch Updated

**Rebase on main:**
```bash
# Fetch latest
git fetch origin

# Rebase onto main
git rebase origin/main

# If conflicts, resolve them
git add resolved-files
git rebase --continue

# Force push
git push --force-with-lease
```

**Merge main into your branch (alternative):**
```bash
git checkout feature/my-feature
git merge main
git push
```

### Step 8: After PR is Merged

**Delete local branch:**
```bash
git checkout main
git branch -d feature/my-feature
```

**Delete remote branch (usually automatic):**
```bash
git push origin --delete feature/my-feature
```

**Update local main:**
```bash
git pull origin main
```

## Common Workflows

### Workflow 1: Simple Feature

```bash
# 1. Create branch
git checkout main
git pull
git checkout -b feature/new-feature

# 2. Make changes and commit
git add .
git commit -m "feat: add new feature"

# 3. Push and create PR
git push -u origin feature/new-feature
gh pr create --fill

# 4. After merge
git checkout main
git pull
git branch -d feature/new-feature
```

### Workflow 2: Bug Fix

```bash
# 1. Create branch from main
git checkout -b fix/issue-123-login-bug

# 2. Fix and commit
git add .
git commit -m "fix: resolve login redirect issue

Fixes #123"

# 3. Push and PR
git push -u origin fix/issue-123-login-bug
gh pr create --fill
```

### Workflow 3: Hotfix

```bash
# 1. Branch from production tag
git checkout -b hotfix/v1.2.1 v1.2.0

# 2. Fix critical issue
git add .
git commit -m "hotfix: patch security vulnerability"

# 3. Push and create urgent PR
git push -u origin hotfix/v1.2.1
gh pr create --title "URGENT: Security patch v1.2.1"
```

## Common Issues and Solutions

### Issue: Merge conflicts

**Solutions:**
```bash
# 1. Update your branch
git fetch origin
git rebase origin/main

# 2. Resolve conflicts in files
# Edit files to resolve conflicts
# Look for <<<<<<, =======, >>>>>> markers

# 3. Stage resolved files
git add resolved-file.py

# 4. Continue rebase
git rebase --continue

# 5. Force push
git push --force-with-lease
```

### Issue: Accidentally committed to wrong branch

**Solutions:**
```bash
# 1. Save changes to new branch
git branch feature/correct-branch

# 2. Reset current branch
git reset --hard origin/main

# 3. Switch to correct branch
git checkout feature/correct-branch
```

### Issue: Need to undo last commit

**Solutions:**
```bash
# Keep changes, undo commit
git reset --soft HEAD~1

# Discard changes and commit
git reset --hard HEAD~1

# Already pushed? Create revert commit
git revert HEAD
git push
```

### Issue: Forgot to pull before making changes

**Solutions:**
```bash
# Stash your changes
git stash

# Pull latest
git pull

# Apply your changes
git stash pop

# Resolve any conflicts
```

## Success Criteria

- ✅ Branch follows naming conventions
- ✅ Commits follow project conventions
- ✅ Commit messages are clear and descriptive
- ✅ PR has good title and description
- ✅ Branch is up to date with main
- ✅ All checks pass (tests, lint, etc.)

## Quick Reference

### Common Git Commands

```bash
# Status and info
git status
git log --oneline -10
git diff

# Branching
git checkout -b new-branch
git branch -d old-branch

# Committing
git add .
git commit -m "message"
git commit --amend

# Pushing
git push
git push --force-with-lease

# Updating
git pull
git fetch
git rebase origin/main

# Cleanup
git clean -fd
git reset --hard
```

## Related Skills

- **code-formatting** - Format before committing
- **run-tests** - Run tests before pushing
- **ci-pipeline** - Understand CI checks

## Documentation References

- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [Git Documentation](https://git-scm.com/doc)
- [GitHub CLI](https://cli.github.com/)
