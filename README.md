# Copilot Agent Factory 🏭

**Auto-generate customized GitHub Copilot agents AND portable Agent Skills for any repository in seconds.**

Transform any codebase into an AI-powered development environment by automatically detecting your tech stack, frameworks, and patterns, then generating perfectly tailored GitHub Copilot agents (role-based experts) and Agent Skills (workflow-based procedures) that understand your project's specific needs.

## What is this?

Instead of manually writing agent.md files and skill documentation for each project, Copilot Agent Factory:

- 🔍 **Scans your repository** to detect languages, frameworks, and tools
- 🎯 **Selects relevant agents AND skills** based on detected patterns (API, ML, testing, etc.)
- 🛠️ **Customizes templates** with your repo-specific commands and structure
- ⚡ **Outputs ready-to-use agents and skills** that know your codebase inside and out
- 🧩 **Recommends MCP servers** to supercharge agent capabilities with database access, filesystem ops, and more
- � **Generates global instruction files** (AGENT.md, copilot-instructions.md, domain-specific *.instructions.md)
- �🔄 **Manages dev workflows** with approval gates for PRD → Architecture → TDD → Development → Review
- 🌐 **Generates portable skills** that work across VS Code, CLI, and GitHub.com

**Result:** Your Copilot becomes both a domain expert (agents) and a workflow guide (skills) for your specific project.

> **NEW:** 🧩 **MCP Server Auto-Detection** - Automatically recommends Model Context Protocol servers (database access, filesystem ops, container management, etc.) to supercharge agent capabilities. See [MCP Servers Guide](docs/MCP-SERVERS.md).

---

## 🚀 Quick Start

**Get started in 3 steps:**

1. **Copy templates to your repository:**
   ```bash
   cp -r .github/agents /path/to/your/repo/.github/
   cp -r agents/skill-templates /path/to/your/repo/.github/skills/
   ```

2. **Generate customized configuration:**
   ```
   @agent-generator Analyze this repository and generate all appropriate agents, skills, and mcp servers.
   ```
   This creates: agent files, skills, MCP config, AGENT.md, copilot-instructions.md, and domain-specific *.instructions.md

3. **Start using agents:**
   ```
   @orchestrator Start a new feature: [your feature description]
   @test-agent Write tests for [component]
   @review-agent Review my changes
   ```

**That's it!** Your agents and skills are ready. Continue reading to understand how everything works.

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

## MCP Server Auto-Detection

The agent factory automatically detects and recommends **Model Context Protocol (MCP) servers** to enhance your agents' capabilities:

### What are MCP Servers?

MCP servers extend GitHub Copilot's abilities by providing:
- 📦 **Direct database access** - Query PostgreSQL, MySQL, SQLite without writing code
- 📁 **Filesystem operations** - Read/write files, browse directories efficiently  
- 💻 **Enhanced language support** - Deep Python analysis with Pylance
- 🐳 **Container management** - Inspect and control Docker containers
- ☁️ **Cloud operations** - Manage AWS, GCP, Azure resources
- 🔗 **Integration tools** - Connect to GitHub, Slack, Google services

### Auto-Detection in Action

When you run `@agent-generator`, it automatically:

**Always Recommends (Essential):**
- `@modelcontextprotocol/server-git` - For any git repository
- `@modelcontextprotocol/server-filesystem` - File operations

**Detects and Recommends Based on Your Stack:**

| You Have | We Recommend | Why |
|----------|--------------|-----|
| PostgreSQL/MySQL config | `@modelcontextprotocol/server-postgres` | Direct database queries |
| Python project | `@modelcontextprotocol/server-pylance` | Enhanced type checking |
| Dockerfile | `@modelcontextprotocol/server-docker` | Container management |
| `.github/workflows/` | `@modelcontextprotocol/server-github` | GitHub operations |
| `k8s/` or `kubernetes/` | `@modelcontextprotocol/server-kubernetes` | Cluster management |
| AWS SDK in deps | `@modelcontextprotocol/server-aws` | Cloud resource ops |
| Slack SDK | `@modelcontextprotocol/server-slack` | Slack integration |
| Puppeteer in deps | `@modelcontextprotocol/server-puppeteer` | Browser automation |

### Generated Configuration

The generator creates `.github/mcp-config.json`:

```json
{
  "mcpServers": {
    "git": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-git"],
      "description": "Repository operations, history, and diffs",
      "recommended": true
    },
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/repo"],
      "description": "File operations and directory browsing",
      "recommended": true
    },
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres", "postgresql://localhost/dbname"],
      "description": "Database queries and schema inspection",
      "recommended": true,
      "requiresConfig": true
    }
  }
}
```

