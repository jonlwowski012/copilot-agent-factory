---
applyTo: "README.md,docs/**/*.md,*.md"
---

# Documentation Instructions

**Domain:** Markdown Documentation (README, guides, examples)  
**Applies To:** README.md, docs/MCP-SERVERS.md, planning artifacts, examples

## Documentation Standards

### Keep It Concise

- **README.md:** Target 900 lines, max 1000 lines
- **Other docs:** As long as needed, but favor clarity over verbosity
- **Examples:** Short, focused, working code

### Examples First

Always show concrete examples before explaining theory:

**❌ Don't do this:**
```markdown
## Placeholder System

The placeholder system uses a template-based approach with variable substitution
enabling dynamic content generation through marker replacement...
```

**✅ Do this instead:**
```markdown
## Placeholder System

Templates use `{{placeholder}}` markers that get replaced:

```markdown
**Tech Stack:** {{tech_stack}}
```

Becomes:

```markdown
**Tech Stack:** Python 3.10, FastAPI, PyTorch
```
```

### Structure for Readability

Use tables, lists, and headings effectively:

**For comparisons:**
| Aspect | Agents | Skills |
|--------|--------|--------|
| Purpose | Role-based experts | Workflow procedures |
| Invocation | `@agent-name` | Auto-activates |

**For steps:**
1. First step
2. Second step
3. Third step

**For categories:**
- **Category 1:** Items with bold labels
- **Category 2:** Items with bold labels

## README.md Structure

Maintain this structure in README.md:

1. **Title & Tagline**
2. **What is this?** (quick overview with bullets)
3. **Quick Start** (3 steps)
4. **Agents vs Skills** (comparison table)
5. **MCP Server Auto-Detection**
6. **Global Instruction Files**
7. **Feature Development Workflow**
8. **Directory Structure**
9. **Available Agent Templates** (46 total)
10. **Available Skills** (7 total)
11. **MCP Server Integrations**
12. **Detection Rules**
13. **Template Placeholders**
14. **Customization**
15. **Best Practices**
16. **Agent Capabilities**
17. **Example Generated Output**
18. **Contributing**
19. **References**

### Updating Sections

**When adding a new agent:**
1. Update count in "Available Agent Templates (46 total)"
2. Add to appropriate category table
3. Add detection rules to "Detection Rules" section
4. Add example to "Example Generated Output"
5. Update "Agent Capabilities" if new capability

**When adding a new skill:**
1. Update count in "Available Skills (7 total)"
2. Add to appropriate category table
3. Add auto-activation patterns

**When adding MCP server detection:**
1. Add to "MCP Server Integrations" table
2. Update detection rules
3. Add example in "MCP Server Auto-Detection"

## Code Blocks

Always specify language:

```markdown
```bash
npm install
```

```python
def example():
    pass
```

```yaml
name: agent-name
```
```

## Tables

Use tables for structured data:

```markdown
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Data | Data | Data |
```

**Alignment:**
- Left-align text columns
- Right-align number columns
- Center-align status/icon columns

## Links

### Internal Links

Use workspace-relative paths:

```markdown
[MCP Servers Guide](docs/MCP-SERVERS.md)
[orchestrator.md](agents/templates/orchestrator.md)
```

### External Links

Use descriptive text:

```markdown
[GitHub Copilot Documentation](https://docs.github.com/en/copilot)
```

## Formatting Conventions

### Code and Technical Terms

- **Inline code:** Use `backticks` for file names, commands, code
  - Example: `package.json`, `npm test`, `{{placeholder}}`
- **Code blocks:** Use triple backticks with language
- **Placeholders:** Always show as `{{placeholder}}`

### Emphasis

- **Bold:** Important concepts, first mention of terms
  - Example: **Agent-generator** analyzes repositories
- **Italic:** Not commonly used (prefer bold or code)
- **Bold + Code:** For emphasis on technical terms
  - Example: **`model:` field** is required

### Lists

**Bullet lists** for unordered items:
- Item 1
- Item 2

**Numbered lists** for sequential steps:
1. First do this
2. Then do this

**Nested lists** for hierarchy:
- Category 1
  - Sub-item 1
  - Sub-item 2
