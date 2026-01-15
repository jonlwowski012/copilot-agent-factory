# Copilot Agent Factory 🏭

**Auto-generate customized agents for VS Code (GitHub Copilot) or Claude Code from any repository.**

Transform any codebase into an AI-powered development environment by automatically detecting your tech stack, frameworks, and patterns, then generating perfectly tailored agents that understand your project's specific needs.

## Supported Platforms

| Platform | Output Format | Default Location |
|----------|---------------|------------------|
| **VS Code** (GitHub Copilot) | Multiple `.md` files (one per agent) | `.github/agents/` |
| **Claude Code** | Multiple `.md` files (one per agent) | `.claude/agents/` |

## What is this?

Instead of manually writing agent files for each project, Copilot Agent Factory:

- 🔍 **Scans your repository** to detect languages, frameworks, and tools
- 🎯 **Selects relevant agents** based on detected patterns (API, ML, testing, etc.)
- 🛠️ **Customizes templates** with your repo-specific commands and structure
- ⚡ **Outputs ready-to-use agents** in the format for your preferred IDE
- 🔄 **Manages dev workflows** with approval gates for PRD → Architecture → TDD → Development → Review

**Result:** Your agents become domain experts for your specific project, not generic assistants.

---

## Feature Development Workflow

The agent factory includes a comprehensive **Feature Development Workflow** with approval gates at each phase. This ensures quality and user oversight throughout the development lifecycle.

### Workflow Phases

```
┌─────────────────────────────────────────────────────────────────────────┐
│  PHASE 0: STATE      →   PHASE 1: PRODUCT    →   PHASE 2: ARCHITECTURE │
│  ─────────────────       ─────────────────       ─────────────────────  │
│  @architecture-agent     @prd-agent              @architecture-agent    │
│  (State Diagram)         @epic-agent             @design-agent          │
│                          @story-agent                                   │
│         ↓                        ↓                        ↓             │
│    [/approve]               [/approve]               [/approve]         │
│    [/skip]                  [/skip]                  [/skip]            │
├─────────────────────────────────────────────────────────────────────────┤
│  PHASE 3: TDD        →   PHASE 4: DEVELOPMENT   →   PHASE 5: REVIEW    │
│  ─────────────────       ──────────────────────      ────────────────  │
│  @test-design-agent      @api-agent, etc.            @test-agent       │
│                                                       @review-agent     │
│                                                       @docs-agent       │
│         ↓                        ↓                        ↓             │
│    [/approve]               [/approve]               [Complete]         │
│    [/skip]                  [/skip]                                     │
└─────────────────────────────────────────────────────────────────────────┘
```

### Workflow Commands

| Command | Description |
|---------|-------------|
| `/approve` | Approve current phase artifact and proceed to next phase |
| `/skip` | Skip current phase and proceed to next phase |
| `/status` | Show current workflow state and phase |
| `/restart` | Restart workflow from beginning |

### Planning Artifacts

All planning artifacts are stored in `docs/` and `docs/planning/` with consistent naming:

```
docs/
├── system-state-diagram.md                           # System state machine
└── planning/
    ├── prd/
    │   └── {feature-name}-{YYYYMMDD}.md          # Product Requirements Document
    ├── epics/
    │   └── {feature-name}-epics-{YYYYMMDD}.md    # Epic breakdown
    ├── stories/
    │   └── {feature-name}-stories-{YYYYMMDD}.md  # User stories with Gherkin
    ├── architecture/
    │   └── {feature-name}-architecture-{YYYYMMDD}.md  # System architecture & ADRs
    ├── design/
    │   └── {feature-name}-design-{YYYYMMDD}.md   # Technical design specs
    └── test-design/
        └── {feature-name}-test-design-{YYYYMMDD}.md  # Test strategy (TDD)
```

### Starting a Feature Development Workflow

```
@orchestrator Start a new feature: user authentication system
```

The orchestrator will:
1. **Phase 0:** Check/create/update the system state diagram with `@architecture-agent`
2. Wait for your `/approve` or `/skip`
3. **Phase 1:** Begin with `@prd-agent` to generate a PRD
4. Continue through each phase with approval gates
5. Coordinate development and review phases

---

## Quick Start

### 1. Copy to Your Repository

```bash
# From this project, copy the generator and templates to your target repo
cp agent-generator.md /path/to/your/repo/
cp -r agent-templates /path/to/your/repo/
```

