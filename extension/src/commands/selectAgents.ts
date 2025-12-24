import * as vscode from 'vscode';
import * as path from 'path';
import { AgentTreeProvider } from '../views/agentTreeProvider';
import { TemplateEngine } from '../generator/templateEngine';
import { AgentTemplate } from '../types';

interface AgentQuickPickItem extends vscode.QuickPickItem {
    agent: AgentTemplate;
    model?: string;
}

export async function selectAgents(
    context: vscode.ExtensionContext,
    treeProvider: AgentTreeProvider
): Promise<void> {
    const templatesDir = path.join(context.extensionPath, '..', 'agents', 'templates');
    const templateEngine = new TemplateEngine(templatesDir);
    const availableAgents = await templateEngine.loadAllTemplates();

    if (availableAgents.length === 0) {
        vscode.window.showErrorMessage('No agent templates found');
        return;
    }

    // Step 1: Select which agents to include
    const agentItems: AgentQuickPickItem[] = availableAgents.map(agent => ({
        label: agent.name,
        description: agent.model,
        detail: agent.description,
        picked: false,
        agent
    }));

    const selectedItems = await vscode.window.showQuickPick(agentItems, {
        canPickMany: true,
        placeHolder: 'Select agents to configure',
        title: 'Agent Selection'
    });

    if (!selectedItems || selectedItems.length === 0) {
        return;
    }

    // Step 2: Optionally customize model for each agent
    const customizeModels = await vscode.window.showQuickPick(['Yes', 'No'], {
        placeHolder: 'Customize models for selected agents?',
        title: 'Model Configuration'
    });

    if (customizeModels === 'Yes') {
        for (const item of selectedItems) {
            const model = await vscode.window.showQuickPick(
                [
                    {
                        label: 'claude-4-5-sonnet',
                        description: 'Fast, efficient for task-focused agents',
                        picked: item.agent.model === 'claude-4-5-sonnet'
                    },
                    {
                        label: 'claude-4-5-opus',
                        description: 'Advanced reasoning for complex agents',
                        picked: item.agent.model === 'claude-4-5-opus'
                    }
                ],
                {
                    placeHolder: `Select model for ${item.agent.name}`,
                    title: `Model for ${item.agent.name}`
                }
            );

            if (model) {
                item.model = model.label;
                item.description = model.label;
            }
        }
    }

    // Save selection to workspace state
    const selection = selectedItems.map(item => ({
        name: item.agent.name,
        model: item.model || item.agent.model
    }));

    await context.workspaceState.update('selectedAgents', selection);

    vscode.window.showInformationMessage(
        `Selected ${selection.length} agents. Run "Generate Copilot Agents" to create them.`,
        'Generate Now'
    ).then(choice => {
        if (choice === 'Generate Now') {
            vscode.commands.executeCommand('copilot-agent-factory.generateAgents');
        }
    });
}
