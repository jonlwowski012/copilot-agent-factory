import * as vscode from 'vscode';
import * as path from 'path';
import { AgentTemplate } from '../types';

export class AgentTreeItem extends vscode.TreeItem {
    constructor(
        public readonly agent: AgentTemplate,
        public readonly isGenerated: boolean,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState = vscode.TreeItemCollapsibleState.None
    ) {
        super(agent.name, collapsibleState);
        
        this.tooltip = agent.description;
        this.description = agent.model;
        this.contextValue = isGenerated ? 'generatedAgent' : 'availableAgent';
        
        // Set icon based on status
        this.iconPath = new vscode.ThemeIcon(
            isGenerated ? 'check' : 'circle-outline',
            isGenerated ? new vscode.ThemeColor('testing.iconPassed') : undefined
        );

        // Add checkbox
        this.checkboxState = vscode.TreeItemCheckboxState.Unchecked;
    }
}

export class AgentTreeProvider implements vscode.TreeDataProvider<AgentTreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<AgentTreeItem | undefined | null | void> = new vscode.EventEmitter<AgentTreeItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<AgentTreeItem | undefined | null | void> = this._onDidChangeTreeData.event;

    private availableAgents: AgentTemplate[] = [];
    private generatedAgents: Set<string> = new Set();
    private context: vscode.ExtensionContext;

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
        this.loadAvailableAgents();
    }

    refresh(): void {
        this.loadAvailableAgents();
        this._onDidChangeTreeData.fire();
    }

    private async loadAvailableAgents(): Promise<void> {
        const templatesDir = path.join(this.context.extensionPath, 'src', 'templates');
        const { TemplateEngine } = await import('../generator/templateEngine');
        const templateEngine = new TemplateEngine(templatesDir);
        
        this.availableAgents = await templateEngine.loadAllTemplates();
        
        // Check which agents are already generated
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (workspaceFolders && workspaceFolders.length > 0) {
            const config = vscode.workspace.getConfiguration('copilot-agent-factory');
            const outputDir = config.get<string>('outputDirectory') || '.github/agents';
            const agentsPath = path.join(workspaceFolders[0].uri.fsPath, outputDir);
            
            const { AgentWriter } = await import('../generator/agentWriter');
            const writer = new AgentWriter(agentsPath);
            
            this.generatedAgents.clear();
            for (const agent of this.availableAgents) {
                if (await writer.agentExists(agent.name)) {
                    this.generatedAgents.add(agent.name);
                }
            }
        }
    }

    getTreeItem(element: AgentTreeItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: AgentTreeItem): Thenable<AgentTreeItem[]> {
        if (!element) {
            // Root level - show all agents
            return Promise.resolve(
                this.availableAgents.map(agent => 
                    new AgentTreeItem(
                        agent,
                        this.generatedAgents.has(agent.name)
                    )
                )
            );
        }
        
        return Promise.resolve([]);
    }

    getSelectedAgents(): string[] {
        // This will be updated by the tree view's selection handling
        return [];
    }

    getAvailableAgents(): AgentTemplate[] {
        return this.availableAgents;
    }

    isGenerated(agentName: string): boolean {
        return this.generatedAgents.has(agentName);
    }

    markAsGenerated(agentName: string): void {
        this.generatedAgents.add(agentName);
        this._onDidChangeTreeData.fire();
    }
}
