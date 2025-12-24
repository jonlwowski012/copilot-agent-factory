import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs/promises';

export interface DetectedFile {
    path: string;
    type: string;
}

export class FileDetector {
    private workspaceRoot: string;

    constructor(workspaceRoot: string) {
        this.workspaceRoot = workspaceRoot;
    }

    async detectProjectFiles(): Promise<DetectedFile[]> {
        const detectedFiles: DetectedFile[] = [];

        // Package managers and config files to detect
        const filesToDetect = [
            { name: 'package.json', type: 'node-package' },
            { name: 'pyproject.toml', type: 'python-project' },
            { name: 'requirements.txt', type: 'python-requirements' },
            { name: 'Pipfile', type: 'python-pipenv' },
            { name: 'setup.py', type: 'python-setup' },
            { name: 'Cargo.toml', type: 'rust' },
            { name: 'go.mod', type: 'go' },
            { name: 'pom.xml', type: 'maven' },
            { name: 'build.gradle', type: 'gradle' },
            { name: 'Gemfile', type: 'ruby' },
            { name: 'composer.json', type: 'php' },
            { name: 'Dockerfile', type: 'docker' },
            { name: 'docker-compose.yml', type: 'docker-compose' },
            { name: 'Makefile', type: 'makefile' },
            { name: '.github/workflows', type: 'github-actions', isDir: true },
            { name: '.gitlab-ci.yml', type: 'gitlab-ci' },
            { name: 'tsconfig.json', type: 'typescript' },
            { name: 'angular.json', type: 'angular' },
            { name: 'next.config.js', type: 'nextjs' },
            { name: 'nuxt.config.js', type: 'nuxtjs' },
            { name: 'vite.config.ts', type: 'vite' },
            { name: 'vue.config.js', type: 'vue' },
            { name: 'pubspec.yaml', type: 'flutter' },
        ];

        for (const file of filesToDetect) {
            const filePath = path.join(this.workspaceRoot, file.name);
            try {
                const stats = await fs.stat(filePath);
                if ((file.isDir && stats.isDirectory()) || (!file.isDir && stats.isFile())) {
                    detectedFiles.push({
                        path: filePath,
                        type: file.type
                    });
                }
            } catch {
                // File doesn't exist, skip
            }
        }

        return detectedFiles;
    }

    async detectFilesByExtension(): Promise<Map<string, number>> {
        const extensionCounts = new Map<string, number>();
        
        const extensions = ['.py', '.js', '.ts', '.tsx', '.jsx', '.java', '.go', '.rs', '.rb', '.php', '.swift', '.kt', '.dart'];
        
        for (const ext of extensions) {
            const files = await vscode.workspace.findFiles(`**/*${ext}`, '**/node_modules/**', 100);
            if (files.length > 0) {
                extensionCounts.set(ext, files.length);
            }
        }

        return extensionCounts;
    }

    async detectDirectories(): Promise<string[]> {
        const dirsToCheck = [
            'src', 'lib', 'app', 'tests', 'test', '__tests__',
            'docs', 'documentation', 'api', 'models', 'data',
            'config', 'configs', 'scripts', 'build', 'dist'
        ];

        const foundDirs: string[] = [];

        for (const dir of dirsToCheck) {
            const dirPath = path.join(this.workspaceRoot, dir);
            try {
                const stats = await fs.stat(dirPath);
                if (stats.isDirectory()) {
                    foundDirs.push(dir);
                }
            } catch {
                // Directory doesn't exist
            }
        }

        return foundDirs;
    }

    async readJsonFile(filePath: string): Promise<any> {
        try {
            const content = await fs.readFile(filePath, 'utf-8');
            return JSON.parse(content);
        } catch {
            return null;
        }
    }

    async readTomlFile(filePath: string): Promise<any> {
        try {
            const content = await fs.readFile(filePath, 'utf-8');
            const toml = await import('@iarna/toml');
            return toml.parse(content);
        } catch {
            return null;
        }
    }

    async readYamlFile(filePath: string): Promise<any> {
        try {
            const content = await fs.readFile(filePath, 'utf-8');
            const yaml = await import('js-yaml');
            return yaml.load(content);
        } catch {
            return null;
        }
    }
}
