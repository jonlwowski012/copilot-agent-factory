# Documentation: Skills Investigation

This directory contains comprehensive documentation investigating whether GitHub Copilot Agent Skills should be added to the Copilot Agent Factory.

## Quick Navigation

| Document | Purpose | Length |
|----------|---------|--------|
| **[SKILLS-RECOMMENDATION.md](SKILLS-RECOMMENDATION.md)** | Executive summary - start here | 2 pages |
| **[AGENTS-VS-SKILLS.md](AGENTS-VS-SKILLS.md)** | Quick reference comparison | 5 pages |
| **[VISUAL-GUIDE.md](VISUAL-GUIDE.md)** | Diagrams and flowcharts | 7 pages |
| **[SKILLS-INVESTIGATION.md](SKILLS-INVESTIGATION.md)** | Full detailed analysis | 10 pages |

## Recommendation

**YES - Add Skills Support** ✅

Skills are highly valuable and fully compatible with the goal of being general-purpose across GitHub Copilot, Claude Code, and Cursor IDE.

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

## Proposed Implementation

### 7 Initial Skill Templates

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

**Estimated Implementation:** ~2 weeks

## Reading Guide

### If You Want...

**A quick yes/no answer:**
→ Read [SKILLS-RECOMMENDATION.md](SKILLS-RECOMMENDATION.md) (2 min)

**To understand agents vs skills:**
→ Read [AGENTS-VS-SKILLS.md](AGENTS-VS-SKILLS.md) (5 min)

**To see visual diagrams:**
→ Read [VISUAL-GUIDE.md](VISUAL-GUIDE.md) (8 min)

**Full analysis and research:**
→ Read [SKILLS-INVESTIGATION.md](SKILLS-INVESTIGATION.md) (20 min)

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

## Next Steps (If Approved)

1. Create `skill-templates/` structure
2. Develop 7 foundational skill templates
3. Update agent-generator.md for skill detection
4. Update README.md with skills documentation
5. Test across all three platforms

---

**Conclusion:** Skills enhance Copilot Agent Factory with cross-platform procedural automation while maintaining the general-purpose goal. Highly recommended.
