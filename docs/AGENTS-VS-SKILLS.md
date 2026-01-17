# Agents vs Skills: Quick Reference Guide

## TL;DR

- **Agents** = Domain experts you invoke by name (`@test-agent`, `@api-agent`)
- **Skills** = Reusable workflows that auto-activate based on keywords ("setup testing", "run tests")
- **Together** = Agents (experts) leverage Skills (procedures) for powerful automation

## Comparison Table

| Aspect | Agents | Skills |
|--------|--------|--------|
| **Purpose** | Role-based domain expertise | Reusable procedural workflows |
| **Think of it as** | "Who" does the work | "How" to do specific tasks |
| **Invocation** | Explicit: `@agent-name` | Auto-activates on keywords |
| **File Structure** | Single `.md` file | Folder: `SKILL.md` + scripts/assets |
| **Location** | `.github/agents/` (Copilot)<br>`.claude/agents/` (Claude)<br>`.cursor/agents/` (Cursor) | `.github/skills/` or `.claude/skills/`<br>(Works for ALL platforms) |
| **Customization** | 60+ project-specific placeholders | 10 core placeholders with fallbacks |
| **Scope** | Broad domain knowledge | Narrow, specific procedure |
| **Platform Support** | Platform-specific formats | Single format, cross-platform |
| **Maintenance** | One per platform or convert | Write once, works everywhere |

## When to Use Each

### Use Agents When You Need:
✅ Domain expertise and judgment calls  
✅ Complex decision-making  
✅ Broad understanding of a domain  
✅ Context-aware recommendations  
✅ Code review and architectural guidance  

**Examples:**
- "Review my API security" → `@security-agent`
- "Generate a PRD for authentication" → `@prd-agent`
- "Debug this ML training issue" → `@ml-trainer`
- "Refactor this code for maintainability" → `@refactor-agent`

### Use Skills When You Need:
✅ Step-by-step procedures  
✅ Repetitive workflows  
✅ Setup/configuration tasks  
✅ Commands and automation  
✅ Portable recipes  

**Examples:**
- "Set up pytest with coverage" → `pytest-setup` skill auto-activates
- "How do I run tests?" → `run-tests` skill auto-activates
- "Configure pre-commit hooks" → `git-hooks` skill auto-activates
- "Deploy to staging" → `deploy` skill auto-activates

## Real-World Examples

### Example 1: Setting Up Testing

**Without Skills (Agents Only):**
```
User: "How do I set up pytest?"
→ User invokes @test-agent
→ test-agent: "Run {{test_command}} to execute tests"
→ User: "But {{test_command}} isn't configured yet..."
→ test-agent has broad testing expertise but not step-by-step setup
```

**With Skills:**
```
User: "Set up pytest with coverage"
→ pytest-setup skill auto-activates
→ Skill: "1. Install: pip install pytest pytest-cov
          2. Create tests/ directory
          3. Add pytest.ini configuration
          4. Create conftest.py with fixtures
          5. Run: pytest -v --cov=src"
→ User: ✅ Tests working in 2 minutes
```

### Example 2: API Development

**Agent (Expertise):**
```
User: @api-agent "Review my REST API design"
→ api-agent analyzes endpoints, suggests improvements
→ Provides architectural guidance
→ Recommends security best practices
```

**Skill (Procedure):**
```
User: "Create a new API endpoint"
→ api-endpoint-scaffold skill auto-activates
→ Skill: "1. Create file in routes/
          2. Define schema with validation
          3. Implement handler
          4. Add tests in tests/routes/
          5. Update OpenAPI spec"
```

### Example 3: They Work Together!

```
User: @api-agent "I need to add authentication to my API"

api-agent (expert judgment):
"Based on your project, I recommend JWT authentication with refresh tokens.
Let me invoke the auth-setup skill to help you implement this..."

→ auth-setup skill (procedure):
"Step 1: Install dependencies: pip install PyJWT python-jose
 Step 2: Create auth/ directory structure
 Step 3: Implement JWT utility functions
 Step 4: Add authentication middleware
 Step 5: Update your API routes with @require_auth decorator
 Step 6: Test with provided auth_test.py"
```

## How They Work Together

```
┌─────────────────────────────────────────────────┐
│                   USER REQUEST                   │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
      ┌──────────────────────┐
      │   Requires Expertise? │
      └──────────┬─────────────┘
                 │
        ┌────────┴────────┐
        │                 │
       YES               NO
        │                 │
        ▼                 ▼
   ┌─────────┐      ┌─────────┐
   │  AGENT  │      │  SKILL  │
   │(Expert) │      │(Recipe) │
   └────┬────┘      └─────────┘
        │
        │ Can invoke
        ▼
   ┌─────────┐
   │  SKILL  │
   │(Recipe) │
   └─────────┘
```

## Platform Support Matrix

