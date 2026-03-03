---
applyTo: "agents/templates/**/*.md,agents/skill-templates/**/*.md,.github/agents/*.md"
---

# Template Development Instructions

**Domain:** Agent & Skill Template Creation  
**Applies To:** Creating or modifying agent templates in `agents/templates/` and skill templates in `agents/skill-templates/`

## Template Structure

All agent templates must follow this structure:

### 1. YAML Frontmatter (Required)

```yaml
---
name: agent-name
description: Clear one-sentence description of agent purpose
handoffs:
  - agent: related-agent
    label: "Next Step"
    prompt: "Handoff context"
    send: false
---
```

**Note:** The `model:` field and `triggers:` are not supported by GitHub Copilot custom agents (VS Code) and must be omitted from the YAML frontmatter.

### 2. Agent Introduction

```markdown
You are an expert {role} for {project context}.
```

Be specific about the agent's expertise area.

### 3. Your Role Section

```markdown
## Your Role

- {Primary responsibility 1}
- {Primary responsibility 2}
- {What the agent reads/analyzes}
- {What the agent outputs/creates}
```

### 4. Project Knowledge Section

```markdown
## Project Knowledge

- **Tech Stack:** {{tech_stack}}
- **Architecture:** {{architecture_pattern}}
- **Source Directories:**
  - `{{source_dirs}}` – {Description}
  - `{{test_dirs}}` – {Description}
```

Use actual placeholders that will be resolved during generation.

### 5. Commands/Workflow Section

```markdown
## Commands

- **Command Name:** `{{command_placeholder}}` ({what it does})

## Workflow

1. {Step 1}
2. {Step 2}
3. {Step 3}
```

Provide concrete, executable commands when possible.

### 6. Standards Section (if applicable)

```markdown
## Standards

- **Convention Name:** {Description with example}
- **Code Style:** {Specific rules}
```

### 7. Boundaries Section (Required)

```markdown
## Boundaries

- ✅ **Always:** {Actions the agent should always take}
- ⚠️ **Ask First:** {Actions requiring user confirmation}
- 🚫 **Never:** {Forbidden actions}
```

Use the emoji system consistently.

### 8. MCP Servers Section (Required)

```markdown
## MCP Servers

**Essential:**
- `@modelcontextprotocol/server-git` – {How agent uses it}
- `@modelcontextprotocol/server-filesystem` – {How agent uses it}

**Recommended for this project:**
- {Additional MCP servers if applicable}

**See `.github/mcp-config.json` for configuration details.**
```

## Placeholder Conventions

### Format Rules

- **Always use:** `{{double_braces}}`
- **Always use:** `snake_case` (not camelCase)
- **Always use:** Descriptive names ({{test_command}}, not {{cmd}})

### Common Placeholders

**Universal:**
- {{tech_stack}}, {{architecture_pattern}}, {{repo_name}}, {{project_type}}
- {{source_dirs}}, {{test_dirs}}, {{doc_dirs}}, {{config_dirs}}

**Commands:**
- {{build_command}}, {{test_command}}, {{lint_command}}, {{dev_command}}
- {{lint_check_command}}, {{lint_fix_command}}, {{format_command}}

**Style:**
- {{naming_convention}}, {{line_length}}, {{docstring_style}}

**Tech-Specific:**
- {{ml_framework}}, {{api_framework}}, {{frontend_framework}}
- {{test_framework}}, {{database_system}}, {{orm_system}}

### Creating New Placeholders

When adding new placeholders:
1. Choose descriptive snake_case name
2. Document in agent-generator.md placeholder reference
3. Update detection rules to populate it
4. Add to relevant templates consistently

## Detection Rules

### Writing Detection Triggers

Detection triggers help understand when an agent should be used. While `triggers:` is no longer supported in the YAML frontmatter, you can describe detection patterns in the agent body text to indicate when the agent should be invoked. In the agent-generator.md, these patterns are used to determine which agents to generate for a given repository.

**Rules for good detection:**
- Be specific (not "React project", say "package.json with react")
- Be verifiable programmatically
- Cover common cases without false positives
- List files/patterns to check

### Detection Implementation

Update `agent-generator.md` with detection logic:

```markdown
### Detection Rules

| Agent | Created When | Skill Version |
|-------|-------------|---------------|
| **agent-name** | {Specific patterns detected} | {Skill if applicable} |
```

