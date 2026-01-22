# GitHub Copilot Instructions Setup

This document explains how GitHub Copilot instructions are configured in this repository, following [GitHub's best practices for Copilot coding agent](https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions).

## Overview

This repository uses GitHub Copilot's custom instructions feature to provide context-aware guidance to the AI coding assistant. The instructions are organized in three layers:

1. **Repository-wide instructions** - Apply to all Copilot interactions
2. **Path-specific instructions** - Apply to specific file types or directories
3. **Agent definitions** - Specialized AI agents for specific tasks

## File Structure

```
.github/
├── copilot-instructions.md              # Repository-wide instructions
├── instructions/
│   ├── templates.instructions.md        # Instructions for agent/skill templates
│   └── documentation.instructions.md    # Instructions for documentation files
└── agents/
    ├── agent-generator.md               # Meta-agent for generating agents
    ├── orchestrator.md                  # Workflow coordinator
    ├── prd-agent.md                     # Product requirements
    ├── epic-agent.md                    # Epic breakdown
    ├── story-agent.md                   # User stories
    ├── application-architecture-agent.md    # Application architecture
    ├── business-architecture-agent.md       # Business architecture
    ├── data-architecture-agent.md           # Data architecture
    ├── infrastructure-architecture-agent.md # Infrastructure architecture
    ├── design-agent.md                  # Technical design
    ├── test-design-agent.md             # Test strategy (TDD)
    ├── docs-agent.md                    # Documentation
    ├── review-agent.md                  # Code review
    ├── refactor-agent.md                # Code refactoring
    └── debug-agent.md                   # Debugging assistance
```

## 1. Repository-Wide Instructions

**File:** `.github/copilot-instructions.md`

This file provides general guidance that applies to all Copilot interactions in this repository. It includes:

- General guidelines and project conventions
- Code generation standards (always/never rules)
- Project-specific context (file structure, commands, template categories)
- Workflow integration patterns
- Model selection guide (Claude 4.5 Opus vs Sonnet)
- Quality checklists and error prevention tips

### Key Features

- **Project Context:** Explains this is a meta-repository for generating Copilot agents
- **Template Conventions:** Placeholder format, YAML frontmatter requirements
- **Workflow Patterns:** Feature Development Workflow with approval gates
- **Best Practices:** Common tasks, anti-patterns, troubleshooting

## 2. Path-Specific Instructions

Path-specific instructions provide targeted guidance for working with specific types of files.

### Templates Instructions

**File:** `.github/instructions/templates.instructions.md`

**Applies to:**
```yaml
---
applyTo: "agents/templates/**/*.md,agents/skill-templates/**/*.md,.github/agents/*.md"
---
```

Provides detailed guidance for:
- Creating and modifying agent templates
- Template structure (YAML frontmatter, sections, MCP servers)
- Placeholder conventions and detection rules
- Testing and integration requirements
- Review checklists

### Documentation Instructions

**File:** `.github/instructions/documentation.instructions.md`

**Applies to:**
```yaml
---
applyTo: "README.md,docs/**/*.md,*.md"
---
```

Provides guidance for:
- Documentation standards (conciseness, examples-first approach)
- README.md structure and maintenance
- Code blocks, tables, and formatting conventions
- Planning artifacts structure
- Anti-patterns to avoid

## 3. Agent Definitions

**Location:** `.github/agents/*.md`

These are specialized AI agents that can be invoked with `@agent-name` syntax. Each agent has:

- **Expertise:** Specific domain knowledge (PRD, architecture, testing, etc.)
- **Role:** Clear responsibilities and boundaries
- **Workflow:** Step-by-step procedures
- **Model:** Appropriate Claude model for the task

### Available Agents

| Agent | Purpose | Model |
|-------|---------|-------|
| `@orchestrator` | Coordinate feature development workflow | claude-4-5-opus |
| `@agent-generator` | Generate customized agents for repositories | claude-4-5-opus |
| `@prd-agent` | Create product requirements documents | claude-4-5-opus |
| `@epic-agent` | Break down features into epics | claude-4-5-opus |
| `@story-agent` | Write user stories with Gherkin scenarios | claude-4-5-opus |
| `@application-architecture-agent` | Design application architecture and component design | claude-4-5-opus |
| `@business-architecture-agent` | Design business architecture and domain models | claude-4-5-opus |
| `@data-architecture-agent` | Design data architecture and data flows | claude-4-5-opus |
| `@infrastructure-architecture-agent` | Design infrastructure and deployment architecture | claude-4-5-opus |
| `@design-agent` | Create technical design specifications | claude-4-5-opus |
| `@test-design-agent` | Develop test strategies (TDD approach) | claude-4-5-opus |
| `@docs-agent` | Write and maintain documentation | claude-4-5-sonnet |
| `@review-agent` | Review code and templates | claude-4-5-opus |
| `@refactor-agent` | Refactor and optimize code | claude-4-5-opus |
| `@debug-agent` | Debug issues and errors | claude-4-5-opus |

## How It Works

### For VS Code Users (GitHub Copilot)

1. **Automatic Loading:** When you open this repository in VS Code with GitHub Copilot enabled, all instruction files are automatically loaded
2. **Context-Aware:** Copilot uses the appropriate instructions based on which file you're editing
3. **Agent Invocation:** Use `@agent-name` to invoke specialized agents for specific tasks

### For Claude Code Users

This repository also supports Claude Code format. The agent-generator can output agents in both formats.

## Customizing Instructions

### Modifying Repository-Wide Instructions

Edit `.github/copilot-instructions.md` to update general guidance. This file should:
- Be comprehensive but concise
- Include concrete examples
- Avoid generic "be helpful" language
- Document project-specific conventions

### Adding New Path-Specific Instructions

1. Create a new file in `.github/instructions/` with `.instructions.md` extension
2. Add YAML frontmatter with `applyTo` glob patterns:
   ```yaml
   ---
   applyTo: "**/*.py,**/*.pyx"
   ---
   ```
3. Write natural language instructions in Markdown format
4. Optionally use `excludeAgent` to limit to specific Copilot features:
   ```yaml
   ---
   applyTo: "**/*.py"
   excludeAgent: "code-review"  # Only for coding agent, not code review
   ---
   ```

### Creating New Agents

1. Create a new file in `.github/agents/` with `.md` extension
2. Follow the agent template structure defined in `templates.instructions.md`
3. Include YAML frontmatter with name, model, description, and triggers
4. Define role, workflow, boundaries, and MCP server integration

## Best Practices

### Do's ✅

- **Be specific:** Use concrete examples and patterns
- **Show, don't tell:** Prefer code examples over descriptions
- **Keep it focused:** Each instruction file should have a clear purpose
- **Test your instructions:** Verify they provide useful guidance
- **Update regularly:** Keep instructions in sync with repository changes

### Don'ts ❌

- **Don't be vague:** Avoid generic advice like "write good code"
- **Don't duplicate:** Keep instructions DRY (Don't Repeat Yourself)
- **Don't overload:** Too many instructions can confuse Copilot
- **Don't skip frontmatter:** Path-specific instructions need `applyTo`
- **Don't ignore boundaries:** Clearly define what agents should/shouldn't do

## Verification

To verify your Copilot instructions setup:

1. **Check file locations:**
   ```bash
   ls -la .github/copilot-instructions.md
   ls -la .github/instructions/*.instructions.md
   ls -la .github/agents/*.md
   ```

2. **Validate frontmatter:** Path-specific instructions must have `applyTo` field
   ```bash
   head -5 .github/instructions/*.instructions.md
   ```

3. **Test in VS Code:** Open a file and verify Copilot uses appropriate context

## References

- [GitHub Copilot Documentation](https://docs.github.com/en/copilot)
- [Adding repository custom instructions](https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions)
- [Best practices for Copilot coding agent](https://docs.github.com/en/copilot/tutorials/coding-agent/get-the-best-results)
- [How to write a great agents.md](https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/)
- [Onboarding your AI peer programmer](https://github.blog/ai-and-ml/github-copilot/onboarding-your-ai-peer-programmer-setting-up-github-copilot-coding-agent-for-success/)

## Contributing

When modifying Copilot instructions:

1. Follow the documentation conventions in `documentation.instructions.md`
2. Test your changes with Copilot before committing
3. Update this setup guide if adding new instruction types
4. Keep instructions aligned with actual repository structure
