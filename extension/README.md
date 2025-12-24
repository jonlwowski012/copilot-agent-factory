# Copilot Agent Factory - VSCode Extension

VSCode extension that automatically generates customized GitHub Copilot agents for your project based on detected tech stack and configuration.

## Features

- 🔍 **Auto-detect** project tech stack, frameworks, and tools
- 🤖 **Generate** 20+ specialized Copilot agents tailored to your stack
- 🎯 **Interactive selection** with checkboxes and multi-select
- 🎨 **Model customization** - Choose Sonnet (fast) or Opus (advanced reasoning) per agent
- 📊 **Tech stack preview** - See what the scanner detects before generating
- 🌲 **TreeView sidebar** - Visual agent browser showing available/generated status
- ⚙️ **Configuration editor** - GUI for creating/editing `agent-config.yml`
- 📦 **20+ bundled templates** - API, ML, mobile, frontend, DevOps agents and more

## Installation

### For Testing/Development
```bash
cd extension
npm install
npm run compile
# Press F5 in VSCode to launch Extension Development Host
```

### For Distribution
```bash
npm install -g @vscode/vsce
vsce package
code --install-extension copilot-agent-factory-0.1.0.vsix
```

## Usage

### Quick Start
1. Open your project workspace in VSCode
2. Open Command Palette (`Cmd+Shift+P` or `Ctrl+Shift+P`)
3. Run: `Copilot Agent Factory: Generate Agents`
4. Select agents from the quick-pick dialog
5. Optionally customize models per agent
6. Generated agents appear in `.github/agents/`

### Available Commands

| Command | Description |
|---------|-------------|
| **Generate Copilot Agents** | Full generation workflow with auto-detection and interactive selection |
| **Scan Repository** | Preview detected tech stack, commands, and directory structure |
| **Select Agents to Generate** | Manual agent selection with model customization UI |
| **Configure Agent Settings** | Create/edit `agent-config.yml` with template |

### Agent Tree View

Click the **Copilot Agent Factory** icon in the Activity Bar (left sidebar) to:
- Browse all available agent templates
- See which agents are already generated (✓ checkmark)
- Refresh the list after generation
- Quick access to agent management

## Configuration

### Extension Settings

Configure via VSCode settings (`Cmd+,`):

```jsonc
{
  "copilot-agent-factory.outputDirectory": ".github/agents",
  "copilot-agent-factory.autoDetectTechStack": true,
  "copilot-agent-factory.defaultModel": "claude-4-5-sonnet",
  "copilot-agent-factory.templateSource": "bundled"
}
```

### Workspace Configuration

Create `.github/agent-config.yml` in your project:

```yaml
agents:
  # Explicitly include specific agents
  include:
    - ml-trainer
    - data-prep
    - api-agent
  
  # Exclude agents from auto-detection
  exclude:
    - performance-agent

# Override auto-detected values
overrides:
  tech_stack: "Python 3.11, PyTorch 2.1, FastAPI"
  test_command: "pytest -v --cov=src"
  lint_command: "ruff check --fix ."
  build_command: "poetry build"
```

## How It Works

### 1. **Repository Scanning**
   - Detects languages by file extensions (`.py`, `.ts`, `.java`, etc.)
   - Identifies frameworks from `package.json`, `pyproject.toml`, etc.
   - Extracts build/test/lint commands from config files
   - Maps directory structure (`src/`, `tests/`, `docs/`, etc.)

### 2. **Agent Selection**
   - Auto-selects relevant agents based on project type:
     - **ML projects** → ml-trainer, data-prep, eval-agent, inference-agent
     - **API projects** → api-agent, security-agent, database-agent
     - **Frontend** → React/Vue/Angular-specific agents
     - **Mobile** → iOS/Flutter/React Native agents
   - Core agents (orchestrator, review, debug, refactor) included for all projects

### 3. **Template Processing**
   - Loads 20+ bundled agent templates
   - Replaces `{{placeholders}}` with detected values:
     - `{{tech_stack}}` → "Python 3.11, FastAPI, PostgreSQL"
     - `{{test_command}}` → "pytest -v"
     - `{{source_dirs}}` → "src"
   - Generates orchestrator with active agent table

### 4. **File Generation**
   - Creates `.github/agents/` directory
   - Writes customized agent.md files
   - Updates TreeView with generation status

## Supported Project Types

| Type | Auto-Generated Agents |
|------|----------------------|
| **Python** | test, lint, docs, review, debug (+ pytest, black, ruff, mypy if detected) |
| **Node.js/TypeScript** | test, lint, docs, review (+ Jest, ESLint, Prettier if detected) |
| **API/Backend** | api-agent, security-agent, database-agent, performance-agent |
| **Machine Learning** | ml-trainer, data-prep, eval-agent, inference-agent |
| **React** | frontend-react-agent (hooks, TypeScript, component patterns) |
| **Vue.js** | frontend-vue-agent (Composition API, TypeScript) |
| **Angular** | frontend-angular-agent (RxJS, standalone components) |
| **Mobile iOS** | mobile-ios-agent (Swift, SwiftUI, UIKit) |
| **Flutter** | mobile-flutter-agent (Dart, widgets, state management) |
| **React Native** | mobile-react-native-agent (cross-platform patterns) |
| **DevOps** | devops-agent (when CI/CD or Docker detected) |

## Architecture

```
extension/
├── src/
│   ├── scanner/              # Project detection modules
│   │   ├── fileDetector.ts      # Scan for package.json, pyproject.toml, etc.
│   │   ├── techStackDetector.ts # Identify languages and frameworks
│   │   ├── commandExtractor.ts  # Extract build/test/lint commands
│   │   ├── directoryMapper.ts   # Map src/, tests/, docs/ structure
│   │   └── projectScanner.ts    # Orchestrate scanning workflow
│   ├── generator/            # Template processing
│   │   ├── templateEngine.ts    # Load templates & replace {{placeholders}}
│   │   ├── agentSelector.ts     # Choose relevant agents
│   │   └── agentWriter.ts       # Write .md files to disk
│   ├── commands/             # Command implementations
│   │   ├── generateAgents.ts    # Main generation workflow
│   │   ├── scanRepository.ts    # Show detected tech stack
│   │   ├── selectAgents.ts      # Manual selection UI
│   │   └── configureSettings.ts # Config file editor
│   ├── views/
│   │   └── agentTreeProvider.ts # TreeView sidebar
│   └── templates/            # 20+ bundled agent templates
└── resources/
    └── icon.png              # Extension icon
```

## Development

### Building
```bash
npm install          # Install dependencies
npm run compile      # Compile TypeScript → JavaScript
npm run watch        # Auto-recompile on changes
npm run lint         # Check code quality
```

### Testing
```bash
# Launch Extension Development Host
code .
# Press F5 (or Run → Start Debugging)
# New VSCode window opens with extension loaded
```

### Packaging
```bash
npm install -g @vscode/vsce
vsce package
# Creates copilot-agent-factory-0.1.0.vsix
```

## Roadmap

- [ ] GitHub Copilot Chat integration (`@agent-factory` participant)
- [ ] Diff preview before overwriting existing agents
- [ ] Template fetch from GitHub (in addition to bundled)
- [ ] Custom template directory support
- [ ] Agent validation and testing
- [ ] Marketplace publication

## Related

- [Main Project README](../README.md) - Agent-based generator approach
- [Agent Templates](src/templates/) - 20+ specialized agent templates
- [Implementation Notes](IMPLEMENTATION.md) - Technical implementation details

## License

MIT
