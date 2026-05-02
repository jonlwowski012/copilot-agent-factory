# Copilot Agent Factory - Agent Instructions

**Project:** Copilot Agent Factory  
**Type:** Documentation/Template Repository  
**Tech Stack:** Markdown, Bash, minimal Python/JS examples

You are an AI coding assistant for the **Copilot Agent Factory** - a meta-repository that generates customized GitHub Copilot agents and skills for other projects.

## Project Overview

This repository contains:
- **46 agent templates** across 12 categories (planning, core dev, backend, mobile, frontend, ML, etc.)
- **7 skill templates** across 3 categories (testing, development, devops)
- **Agent-generator meta-agent** that analyzes repos and creates customized agents
- **Orchestrator** for workflow coordination with approval gates

**Purpose:** Enable developers to auto-generate AI agents tailored to their specific project's tech stack, structure, and patterns.

## Key Technologies

- **Markdown:** All agent/skill templates and documentation
- **Bash:** Framework detection scripts (detect-test-framework.sh)
- **Python/JS:** Minimal code examples in skill templates
- **Git:** Version control for template evolution

## Architecture Patterns

### Template System Architecture

```
.github/agents/
├── agent-generator.md (meta-agent)
├── orchestrator.md (coordinator)
└── templates/
    ├── 01-planning-design/ (6 agents)
    ├── 02-core-development/ (9 agents)
    ├── 03-backend-api/ (2 agents)
    ├── 04-mobile/ (3 agents)
    ├── 05-frontend/ (3 agents)
    ├── 06-ml-ai/ (4 agents)
    ├── 07-rapid-studio/ (6 agents)
    ├── 08-design/ (3 agents)
    ├── 09-product/ (1 agent)
    ├── 10-project-management/ (3 agents)
    ├── 11-operations/ (2 agents)
    └── 12-testing-quality/ (4 agents)

skill-templates/
├── 1-testing-quality/ (3 skills)
├── 2-development-workflows/ (3 skills)
└── 3-devops-deployment/ (1 skill)
```

### Placeholder System
- **Agent templates:** 60+ placeholders ({{tech_stack}}, {{test_command}}, etc.)
- **Skill templates:** 10 core placeholders with fallback logic
- **Detection:** Pattern-based detection in agent-generator.md

### Workflow System
- **Feature Development Workflow:** PRD → Epic → Story → Architecture → Design → Test Design → Implementation → Review
- **Approval Gates:** User must `/approve` or `/skip` at each phase
- **Artifacts:** Stored in `docs/planning/{type}/{feature}-{date}.md`

## Development Standards

### DRY and SOLID During New Feature Development

When developing new features (design or implementation), follow **DRY** and **SOLID**:

