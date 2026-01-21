# Copilot Agent Factory 🏭

**Auto-generate customized agents and skills for VS Code (GitHub Copilot), Claude Code, or Cursor IDE from any repository.**

Transform any codebase into an AI-powered development environment by automatically detecting your tech stack, frameworks, and patterns, then generating perfectly tailored agents and skills that understand your project's specific needs.

## Supported Platforms

| Platform | Agents | Skills | Default Location |
|----------|--------|--------|------------------|
| **VS Code** (GitHub Copilot) | `.md` files | `.claude/skills/` | `.github/agents/` |
| **Claude Code** | `.md` files | `.claude/skills/` | `.claude/agents/` |
| **Cursor IDE** | `.mdc` files | `.claude/skills/` | `.cursor/agents/` |

## What is this?

Instead of manually writing agent files for each project, Copilot Agent Factory:

- 🔍 **Scans your repository** to detect languages, frameworks, and tools
- 🎯 **Selects relevant agents and skills** based on detected patterns (API, ML, testing, etc.)
- 🛠️ **Customizes templates** with your repo-specific commands and structure
- ⚡ **Outputs ready-to-use agents and skills** in the format for your preferred IDE
- 🔄 **Manages dev workflows** with approval gates for PRD → Architecture → TDD → Development → Review
- 🤖 **Auto-activating skills** provide step-by-step guidance for common tasks

**Result:** Your agents become domain experts and skills provide procedural automation for your specific project, not generic assistants.

---

## Quick Start

Get up and running in 3 simple steps:

### 1. Copy to Your Repository

```bash
# From this project, copy the generator and templates to your target repo
cp agent-generator.md /path/to/your/repo/
cp -r agent-templates /path/to/your/repo/
cp -r skill-templates /path/to/your/repo/
cp SKILL-TEMPLATE-STANDARD.md /path/to/your/repo/
```

### 2. Generate Agents and Skills for Your Platform

**For VS Code (GitHub Copilot):**

```
@agent-generator --platform vscode --output .github/agents/
Analyze this repository and generate all appropriate agents and skills
```

**For Claude Code:**

```
@agent-generator --platform claude-code --output .claude/agents/
Analyze this repository and generate all appropriate agents and skills
```

**For Cursor IDE:**

```
@agent-generator --platform cursor --output .cursor/agents/
Analyze this repository and generate all appropriate agents and skills
```

**For Multiple Platforms:**

```
@agent-generator --platform both --output-vscode .github/agents/ --output-claude .claude/agents/
Analyze this repository and generate agents and skills for both platforms
```

Or specify all platforms:

```
@agent-generator --platform vscode,claude-code,cursor --output-vscode .github/agents/ --output-claude .claude/agents/ --output-cursor .cursor/agents/
Analyze this repository and generate agents and skills for all three platforms
```

The generator will:
1. 🔍 Scan your repository structure
2. 🎯 Detect tech stack, frameworks, and tools
3. 📝 Extract build/test/lint commands from configs
4. 📚 Inspect coding standards and style guidelines
5. ✨ Select relevant agents and skills based on detected patterns
6. 🛠️ Customize templates with repo-specific values
7. 🚀 Output ready-to-use agents in the appropriate format
8. 🤖 Output auto-activating skills to `.claude/skills/`

### 3. Start Using Your Agents and Skills

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

**Cursor IDE:**

Agents are available in your `.cursor/agents/` directory. Cursor will recognize and apply these agents automatically based on your project context.

**Using Skills (All Platforms):**

Skills auto-activate based on keywords in your prompts. No explicit invocation needed:

```
# Skills auto-activate on natural language
"set up pytest with coverage"  → pytest-setup skill activates
"how do I run tests"           → run-tests skill activates
"format my code"               → code-formatting skill activates
"debug failing test"           → debug-test-failures skill activates
```

Skills are available in `.claude/skills/` and work across GitHub Copilot, Claude Code, and Cursor IDE.

---

## Agents vs Skills

The factory now generates both **agents** and **skills** to provide comprehensive AI assistance:

| Aspect | Agents | Skills |
|--------|--------|--------|
| **Purpose** | Domain expertise and decision-making | Step-by-step procedural workflows |
| **Invocation** | Explicit: `@agent-name` | Auto-activates based on keywords |
| **Location** | `.github/agents/` (platform-specific) | `.claude/skills/` (cross-platform) |
| **Best For** | Code review, architecture, debugging | Setup tasks, running commands, workflows |
| **Example** | `@test-agent` reviews test quality | "set up pytest" auto-activates pytest-setup skill |

