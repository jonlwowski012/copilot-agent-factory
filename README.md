# Copilot Agent Factory 🏭

**Auto-generate customized GitHub Copilot agents AND portable Agent Skills for any repository in seconds.**

Transform any codebase into an AI-powered development environment by automatically detecting your tech stack, frameworks, and patterns, then generating perfectly tailored GitHub Copilot agents (role-based experts) and Agent Skills (workflow-based procedures) that understand your project's specific needs.

## What is this?

Instead of manually writing agent.md files and skill documentation for each project, Copilot Agent Factory:

- 🔍 **Scans your repository** to detect languages, frameworks, and tools
- 🎯 **Selects relevant agents AND skills** based on detected patterns (API, ML, testing, etc.)
- 🛠️ **Customizes templates** with your repo-specific commands and structure
- ⚡ **Outputs ready-to-use agents and skills** that know your codebase inside and out
- 🔄 **Manages dev workflows** with approval gates for PRD → Architecture → TDD → Development → Review
- 🌐 **Generates portable skills** that work across VS Code, CLI, and GitHub.com

**Result:** Your Copilot becomes both a domain expert (agents) and a workflow guide (skills) for your specific project.

---

## Agents vs Skills: Understanding the Difference

This factory generates **both agents and skills** to provide comprehensive AI assistance:

| Aspect | Agents | Skills |
|--------|--------|--------|
| **Purpose** | Role-based domain experts | Workflow-based procedures |
| **Invocation** | Explicit `@agent-name` | Auto-activated by task description |
| **Location** | `.github/agents/{name}.md` | `.github/skills/{name}/SKILL.md` |
| **Portability** | VS Code only | Works across VS Code, CLI, GitHub.com |
| **Content** | Instructions only | Instructions + scripts + templates |
| **Best For** | Complex analysis, expert consultation | Step-by-step workflows, procedures |
| **Example** | `@test-agent` for testing strategy | `creating-unit-tests` skill for test writing |

**When to Use Each:**
- **Use Agents** (`@agent-name`) for expert consultation, deep analysis, and complex reasoning
- **Skills auto-activate** when your task description matches their workflow (no explicit invocation needed)
- **Hybrid Approach**: Many capabilities exist as both (e.g., `@test-agent` + `creating-unit-tests` skill)

---

## Feature Development Workflow

The agent factory includes a comprehensive **Feature Development Workflow** with approval gates at each phase. This ensures quality and user oversight throughout the development lifecycle.

### Workflow Phases

```
┌─────────────────────────────────────────────────────────────────────────┐
│  PHASE 1: PRODUCT    →   PHASE 2: ARCHITECTURE   →   PHASE 3: TDD     │
│  ─────────────────       ───────────────────────       ───────────    │
│  @prd-agent              @architecture-agent           @test-design   │
│  @epic-agent             @design-agent                   -agent       │
│  @story-agent                                                         │
│         ↓                        ↓                          ↓         │
│    [/approve]               [/approve]                 [/approve]     │
│    [/skip]                  [/skip]                    [/skip]        │
├─────────────────────────────────────────────────────────────────────────┤
│                        PHASE 4: DEVELOPMENT                            │
│  ──────────────────────────────────────────────────────────────────   │
│  @api-agent, @database-agent, @frontend-*-agent, etc.                 │
│                              ↓                                         │
│                         [/approve]                                     │
├─────────────────────────────────────────────────────────────────────────┤
│                         PHASE 5: REVIEW                                │
│  ──────────────────────────────────────────────────────────────────   │
│  @test-agent → @review-agent → @security-agent → @docs-agent          │
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

All planning artifacts are stored in `docs/planning/` with consistent naming:

```
docs/planning/
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
1. Begin with `@prd-agent` to generate a PRD
2. Wait for your `/approve` or `/skip`
3. Proceed through each phase with approval gates
4. Coordinate development and review phases

---

## Quick Start

### 1. Copy to Your Repository

**Important:** GitHub Copilot agents and skills must be placed in specific directories:
- **Agents**: `.github/agents/` directory
- **Skills**: `.github/skills/` directory

