# Visual Guide: Agents vs Skills

## The Relationship

```
┌─────────────────────────────────────────────────────────────────────┐
│                        COPILOT AGENT FACTORY                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌─────────────────────┐              ┌─────────────────────┐       │
│  │      AGENTS         │              │       SKILLS        │       │
│  │   (Expertise)       │◄────uses────►│    (Procedures)     │       │
│  │                     │              │                     │       │
│  │  Role-based         │              │  Step-by-step       │       │
│  │  domain experts     │              │  workflows          │       │
│  │                     │              │                     │       │
│  │  46 templates       │              │  7 templates        │       │
│  │  12 categories      │              │  3 categories       │       │
│  └─────────────────────┘              └─────────────────────┘       │
│           │                                     │                    │
│           │                                     │                    │
│           ▼                                     ▼                    │
│  ┌──────────────────────────────────────────────────────────┐       │
│  │              AGENT-GENERATOR                             │       │
│  │         Analyzes repo → Selects templates                │       │
│  │         → Customizes with placeholders                   │       │
│  │         → Outputs for target platform                    │       │
│  └──────────────────────────────────────────────────────────┘       │
│           │                                     │                    │
└───────────┼─────────────────────────────────────┼────────────────────┘
            │                                     │
            ▼                                     ▼
   ┌────────────────┐                   ┌────────────────┐
   │ Platform-       │                   │ Cross-platform │
   │ specific        │                   │ .claude/       │
   │ formats         │                   │ skills/        │
   └────────────────┘                   └────────────────┘
            │                                     │
    ┌───────┼─────────┐                          │
    ▼       ▼         ▼                          ▼
┌────────┬────────┬────────┐          ┌──────────────────┐
│VS Code │ Claude │ Cursor │          │  All Platforms   │
│ .md    │  .md   │  .mdc  │          │  Use Same Format │
└────────┴────────┴────────┘          └──────────────────┘
```

## User Interaction Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER REQUEST                             │
└────────────────────────────┬────────────────────────────────────┘
                             │
                ┌────────────┴────────────┐
                │                         │
        Explicit Invocation      Keyword Detected
                │                         │
                ▼                         ▼
        ┌──────────────┐         ┌──────────────┐
        │    AGENT     │         │    SKILL     │
        │              │         │              │
        │ @test-agent  │         │ pytest-setup │
        │ @api-agent   │         │ run-tests    │
        │ @debug-agent │         │ git-workflow │
        └──────┬───────┘         └──────────────┘
               │
               │ Can invoke skills
               ▼
        ┌──────────────┐
        │    SKILL     │
        │  (called by  │
        │    agent)    │
        └──────────────┘
```

## Example Workflow: Setting Up Testing

```
┌─────────────────────────────────────────────────────────────────┐
│ USER: "I need to set up pytest with coverage in my Python repo" │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
                    ┌────────────────┐
                    │ Keyword Match: │
                    │ "set up pytest"│
                    └────────┬───────┘
                             │
                             ▼
              ┌──────────────────────────┐
              │  pytest-setup SKILL      │
              │  Auto-activates          │
              └──────────┬───────────────┘
                         │
         ┌───────────────┼───────────────┐
         ▼               ▼               ▼
    ┌─────────┐    ┌─────────┐    ┌─────────┐
    │ Step 1: │    │ Step 2: │    │ Step 3: │
    │ Install │    │ Create  │    │ Config  │
    │ pytest  │    │ tests/  │    │ pytest  │
    └─────────┘    └─────────┘    └─────────┘
         │               │               │
         └───────────────┼───────────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │  ✅ Tests Working    │
              └──────────────────────┘
```

## Example Workflow: API Security Review (Agent + Skill)

```
┌──────────────────────────────────────────────────────────────┐
│ USER: @security-agent "Review my API authentication"         │
└─────────────────────────┬────────────────────────────────────┘
                          │
                          ▼
                ┌──────────────────┐
                │ security-agent   │
                │ (Expert Analysis)│
                └────────┬─────────┘
                         │
            ┌────────────┼────────────┐
            ▼            ▼            ▼
      ┌─────────┐  ┌─────────┐  ┌─────────┐
      │Analyzes │  │Reviews  │  │Checks   │
      │ code    │  │patterns │  │vulns    │
      └─────────┘  └─────────┘  └─────────┘
            │            │            │
            └────────────┼────────────┘
                         │
                         ▼
                ┌─────────────────┐
                │ Recommendation: │
                │ "Implement JWT" │
                └────────┬────────┘
                         │
                         │ Invokes skill
                         ▼
                ┌──────────────────┐
                │ auth-setup SKILL │
                │ (Step-by-step)   │
                └────────┬─────────┘
                         │
         ┌───────────────┼───────────────┐
         ▼               ▼               ▼
    ┌─────────┐    ┌─────────┐    ┌─────────┐
    │Install  │    │Create   │    │Add      │
    │packages │    │auth/    │    │tests    │
    └─────────┘    └─────────┘    └─────────┘
         │               │               │
         └───────────────┼───────────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │ ✅ Auth Implemented  │
              └──────────────────────┘