### When to Use Each

**Use Agents when you need:**
- Expert judgment and recommendations
- Code review and architectural guidance
- Debugging complex issues
- Design decisions

**Use Skills when you need:**
- Step-by-step setup instructions
- Command execution guidance
- Workflow automation
- Troubleshooting procedures

**They work together:** Agents can invoke skills for procedural tasks, and skills can reference agents for expert guidance.

### Available Skills (7)

The factory includes skill templates that auto-activate based on keywords:

#### Testing & Quality (3)
- **pytest-setup** - Setup pytest with coverage  
  *Keywords:* "set up pytest", "configure pytest", "install pytest"
- **run-tests** - Execute tests with various options  
  *Keywords:* "run tests", "execute tests", "test command"
- **debug-test-failures** - Debug and fix failing tests  
  *Keywords:* "debug test", "test failing", "fix failing test"

#### Development Workflows (3)
- **local-dev-setup** - Setup development environment  
  *Keywords:* "dev setup", "local environment", "install dependencies"
- **code-formatting** - Format code and fix linting  
  *Keywords:* "format code", "fix formatting", "run formatter"
- **git-workflow** - Git branching and commit conventions  
  *Keywords:* "git workflow", "commit message", "branch strategy"

#### DevOps & Deployment (1)
- **ci-pipeline** - Debug CI/CD pipelines  
  *Keywords:* "CI pipeline", "GitHub Actions", "CI failing"

### Cross-Platform Skills Support

Skills use the `.claude/skills/` format which works natively across all three platforms:

| Platform | Skills Support | Auto-Activation |
|----------|----------------|-----------------|
| GitHub Copilot | ✅ Native (Dec 2025) | ✅ Yes |
| Claude Code | ✅ Native | ✅ Yes |
| Cursor IDE | ✅ Compatible | ✅ Yes |

**Key advantage:** Skills use a single format that works everywhere, while agents need platform-specific conversion.

---

## Feature Development Workflow

The agent factory includes a comprehensive **Feature Development Workflow** with approval gates at each phase. This ensures quality and user oversight throughout the development lifecycle.

