# Copilot Agent Factory 🏭

**Auto-generate customized GitHub Copilot agents for any repository in seconds.**

Transform any codebase into an AI-powered development environment by automatically detecting your tech stack, frameworks, and patterns, then generating perfectly tailored GitHub Copilot agents that understand your project's specific needs.

## What is this?

Instead of manually writing agent.md files for each project, Copilot Agent Factory:

- 🔍 **Scans your repository** to detect languages, frameworks, and tools
- 🎯 **Selects relevant agents** based on detected patterns (API, ML, testing, etc.)
- 🛠️ **Customizes templates** with your repo-specific commands and structure
- ⚡ **Outputs ready-to-use agents** that know your codebase inside and out

**Result:** Your Copilot agents become domain experts for your specific project, not generic assistants.

---

## Quick Start

### 1. Copy to Your Repository

**Important:** GitHub Copilot agents must be placed in the `.github/agents/` directory of your repository to function properly.

```bash
# From this project, copy the agents to your target repo
cp -r .github/agents /path/to/your/repo/.github/
```

### 2. Generate Customized Agents

Invoke the agent-generator in your repository:

```
@agent-generator Analyze this repository and generate all appropriate agent.md files.
```

The generator will:
1. Scan your repository structure
2. Detect tech stack, frameworks, and tools
3. Extract build/test/lint commands from configs
4. Select relevant agents based on detected patterns
5. Customize templates with repo-specific values
6. Output ready-to-use agent files

### 3. Use Your Agents

Once generated, invoke agents directly:

```
@orchestrator Help me plan a new feature implementation
@test-agent Write tests for the UserService class
@lint-agent Fix all style issues in src/
@docs-agent Update the README with new API endpoints
@review-agent Review my changes before I create a PR
```

## Directory Structure

```
.github/agents/
├── agent-generator.md    # Meta-agent that creates other agents
├── orchestrator.md       # Coordinates all agents
└── templates/            # Agent templates with {{placeholders}}
    ├── docs-agent.md     # Documentation and technical writing
    ├── test-agent.md     # Testing and coverage
    ├── lint-agent.md     # Code formatting and style
    ├── review-agent.md   # Code review and best practices
    ├── api-agent.md      # API development
    ├── ml-trainer.md     # ML model training
    ├── data-prep.md      # Data preprocessing
    ├── eval-agent.md     # Model evaluation
    └── inference-agent.md # Model inference and serving
```

## Agent Detection Rules

The generator creates agents based on detected patterns:

| Agent | Created When |
|-------|-------------|
| **docs-agent** | `docs/` exists, README present, or docstrings found |
| **test-agent** | `tests/` exists, test framework in deps, or `*_test.*` files |
| **lint-agent** | Linter configs exist (ruff, eslint, prettier, etc.) |
| **review-agent** | Always created (universal need) |
| **api-agent** | API framework detected or `api/` directory present |
| **ml-trainer** | `train.py`, `training/`, or ML framework in deps |
| **data-prep** | `data/` directory or data processing libraries |
| **eval-agent** | `eval.py`, `metrics/`, or ML framework detected |
| **inference-agent** | `inference.py`, `predict.py`, or model serving patterns |

## Template Placeholders

Templates use `{{placeholder}}` markers that get replaced with detected values:

| Placeholder | Description | Example Values |
|-------------|-------------|----------------|
| `{{tech_stack}}` | Languages, frameworks, versions | "Python 3.10, PyTorch 2.0, FastAPI" |
| `{{source_dirs}}` | Source code locations | "`src/`, `lib/`" |
| `{{test_dirs}}` | Test file locations | "`tests/`, `__tests__/`" |
| `{{test_command}}` | Test execution command | "pytest -v", "npm test" |
| `{{lint_command}}` | Linting command | "ruff check --fix .", "eslint --fix" |
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
- Coordinates multi-step workflows
- Manages handoffs between agents
- Provides high-level guidance

### Core Agents
- **docs-agent**: READMEs, API docs, docstrings, comments
- **test-agent**: Unit tests, integration tests, coverage
- **lint-agent**: Formatting, style fixes, import sorting
- **review-agent**: Code review, best practices, security
- **api-agent**: Endpoints, validation, error handling

### ML Agents
- **ml-trainer**: Training loops, hyperparameters, checkpoints
- **data-prep**: Data loading, augmentation, preprocessing
- **eval-agent**: Metrics, benchmarking, model comparison
- **inference-agent**: Prediction pipelines, serving, optimization

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