### Setup Instructions

1. **Review** `.github/mcp-config.json` to see recommended servers
2. **Configure** connection strings for databases, cloud providers, etc.
3. **Enable** in VS Code settings or your editor's MCP configuration
4. **Restart** your editor to activate the servers

**Agents automatically know about available MCP servers** and will use them to provide richer responses.

---

## Global Instruction Files

The agent factory generates multiple instruction files to provide context to GitHub Copilot at different scopes:

### AGENT.md (Repository Root)

Root-level instructions visible to all Copilot interactions in the repository:
- High-level project overview and architecture
- Tech stack and key technologies
- Development standards and quality gates
- List of available specialized agents
- Links to MCP servers

### copilot-instructions.md (.github/)

VS Code-specific instructions for Copilot Chat:
- Code generation standards (always/never rules)
- File structure overview
- Common commands (dev, test, lint, build)
- Workflow integration guidance

### Domain-Specific Instructions (.github/instructions/)

Automatically generated based on detected technologies:

| File | Generated When | Contains |
|------|----------------|----------|
| **testing.instructions.md** | Test framework detected | Test patterns, fixtures, coverage requirements |
| **api.instructions.md** | API framework detected | Endpoint patterns, validation, error handling |
| **database.instructions.md** | Database detected | Migration workflow, query patterns, indexes |
| **frontend.instructions.md** | Frontend framework detected | Component patterns, state management, accessibility |
| **ml.instructions.md** | ML framework detected | Training patterns, reproducibility, monitoring |

### How They Work Together

```
Scope:      Global              Editor-Specific       Domain-Specific
            ↓                   ↓                     ↓
File:       AGENT.md  →  copilot-instructions.md  →  *.instructions.md
Priority:   Baseline            Overrides             Specialized
```

Copilot reads all instruction files and combines them, with more specific instructions taking precedence.

**Example hierarchy:**
- `AGENT.md`: "Follow test-driven development"
- `copilot-instructions.md`: "Always write tests alongside implementation"
- `testing.instructions.md`: "Use pytest fixtures from conftest.py"

Result: Copilot follows all three, with the most specific guidance (testing.instructions.md) taking precedence for test-related tasks.

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
4. Detect and recommend relevant MCP servers
5. Select relevant agents AND skills based on detected patterns
6. Customize templates with repo-specific values
7. Output agents to `.github/agents/` and skills to `.github/skills/`
8. Generate `.github/mcp-config.json` with recommended MCP servers
9. Generate global instruction files:
   - `AGENT.md` in repository root
   - `.github/copilot-instructions.md`
   - `.github/instructions/*.instructions.md` (domain-specific)
10. **Default behavior**: Generate BOTH agents and skills for hybrid-eligible patterns

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

## 📁 Directory Structure

```
project-root/
├── AGENT.md                          # Global agent instructions (root level)
└── .github/
    ├── agents/                       # Role-based expert agents (46 templates)
    │   ├── agent-generator.md        # Meta-agent: Creates other agents and skills
    │   ├── orchestrator.md           # Coordinator: Manages workflows and agent handoffs
    │   └── templates/                # Agent templates with {{placeholders}}
    ├── skills/                       # Workflow-based skills (7 skills)
    │   └── skill-templates/          # Portable across VS Code, CLI, GitHub.com
    ├── copilot-instructions.md       # VS Code Copilot instructions
    ├── instructions/                 # Domain-specific instructions (auto-generated)
    │   ├── testing.instructions.md
    │   ├── api.instructions.md
    │   ├── database.instructions.md
    │   ├── frontend.instructions.md
    │   └── ml.instructions.md
    └── mcp-config.json               # Auto-detected MCP server recommendations
```

---

## 🤖 Available Agent Templates (46 Total)

### 📋 Core System Agents (2)
**Always created for every repository**
- **orchestrator.md** - Central coordinator managing workflows and agent collaboration
- **agent-generator.md** - Meta-agent that analyzes repos and creates customized agents

### 📐 Planning & Design Agents (6)
**Created for structured feature development workflows**
- **prd-agent** - Product Requirements Documents with user stories and acceptance criteria
- **epic-agent** - Epic breakdown from PRDs into manageable deliverables
- **story-agent** - User stories with Gherkin scenarios and story points
- **architecture-agent** - System architecture, ADRs, and component diagrams
- **design-agent** - Technical design specifications and API contracts
- **test-design-agent** - Test strategy and TDD specifications (pre-implementation)