### Workflow Overview

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
│  @test-design-agent      @api-agent, etc.            @review-agent     │
│                                                       @docs-agent       │
│                                                                         │
│         ↓                        ↓                        ↓             │
│    [/approve]               [/approve]               [Complete]         │
│    [/skip]                  [/skip]                                     │
└─────────────────────────────────────────────────────────────────────────┘
```

### Starting a Feature Development Workflow

```
@orchestrator Start a new feature: user authentication system
```

The orchestrator coordinates a 6-phase workflow with approval gates, ensuring quality and user oversight at each step.

---

### Phase-by-Phase Breakdown

#### **Phase 0: System State Validation**

**Goal:** Ensure system state diagram exists and is current before starting feature development.

**Steps:**
1. Orchestrator checks if `docs/system-state-diagram.md` exists
2. If missing or outdated:
   - Invokes `@architecture-agent` to analyze current system
   - Generates state machine diagram showing system states and transitions
   - Saves to `docs/system-state-diagram.md`
3. Presents diagram to user for review

**Output:** `docs/system-state-diagram.md` (state machine diagram)

**Approval Gate:** Type `/approve` to proceed to Phase 1, or `/skip` to skip validation

---

#### **Phase 1: Product Planning** (3 sub-phases)

**Goal:** Define requirements, break into manageable epics, and create detailed user stories.

##### **Phase 1.1: Product Requirements Document**
- **Agent:** `@prd-agent`
- **Input:** Feature description from user
- **Action:** Creates comprehensive PRD defining goals, requirements, success metrics, and constraints
- **Output:** `docs/planning/prd/{feature-name}-{YYYYMMDD}.md`
- **Approval Gate:** `/approve` to continue to Phase 1.2

##### **Phase 1.2: Epic Breakdown**
- **Agent:** `@epic-agent`
- **Input:** PRD from Phase 1.1
- **Action:** Breaks PRD into implementable epics with acceptance criteria and dependencies
- **Output:** `docs/planning/epics/{feature-name}-epics-{YYYYMMDD}.md`
- **Approval Gate:** `/approve` to continue to Phase 1.3

##### **Phase 1.3: User Stories**
- **Agent:** `@story-agent`
- **Input:** Epics from Phase 1.2
- **Action:** Creates detailed user stories with Gherkin scenarios and story point estimates
- **Output:** `docs/planning/stories/{feature-name}-stories-{YYYYMMDD}.md`
- **Approval Gate:** `/approve` to proceed to Phase 2

---

#### **Phase 2: Architecture & Design** (2 sub-phases)

**Goal:** Design system architecture and create detailed technical specifications.

##### **Phase 2.1: Architecture Design**
- **Agent:** `@architecture-agent`
- **Input:** All Phase 1 planning artifacts (PRD, epics, stories)
- **Action:** Designs system architecture, creates ADRs, defines components and data flow
- **Output:** `docs/planning/architecture/{feature-name}-architecture-{YYYYMMDD}.md`
- **Approval Gate:** `/approve` to continue to Phase 2.2

##### **Phase 2.2: Technical Design**
- **Agent:** `@design-agent`
- **Input:** Architecture from Phase 2.1 + all Phase 1 artifacts
- **Action:** Creates detailed technical specs including API contracts, data models, file structure, and implementation details
- **Output:** `docs/planning/design/{feature-name}-design-{YYYYMMDD}.md`
- **Approval Gate:** `/approve` to proceed to Phase 3

---

#### **Phase 3: Test Strategy (TDD)**

**Goal:** Define comprehensive test strategy before implementation begins.

**Steps:**
1. `@test-design-agent` receives design and architecture documents
2. Creates test strategy with:
   - Test case specifications
   - Success criteria
   - Testing approach (unit, integration, e2e)
   - Coverage requirements
3. Defines tests BEFORE code is written (TDD approach)

**Input:** Design and architecture from Phase 2 + all Phase 1 artifacts

**Output:** `docs/planning/test-design/{feature-name}-test-design-{YYYYMMDD}.md`

**Approval Gate:** `/approve` to proceed to Phase 4 (implementation)

---

#### **Phase 4: Implementation**

**Goal:** Implement the feature according to approved designs and test strategy.

**Steps:**
1. Orchestrator routes to appropriate development agents based on feature type:
   - `@docs-agent` for documentation changes
   - `@refactor-agent` for template improvements
   - `@api-agent` for API endpoints
   - Direct implementation for simple changes
2. Agent implements feature following:
   - Design specifications from Phase 2.2
   - Test strategy from Phase 3
   - Architecture from Phase 2.1
3. Implementation is completed and verified

**Input:** All planning artifacts from Phases 1-3

**Output:** Implemented code, templates, or documentation

**Approval Gate:** `/approve` to proceed to Phase 5 (review)

---

#### **Phase 5: Review & Quality Assurance** (2 sub-phases)

**Goal:** Ensure quality, consistency, and complete documentation.

##### **Phase 5.1: Code Review**
- **Agent:** `@review-agent`
- **Input:** Implemented changes from Phase 4
- **Action:** Reviews code for quality, best practices, consistency, and potential issues
- **Output:** Review feedback and approval (or requested changes)
- **Approval Gate:** `/approve` to continue to Phase 5.2 (or address feedback first)

##### **Phase 5.2: Documentation Update**
- **Agent:** `@docs-agent`
- **Input:** Implemented changes + review feedback
- **Action:** Updates README, examples, and all relevant documentation to reflect changes
- **Output:** Updated documentation
- **Result:** **Workflow Complete** ✅

---

### Workflow Commands

| Command | Description | Usage |
|---------|-------------|-------|
| `/approve` | Approve current phase artifact and proceed to next phase | Type when ready to move forward |
| `/skip` | Skip current phase and proceed to next phase | Use when phase is not needed |
| `/status` | Show current workflow state and phase | Check progress at any time |
| `/restart` | Restart workflow from beginning | Start over if needed |

### Example: Phase Transition

```
Orchestrator:
✅ Phase 1.1 Complete: Product Requirements Document

📄 Artifact Created: docs/planning/prd/oauth2-auth-20240115.md

📋 Summary: Created comprehensive PRD defining OAuth2 authentication 
system with social login, MFA support, and session management.

⏭️  Next: Phase 1.2 - Epic Breakdown (@epic-agent)

