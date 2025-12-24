import * as vscode from 'vscode';
import { ProjectScanner } from '../scanner/projectScanner';

export async function scanRepository(context: vscode.ExtensionContext): Promise<void> {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
        vscode.window.showErrorMessage('No workspace folder open');
        return;
    }

    const workspaceRoot = workspaceFolders[0].uri.fsPath;

    await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: 'Scanning Repository',
        cancellable: false
    }, async (progress) => {
        try {
            progress.report({ message: 'Analyzing project structure...', increment: 50 });
            
            const scanner = new ProjectScanner(workspaceRoot);
            const projectContext = await scanner.scanProject();

            progress.report({ message: 'Complete!', increment: 50 });

            // Format results for display
            const results = [
                '## Tech Stack Detected',
                '',
                `**Languages:** ${projectContext.techStack.languages.join(', ') || 'None'}`,
                `**Frameworks:** ${projectContext.techStack.frameworks.join(', ') || 'None'}`,
                `**Tools:** ${projectContext.techStack.tools.join(', ') || 'None'}`,
                `**Project Type:** ${projectContext.projectType}`,
                '',
                '## Available Commands',
                '',
                `**Build:** ${projectContext.commands.build || 'N/A'}`,
                `**Test:** ${projectContext.commands.test || 'N/A'}`,
                `**Lint:** ${projectContext.commands.lint || 'N/A'}`,
                `**Dev:** ${projectContext.commands.dev || 'N/A'}`,
                '',
                '## Directory Structure',
                '',
                `**Source:** ${projectContext.directories.sourceDir || 'N/A'}`,
                `**Tests:** ${projectContext.directories.testDir || 'N/A'}`,
                `**Docs:** ${projectContext.directories.docsDir || 'N/A'}`,
                `**API:** ${projectContext.directories.apiDir || 'N/A'}`,
                '',
                '## Infrastructure',
                '',
                `**CI/CD:** ${projectContext.hasCI ? 'Yes' : 'No'}`,
                `**Docker:** ${projectContext.hasDocker ? 'Yes' : 'No'}`
            ].join('\n');

            // Show results in a new document
            const doc = await vscode.workspace.openTextDocument({
                content: results,
                language: 'markdown'
            });
            await vscode.window.showTextDocument(doc);

        } catch (error) {
            vscode.window.showErrorMessage(`Failed to scan repository: ${error}`);
            console.error('Repository scan error:', error);
        }
    });
}
