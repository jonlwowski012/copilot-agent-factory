import { TechStackDetector } from './techStackDetector';
import { CommandExtractor } from './commandExtractor';
import { DirectoryMapper } from './directoryMapper';
import { ProjectContext } from '../types';
import * as path from 'path';
import * as fs from 'fs/promises';

export class ProjectScanner {
    private workspaceRoot: string;

    constructor(workspaceRoot: string) {
        this.workspaceRoot = workspaceRoot;
    }

    async scanProject(): Promise<ProjectContext> {
        const techStackDetector = new TechStackDetector(this.workspaceRoot);
        const commandExtractor = new CommandExtractor(this.workspaceRoot);
        const directoryMapper = new DirectoryMapper(this.workspaceRoot);

        const [techStack, commands, directories] = await Promise.all([
            techStackDetector.detectTechStack(),
            commandExtractor.extractCommands(),
            directoryMapper.mapDirectories()
        ]);

        const projectType = this.determineProjectType(techStack, directories);
        const hasCI = await this.detectCI();
        const hasDocker = await this.detectDocker();

        return {
            techStack,
            commands,
            directories,
            projectType,
            hasCI,
            hasDocker
        };
    }

    private determineProjectType(techStack: any, directories: any): string {
        // Machine Learning project
        if (techStack.frameworks.some((f: string) => 
            ['PyTorch', 'TensorFlow', 'Keras', 'scikit-learn'].includes(f)
        ) || directories.modelsDir || directories.dataDir) {
            return 'machine-learning';
        }

        // API/Backend project
        if (techStack.frameworks.some((f: string) => 
            ['Express', 'FastAPI', 'Django', 'Flask', 'NestJS', 'Fastify'].includes(f)
        ) || directories.apiDir) {
            return 'api-backend';
        }

        // Mobile project
        if (techStack.frameworks.some((f: string) => 
            ['Flutter', 'React Native'].includes(f)
        ) || techStack.languages.includes('Swift') || techStack.languages.includes('Kotlin')) {
            return 'mobile';
        }

        // Frontend project
        if (techStack.frameworks.some((f: string) => 
            ['React', 'Vue.js', 'Angular', 'Svelte', 'Next.js', 'Nuxt.js'].includes(f)
        )) {
            return 'frontend';
        }

        // Library/Package project
        if (techStack.buildSystem || (directories.sourceDir && !directories.apiDir)) {
            return 'library';
        }

        return 'general';
    }

    private async detectCI(): Promise<boolean> {
        const ciPaths = [
            '.github/workflows',
            '.gitlab-ci.yml',
            '.circleci/config.yml',
            'azure-pipelines.yml',
            '.travis.yml'
        ];

        for (const ciPath of ciPaths) {
            try {
                await fs.stat(path.join(this.workspaceRoot, ciPath));
                return true;
            } catch {
                // Path doesn't exist
            }
        }

        return false;
    }

    private async detectDocker(): Promise<boolean> {
        const dockerPaths = ['Dockerfile', 'docker-compose.yml', 'docker-compose.yaml'];

        for (const dockerPath of dockerPaths) {
            try {
                await fs.stat(path.join(this.workspaceRoot, dockerPath));
                return true;
            } catch {
                // Path doesn't exist
            }
        }

        return false;
    }
}
