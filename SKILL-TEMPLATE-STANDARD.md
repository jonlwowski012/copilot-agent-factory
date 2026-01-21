# Skill Template Standard

**Version:** 1.0  
**Format:** SKILL.md (GitHub Copilot Agent Skills)  
**Target Platforms:** GitHub Copilot, Claude Code, Cursor IDE

## Overview

This document defines the standard format for creating skill templates in the Copilot Agent Factory. Skills are reusable, auto-activating workflow procedures that complement agent templates.

## Directory Structure

```
.github/skills/skill-templates/
├── 1-testing-quality/
│   ├── pytest-setup/
│   │   ├── SKILL.md
│   │   ├── README.md
│   │   └── scripts/
│   │       └── detect-test-framework.sh
│   └── run-tests/
│       └── SKILL.md
├── 2-development-workflows/
│   └── local-dev-setup/
│       └── SKILL.md
└── 3-devops-deployment/
    └── ci-pipeline/
        └── SKILL.md
```

Each skill lives in its own subdirectory with:
- **SKILL.md** (required) - Main skill instructions
- **README.md** (optional) - Skill documentation
- **scripts/** (optional) - Helper scripts
- **templates/** (optional) - File templates

## SKILL.md Format

### 1. YAML Frontmatter (Required)

```yaml
---
name: skill-name
description: "Clear description of what the skill does and when it activates"
auto-activates:
  - "keyword phrase 1"
  - "keyword phrase 2"
  - "keyword phrase 3"
---
```

**Fields:**
- `name` - Lowercase, hyphen-separated (e.g., `pytest-setup`)
- `description` - One-sentence description (include "for this project")
- `auto-activates` - List of keyword phrases that trigger the skill

### 2. Markdown Body Structure

```markdown
# Skill: [Skill Name]

## When to Use This Skill

This skill activates when you need to:
- [Use case 1]
- [Use case 2]
- [Use case 3]

## Prerequisites

Check if [feature] is already configured:
- Look for {{placeholder_dir}} (e.g., `example/`)
- Check for [indicator] in dependencies
- Verify {{command_placeholder}} exists

## Step-by-Step Workflow

### Step 1: [Action Name]

**For [Tech Stack A]:**
- Check for [indicator]
- If not configured, try: `command here`

**For [Tech Stack B]:**
- Check for [indicator]
- If not configured, try: `command here`

### Step 2: [Action Name]

[Detailed instructions with code blocks]

```bash
example command
```

### Step 3: [Action Name]

[More instructions]

## Common Issues and Solutions

**Issue:** [Problem description]
**Solution:** [Step-by-step fix]

**Issue:** [Another problem]
**Solution:** [Another fix]

## Success Criteria

- ✅ [Expected outcome 1]
- ✅ [Expected outcome 2]
- ✅ [Expected outcome 3]
```

## Core Placeholders

Skills use a minimal set of 10 core placeholders with fallback logic:

| Placeholder | Description | Fallback |
|-------------|-------------|----------|
| `{{test_dirs}}` | Test directories | "If tests/ doesn't exist, create it" |
| `{{test_command}}` | Test execution command | Provide installation instructions |
| `{{lint_command}}` | Linting command | "If not configured, try: [examples]" |
| `{{build_command}}` | Build command | Detect and provide examples |
| `{{dev_command}}` | Development server | Provide common patterns |
| `{{source_dirs}}` | Source directories | "Typically src/, lib/, or app/" |
| `{{doc_dirs}}` | Documentation directories | "Typically docs/ or doc/" |
| `{{config_files}}` | Config file locations | List common patterns |
| `{{package_manager}}` | Package manager (npm, pip, etc.) | Detect or provide options |
| `{{tech_stack}}` | Technology stack | Detect from files |

## Fallback Logic Pattern

Always provide fallback instructions when a placeholder might not be configured:

```markdown
**If {{test_command}} is configured:**
- Run: `{{test_command}}`

**If not configured (common scenario):**

**For Python projects:**
- Install: `pip install pytest pytest-cov`
- Run: `pytest -v --cov=src`

**For JavaScript/TypeScript projects:**
- Install: `npm install --save-dev jest`
- Run: `npm test`

**For other projects:**
- Check project documentation for test setup
```

## Auto-Activation Keywords

Choose 3-5 keyword phrases that users might naturally type:

**Good examples:**
- "set up testing"
- "configure pytest"
- "install test framework"
- "how do I run tests"

**Avoid:**
- Too generic: "testing" (too broad)
- Too specific: "pytest version 7.4.3" (too narrow)
- Tool names only: "pytest" (needs context)

## Writing Style Guidelines

### Do's ✅
- **Be specific:** "Install pytest 7.x or later" not "Install testing tools"
- **Show commands:** Actual executable commands with flags
- **Provide examples:** Code snippets for each tech stack
- **Include fallbacks:** "If X not found, try Y"
- **Use checkboxes:** ✅ for success criteria
- **Be actionable:** Every step should be executable

### Don'ts ❌
- Generic advice: "Configure your test framework properly"
- Vague instructions: "Set up your environment"
- Missing fallbacks: Assuming everything is configured
- No examples: Just describing what to do
- Platform assumptions: Only covering one OS or tool

## Testing Your Skill

Before submitting a skill template:

1. **Syntax check:** Verify YAML frontmatter is valid
2. **Placeholder check:** All placeholders have fallback logic
3. **Keyword check:** Auto-activation keywords are specific
4. **Tech stack coverage:** Multiple tech stacks covered
5. **Execution test:** Follow instructions on a real project
6. **Edge cases:** Test with unconfigured/minimal projects

## Examples

### Good Skill Structure

```markdown
---
name: pytest-setup
description: "Setup pytest with coverage reporting and watch mode for this project"
auto-activates:
  - "set up pytest"
  - "configure testing"
  - "install pytest"
  - "setup test framework"
---

# Skill: Test Framework Setup (pytest)

## When to Use This Skill

This skill activates when you need to:
- Set up pytest from scratch
- Add coverage reporting to existing tests
- Configure watch mode for test-driven development

## Prerequisites

Check if testing is already configured:
- Look for {{test_dirs}} (e.g., `tests/` or `test/`)
- Check for `pytest` in requirements.txt or pyproject.toml
- Verify {{test_command}} exists in package config

## Step-by-Step Workflow

### Step 1: Install pytest

**If using pip:**
```bash
pip install pytest pytest-cov pytest-watch
```

**If using poetry:**
```bash
poetry add --group dev pytest pytest-cov pytest-watch
```

### Step 2: Create Test Directory

```bash
mkdir -p tests
touch tests/__init__.py
touch tests/conftest.py
```

### Step 3: Add pytest Configuration

Create `pytest.ini`:
```ini
[pytest]
testpaths = tests
python_files = test_*.py
python_classes = Test*
python_functions = test_*
addopts = -v --cov=src --cov-report=html --cov-report=term
```

### Step 4: Verify Installation

```bash
pytest --version
pytest -v
```

## Common Issues and Solutions

**Issue:** Tests not discovered
**Solution:** Ensure test files are named `test_*.py` and in `tests/` directory

**Issue:** Coverage report not showing
**Solution:** Verify `--cov=src` points to your source directory

## Success Criteria

- ✅ pytest runs with `pytest -v`
- ✅ Coverage report generated in htmlcov/
- ✅ Watch mode works with `pytest-watch`
```

### Bad Skill Structure (Anti-pattern)

```markdown
---
name: testing
description: "For testing"
auto-activates:
  - "test"
---

# Testing

Use pytest for testing.

Configure it properly and run tests.
```

**Problems:**
- Name too generic
- Description unclear
- Auto-activates too broad
- No step-by-step instructions
- No fallback logic
- No specific commands
- No examples

## Version History

- **v1.0** (2026-01-17) - Initial standard
