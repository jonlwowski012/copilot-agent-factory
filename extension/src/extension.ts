import * as vscode from 'vscode';
import { AgentTreeProvider } from './views/agentTreeProvider';
import { generateAgents } from './commands/generateAgents';
import { scanRepository } from './commands/scanRepository';
import { selectAgents } from './commands/selectAgents';
import { configureSettings } from './commands/configureSettings';

export function activate(context: vscode.ExtensionContext) {
    console.log('Copilot Agent Factory extension is now active');
    vscode.window.showInformationMessage('Copilot Agent Factory activated!');

    // Initialize agent tree view
    const agentTreeProvider = new AgentTreeProvider(context);
    const treeView = vscode.window.createTreeView('copilot-agent-factory.agentTree', {
        treeDataProvider: agentTreeProvider,
        canSelectMany: true
    });

    // Register commands
    context.subscriptions.push(
        vscode.commands.registerCommand('copilot-agent-factory.generateAgents', () => 
            generateAgents(context, agentTreeProvider)
        ),
        vscode.commands.registerCommand('copilot-agent-factory.scanRepository', () => 
            scanRepository(context)
        ),
        vscode.commands.registerCommand('copilot-agent-factory.selectAgents', () => 
            selectAgents(context, agentTreeProvider)
        ),
        vscode.commands.registerCommand('copilot-agent-factory.configureSettings', () => 
            configureSettings(context)
        ),
        vscode.commands.registerCommand('copilot-agent-factory.refreshAgents', () => 
            agentTreeProvider.refresh()
        ),
        treeView
    );

    // Auto-detect tech stack on workspace open if configured
    const config = vscode.workspace.getConfiguration('copilot-agent-factory');
    if (config.get<boolean>('autoDetectTechStack')) {
        scanRepository(context);
    }
}

export function deactivate() {
    console.log('Copilot Agent Factory extension is now deactivated');
}