To proceed, type:
- `/approve` - Move to Phase 1.2 (Epic Breakdown)
- `/skip` - Skip to Phase 1.2
- `/status` - View workflow state

User: /approve

Orchestrator: ✓ Phase 1.1 approved. Starting Phase 1.2...
Invoking @epic-agent with PRD context...
```

### Planning Artifacts Structure

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

---

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
│       ├── inference-agent.md     # Model inference and serving
│       ├── pytorch-agent.md       # PyTorch neural networks
│       ├── tensorflow-agent.md    # TensorFlow/Keras models
│       ├── pytorch-lightning-agent.md  # Lightning structured training
│       └── torchgeo-agent.md      # Geospatial deep learning
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

### Cursor IDE

- **Output:** Multiple `.mdc` files (Markdown Cursor format) in `.cursor/agents/`
- **YAML Frontmatter:** Cursor-specific format with `description`, `globs`, `alwaysApply` (no `triggers` or `handoffs`)
- **Invocation:** Cursor uses agents automatically based on context and file patterns
- **Handoffs:** Not supported (Cursor handles routing internally)
- **Additional:** Can use `.cursorrules` file in project root for global project instructions

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
| **pytorch-agent** | `torch` or `pytorch` in dependencies, `import torch` statements, or `.pt/.pth` files |
| **tensorflow-agent** | `tensorflow` in dependencies, `import tensorflow` statements, or `.h5/.pb` files |
| **pytorch-lightning-agent** | `pytorch-lightning` or `lightning` in dependencies, or LightningModule classes |
| **torchgeo-agent** | `torchgeo` in dependencies, `import torchgeo` statements, or geospatial datasets |
| **metaflow-agent** | `metaflow` in dependencies or Flow class with `@step` decorators |

### Robotics Agents
| Agent | Created When |
|-------|-------------|
| **robotics-cpp-agent** | `CMakeLists.txt`, `*.cpp/*.hpp` files, or C++ project structure |
| **robotics-ros-agent** | `package.xml` (ROS package), `launch/` directory, or ROS dependencies |
| **robotics-jetson-agent** | `*.cu` (CUDA files), TensorRT usage, or Jetson-specific patterns |

## Skill Detection Rules

The generator also creates skills based on project needs. Skills auto-activate based on keywords:

### Testing & Quality Skills
| Skill | Created When | Auto-Activates On |
|-------|-------------|-------------------|
| **pytest-setup** | Python project without pytest fully configured | "set up pytest", "configure pytest", "install pytest" |
| **run-tests** | Any project with test framework | "run tests", "execute tests", "test command" |
| **debug-test-failures** | Any project with tests | "debug test", "test failing", "fix failing test" |

### Development Workflow Skills
| Skill | Created When | Auto-Activates On |
|-------|-------------|-------------------|
| **local-dev-setup** | Any project | "dev setup", "local environment", "install dependencies" |
| **code-formatting** | Linter/formatter configs detected | "format code", "fix formatting", "run formatter" |
| **git-workflow** | Any Git repository | "git workflow", "commit message", "branch strategy" |

### DevOps Skills
| Skill | Created When | Auto-Activates On |
|-------|-------------|-------------------|
| **ci-pipeline** | `.github/workflows/` or CI/CD configs exist | "CI pipeline", "GitHub Actions", "CI failing" |

**Skills output location:** `.claude/skills/` (works across GitHub Copilot, Claude Code, and Cursor IDE)

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
| `{{pytorch_version}}` | PyTorch version | "2.0.0", "2.1.0" |
| `{{tensorflow_version}}` | TensorFlow version | "2.13.0", "2.14.0" |
| `{{lightning_version}}` | PyTorch Lightning version | "2.0.0", "2.1.0" |
| `{{torchgeo_version}}` | TorchGeo version | "0.5.0", "0.5.1" |
| `{{cuda_available}}` | CUDA availability | "Yes (CUDA 11.8)", "No" |
| `{{gpu_available}}` | GPU availability | "Yes (1 GPU)", "No" |
| `{{accelerator}}` | Training accelerator | "cuda", "mps", "cpu" |
| `{{metaflow_version}}` | Metaflow version | "2.11.0" |
| `{{flows_dirs}}` | Metaflow pipeline directories | "`flows/`, `workflows/`" |
| `{{execution_environment}}` | Metaflow execution target | "local", "AWS Batch", "Kubernetes" |
| `{{run_flow_command}}` | Command to run Metaflow flow | "python my_flow.py run" |

### Coding Standards Placeholders
| Placeholder | Description | Example Values |
|-------------|-------------|----------------|
| `{{naming_convention}}` | General naming pattern | "snake_case (Python)", "camelCase (JS)" |
| `{{file_naming}}` | File naming convention | "snake_case", "camelCase", "kebab-case" |
| `{{function_naming}}` | Function naming style | "snake_case", "camelCase" |
| `{{variable_naming}}` | Variable naming style | "snake_case", "camelCase" |
| `{{class_naming}}` | Class naming style | "PascalCase" |
| `{{constant_naming}}` | Constant naming style | "UPPER_SNAKE_CASE" |
| `{{line_length}}` | Maximum line length | "88", "80", "120" |
| `{{docstring_style}}` | Documentation style | "Google", "NumPy", "Sphinx", "JSDoc" |
| `{{quote_style}}` | String quote preference | "single", "double" |
| `{{indentation}}` | Indentation style | "4 spaces", "2 spaces", "tabs" |
| `{{semicolons}}` | Semicolon usage (JS/TS) | "required", "optional" |
| `{{architecture_pattern}}` | Project architecture | "MVC", "Service Layer", "Clean Architecture" |

**Detection Sources:**
1. Standards files: `CONTRIBUTING.md`, `STYLE.md`, `STYLEGUIDE.md`
2. Linter configs: `.eslintrc`, `.prettierrc`, `ruff.toml`, `pyproject.toml`
3. Code analysis: Patterns detected from actual source files
4. Editor config: `.editorconfig` for basic formatting rules

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

**Note:** The `triggers` and `handoffs` sections are VS Code-specific and will be automatically stripped when generating for Claude Code or Cursor IDE. For Cursor, the YAML frontmatter is converted to include `description`, `globs`, and `alwaysApply` fields instead.

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

**Note:** Handoffs are a VS Code (GitHub Copilot) feature and are automatically stripped when generating for Claude Code or Cursor IDE.

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
- **metaflow-agent**: ML workflow orchestration, experiment tracking, pipeline management

## Example Generated Output

For a Python ML project, the generator might produce different output formats based on the target platform:

### VS Code (GitHub Copilot) Format

```markdown
---
name: test-agent
model: claude-4-5-sonnet
description: Test engineer specializing in writing tests for ML pipelines
triggers:
  - pytest configuration detected
  - test files present
handoffs:
  - target: review-agent
    label: "Review Tests"
    prompt: "Please review the test coverage and quality"
    send: false
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

### Claude Code Format

```markdown
---
name: test-agent
model: claude-4-5-sonnet
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

### Cursor IDE Format (test-agent.mdc)

```markdown
---
description: Test engineer specializing in writing tests for ML pipelines in this Python ML project
globs:
  - "tests/**/*.py"
  - "test_*.py"
  - "src/**/*.py"
