import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs/promises';
import { AgentTemplate, PlaceholderValues } from '../types';

export class AgentWriter {
    private outputDir: string;

    constructor(outputDir: string) {
        this.outputDir = outputDir;
    }

    async writeAgent(agent: AgentTemplate, content: string): Promise<string> {
        // Ensure output directory exists
        await fs.mkdir(this.outputDir, { recursive: true });

        const filePath = path.join(this.outputDir, `${agent.name}.md`);
        await fs.writeFile(filePath, content, 'utf-8');

        return filePath;
    }

    async writeAllAgents(
        agents: AgentTemplate[], 
        contents: Map<string, string>,
        progressCallback?: (current: number, total: number, agent: string) => void
    ): Promise<string[]> {
        const writtenPaths: string[] = [];
        let current = 0;

        for (const agent of agents) {
            const content = contents.get(agent.name);
            if (content) {
                if (progressCallback) {
                    progressCallback(++current, agents.length, agent.name);
                }
                const filePath = await this.writeAgent(agent, content);
                writtenPaths.push(filePath);
            }
        }

        return writtenPaths;
    }

    async previewDiff(agent: AgentTemplate, newContent: string): Promise<boolean> {
        const filePath = path.join(this.outputDir, `${agent.name}.md`);
        
        try {
            const existingContent = await fs.readFile(filePath, 'utf-8');
            
            // Create temporary file for diff
            const tmpPath = path.join(this.outputDir, `.${agent.name}.new.md`);
            await fs.writeFile(tmpPath, newContent, 'utf-8');

            // Open diff editor
            const existingUri = vscode.Uri.file(filePath);
            const newUri = vscode.Uri.file(tmpPath);
            
            await vscode.commands.executeCommand(
                'vscode.diff',
                existingUri,
                newUri,
                `${agent.name}: Current ↔ Generated`
            );

            // Clean up temp file after a delay
            setTimeout(async () => {
                try {
                    await fs.unlink(tmpPath);
                } catch {
                    // Ignore cleanup errors
                }
            }, 60000); // 1 minute

            return true;
        } catch (error) {
            // File doesn't exist yet, just show the new content
            const tmpPath = path.join(this.outputDir, `.${agent.name}.new.md`);
            await fs.writeFile(tmpPath, newContent, 'utf-8');
            
            const doc = await vscode.workspace.openTextDocument(tmpPath);
            await vscode.window.showTextDocument(doc);

            return true;
        }
    }

    async agentExists(agentName: string): Promise<boolean> {
        const filePath = path.join(this.outputDir, `${agentName}.md`);
        try {
            await fs.stat(filePath);
            return true;
        } catch {
            return false;
        }
    }

    async readExistingAgent(agentName: string): Promise<string | null> {
        const filePath = path.join(this.outputDir, `${agentName}.md`);
        try {
            return await fs.readFile(filePath, 'utf-8');
        } catch {
            return null;
        }
    }
}
