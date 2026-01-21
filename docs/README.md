# Documentation: Skills Support

This directory contains reference documentation for the GitHub Copilot Agent Skills implementation in Copilot Agent Factory.

## Quick Navigation

| Document | Purpose |
|----------|---------|
| **[AGENTS-VS-SKILLS.md](AGENTS-VS-SKILLS.md)** | Comparison guide - when to use agents vs skills |
| **[VISUAL-GUIDE.md](VISUAL-GUIDE.md)** | Diagrams and flowcharts for understanding skills |

## Status

**✅ Skills Support Implemented**

Skills have been successfully added to Copilot Agent Factory with 7 skill templates and full cross-platform support.

## Quick Summary

### What Are Skills?

- **Skills** = Reusable, auto-activating workflow procedures
- **Agents** = Role-based domain experts you invoke explicitly
- **Together** = Agents (expertise) + Skills (procedures) = Powerful automation

### Cross-Platform Compatibility

| Platform | Support |
|----------|---------|
| GitHub Copilot | ✅ Native (Dec 2025) |
| Claude Code | ✅ Native |
| Cursor IDE | ✅ Compatible |

**Key:** Single `.claude/skills/` format works on ALL platforms.

### Why Skills Are Valuable

1. **True cross-platform portability** - Write once, use everywhere
2. **Complements existing agents** - Expertise + Procedures
3. **Fills a gap** - Factory has 46 agents but no workflow procedures
4. **Industry standard** - Official GitHub support
5. **Auto-activation** - Seamless user experience
6. **Lower maintenance** - Single format vs platform-specific

## Implemented Skill Templates

### 7 Skill Templates (Complete)

**Testing & Quality (3):**
- `pytest-setup` - Setup pytest with coverage
- `run-tests` - Commands to run tests
- `debug-test-failures` - Investigate test failures

**Development Workflows (3):**
- `local-dev-setup` - Setup dev environment
- `code-formatting` - Format code to standards
- `git-workflow` - Branch/commit/PR process

**DevOps (1):**
- `ci-pipeline` - Understanding CI/CD pipelines

## Documentation Guide

**To understand agents vs skills:**
→ Read [AGENTS-VS-SKILLS.md](AGENTS-VS-SKILLS.md)

**To see visual diagrams:**
→ Read [VISUAL-GUIDE.md](VISUAL-GUIDE.md)

## Key Findings

### 1. Cross-Platform Table

| Feature | GitHub Copilot | Claude Code | Cursor IDE |
|---------|----------------|-------------|------------|
| Agents | ✅ `.github/agents/*.md` | ✅ `.claude/agents/*.md` | ✅ `.cursor/agents/*.mdc` |
| Skills | ✅ `.claude/skills/` | ✅ `.claude/skills/` | ✅ `.claude/skills/` |

**Result:** Skills have BETTER cross-platform support than agents.

### 2. Agents vs Skills

| Aspect | Agents | Skills |
|--------|--------|--------|
| Purpose | Expert knowledge | Step-by-step procedures |
| Invocation | `@agent-name` | Auto-activates on keywords |
| Format | Platform-specific | Single format |
| Placeholders | 60+ project-specific | 10 core with fallbacks |
| Maintenance | Higher | Lower |

### 3. Real-World Example

**Current State (Agents Only):**
```
User: "How do I set up pytest?"
→ test-agent: "Run {{test_command}}"
→ User: "But that's not configured yet..."
```

**With Skills:**
```
User: "Set up pytest"
→ pytest-setup skill auto-activates
→ Step-by-step: install → configure → test
→ ✅ Working in minutes
```

## References

- [GitHub Copilot Skills Announcement](https://github.blog/changelog/2025-12-18-github-copilot-now-supports-agent-skills/) (Dec 2025)
- [GitHub Docs: Agent Skills](https://docs.github.com/en/copilot/concepts/agents/about-agent-skills)
- [VS Code: Using Skills](https://code.visualstudio.com/docs/copilot/customization/agent-skills)
- [GitHub Community Discussion](https://github.com/orgs/community/discussions/183962)

## Implementation Complete

Skills have been successfully integrated into Copilot Agent Factory:

- ✅ `skill-templates/` directory created
- ✅ 7 foundational skill templates developed
- ✅ README.md updated with skills documentation
- ✅ AGENT.md updated with skills guidelines
- ✅ SKILL-TEMPLATE-STANDARD.md created

---

**Result:** Skills enhance Copilot Agent Factory with cross-platform procedural automation that works seamlessly across GitHub Copilot, Claude Code, and Cursor IDE.