```bash
# From this project, copy to your target repo
cp -r .github/agents /path/to/your/repo/.github/
cp -r agents/skill-templates /path/to/your/repo/.github/skills/
```

### 2. Generate Customized Agents and Skills

Invoke the agent-generator in your repository:

```
@agent-generator Analyze this repository and generate all appropriate agents and skills.
```

The generator will:
1. Scan your repository structure
2. Detect tech stack, frameworks, and tools
3. Extract build/test/lint commands from configs
4. Select relevant agents AND skills based on detected patterns
5. Customize templates with repo-specific values
6. Output agents to `.github/agents/` and skills to `.github/skills/`
7. **Default behavior**: Generate BOTH agents and skills for hybrid-eligible patterns

**Generation options:**
```
# Generate both agents and skills (default)
@agent-generator Analyze this repository

# Generate only agents
@agent-generator Analyze this repository --agents-only

# Generate only skills
@agent-generator Analyze this repository --skills-only
```

### 3. Use Your Agents and Skills

**Invoke agents explicitly:**
```
# Start a full feature workflow with approval gates
@orchestrator Start a new feature: user authentication system

# Or invoke individual agents directly
@prd-agent Create a PRD for the payment processing feature
@architecture-agent Design the system architecture for this feature
@test-design-agent Create test strategy before implementation

# Development agents
@test-agent Write tests for the UserService class
@lint-agent Fix all style issues in src/
@docs-agent Update the README with new API endpoints
@review-agent Review my changes before I create a PR
```

**Skills auto-activate:**
```
# These phrases trigger skills automatically (no @ needed)
"Create unit tests for the Calculator class"
  → creating-unit-tests skill activates

"Debug this failing test"
  → debugging-test-failures skill activates

"Create a new API endpoint for users"
  → creating-api-endpoints skill activates

"Set up Docker for this project"
  → setting-up-docker skill activates

"Review these code changes"
  → reviewing-code-changes skill activates
```

## Directory Structure

```
.github/
├── agents/                    # Role-based expert agents
│   ├── agent-generator.md     # Meta-agent that creates other agents and skills
│   ├── orchestrator.md        # Coordinates all agents + workflow management
│   └── templates/             # Agent templates with {{placeholders}}
│       ├── Planning & Design Agents
│       │   ├── prd-agent.md           # Product Requirements Documents
│       │   ├── epic-agent.md          # Epic breakdown from PRDs
│       │   ├── story-agent.md         # User stories with Gherkin
│       │   ├── architecture-agent.md  # System architecture & ADRs
│       │   ├── design-agent.md        # Technical design specifications
│       │   └── test-design-agent.md   # Test strategy (TDD)
│       ├── Core Development Agents
│       │   ├── docs-agent.md          # Documentation and technical writing
│       │   ├── test-agent.md          # Testing and coverage
│       │   ├── lint-agent.md          # Code formatting and style
│       │   ├── review-agent.md        # Code review and best practices
│       │   ├── debug-agent.md         # Error investigation and troubleshooting
│       │   ├── refactor-agent.md      # Code restructuring and tech debt
│       │   ├── performance-agent.md   # Profiling and optimization
│       │   ├── security-agent.md      # Security audits and vulnerability detection
│       │   └── devops-agent.md        # CI/CD, Docker, deployments
│       ├── API & Backend Agents
│       │   ├── api-agent.md           # API development and endpoints
│       │   └── database-agent.md      # Database schemas and migrations
│       ├── Mobile Development Agents
│       │   ├── mobile-ios-agent.md         # iOS development (Swift, SwiftUI, UIKit)
│       │   ├── mobile-react-native-agent.md # React Native cross-platform
│       │   └── mobile-flutter-agent.md     # Flutter/Dart development
│       ├── Frontend Framework Agents
│       │   ├── frontend-react-agent.md   # React development with hooks and TypeScript
│       │   ├── frontend-vue-agent.md     # Vue.js with Composition API
│       │   └── frontend-angular-agent.md # Angular with RxJS and standalone components
│       └── ML/AI Agents
│           ├── ml-trainer.md          # ML model training
│           ├── data-prep.md           # Data preprocessing
│           ├── eval-agent.md          # Model evaluation
│           └── inference-agent.md     # Model inference and serving
└── skills/                    # Workflow-based skills (portable across tools)
    └── skill-templates/       # Skill templates with minimal placeholders
        ├── Testing & Quality
        │   ├── creating-unit-tests/
        │   │   ├── SKILL.md                    # Main skill instructions
        │   │   ├── detect-test-framework.sh    # Auto-detection script
        │   │   ├── pytest-fixtures.py          # Python test patterns
        │   │   └── jest-test-template.js       # JavaScript test patterns
        │   ├── debugging-test-failures/
        │   │   └── SKILL.md                    # Test debugging workflow
        │   └── reviewing-code-changes/
        │       └── SKILL.md                    # Code review checklist
        ├── Development Workflows
        │   ├── creating-api-endpoints/
        │   │   ├── SKILL.md                    # REST API creation guide
        │   │   ├── fastapi-endpoint-template.py # FastAPI templates
        │   │   └── express-endpoint-template.js # Express templates
        │   ├── creating-database-migrations/
        │   │   └── SKILL.md                    # Migration workflow
        │   └── designing-with-tdd/
        │       └── SKILL.md                    # TDD cycle guide
        └── DevOps & Deployment
            └── setting-up-docker/
                └── SKILL.md                     # Containerization workflow
```