alwaysApply: false
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

## Copilot Instructions Setup

This repository uses GitHub Copilot's custom instructions feature to provide context-aware guidance. The setup includes:

- **Repository-wide instructions** (`.github/copilot-instructions.md`) - General conventions and project context
- **Path-specific instructions** (`.github/instructions/*.instructions.md`) - Targeted guidance for templates and documentation
- **Agent definitions** (`.github/agents/*.md`) - Specialized agents for specific tasks

For detailed information about how Copilot instructions are configured in this repository, see:

**📖 [Copilot Instructions Setup Guide](.github/COPILOT-SETUP.md)**

## Contributing

To improve the templates or add new agents:

1. Test changes on diverse repository types
2. Ensure templates work with multiple tech stacks
3. Keep placeholders consistent across templates
4. Update detection rules in agent-generator.md
5. Follow the guidelines in [Copilot Instructions Setup Guide](.github/COPILOT-SETUP.md)

## References

- [GitHub Blog: How to Write Great Agents.md](https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/)
- [GitHub Copilot Documentation](https://docs.github.com/en/copilot)
- [Cursor IDE Documentation - Rules](https://cursor.com/docs/context/rules)
- [Cursor IDE Documentation - Subagents](https://cursor.com/docs/context/subagents)
- [Adding Repository Custom Instructions](https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions)
- [Best Practices for Copilot Coding Agent](https://docs.github.com/en/copilot/tutorials/coding-agent/get-the-best-results)