```

## File Structure Comparison

```
PROJECT ROOT
│
├── .github/
│   ├── agents/                    ◄── AGENTS (Platform-specific)
│   │   ├── test-agent.md          │   Individual files
│   │   ├── api-agent.md           │   YAML + Markdown
│   │   └── security-agent.md      │   60+ placeholders
│   │
│   └── skills/                    ◄── SKILLS (or .claude/skills/)
│       ├── pytest-setup/          │   Folders per skill
│       │   ├── SKILL.md           │   YAML + Markdown
│       │   └── scripts/           │   Optional scripts
│       │       └── setup.sh       │   10 core placeholders
│       ├── run-tests/
│       │   └── SKILL.md
│       └── git-workflow/
│           └── SKILL.md
│
└── .claude/
    └── skills/                    ◄── Cross-platform location
        └── (same structure)           Works with Copilot, Claude, Cursor
```

## Platform Support Visual

```
                    ┌──────────────────────┐
                    │   .claude/skills/    │
                    │   (Single Format)    │
                    └──────────┬───────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
      ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
      │ GitHub       │  │ Claude       │  │ Cursor       │
      │ Copilot      │  │ Code         │  │ IDE          │
      │              │  │              │  │              │
      │ ✅ Supports  │  │ ✅ Native    │  │ ✅ Compatible│
      │ (Dec 2025)   │  │ Support      │  │              │
      └──────────────┘  └──────────────┘  └──────────────┘

VS.

      ┌──────────────────────────────────────────────┐
      │           Agents (Multi-Format)              │
      └──────────────┬───────────────────────────────┘
                     │
      ┌──────────────┼──────────────────┐
      │              │                  │
      ▼              ▼                  ▼
┌──────────┐   ┌──────────┐    ┌──────────┐
│ .md      │   │ .md      │    │ .mdc     │
│ format   │   │ format   │    │ format   │
│          │   │          │    │          │
│ Copilot  │   │ Claude   │    │ Cursor   │
│ specific │   │ specific │    │ specific │
└──────────┘   └──────────┘    └──────────┘
```

## Decision Tree

```
                    ┌─────────────────────┐
                    │ What do you need?   │
                    └──────────┬──────────┘
                               │
              ┌────────────────┴────────────────┐
              │                                 │
              ▼                                 ▼
     ┌────────────────┐                ┌────────────────┐
     │ Expert         │                │ Step-by-step   │
     │ Judgment?      │                │ Procedure?     │
     └────┬───────────┘                └────┬───────────┘
          │                                 │
          ▼                                 ▼
     ┌────────────────┐                ┌────────────────┐
     │  USE AGENT     │                │  USE SKILL     │
     │                │                │                │
     │ Examples:      │                │ Examples:      │
     │ • Code review  │                │ • Setup tools  │
     │ • Architecture │                │ • Run commands │
     │ • Debug issues │                │ • Workflows    │
     │ • Design APIs  │                │ • Automation   │
     └────────────────┘                └────────────────┘
              │                                 │
              └────────────┬────────────────────┘
                           │
                           ▼
                  ┌────────────────┐
                  │  OR USE BOTH!  │
                  │                │
                  │ Agent invokes  │
                  │ skill for      │
                  │ implementation │
                  └────────────────┘
```

## Auto-Activation Visual

### Agents (Explicit)
```
User types: "@test-agent review my tests"
             ↑
             └── Must explicitly mention agent name
```

### Skills (Auto)
```
User types: "how do I set up testing"
                      └──┬──┘
                         │
                         └── Keywords trigger pytest-setup skill
                             (no @ needed)
```

## Summary Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                   COPILOT AGENT FACTORY                          │
│                                                                   │
│  Creates:                                                         │
│                                                                   │
│  ┌──────────────────────┐        ┌──────────────────────┐       │
│  │  50 AGENT TEMPLATES  │        │  7 SKILL TEMPLATES   │       │
│  │  ─────────────────── │        │  ──────────────────  │       │
│  │  • Planning (6)      │        │  • Testing (3)       │       │
│  │  • Development (9)   │        │  • Development (3)   │       │
│  │  • Backend (2)       │        │  • DevOps (1)        │       │
│  │  • Mobile (3)        │        │                      │       │
│  │  • Frontend (3)      │        │  ✨ NEW ADDITION    │       │
│  │  • ML/AI (4)         │        │                      │       │
│  │  • + 7 more          │        │                      │       │
│  └──────────────────────┘        └──────────────────────┘       │
│                                                                   │
│  Output:                                                          │
│                                                                   │
│  🎯 Customized for your project                                  │
│  🎯 Ready to use immediately                                     │
│  🎯 Cross-platform compatible                                    │
└─────────────────────────────────────────────────────────────────┘
```
