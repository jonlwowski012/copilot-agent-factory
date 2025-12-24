import * as vscode from 'vscode';
import * as path from 'path';
import { ProjectScanner } from '../scanner/projectScanner';
import { TemplateEngine } from '../generator/templateEngine';
import { AgentSelector } from '../generator/agentSelector';
import { AgentWriter } from '../generator/agentWriter';
import { AgentTreeProvider } from '../views/agentTreeProvider';
import { AgentTemplate } from '../types';

export async function generateAgents(
    context: vscode.ExtensionContext,
    treeProvider: AgentTreeProvider
): Promise<void> {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
        vscode.window.showErrorMessage('No workspace folder open');
        return;
    }

    const workspaceRoot = workspaceFolders[0].uri.fsPath;
    const config = vscode.workspace.getConfiguration('copilot-agent-factory');
    const outputDir = path.join(workspaceRoot, config.get<string>('outputDirectory') || '.github/agents');

    await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: 'Generating Copilot Agents',
        cancellable: false
    }, async (progress) => {
        try {
            // Step 1: Scan project
            progress.report({ message: 'Scanning project...', increment: 10 });
            const scanner = new ProjectScanner(workspaceRoot);
            const projectContext = await scanner.scanProject();

            // Step 2: Select agents
            progress.report({ message: 'Selecting agents...', increment: 20 });
            const templatesDir = path.join(context.extensionPath, '..', 'agents', 'templates');
            const templateEngine = new TemplateEngine(templatesDir);
            const agentSelector = new AgentSelector(templateEngine);
            
            let selectedAgents = await agentSelector.selectAgents(projectContext);

            // Step 3: Let user customize selection
            progress.report({ message: 'Waiting for agent selection...', increment: 10 });
            const customSelection = await showAgentSelectionDialog(selectedAgents);
            if (customSelection) {
                selectedAgents = selectedAgents.filter(a => customSelection.includes(a.name));
            }

            if (selectedAgents.length === 0) {
                vscode.window.showInformationMessage('No agents selected');
                return;
            }

            // Step 4: Generate content with placeholders
            progress.report({ message: 'Generating agent content...', increment: 20 });
            const agentNames = selectedAgents.map(a => a.name);
            const placeholders = templateEngine.buildPlaceholderValues(projectContext, agentNames);
            
            const generatedContents = new Map<string, string>();
            for (const agent of selectedAgents) {
                const content = templateEngine.replacePlaceholders(agent, placeholders);
                generatedContents.set(agent.name, content);
            }

            // Step 5: Preview or write
            progress.report({ message: 'Writing agents...', increment: 20 });
            const writer = new AgentWriter(outputDir);
            
            const writtenPaths = await writer.writeAllAgents(
                selectedAgents, 
                generatedContents,
                (current, total, agent) => {
                    progress.report({ 
                        message: `Writing ${agent} (${current}/${total})...`,
                        increment: 20 / total
                    });
                }
            );

            // Update tree view
            for (const agent of selectedAgents) {
                treeProvider.markAsGenerated(agent.name);
            }

            progress.report({ message: 'Done!', increment: 20 });
            
            vscode.window.showInformationMessage(
                `Generated ${writtenPaths.length} agents in ${outputDir}`,
                'Open Folder'
            ).then(selection => {
                if (selection === 'Open Folder') {
                    vscode.commands.executeCommand('revealInExplorer', vscode.Uri.file(outputDir));
                }
            });

        } catch (error) {
            vscode.window.showErrorMessage(`Failed to generate agents: ${error}`);
            console.error('Agent generation error:', error);
        }
    });
}

async function showAgentSelectionDialog(agents: AgentTemplate[]): Promise<string[] | undefined> {
    const items = agents.map(agent => ({
        label: agent.name,
        description: agent.model,
        detail: agent.description,
        picked: true
    }));

    const selected = await vscode.window.showQuickPick(items, {
        canPickMany: true,
        placeHolder: 'Select agents to generate (pre-selected based on project detection)',
        title: 'Agent Selection'
    });

    return selected?.map(item => item.label);
}