- **DRY (Don't Repeat Yourself):** One place for each piece of logic or data; extract shared behavior instead of copying; parameterize differences.
- **SOLID:** Single Responsibility (one reason to change), Open/Closed (extend via new code), Liskov Substitution (subtypes substitutable), Interface Segregation (small, specific interfaces), Dependency Inversion (depend on abstractions).

Apply these in technical designs and in implementation so new code stays maintainable and consistent with refactoring standards.

### Template Conventions

**YAML Frontmatter (Required for VS Code / GitHub Copilot):**
```yaml
---
name: agent-name
description: One-sentence description
handoffs:
  - agent: other-agent
    label: "Button Label"
    prompt: "Handoff context"
    send: false
---
```

**Note:** The `model:` field and `triggers:` are not supported by GitHub Copilot custom agents and must be omitted. For Claude Code format, `model:` is supported.

**Template Structure:**
1. YAML frontmatter (`name`, `description`, `handoffs`)
2. Your Role section
3. Project Knowledge section
4. Workflow/Commands/Standards section
5. Boundaries section (✅/⚠️/🚫)
6. MCP Servers section

### Placeholder Conventions

- **Format:** `{{placeholder_name}}` (double braces, lowercase, underscores)
- **Naming:** Descriptive ({{test_command}}, not {{cmd}})
- **Categories:** Universal, commands, style, ML, DevOps, API, security, etc.
- **Fallbacks:** Skills provide fallback instructions

### Documentation Standards

- **README.md:** Keep under 1000 lines (~900 currently)
- **Examples:** Always include concrete, working examples
- **Tables:** Use for structured data (agents, skills, placeholders)
- **Code blocks:** Always specify language
- **Links:** Use workspace-relative paths

### Code Style

- **Naming:** kebab-case for files, snake_case for placeholders
- **Line Length:** No strict limit (readability first)
- **Markdown:** Consistent heading hierarchy, proper formatting

## Quality Gates

### Template Quality
- All templates must have `model:` field in YAML frontmatter
- Placeholders must follow {{placeholder}} convention
- Detection rules must be specific and testable
- Boundaries section must be present
- No generic "be helpful" instructions

### Documentation Quality
- Examples must be accurate and tested
- No placeholder/TODO sections
- Internal links must work
- Documentation in sync with templates

### Generation Quality
- All placeholders must resolve (no {{}} in output)
- Generated agents work without modification
- Detection accuracy: 95%+ precision, 90%+ recall

## Available Specialized Agents

For specific tasks, invoke these specialized agents:

| Agent | Invoke With | Best For |
|-------|-------------|----------|
| **@orchestrator** | `@orchestrator` | Task routing, workflow coordination, approval gates |
| **@prd-agent** | `@prd-agent` | Product Requirements Documents for new features |
| **@epic-agent** | `@epic-agent` | Breaking PRDs into deliverable epics |
| **@story-agent** | `@story-agent` | User stories with Gherkin acceptance criteria |
| **@application-architecture-agent** | `@application-architecture-agent` | Application architecture, component design, APIs, state diagrams |
| **@business-architecture-agent** | `@business-architecture-agent` | Business architecture, domain models, business processes |
| **@data-architecture-agent** | `@data-architecture-agent` | Data architecture, data models, data flows, storage patterns |
| **@infrastructure-architecture-agent** | `@infrastructure-architecture-agent` | Infrastructure architecture, deployment, scaling, observability |
| **@design-agent** | `@design-agent` | Technical specifications, detection algorithms |
| **@test-design-agent** | `@test-design-agent` | Test strategy, validation criteria (TDD) |
| **@docs-agent** | `@docs-agent` | README updates, documentation, examples |
| **@review-agent** | `@review-agent` | Template review, consistency checks, quality assurance |
| **@refactor-agent** | `@refactor-agent` | Template restructuring, placeholder optimization |
| **@agent-generator** | `@agent-generator` | Analyze repos and generate customized agents |

## MCP Servers

The following MCP servers enhance agent capabilities:

**Essential:**
- `@modelcontextprotocol/server-git` – Repository operations, template history, version control
- `@modelcontextprotocol/server-filesystem` – File operations, template comparison, directory browsing

**See `.github/mcp-config.json` for setup instructions.**

## Workflow Integration

This project uses a structured Feature Development Workflow:

1. **Planning:** PRD → Epics → Stories
2. **Technical Design:** Architecture → Design → Test Strategy
3. **Implementation:** Development (with approval gate)
4. **Quality:** Review → Documentation

**To start a workflow:**
```
@orchestrator Start a new feature: [feature description]
```

**Approval commands:**
- `/approve` – Proceed to next phase
- `/skip` – Skip current phase
- `/status` – Show workflow state
- `/restart` – Restart from beginning

## Common Workflows

### Adding a New Agent Type

```
1. @orchestrator Start feature: "Add {agent-type} agent"
2. Review PRD → /approve
3. Review Epics → /approve
4. Review Stories → /approve
5. Review Architecture → /approve
6. Review Design → /approve
7. Review Test Design → /approve
8. Implement template
9. @review-agent Review new template
10. @docs-agent Update README
```

### Improving Documentation

```
@docs-agent Update README with [topic]
```

### Refactoring Templates

```
@refactor-agent Refactor [aspect] for consistency
```

### Reviewing Changes

```
@review-agent Review changes in [file/directory]
```

## Best Practices

### When Creating Templates
- ✅ Use `claude-4-5-opus` for complex reasoning agents
- ✅ Use `claude-4-5-sonnet` for most development agents
- ✅ Include specific detection triggers
- ✅ Provide concrete examples
- ✅ Define clear boundaries
- ✅ Test placeholder resolution

### When Writing Documentation
- ✅ Start with concrete examples
- ✅ Keep README under 1000 lines
- ✅ Test all examples
- ✅ Use tables for structured data
- ⚠️ Ask before major reorganization

### When Reviewing Templates
- ✅ Check for `model:` field in YAML
- ✅ Verify placeholder conventions
- ✅ Ensure detection rules are specific
- ✅ Confirm boundaries section exists
- 🚫 Never approve templates with generic instructions

## Skills Guidelines

### Skills vs Agents

**Agents** (role-based experts):
- Invoked explicitly: `@agent-name`
- Provide domain expertise and judgment
- Platform-specific formats
- 60+ project-specific placeholders

**Skills** (procedural workflows):
- Auto-activate on keywords
- Provide step-by-step instructions
- Single cross-platform format (`.claude/skills/`)
- 10 core placeholders with fallback logic

### Creating Skills

**When to create a skill:**
- Task is repetitive and procedural
- Can be broken into clear steps
- Needs fallback instructions for unconfigured environments
- Benefits from auto-activation

**Skill template structure:**
1. YAML frontmatter (name, description, auto-activates)
2. "When to Use This Skill" section
3. Prerequisites check
4. Step-by-Step Workflow
5. Common Issues and Solutions
6. Success Criteria

**See `SKILL-TEMPLATE-STANDARD.md` for complete guidelines.**

### Skill Placeholders

Use only 10 core placeholders in skills:
- {{test_dirs}}, {{test_command}}, {{lint_command}}
- {{build_command}}, {{dev_command}}
- {{source_dirs}}, {{doc_dirs}}, {{config_files}}
- {{package_manager}}, {{tech_stack}}

**Always provide fallback logic:**
```markdown
**If {{test_command}} is configured:**
- Run: `{{test_command}}`

**If not configured:**
- For Python: `pytest -v`
- For JavaScript: `npm test`
- For Go: `go test ./...`
```

## Repository Conventions

- **File Naming:** kebab-case (prd-agent.md, not PRDAgent.md)
- **Directory Structure:** Numeric prefixes for categories (01-, 02-, etc.)
- **Placeholder Format:** {{snake_case}}
- **Date Format:** YYYYMMDD in filenames
- **Commit Messages:** Descriptive, mention affected templates

## Getting Help

For complex multi-step tasks, use:
```
@orchestrator [describe goal]
```

For specific domains:
- Documentation questions → `@docs-agent`
- Template quality → `@review-agent`
- Refactoring → `@refactor-agent`
- Feature planning → `@prd-agent`
- Technical design → `@application-architecture-agent`, `@business-architecture-agent`, `@data-architecture-agent`, `@infrastructure-architecture-agent`
