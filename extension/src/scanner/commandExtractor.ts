import { FileDetector } from './fileDetector';
import { DetectedCommands } from '../types';
import * as path from 'path';

export class CommandExtractor {
    private fileDetector: FileDetector;
    private workspaceRoot: string;

    constructor(workspaceRoot: string) {
        this.fileDetector = new FileDetector(workspaceRoot);
        this.workspaceRoot = workspaceRoot;
    }

    async extractCommands(): Promise<DetectedCommands> {
        const commands: DetectedCommands = {};

        // Try package.json first
        const packageJsonPath = path.join(this.workspaceRoot, 'package.json');
        const packageJson = await this.fileDetector.readJsonFile(packageJsonPath);
        if (packageJson?.scripts) {
            this.extractFromPackageJson(packageJson.scripts, commands);
        }

        // Try pyproject.toml
        const pyprojectPath = path.join(this.workspaceRoot, 'pyproject.toml');
        const pyproject = await this.fileDetector.readTomlFile(pyprojectPath);
        if (pyproject) {
            this.extractFromPyproject(pyproject, commands);
        }

        // Try Makefile
        await this.extractFromMakefile(commands);

        return commands;
    }

    private extractFromPackageJson(scripts: Record<string, string>, commands: DetectedCommands): void {
        const scriptMap: Record<string, keyof DetectedCommands> = {
            'build': 'build',
            'compile': 'build',
            'test': 'test',
            'test:unit': 'test',
            'lint': 'lint',
            'format': 'format',
            'dev': 'dev',
            'start:dev': 'dev',
            'start': 'dev',
            'type-check': 'typeCheck',
            'typecheck': 'typeCheck',
            'deploy': 'deploy'
        };

        for (const [script, command] of Object.entries(scripts)) {
            const key = scriptMap[script];
            if (key && !commands[key]) {
                commands[key] = `npm run ${script}`;
            }
        }
    }

    private extractFromPyproject(pyproject: any, commands: DetectedCommands): void {
        // Poetry scripts
        if (pyproject.tool?.poetry?.scripts) {
            const scripts = pyproject.tool.poetry.scripts;
            if (scripts.test && !commands.test) {
                commands.test = 'poetry run test';
            }
        }

        // Detect common Python tools
        const dependencies = [
            ...(pyproject.project?.dependencies || []),
            ...Object.keys(pyproject.tool?.poetry?.dependencies || {}),
            ...Object.keys(pyproject.tool?.poetry?.['dev-dependencies'] || {})
        ];

        const depString = dependencies.join(' ').toLowerCase();

        if (!commands.test) {
            if (depString.includes('pytest')) {
                commands.test = 'pytest';
            } else if (depString.includes('unittest')) {
                commands.test = 'python -m unittest discover';
            }
        }

        if (!commands.lint) {
            if (depString.includes('ruff')) {
                commands.lint = 'ruff check .';
            } else if (depString.includes('pylint')) {
                commands.lint = 'pylint src';
            } else if (depString.includes('flake8')) {
                commands.lint = 'flake8 src';
            }
        }

        if (!commands.format) {
            if (depString.includes('black')) {
                commands.format = 'black .';
            } else if (depString.includes('ruff')) {
                commands.format = 'ruff format .';
            }
        }

        if (!commands.typeCheck && depString.includes('mypy')) {
            commands.typeCheck = 'mypy src';
        }
    }

    private async extractFromMakefile(commands: DetectedCommands): Promise<void> {
        const makefilePath = path.join(this.workspaceRoot, 'Makefile');
        try {
            const fs = await import('fs/promises');
            const content = await fs.readFile(makefilePath, 'utf-8');
            const lines = content.split('\n');

            const targetMap: Record<string, keyof DetectedCommands> = {
                'build': 'build',
                'compile': 'build',
                'test': 'test',
                'lint': 'lint',
                'format': 'format',
                'dev': 'dev',
                'run': 'dev',
                'deploy': 'deploy',
                'train': 'train'
            };

            for (const line of lines) {
                const match = line.match(/^([a-zA-Z0-9_-]+):/);
                if (match) {
                    const target = match[1];
                    const key = targetMap[target];
                    if (key && !commands[key]) {
                        commands[key] = `make ${target}`;
                    }
                }
            }
        } catch {
            // Makefile doesn't exist or can't be read
        }
    }
}