| Feature | GitHub Copilot | Claude Code | Cursor IDE |
|---------|----------------|-------------|------------|
| **Agents** | ✅ `.github/agents/*.md` | ✅ `.claude/agents/*.md` | ✅ `.cursor/agents/*.mdc` |
| **Skills** | ✅ `.github/skills/` or `.claude/skills/` | ✅ `.claude/skills/` | ✅ `.claude/skills/` |
| **Auto-activation** | ✅ Yes | ✅ Yes | ✅ Yes |
| **Cross-platform** | ⚠️ Platform-specific format | ⚠️ Platform-specific format | ✅ Single format works everywhere |

**Key Takeaway:** Skills use `.claude/skills/` format that ALL three platforms recognize (as of Dec 2025).

## File Structure Comparison

### Agent File Structure
```
.github/agents/
├── test-agent.md          # Single file per agent
├── api-agent.md
└── security-agent.md

YAML Frontmatter (in agent.md):
---
name: test-agent
model: claude-4-5-sonnet
description: Testing expert
triggers: [test patterns detected]
---
```

### Skill File Structure
```
.claude/skills/
├── pytest-setup/           # Folder per skill
│   ├── SKILL.md           # Instructions
│   └── scripts/
│       └── setup.sh
├── api-scaffold/
│   ├── SKILL.md
│   └── templates/
│       ├── route.py
│       └── test.py
└── git-workflow/
    └── SKILL.md

YAML Frontmatter (in SKILL.md):
---
name: pytest-setup
description: "Setup pytest with coverage"
auto-activates:
  - "setup pytest"
  - "configure testing"
---
```

## Metadata Comparison

### Agent Metadata (60+ placeholders)
```yaml
# Highly project-specific
{{tech_stack}}           # "Python 3.10, FastAPI, PyTorch"
{{source_dirs}}          # "src/, lib/"
{{test_command}}         # "pytest -v --cov=src"
{{lint_command}}         # "ruff check --fix ."
{{ml_framework}}         # "PyTorch"
{{pytorch_version}}      # "2.0.0"
{{database_system}}      # "PostgreSQL"
{{orm_system}}           # "SQLAlchemy"
... (50+ more)
```

### Skill Metadata (10 core placeholders + fallbacks)
```yaml
# Generic with fallback logic
{{test_dirs}}            # "tests/" or guide to create
{{test_command}}         # "pytest -v" or suggest setup
{{lint_command}}         # "ruff check ." or "If not configured..."
{{build_command}}        # "npm build" or provide alternatives
{{dev_command}}          # "npm run dev" or manual steps
... (5 more core placeholders)
```

## Use Case Matrix

| Scenario | Solution | Why |
|----------|----------|-----|
| "Review my code architecture" | `@architecture-agent` | Needs expert judgment |
| "Set up linting" | `lint-setup` skill | Step-by-step procedure |
| "Debug why tests are failing" | `@debug-agent` | Needs investigation expertise |
| "Run all tests with coverage" | `run-tests` skill | Simple command procedure |
| "Design authentication system" | `@security-agent` + `auth-setup` skill | Expert designs, skill implements |
| "Optimize API performance" | `@performance-agent` | Requires profiling expertise |
| "Add API endpoint" | `api-scaffold` skill | Repetitive boilerplate task |
| "Generate PRD for new feature" | `@prd-agent` | Document creation expertise |

## Auto-Activation Examples

Skills auto-activate based on keywords in your prompts:

```
User: "set up testing"           → pytest-setup skill
User: "how do I run tests"       → run-tests skill
User: "configure linting"        → lint-setup skill
User: "deploy to production"     → deploy skill
User: "git workflow"             → git-workflow skill
User: "setup CI pipeline"        → ci-pipeline skill
```

Agents require explicit invocation:

```
User: @test-agent "review test coverage"
User: @api-agent "design REST API"
User: @security-agent "audit authentication"
```

## Migration Path

### Current State (Copilot Agent Factory)
- ✅ 46 agent templates
- ❌ 0 skill templates

### Proposed State
- ✅ 46 agent templates
- ✅ 7 skill templates (initial set)

### No Breaking Changes
- Existing agents continue working
- Skills are additive enhancement
- Users can adopt incrementally

## Summary

| | Agents | Skills |
|---|--------|--------|
| **Analogy** | Senior engineer on your team | Runbook or playbook |
| **Focus** | Expertise and judgment | Procedures and automation |
| **Invocation** | Explicit (`@name`) | Auto-activation |
| **Maintenance** | Platform-specific | Cross-platform |
| **Best For** | Complex reasoning | Repetitive tasks |
| **Example** | `@api-agent` reviews design | `api-scaffold` generates boilerplate |

**Bottom Line:** Use agents for expertise, skills for procedures. They complement each other perfectly.
