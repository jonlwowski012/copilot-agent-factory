import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs/promises';

export async function configureSettings(context: vscode.ExtensionContext): Promise<void> {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
        vscode.window.showErrorMessage('No workspace folder open');
        return;
    }

    const workspaceRoot = workspaceFolders[0].uri.fsPath;
    const configPath = path.join(workspaceRoot, '.github', 'agent-config.yml');

    // Check if config file exists
    let configExists = false;
    try {
        await fs.stat(configPath);
        configExists = true;
    } catch {
        // File doesn't exist
    }

    const action = await vscode.window.showQuickPick(
        [
            { label: 'Edit Configuration', description: 'Open agent-config.yml for editing' },
            { label: 'Create Template', description: 'Create a new agent-config.yml from template' },
            { label: 'Extension Settings', description: 'Open VSCode extension settings' }
        ],
        {
            placeHolder: 'Choose configuration option',
            title: 'Configure Agent Settings'
        }
    );

    if (!action) {
        return;
    }

    switch (action.label) {
        case 'Edit Configuration':
            if (configExists) {
                const doc = await vscode.workspace.openTextDocument(configPath);
                await vscode.window.showTextDocument(doc);
            } else {
                const create = await vscode.window.showWarningMessage(
                    'agent-config.yml does not exist. Create it?',
                    'Yes', 'No'
                );
                if (create === 'Yes') {
                    await createConfigTemplate(configPath);
                }
            }
            break;

        case 'Create Template':
            await createConfigTemplate(configPath);
            break;

        case 'Extension Settings':
            await vscode.commands.executeCommand('workbench.action.openSettings', 'copilot-agent-factory');
            break;
    }
}

async function createConfigTemplate(configPath: string): Promise<void> {
    const template = `# Copilot Agent Factory Configuration
# Override auto-detection and customize agent generation

agents:
  # Explicitly include specific agents
  include:
    # - ml-trainer
    # - data-prep
    # - api-agent
  
  # Exclude agents from auto-detection
  exclude:
    # - performance-agent
    # - security-agent

# Override detected values
overrides:
  # Tech stack description
  # tech_stack: "Python 3.11, PyTorch 2.1, FastAPI"
  
  # Custom commands
  # test_command: "pytest -v --cov=src"
  # lint_command: "ruff check --fix ."
  # build_command: "npm run build"
  
  # Directory paths
  # source_dirs: "src, lib"
  # test_dirs: "tests, __tests__"
  
  # Per-agent model overrides
  # agent_models:
  #   test-agent: "claude-4-5-sonnet"
  #   review-agent: "claude-4-5-opus"
`;

    // Ensure .github directory exists
    await fs.mkdir(path.dirname(configPath), { recursive: true });
    await fs.writeFile(configPath, template, 'utf-8');

    const doc = await vscode.workspace.openTextDocument(configPath);
    await vscode.window.showTextDocument(doc);

    vscode.window.showInformationMessage('Created agent-config.yml template');
}