### 🛠️ Core Development Agents (9)
**Universal agents for common development tasks**
- **test-agent** - Unit tests, integration tests, coverage, TDD
- **docs-agent** - READMEs, API docs, docstrings, technical writing
- **lint-agent** - Code formatting, style fixes, import sorting
- **review-agent** - Code review, best practices, PR feedback
- **debug-agent** - Error investigation, log analysis, troubleshooting
- **refactor-agent** - Code restructuring, design patterns, tech debt
- **performance-agent** - Profiling, optimization, bottleneck identification
- **security-agent** - Vulnerability detection, secure coding, security audits
- **devops-agent** - CI/CD pipelines, Docker, deployments, infrastructure

### 🔌 Backend & API Agents (2)
**Created when API or database patterns detected**
- **api-agent** - REST/GraphQL endpoints, validation, error handling
- **database-agent** - Schema design, migrations, query optimization

### 📱 Mobile Development Agents (3)
**Created for mobile projects**
- **mobile-ios-agent** - iOS apps (Swift, SwiftUI, UIKit)
- **mobile-react-native-agent** - Cross-platform apps with React Native
- **mobile-flutter-agent** - Flutter/Dart apps and widgets

### 🎨 Frontend Framework Agents (3)
**Created when specific frontend frameworks detected**
- **frontend-react-agent** - React components, hooks, state management
- **frontend-vue-agent** - Vue 3, Composition API, Pinia
- **frontend-angular-agent** - Angular, RxJS, standalone components

### 🤖 ML/AI Agents (4)
**Created for machine learning projects**
- **ml-trainer** - Training loops, hyperparameters, distributed training
- **data-prep** - Data loading, augmentation, preprocessing pipelines
- **eval-agent** - Metrics, benchmarking, model comparison
- **inference-agent** - Prediction pipelines, model serving, optimization

### 🚀 Rapid Development Studio Agents (6)
**Specialized agents for fast-paced app development**
- **rapid-prototyper** - MVP builder for 6-day app cycles
- **frontend-developer** - Responsive UI specialist (React/Next.js/Tailwind)
- **mobile-app-builder** - iOS/Android/cross-platform development
- **ai-engineer** - AI/ML integration, LLM, computer vision, NLP
- **backend-architect** - Scalable APIs, databases, server-side systems
- **test-writer-fixer** - Proactive test automation (auto-triggers after code changes)

### 🎨 Design Specialists (3)
**Created for design-focused projects**
- **ui-designer** - Beautiful, implementable interface design
- **brand-guardian** - Brand consistency and visual identity
- **ux-researcher** - User research, journey mapping, usability testing

### 📊 Product & Feedback (1)
**User feedback and product insights**
- **feedback-synthesizer** - User feedback analysis and pattern identification

### 📦 Project Management (3)
**Coordination and launch management**
- **experiment-tracker** - A/B testing and feature validation (auto-triggers with flags)
- **project-shipper** - Launch coordinator for smooth releases
- **studio-producer** - Project manager keeping teams shipping efficiently

### 🏢 Studio Operations (2)
**Analytics and infrastructure**
- **analytics-reporter** - Dashboards and insights (auto-triggers on data questions)
- **infrastructure-maintainer** - DevOps and SRE (auto-triggers on incidents)

### ✅ Testing & Quality (4)
**Comprehensive testing and optimization**
- **api-tester** - API testing specialist (auto-triggers after API changes)
- **test-results-analyzer** - Test failure investigation (auto-triggers on failures)
- **tool-evaluator** - Development tool evaluation and optimization
- **workflow-optimizer** - Process improvement (auto-triggers on inefficiencies)

---

## 🎯 Available Agent Skills (7 Total)