## Agent & Skill Detection Rules

The generator creates agents and skills based on detected patterns. **Default behavior: Generate BOTH for hybrid-eligible patterns.**

### Planning & Design (Agents Only)
| Agent | Created When | Skill Version |
|-------|-------------|---------------|
| **prd-agent** | Always created (supports feature workflows) | No skill (requires expert reasoning) |
| **epic-agent** | Always created (supports feature workflows) | No skill (requires expert reasoning) |
| **story-agent** | Always created (supports feature workflows) | No skill (requires expert reasoning) |
| **architecture-agent** | Always created (supports feature workflows) | No skill (requires expert reasoning) |
| **design-agent** | Always created (supports feature workflows) | No skill (requires expert reasoning) |
| **test-design-agent** | Always created (supports TDD workflows) | **designing-with-tdd** skill for TDD cycle |

### Core Development (Hybrid: Agents + Skills)
| Agent | Created When | Skill Version |
|-------|-------------|---------------|
| **orchestrator** | Always created (central coordinator) | No skill (coordination role) |
| **test-agent** | Test framework detected | **creating-unit-tests**, **debugging-test-failures** |
| **docs-agent** | `docs/` exists, README present, or docstrings | No skill (agent sufficient) |
| **lint-agent** | Linter configs exist (ruff, eslint, prettier) | No skill (agent sufficient) |
| **review-agent** | Always created (universal need) | **reviewing-code-changes** skill |
| **debug-agent** | Always created (universal need) | Uses debugging-test-failures for tests |
| **refactor-agent** | Always created (universal need) | No skill (requires reasoning) |
| **performance-agent** | Large codebase or perf patterns | No skill (requires profiling) |
| **security-agent** | Auth code, APIs, database queries | No skill (requires deep analysis) |
| **devops-agent** | `.github/workflows/`, `Dockerfile`, CI/CD | **setting-up-docker** for Docker |

### API & Backend (Hybrid)
| Agent | Created When | Skill Version |
|-------|-------------|---------------|
| **api-agent** | API framework (FastAPI, Flask, Express) or `api/` | **creating-api-endpoints** |
| **database-agent** | Database detected (PostgreSQL, MySQL, SQLite) | **creating-database-migrations** |

### Mobile Development (Agents Only)
| Agent | Created When | Skill Version |
|-------|-------------|---------------|
| **mobile-ios-agent** | `.xcodeproj`, `.xcworkspace`, Swift files | No skill (agent sufficient) |
| **mobile-react-native-agent** | `package.json` with `react-native` | No skill (agent sufficient) |
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

1. Create a new template in `.github/agents/templates/`:

```markdown
---
name: my-agent
description: What this agent does
triggers:
  - file patterns or conditions that indicate this agent is needed
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
