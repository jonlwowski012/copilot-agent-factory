# GitHub Copilot Instructions

**Repository:** Copilot Agent Factory  
**Generated:** 2026-01-09

## General Guidelines

- Follow project conventions defined in AGENT.md
- Use specialized agents via `@agent-name` for domain-specific tasks
- Leverage MCP servers (git, filesystem) for template operations
- **Critical:** Always include `model:` field in agent YAML frontmatter

## Code Generation Standards

### Always

- **Include `model:` field** in agent YAML frontmatter (`claude-4-5-sonnet` or `claude-4-5-opus`)
- Use `{{placeholder}}` convention (double braces, snake_case)
- Follow standard agent template structure (Role → Knowledge → Standards → Boundaries → MCP)
- Include concrete examples in templates
- Define specific detection triggers
- Add Boundaries section with ✅/⚠️/🚫 format
- Keep documentation under 1000 lines
- Test examples before adding to documentation
- Use tables for structured data

### Never

- Generate agent templates without `model:` field in YAML frontmatter
- Use incorrect placeholder format (single braces, camelCase)
- Create generic "helpful AI" instructions
- Add placeholder/TODO sections to documentation
- Include vague detection rules ("React project" vs "package.json with 'react'")
- Break backwards compatibility without discussion
- Skip approval gates in Feature Development Workflow
- Duplicate content across templates without refactoring

## Project-Specific Context

### File Structure

```
Copilot Agent Factory/
├── README.md (900 lines) – Main documentation
├── AGENT.md – Global agent instructions
├── .github/
│   ├── agents/ – Active agents for this repo
│   │   ├── agent-generator.md (meta-agent)
│   │   ├── orchestrator.md (coordinator)
│   │   └── {specialized agents}
│   ├── mcp-config.json – MCP server config
│   └── copilot-instructions.md (this file)
├── agents/
│   ├── agent-generator.md (in both locations)
│   ├── templates/ – 46 agent templates
│   └── skill-templates/ – 7 skill templates
└── docs/
    ├── MCP-SERVERS.md
    └── planning/ – Workflow artifacts
        ├── prd/
        ├── epics/
        ├── stories/
        ├── architecture/
        ├── design/
        └── test-design/
```

### Common Commands

- **No build command** (documentation only)
- **No test command** (manual validation)
- **No lint command** (Markdown formatting only)
- **Git operations:** Standard git commands

### Template Categories

1. **Planning & Design (6):** prd, epic, story, architecture, design, test-design
2. **Core Development (9):** test, docs, lint, review, debug, refactor, performance, security, devops
3. **Backend/API (2):** api, database
4. **Mobile (3):** iOS, React Native, Flutter
5. **Frontend (3):** React, Vue, Angular
6. **ML/AI (4):** ml-trainer, data-prep, eval, inference
7. **Rapid Studio (6):** prototyper, frontend-dev, mobile-builder, ai-engineer, backend-architect, test-fixer
8. **Design (3):** ui-designer, brand-guardian, ux-researcher
9. **Product (1):** feedback-synthesizer
10. **Project Management (3):** experiment-tracker, project-shipper, studio-producer
11. **Operations (2):** analytics-reporter, infrastructure-maintainer
12. **Testing & Quality (4):** api-tester, test-analyzer, tool-evaluator, workflow-optimizer

## Workflow Integration

### Feature Development Workflow (with Approval Gates)

```
Start: @orchestrator Start a new feature: [description]

Phase 1: Planning
├── @prd-agent → PRD document → /approve
├── @epic-agent → Epic breakdown → /approve
└── @story-agent → User stories → /approve

Phase 2: Architecture & Design
├── @architecture-agent → Architecture doc → /approve
└── @design-agent → Technical spec → /approve

Phase 3: Test Strategy
└── @test-design-agent → Test plan → /approve

Phase 4: Implementation
└── [Development] → /approve

Phase 5: Review & Documentation
├── @review-agent → Quality check
└── @docs-agent → Documentation updates
```

**User must explicitly approve** each phase with `/approve` or `/skip`.