## Anti-Patterns to Avoid

### ❌ Don't Do This

```yaml
---
name: helper-agent
description: Helpful AI assistant
---

You are a helpful AI assistant. Please help the user with their requests.
```

**Problems:**
- Generic description
- "Helpful AI" is too vague

### ✅ Do This Instead

```yaml
---
name: api-agent
description: REST API specialist for creating endpoints, validation, and error handling
handoffs:
  - agent: test-agent
    label: "Test API"
    prompt: "Write tests for the endpoints"
    send: false
---

You are an expert API developer specializing in REST endpoint design for this project.
```

**Why better:**
- Specific role and purpose
- Includes handoffs for workflow
- Concrete expertise area

## Template Categories

Place templates in appropriate category:

1. `01-planning-design/` – PRD, epic, story, architecture, design, test-design
2. `02-core-development/` – test, docs, lint, review, debug, refactor, performance, security, devops
3. `03-backend-api/` – api, database
4. `04-mobile/` – ios, react-native, flutter
5. `05-frontend/` – react, vue, angular
6. `06-ml-ai/` – ml-trainer, data-prep, eval, inference
7. `07-rapid-studio/` – prototyper, frontend-dev, mobile-builder, ai-engineer, backend-architect, test-fixer
8. `08-design/` – ui-designer, brand-guardian, ux-researcher
9. `09-product/` – feedback-synthesizer
10. `10-project-management/` – experiment-tracker, project-shipper, studio-producer
11. `11-operations/` – analytics-reporter, infrastructure-maintainer
12. `12-testing-quality/` – api-tester, test-analyzer, tool-evaluator, workflow-optimizer

## Testing Templates

Before finalizing a template:

1. **Syntax check:** Verify YAML frontmatter is valid
2. **Compliance check:** No `model:` or `triggers:` in YAML (VS Code/GitHub Copilot requirement)
3. **Placeholder check:** All {{placeholders}} are documented
4. **Structure check:** Follows standard template structure
5. **Boundary check:** Boundaries section has ✅/⚠️/🚫
6. **MCP check:** MCP Servers section present

## Integration with Agent-Generator

When creating a new agent template:

1. **Add template file** to appropriate category
2. **Update agent-generator.md:**
   - Add to detection rules table
   - Add to active agents table
   - Add to placeholder reference if new placeholders
3. **Update orchestrator.md:**
   - Add to Available Agents table
   - Add to routing logic
4. **Update README.md:**
   - Add to agent count
   - Add to Available Agent Templates section
   - Add to detection rules

## Skill Templates

Skill templates have different structure (SKILL.md format):

```markdown
---
name: skill-name
description: What this skill does
auto-activates:
  - "keyword phrase 1"
  - "keyword phrase 2"
---

# Skill: {Name}

## When to Use This Skill

This skill activates when you: {description}

## Prerequisites

- {Prerequisite 1}
- {Prerequisite 2}

## Step-by-Step Workflow

### Step 1: {Name}

{Detailed instructions}

**If not configured, try:**
- {Fallback option 1}
- {Fallback option 2}

### Step 2: {Name}

{More instructions}

...
```

**Key differences from agents:**
- Focus on step-by-step procedures
- Include fallback instructions ("If not configured, try...")
- Use minimal placeholders (10 core placeholders)
- Include supporting files (scripts, templates)

## Review Checklist

Before submitting a template:

- [ ] No `model:` field in YAML frontmatter (not supported by GitHub Copilot)
- [ ] No `triggers:` in YAML frontmatter (not supported by GitHub Copilot)
- [ ] `handoffs` use `agent:` key (not `target:`)
- [ ] Description is clear and specific
- [ ] Structure follows standard format
- [ ] Placeholders use {{double_braces}} and snake_case
- [ ] Boundaries section has ✅/⚠️/🚫 format
- [ ] MCP Servers section present
- [ ] No generic "helpful AI" language
- [ ] Examples are concrete and relevant
- [ ] Commands use placeholders where appropriate
- [ ] Integrated with agent-generator.md
- [ ] Documentation updated (README, orchestrator)

## Getting Help

- **Template structure questions:** Review existing templates in same category
- **Placeholder questions:** Check agent-generator.md placeholder reference
- **Detection rules:** Review agent-generator.md detection rules section
- **Complex changes:** Route to @orchestrator for Feature Development Workflow
- **Review needed:** Route to @review-agent