### 2. Generate Agents for Your Platform

**For VS Code (GitHub Copilot):**

```
@agent-generator --platform vscode --output .github/agents/
Analyze this repository and generate all appropriate agents
```

**For Claude Code:**

```
@agent-generator --platform claude-code --output .claude/agents/
Analyze this repository and generate all appropriate agents
```

**For Both Platforms:**

```
@agent-generator --platform both --output-vscode .github/agents/ --output-claude .claude/agents/
Analyze this repository and generate agents for both platforms
```

The generator will:
1. Scan your repository structure
2. Detect tech stack, frameworks, and tools
3. Extract build/test/lint commands from configs
4. Select relevant agents based on detected patterns
5. Customize templates with repo-specific values
6. Output agents in the appropriate format for your platform

### 3. Use Your Agents

**VS Code (GitHub Copilot):**

```
# Start a full feature workflow with approval gates
@orchestrator Start a new feature: user authentication system

# Or invoke individual agents directly
@prd-agent Create a PRD for the payment processing feature
@test-agent Write tests for the UserService class
@review-agent Review my changes before I create a PR
```

**Claude Code:**

Agents are available in your `.claude/agents/` directory and Claude will automatically use them based on context.

## Directory Structure

```
automatic_agent_gen/
├── agent-generator.md        # Meta-agent that creates other agents
├── agent-templates/          # Shared agent templates with {{placeholders}}
│   ├── Planning & Design Agents
│   │   ├── prd-agent.md           # Product Requirements Documents
│   │   ├── epic-agent.md          # Epic breakdown from PRDs
│   │   ├── story-agent.md         # User stories with Gherkin
│   │   ├── architecture-agent.md  # System architecture & ADRs
│   │   ├── design-agent.md        # Technical design specifications
│   │   └── test-design-agent.md   # Test strategy (TDD)
│   ├── Core Development Agents
│   │   ├── orchestrator.md        # Coordinates all agents + workflow management
│   │   ├── docs-agent.md          # Documentation and technical writing
│   │   ├── test-agent.md          # Testing and coverage
│   │   ├── lint-agent.md          # Code formatting and style
│   │   ├── review-agent.md        # Code review and best practices
│   │   ├── debug-agent.md         # Error investigation and troubleshooting
│   │   ├── refactor-agent.md      # Code restructuring and tech debt
│   │   ├── performance-agent.md   # Profiling and optimization
│   │   ├── security-agent.md      # Security audits and vulnerability detection
│   │   └── devops-agent.md        # CI/CD, Docker, deployments
│   ├── API & Backend Agents
│   │   ├── api-agent.md           # API development and endpoints
│   │   └── backend-agent.md       # Server-side logic
│   ├── Mobile Development Agents
│   │   ├── mobile-ios-agent.md         # iOS development (Swift, SwiftUI, UIKit)
│   │   ├── mobile-react-native-agent.md # React Native cross-platform
│   │   └── mobile-flutter-agent.md     # Flutter/Dart development
│   ├── Frontend Framework Agents
│   │   ├── frontend-react-agent.md   # React development with hooks and TypeScript
│   │   ├── frontend-vue-agent.md     # Vue.js with Composition API
│   │   └── frontend-angular-agent.md # Angular with RxJS and standalone components
│   ├── Database Agents
│   │   └── database-agent.md      # Schema design, migrations, query optimization
│   └── ML/AI Agents
│       ├── ml-trainer.md          # ML model training
│       ├── data-prep.md           # Data preprocessing
│       ├── eval-agent.md          # Model evaluation
│       └── inference-agent.md     # Model inference and serving
├── AGENT.md                  # Global agent conventions
├── README.md                 # This documentation
└── docs/                     # Planning artifacts
    └── planning/
        ├── prd/              # Product Requirements Documents
        ├── epics/            # Epic breakdowns
        ├── stories/          # User stories with Gherkin
        ├── architecture/     # System architecture & ADRs
        ├── design/           # Technical design specs
        └── test-design/      # Test strategy documents
```

## Platform Differences

### VS Code (GitHub Copilot)

- **Output:** Multiple `.md` files in `.github/agents/`
- **YAML Frontmatter:** Full format with `name`, `model`, `description`, `triggers`, `handoffs`
- **Invocation:** `@agent-name` in VS Code chat
- **Handoffs:** Supported for agent-to-agent transitions

### Claude Code