### Quick Tasks (No Workflow)

```
@docs-agent Update README with [topic]
@review-agent Review [template/changes]
@refactor-agent Optimize [aspect]
```

## Agent-Specific Guidelines

### When Working with Templates

**Creating new agent templates:**
1. Must include `model:` field (use `claude-4-5-opus` for planning/architecture/security, `claude-4-5-sonnet` for others)
2. Use standard YAML frontmatter (name, model, description, triggers)
3. Include detection patterns in triggers
4. Follow structure: Role → Knowledge → Standards → Boundaries → MCP
5. Use documented placeholders only
6. Route to @review-agent before finalizing

**Modifying existing templates:**
1. Check consistency with other templates in category
2. Update all affected templates if changing conventions
3. Test placeholder resolution
4. Update documentation if user-facing changes

### When Working with Documentation

**README.md updates:**
1. Keep under 1000 lines (currently ~900)
2. Update affected sections (agents table, detection rules, examples)
3. Include concrete examples
4. Test all code blocks
5. Verify internal links work
6. Route to @docs-agent for major changes

**Adding examples:**
1. Must be accurate and testable
2. Show actual detection patterns
3. Include placeholder resolution
4. Use real-world scenarios

## Model Selection Guide

Use **claude-4-5-opus** (deep reasoning) for:
- orchestrator (workflow coordination)
- Planning agents (prd, epic, story, architecture, design, test-design)
- review-agent (quality analysis)
- refactor-agent (architectural decisions)

Use **claude-4-5-sonnet** (fast, capable) for:
- docs-agent (documentation)
- Most development agents

**Always specify in YAML frontmatter:**
```yaml
---
name: agent-name
model: claude-4-5-sonnet
description: Description
---
```

## Placeholder Reference

When customizing templates, use these placeholders:

**Universal:**
- {{tech_stack}}, {{source_dirs}}, {{test_dirs}}, {{doc_dirs}}

**Commands:**
- {{test_command}}, {{lint_command}}, {{build_command}}, {{dev_command}}

**Framework-specific:**
- {{ml_framework}}, {{api_framework}}, {{frontend_framework}}

**Always use {{double_braces}} format.**

## MCP Server Integration

Available MCP servers:
1. `@modelcontextprotocol/server-git` – Template history, version control
2. `@modelcontextprotocol/server-filesystem` – File operations, template comparison

Agents automatically use these when available. Configuration in `.github/mcp-config.json`.

## Quality Checklist

Before submitting changes:
- [ ] Agent templates have `model:` field
- [ ] Placeholders use {{double_braces}}
- [ ] Detection rules are specific
- [ ] Boundaries section present
- [ ] Examples tested
- [ ] Documentation updated
- [ ] Links verified
- [ ] No generic "be helpful" instructions

## Common Tasks

| Task | Agent | Example |
|------|-------|---------|
| Add new agent type | @orchestrator | "Start feature: Add {type} agent" |
| Update README | @docs-agent | "Update README with {topic}" |
| Review template | @review-agent | "Review {template}" |
| Refactor templates | @refactor-agent | "Optimize {aspect}" |
| Create PRD | @prd-agent | "Create PRD for {feature}" |
| Design architecture | @architecture-agent | "Design {system}" |

## Error Prevention

**Common mistakes to avoid:**
1. Missing `model:` field in agent YAML
2. Wrong placeholder format ({{camelCase}} or {single})
3. Vague detection rules
4. Generic agent instructions
5. Breaking template backwards compatibility
6. Skipping approval gates
7. Documentation out of sync with templates
8. Untested examples

## Getting Unstuck

If unsure about a task:
1. Check AGENT.md for conventions
2. Review similar existing templates
3. Route to @orchestrator for multi-step tasks
4. Use @review-agent to validate changes
5. Consult @docs-agent for documentation questions

## Remember

This is a **meta-repository** that generates agents for other projects. Always think about:
- Template users (developers)
- Detection accuracy (precision & recall)
- Template consistency
- Placeholder conventions
- Documentation clarity

The goal is making agent generation effortless for users.
