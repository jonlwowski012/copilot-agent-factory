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

.github/skills/skill-templates/
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

### Template Conventions

**YAML Frontmatter (Required):**
```yaml
---
name: agent-name
model: claude-4-5-sonnet | claude-4-5-opus
description: One-sentence description
triggers:
  - Detection pattern 1
  - Detection pattern 2
---
```

**Model Selection:**
- `claude-4-5-opus`: orchestrator, planning agents, architecture, security, debug (complex reasoning)
- `claude-4-5-sonnet`: most development agents (faster, cost-effective)

**Template Structure:**
1. YAML frontmatter (with `model:` field)
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
| **@architecture-agent** | `@architecture-agent` | Template architecture, placeholder design, ADRs |
| **@design-agent** | `@design-agent` | Technical specifications, detection algorithms |
| **@test-design-agent** | `@test-design-agent` | Test strategy, validation criteria (TDD) |
| **@docs-agent** | `@docs-agent` | README updates, documentation, examples |
| **@review-agent** | `@review-agent` | Template review, consistency checks, quality assurance |
| **@refactor-agent** | `@refactor-agent` | Template restructuring, placeholder optimization |
| **@agent-generator** | `@agent-generator` | Analyze repos and generate customized agents |

## MCP Servers

The following MCP servers enhance agent capabilities. All generated agents now include MCP server recommendations based on project detection.

### Essential (Always Included)

These servers are included in every generated agent:

- `@modelcontextprotocol/server-git` – Repository operations, template history, version control, commit analysis
- `@modelcontextprotocol/server-filesystem` – File operations, template comparison, directory browsing, content search

### Conditionally Recommended

Based on project detection, agents may recommend these additional servers:

**Development & Code Quality:**
- `@modelcontextprotocol/server-github` – Issues, PRs, CI/CD integration, discussions
- `@modelcontextprotocol/server-gitlab` – GitLab issues, MRs, CI/CD integration
- `@modelcontextprotocol/server-sequential-thinking` – Enhanced reasoning for complex problems (planning agents)

**Database & Data:**
- `@modelcontextprotocol/server-postgres` – PostgreSQL operations, schema inspection
- `@modelcontextprotocol/server-mongodb` – MongoDB queries, aggregations
- `@modelcontextprotocol/server-mysql` – MySQL database operations
- `@modelcontextprotocol/server-sqlite` – Local database operations
- `@modelcontextprotocol/server-supabase` – Real-time Postgres, auth, storage

**Web & Testing:**
- `@playwright/mcp` – Browser automation, E2E testing, web scraping
- `@modelcontextprotocol/server-fetch` – HTTP requests, API calls, web content
- `@modelcontextprotocol/server-puppeteer` – Headless Chrome automation

**Cloud & Infrastructure:**
- `@modelcontextprotocol/server-docker` – Container management, image operations
- `@modelcontextprotocol/server-kubernetes` – K8s cluster management, deployments
- `@modelcontextprotocol/server-aws-kb` – AWS service docs, billing, resources

**ML & Data Science:**
- `@modelcontextprotocol/server-memory` – Persistent context across training sessions

### Auto-Detection

The agent-generator automatically detects project characteristics and includes appropriate MCP server recommendations in the generated agents. See [agent-generator.md Step 5.5](agent-generator.md#step-55-detect-and-recommend-mcp-servers) for detection logic.

**See `.github/mcp-config.json` for configuration details and setup instructions.**

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
- Technical design → `@architecture-agent`