- **Output:** Multiple `.md` files in `.claude/agents/`
- **YAML Frontmatter:** Simplified format with `name`, `model`, `description` only (no `triggers` or `handoffs`)
- **Invocation:** Claude uses agents automatically based on context
- **Handoffs:** Not supported (Claude handles routing internally)

## Agent Detection Rules

The generator creates agents based on detected patterns:

### Planning & Design Agents
| Agent | Created When |
|-------|-------------|
| **prd-agent** | Always created (supports feature workflows) |
| **epic-agent** | Always created (supports feature workflows) |
| **story-agent** | Always created (supports feature workflows) |
| **architecture-agent** | Always created (supports feature workflows) |
| **design-agent** | Always created (supports feature workflows) |
| **test-design-agent** | Always created (supports TDD workflows) |

### Core Development Agents
| Agent | Created When |
|-------|-------------|
| **orchestrator** | Always created (central coordinator) |
| **docs-agent** | `docs/` exists, README present, or docstrings found |
| **test-agent** | `tests/` exists, test framework in deps, or `*_test.*` files |
| **lint-agent** | Linter configs exist (ruff, eslint, prettier, etc.) |
| **review-agent** | Always created (universal need) |
| **debug-agent** | Always created (universal need) |
| **refactor-agent** | Always created (universal need) |
| **performance-agent** | Large codebase or performance-critical patterns |
| **security-agent** | Auth code, API endpoints, database queries, or env vars |
| **devops-agent** | `.github/workflows/`, `Dockerfile`, or CI/CD configs |

### API & Backend Agents
| Agent | Created When |
|-------|-------------|
| **api-agent** | API framework detected (FastAPI, Flask, Express, etc.) or `api/` directory |

### Mobile Development Agents
| Agent | Created When |
|-------|-------------|
| **mobile-ios-agent** | `.xcodeproj`, `.xcworkspace`, `Package.swift`, or Swift files |
| **mobile-react-native-agent** | `package.json` with `react-native`, `metro.config.js`, or RN structure |
| **mobile-flutter-agent** | `pubspec.yaml`, `lib/*.dart`, or Flutter dependencies |

### Frontend Framework Agents
| Agent | Created When |
|-------|-------------|
| **frontend-react-agent** | `package.json` with `react` dependency or `.jsx/.tsx` files |
| **frontend-vue-agent** | `package.json` with `vue` dependency or `.vue` files |
| **frontend-angular-agent** | `package.json` with `@angular/core` or `angular.json` |

### Database Agents
| Agent | Created When |
|-------|-------------|
| **database-agent** | `migrations/`, database configs, SQL files, or ORM dependencies |

### ML/AI Agents
| Agent | Created When |
|-------|-------------|
| **ml-trainer** | `train.py`, `training/`, or ML framework in deps |
| **data-prep** | `data/` directory or data processing libraries |
| **eval-agent** | `eval.py`, `metrics/`, or ML framework detected |
| **inference-agent** | `inference.py`, `predict.py`, or model serving patterns |

## Template Placeholders

Templates use `{{placeholder}}` markers that get replaced with detected values:

### Universal Placeholders
| Placeholder | Description | Example Values |
|-------------|-------------|----------------|
| `{{tech_stack}}` | Languages, frameworks, versions | "Python 3.10, PyTorch 2.0, FastAPI" |
| `{{source_dirs}}` | Source code locations | "`src/`, `lib/`" |
| `{{test_dirs}}` | Test file locations | "`tests/`, `__tests__/`" |
| `{{test_command}}` | Test execution command | "pytest -v", "npm test" |
| `{{lint_command}}` | Linting command | "ruff check --fix .", "eslint --fix" |
| `{{build_command}}` | Build command | "npm run build", "cargo build" |
| `{{dev_command}}` | Development server command | "npm run dev", "python manage.py runserver" |

### Mobile Development Placeholders
| Placeholder | Description | Example Values |
|-------------|-------------|----------------|
| `{{ios_target_version}}` | iOS deployment target | "iOS 15.0", "iOS 16.0" |
| `{{ios_ui_framework}}` | UI framework | "SwiftUI", "UIKit" |
| `{{rn_version}}` | React Native version | "0.72.0" |
| `{{flutter_version}}` | Flutter SDK version | "3.10.0" |
| `{{navigation_library}}` | Navigation solution | "React Navigation", "Go Router" |
| `{{state_management}}` | State management library | "Redux", "Provider", "BLoC" |