- Category 2

### Headings

Use proper hierarchy:
- `#` for document title
- `##` for main sections
- `###` for subsections
- `####` for sub-subsections (avoid if possible)

## Examples

### Good Example Format

```markdown
### Example: Adding React Agent

**Repository detected:**
- `package.json` with `"react": "^18.0.0"`
- `.jsx` files in `src/`
- `tsconfig.json` present

**Generated agent:**
- `frontend-react-agent.md` created
- Placeholders resolved:
  - `{{react_version}}` → "18.0.0"
  - `{{ui_library}}` → "Material-UI"
  - `{{state_management}}` → "Redux Toolkit"

**Result:** Agent provides React-specific guidance with project conventions.
```

### Bad Example Format

```markdown
### Example

The system would detect React and create an agent. It would be a good agent
that helps with React. The agent would know about your project.
```

**Problems:**
- No concrete details
- Vague language ("would", "good")
- No actual values shown

## Planning Artifacts

Planning docs (PRD, epics, stories, etc.) follow their own templates. When documenting them:

### File Naming

```
docs/planning/{type}/{feature-name}-{YYYYMMDD}.md
```

Examples:
- `docs/planning/prd/docker-agent-20260109.md`
- `docs/planning/architecture/mcp-detection-20260109.md`

### Content Structure

Follow agent template structures:
- PRD: prd-agent template
- Epics: epic-agent template
- Stories: story-agent template
- Architecture: architecture-agent template
- Design: design-agent template
- Test Design: test-design-agent template

## Anti-Patterns

### ❌ Avoid These

**Vague examples:**
```markdown
The agent will help you with your code.
```

**Placeholder sections:**
```markdown
## Future Features

TBD - to be implemented later
```

**Broken links:**
```markdown
[See this doc](../docs/nonexistent.md)
```

**Inconsistent formatting:**
```markdown
**Bold text** some text `code` more text
**boldCode** {{placeholder}} normal
```

### ✅ Do This Instead

**Concrete examples:**
```markdown
The agent detects FastAPI in requirements.txt and generates
api-agent.md with endpoint templates and validation patterns.
```

**Complete sections or omit:**
```markdown
(Either write complete section or leave it out)
```

**Valid links:**
```markdown
[MCP Servers Guide](docs/MCP-SERVERS.md)
(Verify the file exists)
```

**Consistent formatting:**
```markdown
Use `backticks` for all code and file names consistently.
```

## Documentation Review Checklist

Before committing documentation changes:

- [ ] Examples are concrete and accurate
- [ ] Code blocks specify language
- [ ] Internal links work (files exist)
- [ ] Tables are properly formatted
- [ ] Headings follow proper hierarchy
- [ ] No placeholder/TBD sections
- [ ] README.md under 1000 lines
- [ ] Consistent formatting throughout
- [ ] Technical terms use `backticks`
- [ ] Lists are properly formatted

## README.md Maintenance

### Adding New Content

**Where to add:**
- New agent types → "Available Agent Templates" section
- New skills → "Available Skills" section
- Detection rules → "Detection Rules" section
- Usage patterns → Examples throughout
- MCP servers → "MCP Server Integrations" section

### Removing Outdated Content

When something changes:
1. Update all affected sections
2. Check for broken references
3. Update examples to match new behavior
4. Update counts in section headers

### Keeping Under 1000 Lines

Currently ~900 lines. To stay under limit:
- Favor tables over prose
- Use concrete examples (shorter than explanations)
- Link to separate docs for deep dives
- Avoid repetition across sections

## MCP-SERVERS.md Maintenance

Document MCP servers that agent-generator detects:

### Structure

```markdown
# MCP Server

**Purpose:** What it does

**Detection:** When agent-generator recommends it

**Setup:**
1. Step 1
2. Step 2

**Usage with Agents:**
- Agent 1 uses it for X
- Agent 2 uses it for Y

**Example:**
[Code example]
```

## Getting Help

- **Structure questions:** Review existing docs
- **Major rewrites:** Use @orchestrator Feature Development Workflow
- **Formatting issues:** Check this guide
- **Examples needed:** Ask @docs-agent