### 🧪 Testing & Quality Skills (3)
- **creating-unit-tests/** - Auto-generates tests with framework detection
  - Includes: pytest patterns, Jest templates, framework detection script
- **debugging-test-failures/** - Systematic test debugging workflow
- **reviewing-code-changes/** - Code review checklist and best practices

### 💻 Development Workflow Skills (3)
- **creating-api-endpoints/** - REST API creation with templates
  - Includes: FastAPI and Express.js templates
- **creating-database-migrations/** - Safe migration workflow
- **designing-with-tdd/** - Test-Driven Development cycle guide

### 🐳 DevOps Skills (1)
- **setting-up-docker/** - Containerization workflow and best practices

---

## 🔌 MCP Server Integrations

### Essential Servers (Always Recommended)
| Server | Purpose | Installation |
|--------|---------|-------------|
| **git** | Repository operations, history, diffs | `npx -y @modelcontextprotocol/server-git` |
| **filesystem** | File operations, directory browsing | `npx -y @modelcontextprotocol/server-filesystem` |

### Conditional Servers (Auto-Detected Based on Your Stack)
| Server | Detects | Purpose | Installation |
|--------|---------|---------|-------------|
| **postgres** | PostgreSQL/MySQL config | Database queries and schema | `npx -y @modelcontextprotocol/server-postgres` |
| **pylance** | Python project | Enhanced type checking | `npx -y @modelcontextprotocol/server-pylance` |
| **docker** | Dockerfile | Container management | `npx -y @modelcontextprotocol/server-docker` |
| **github** | `.github/workflows/` | GitHub operations | `npx -y @modelcontextprotocol/server-github` |
| **kubernetes** | `k8s/` or `kubernetes/` | Cluster management | `npx -y @modelcontextprotocol/server-kubernetes` |
| **aws** | AWS SDK in dependencies | Cloud resource operations | `npx -y @modelcontextprotocol/server-aws` |
| **slack** | Slack SDK | Slack integration | `npx -y @modelcontextprotocol/server-slack` |
| **puppeteer** | Puppeteer in deps | Browser automation | `npx -y @modelcontextprotocol/server-puppeteer` |

**See [docs/MCP-SERVERS.md](docs/MCP-SERVERS.md) for detailed setup instructions.**

---

## 🔍 Agent & Skill Detection Rules

**The generator creates agents and skills based on detected patterns.**
**Default behavior: Generate BOTH agents and skills for hybrid-eligible patterns.**

### Quick Reference
| Category | Agents | Skills | Detection Trigger |
|----------|--------|--------|------------------|
| **Planning** | 6 | 1 | Always created |
| **Core Dev** | 9 | 3 | Framework/patterns detected |
| **Backend/API** | 2 | 2 | API framework or database |
| **Mobile** | 3 | 0 | Mobile project files |
| **Frontend** | 3 | 0 | Frontend framework |
| **ML/AI** | 4 | 0 | ML frameworks/patterns |
| **Studio** | 6 | 0 | Rapid dev patterns |
| **Design** | 3 | 0 | Design files/UI patterns |
| **Product** | 1 | 0 | User feedback data |
| **Project Mgmt** | 3 | 0 | PM/coordination needs |
| **Operations** | 2 | 0 | Analytics/infrastructure |
| **Testing** | 4 | 1 | Test framework/tooling |

### Detailed Detection Rules

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
| **mobile-flutter-agent** | `pubspec.yaml`, `lib/*.dart`, or Flutter dependencies | No skill (agent sufficient) |

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

### Engineering Department (Rapid Development Studio)
| Agent | Created When | Skill Version |
|-------|-------------|---------------|
| **rapid-prototyper** | Startup/MVP projects, or user requests rapid prototyping | No skill (requires MVP expertise) |
| **frontend-developer** | Frontend framework detected (React/Vue/Angular/Next.js) | No skill (agent sufficient) |
| **mobile-app-builder** | Mobile project detected (iOS/Android/RN/Flutter) | No skill (agent sufficient) |
| **ai-engineer** | AI/ML frameworks, LLM integration, computer vision libs | No skill (requires AI expertise) |
| **backend-architect** | Backend framework (FastAPI/Express/Django) or API detected | Uses **creating-api-endpoints** skill |
| **test-writer-fixer** | Test framework detected, auto-triggers after code changes | Uses **creating-unit-tests**, **debugging-test-failures** |

### Design Department
| Agent | Created When | Skill Version |
|-------|-------------|---------------|
| **ui-designer** | Frontend project or UI components detected | No skill (agent sufficient) |
| **visual-storyteller** | Design assets, presentations, or branding needs | No skill (agent sufficient) |
| **brand-guardian** | Branding files, style guides, or design system | No skill (agent sufficient) |
| **ux-researcher** | User research docs or UX patterns detected | No skill (agent sufficient) |
| **whimsy-injector** | Auto-triggers after UI changes to add delight | No skill (agent sufficient) |

### Design Department
| Agent | Created When | Skill Version |
|-------|-------------|---------------|
| **ui-designer** | Frontend project or UI components detected | No skill (agent sufficient) |
| **brand-guardian** | Branding files, style guides, or design system | No skill (agent sufficient) |
| **ux-researcher** | User research docs or UX patterns detected | No skill (agent sufficient) |

### Product Department
| Agent | Created When | Skill Version |
|-------|-------------|---------------|
| **feedback-synthesizer** | User feedback, surveys, or customer data | No skill (requires analysis expertise) |

### Project Management Department
| Agent | Created When | Skill Version |
|-------|-------------|---------------|
| **experiment-tracker** | A/B tests, feature flags, or experimentation detected | No skill (requires statistical analysis) |
| **project-shipper** | Release process, launch planning, or go-to-market | No skill (requires launch coordination) |
| **studio-producer** | Team coordination, project management, or agile workflow | No skill (requires PM expertise) |

### Studio Operations Department
| Agent | Created When | Skill Version |
|-------|-------------|---------------|
| **analytics-reporter** | Analytics platform, dashboards, or data warehouse detected | No skill (requires data analysis) |
| **infrastructure-maintainer** | DevOps, monitoring, or incident response detected | No skill (requires SRE expertise) |

### Testing & Quality Department
| Agent | Created When | Skill Version |
|-------|-------------|---------------|
| **api-tester** | API endpoints detected, auto-triggers after API changes | Uses **creating-api-endpoints** skill |
| **test-results-analyzer** | Test failures detected, auto-triggers on failures | Uses **debugging-test-failures** skill |
| **tool-evaluator** | Development tools, toolchain optimization | No skill (requires tool evaluation) |
| **workflow-optimizer** | Process inefficiencies, bottlenecks, or workflow issues | No skill (requires process analysis) |

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

# Customize MCP server recommendations
mcp_servers:
  include:
    - postgres
    - docker
    - kubernetes
  exclude:
    - aws
  custom:
    - name: "custom-mcp-server"
      command: "node"
      args: ["./mcp-servers/custom.js"]
      description: "Custom internal tool integration"
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

### Engineering Department (Rapid Development Studio)
- **rapid-prototyper**: MVP building, 6-day app cycles, rapid prototyping, tech stack selection (React/Next.js, Supabase, Tailwind)
- **frontend-developer**: Responsive UI development, component architecture, accessibility (WCAG), performance optimization (LCP <2.5s)
- **mobile-app-builder**: iOS/Android/cross-platform apps, React Native/Flutter, push notifications, biometric auth, 60fps performance
- **ai-engineer**: AI/ML integration, LLM usage, prompt engineering, computer vision, NLP, responsible AI, cost management
- **backend-architect**: Scalable APIs (REST/GraphQL), authentication (JWT/OAuth2), database optimization, security best practices
- **test-writer-fixer**: Proactive test automation (auto-triggers after code changes), test quality, flaky test resolution

### Design Department
- **ui-designer**: Beautiful interface design, design systems, accessibility (4.5:1 contrast), mobile-first design, rapid UI conceptualization
- **brand-guardian**: Brand consistency, visual identity systems (logo, colors, typography), cross-platform consistency, brand compliance
- **ux-researcher**: User research methodologies, user journey mapping, persona development, usability testing, behavioral insights

### Product Department
- **feedback-synthesizer**: User feedback analysis, pattern identification, sentiment analysis, prioritization matrix, behavioral correlation

### Project Management Department
- **experiment-tracker**: A/B testing, feature flag tracking, statistical significance analysis, experiment documentation, data-driven decisions (auto-triggers with flags)
- **project-shipper**: Launch coordination, release management, go-to-market execution, cross-team coordination, post-launch monitoring
- **studio-producer**: Project management, team velocity optimization, blocker removal, stakeholder management, meeting efficiency (<20% time)

### Studio Operations Department
- **analytics-reporter**: Dashboard creation, data visualization, metrics tracking (DAU/MAU, retention, revenue), insights generation (auto-triggers on data questions)
- **infrastructure-maintainer**: DevOps, site reliability (99.9% uptime), incident response (<15 min), deployment automation, monitoring (auto-triggers on incidents)

### Testing & Quality Department
- **api-tester**: API endpoint testing, contract validation, authentication testing, performance testing (<500ms P95), security testing (auto-triggers after API changes)
- **test-results-analyzer**: Test failure investigation, flaky test detection, root cause analysis, test reliability improvement (auto-triggers on failures)
- **tool-evaluator**: Development tool evaluation, toolchain optimization, TCO analysis, vendor assessment, adoption strategy
- **workflow-optimizer**: Process improvement, bottleneck identification, automation opportunities, DORA metrics, developer velocity optimization (auto-triggers on inefficiencies)

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
- [Model Context Protocol Specification](https://modelcontextprotocol.io/)
- [MCP Servers Registry](https://github.com/modelcontextprotocol/servers)