### Frontend Framework Placeholders
| Placeholder | Description | Example Values |
|-------------|-------------|----------------|
| `{{react_version}}` | React version | "18.2.0" |
| `{{vue_version}}` | Vue version | "3.3.0" |
| `{{angular_version}}` | Angular version | "16.0.0" |
| `{{ui_library}}` | UI component library | "Material-UI", "Ant Design", "Vuetify" |
| `{{build_tool}}` | Build tool | "Vite", "Webpack", "Angular CLI" |

### Database Placeholders
| Placeholder | Description | Example Values |
|-------------|-------------|----------------|
| `{{database_system}}` | Database type | "PostgreSQL", "MySQL", "MongoDB" |
| `{{orm_system}}` | ORM/Query builder | "Prisma", "TypeORM", "Sequelize", "Django ORM" |
| `{{migration_tool}}` | Migration tool | "Alembic", "Knex", "Django migrations" |
| `{{db_migrations_dirs}}` | Migration directory | "`migrations/`, `db/migrate/`" |

### ML/AI Placeholders
| Placeholder | Description | Example Values |
|-------------|-------------|----------------|
| `{{ml_framework}}` | ML framework in use | "PyTorch", "TensorFlow" |
| `{{docstring_style}}` | Docstring convention | "Google", "NumPy", "Sphinx" |

## Customization

### Adding New Agent Templates

1. Create a new template in `agent-templates/`:

```markdown
---
name: my-agent
model: claude-4-5-sonnet
description: What this agent does
triggers:
  - file patterns or conditions that indicate this agent is needed
handoffs:
  - target: related-agent
    label: "Next Step"
    prompt: "Handoff context"
    send: false
---

You are an expert [role] for this project.

## Your Role
...

## Project Knowledge
- **Tech Stack:** {{tech_stack}}
...

## Commands
- **Primary Command:** `{{my_command}}`
...

## Boundaries
- ✅ **Always:** ...
- ⚠️ **Ask First:** ...
- 🚫 **Never:** ...
```

2. Update `agent-generator.md` to detect when your agent should be created

**Note:** The `triggers` and `handoffs` sections are VS Code-specific and will be automatically stripped when generating for Claude Code.

### Overriding Detection

Create `.github/agent-config.yml` in your repo to customize detection:

```yaml
# Force include/exclude specific agents
agents:
  include:
    - ml-trainer
    - data-prep
  exclude:
    - api-agent

# Override detected values
overrides:
  tech_stack: "Python 3.11, PyTorch 2.1, Lightning"
  test_command: "pytest -v --cov=src"
  lint_command: "ruff check --fix . && ruff format ."
```

## Best Practices

Based on analysis of [2,500+ repositories](https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/):

### Do's ✅
- **Be specific**: "Python 3.10 with PyTorch" not "Python project"
- **Include commands**: Actual executable commands with flags
- **Show examples**: Code snippets demonstrating style
- **Set boundaries**: Clear always/ask/never rules

### Don'ts ❌
- Generic personas ("helpful assistant")
- Vague instructions without examples
- Missing executable commands
- No boundaries defined

## Agent Handoffs (VS Code Only)

All agent templates include **handoff** configurations that enable seamless transitions between agents during development workflows. Handoffs allow agents to pass context and suggest next steps, creating a guided, multi-agent collaboration experience.

**Note:** Handoffs are a VS Code (GitHub Copilot) feature and are automatically stripped when generating for Claude Code.

### How Handoffs Work

When an agent completes its task, it can present handoff buttons that:
- Transfer context to the next appropriate agent
- Pre-fill prompts with relevant information
- Guide users through multi-step workflows
- Enable approval-based transitions

### Example Workflow with Handoffs

```
1. @prd-agent creates PRD
   → Handoff options: "Break into Epics" (@epic-agent), "Design Architecture" (@architecture-agent)

2. @epic-agent breaks down PRD
   → Handoff options: "Generate User Stories" (@story-agent), "Design Architecture" (@architecture-agent)

3. @architecture-agent designs system
   → Handoff options: "Create Technical Design" (@design-agent), "Security Review" (@security-agent)

4. @test-design-agent creates test strategy
   → Handoff options: "Implement Tests" (@test-agent), "Start Implementation" (@api-agent)

5. @api-agent implements endpoints
   → Handoff options: "Test API" (@test-agent), "Security Review" (@security-agent), "Document API" (@docs-agent)

6. @review-agent reviews code
   → Handoff options: "Refactor Code" (@refactor-agent), "Add Tests" (@test-agent), "Update Documentation" (@docs-agent)
```

### Handoff Configuration

Each agent template includes handoffs in the YAML frontmatter:

```yaml
---
name: api-agent
handoffs:
  - target: test-agent
    label: "Test API"
    prompt: "Please write comprehensive tests for the API endpoints implemented."
    send: false
  - target: security-agent
    label: "Security Review"
    prompt: "Please review the API endpoints for security vulnerabilities."
    send: false
---
```

The `send: false` setting means handoffs require user approval before transitioning, maintaining developer control over the workflow.

## Agent Capabilities

### Orchestrator
- Routes tasks to appropriate specialized agents
- **Manages Feature Development Workflow** with approval gates
- Handles `/approve`, `/skip`, `/status`, `/restart` commands
- Coordinates multi-step workflows
- Manages handoffs between agents
- Provides high-level guidance

### Planning & Design Agents
- **prd-agent**: Generate PRDs from feature requests, define goals and requirements
- **epic-agent**: Break PRDs into epics with acceptance criteria and dependencies
- **story-agent**: Create user stories with Gherkin scenarios and story points
- **architecture-agent**: Design system architecture, create ADRs, component diagrams
- **design-agent**: Technical specs, API contracts, data models, implementation details
- **test-design-agent**: Test strategy, test case specifications (TDD pre-implementation)

### Core Development Agents
- **docs-agent**: READMEs, API docs, docstrings, comments
- **test-agent**: Unit tests, integration tests, coverage, TDD
- **lint-agent**: Code formatting, style fixes, import sorting
- **review-agent**: Code review, best practices, PR feedback
- **debug-agent**: Error investigation, log analysis, troubleshooting
- **refactor-agent**: Code restructuring, design patterns, tech debt reduction
- **performance-agent**: Profiling, optimization, bottleneck identification
- **security-agent**: Vulnerability detection, secure coding, security audits
- **devops-agent**: CI/CD pipelines, Docker, deployments, infrastructure

### API & Backend Agents
- **api-agent**: REST/GraphQL endpoints, validation, error handling, API design

### Mobile Development Agents
- **mobile-ios-agent**: iOS apps with Swift, SwiftUI, UIKit, App Store optimization
- **mobile-react-native-agent**: Cross-platform apps, platform-specific code, native modules
- **mobile-flutter-agent**: Flutter/Dart apps, widget composition, multi-platform deployment

### Frontend Framework Agents
- **frontend-react-agent**: React components, hooks, state management, performance optimization
- **frontend-vue-agent**: Vue 3 apps, Composition API, Pinia, composables
- **frontend-angular-agent**: Angular apps, RxJS, standalone components, dependency injection

### Database Agents
- **database-agent**: Schema design, migrations, query optimization, ORM patterns

### ML/AI Agents
- **ml-trainer**: Training loops, hyperparameters, checkpoints, distributed training
- **data-prep**: Data loading, augmentation, preprocessing, pipelines
- **eval-agent**: Metrics, benchmarking, model comparison, validation
- **inference-agent**: Prediction pipelines, model serving, optimization, deployment

## Example Generated Output

For a Python ML project, the generator might produce:

```markdown
---
name: test-agent
description: Test engineer specializing in writing tests for ML pipelines
---

You are an expert test engineer for this project.

## Project Knowledge
- **Tech Stack:** Python 3.10, PyTorch 2.0, pytest
- **Test Directories:**
  - `tests/` – Unit and integration tests

## Commands
- **Run All Tests:** `pytest -v`
- **Run with Coverage:** `pytest -v --cov=src --cov-report=html`

## Standards
- Test file naming: `test_*.py`
- Use pytest fixtures for shared setup
- Mock external APIs and database calls

## Boundaries
- ✅ **Always:** Write tests for new features, use descriptive names
- ⚠️ **Ask First:** Adding new test dependencies
- 🚫 **Never:** Skip tests, commit failing tests
```

## Contributing

To improve the templates or add new agents:

1. Test changes on diverse repository types
2. Ensure templates work with multiple tech stacks
3. Keep placeholders consistent across templates
4. Update detection rules in agent-generator.md

## References

- [GitHub Blog: How to Write Great Agents.md](https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/)
- [GitHub Copilot Documentation](https://docs.github.com/en/copilot)
