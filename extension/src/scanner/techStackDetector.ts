import { FileDetector, DetectedFile } from './fileDetector';
import { TechStack } from '../types';

export class TechStackDetector {
    private fileDetector: FileDetector;

    constructor(workspaceRoot: string) {
        this.fileDetector = new FileDetector(workspaceRoot);
    }

    async detectTechStack(): Promise<TechStack> {
        const detectedFiles = await this.fileDetector.detectProjectFiles();
        const extensionCounts = await this.fileDetector.detectFilesByExtension();

        const techStack: TechStack = {
            languages: [],
            frameworks: [],
            tools: []
        };

        // Detect languages
        if (extensionCounts.has('.py')) {
            techStack.languages.push('Python');
        }
        if (extensionCounts.has('.js') || extensionCounts.has('.jsx')) {
            techStack.languages.push('JavaScript');
        }
        if (extensionCounts.has('.ts') || extensionCounts.has('.tsx')) {
            techStack.languages.push('TypeScript');
        }
        if (extensionCounts.has('.java')) {
            techStack.languages.push('Java');
        }
        if (extensionCounts.has('.go')) {
            techStack.languages.push('Go');
        }
        if (extensionCounts.has('.rs')) {
            techStack.languages.push('Rust');
        }
        if (extensionCounts.has('.rb')) {
            techStack.languages.push('Ruby');
        }
        if (extensionCounts.has('.php')) {
            techStack.languages.push('PHP');
        }
        if (extensionCounts.has('.swift')) {
            techStack.languages.push('Swift');
        }
        if (extensionCounts.has('.kt')) {
            techStack.languages.push('Kotlin');
        }
        if (extensionCounts.has('.dart')) {
            techStack.languages.push('Dart');
        }

        // Detect frameworks and tools from detected files
        for (const file of detectedFiles) {
            switch (file.type) {
                case 'node-package':
                    await this.detectNodeFrameworks(file.path, techStack);
                    techStack.packageManager = 'npm';
                    break;
                case 'python-project':
                    await this.detectPythonFrameworks(file.path, techStack);
                    break;
                case 'angular':
                    techStack.frameworks.push('Angular');
                    break;
                case 'nextjs':
                    techStack.frameworks.push('Next.js');
                    break;
                case 'nuxtjs':
                    techStack.frameworks.push('Nuxt.js');
                    break;
                case 'vite':
                    techStack.tools.push('Vite');
                    break;
                case 'vue':
                    techStack.frameworks.push('Vue.js');
                    break;
                case 'flutter':
                    techStack.frameworks.push('Flutter');
                    break;
                case 'docker':
                    techStack.tools.push('Docker');
                    break;
                case 'docker-compose':
                    techStack.tools.push('Docker Compose');
                    break;
                case 'github-actions':
                    techStack.tools.push('GitHub Actions');
                    break;
                case 'gitlab-ci':
                    techStack.tools.push('GitLab CI');
                    break;
                case 'makefile':
                    techStack.buildSystem = 'Make';
                    break;
                case 'maven':
                    techStack.buildSystem = 'Maven';
                    break;
                case 'gradle':
                    techStack.buildSystem = 'Gradle';
                    break;
            }
        }

        return techStack;
    }

    private async detectNodeFrameworks(packageJsonPath: string, techStack: TechStack): Promise<void> {
        const packageJson = await this.fileDetector.readJsonFile(packageJsonPath);
        if (!packageJson) return;

        const dependencies = {
            ...packageJson.dependencies || {},
            ...packageJson.devDependencies || {}
        };

        const frameworkMap: Record<string, string> = {
            'react': 'React',
            'vue': 'Vue.js',
            '@angular/core': 'Angular',
            'next': 'Next.js',
            'nuxt': 'Nuxt.js',
            'express': 'Express',
            'fastify': 'Fastify',
            'koa': 'Koa',
            'nest': 'NestJS',
            '@nestjs/core': 'NestJS',
            'react-native': 'React Native',
            'svelte': 'Svelte',
            'solid-js': 'Solid.js',
            'vite': 'Vite',
            'webpack': 'Webpack',
            'jest': 'Jest',
            'vitest': 'Vitest',
            'cypress': 'Cypress',
            'playwright': 'Playwright',
            'eslint': 'ESLint',
            'prettier': 'Prettier',
            'typescript': 'TypeScript'
        };

        for (const [dep, framework] of Object.entries(frameworkMap)) {
            if (dependencies[dep]) {
                if (dep === 'typescript' && !techStack.languages.includes('TypeScript')) {
                    techStack.languages.push('TypeScript');
                } else if (['jest', 'vitest', 'cypress', 'playwright', 'eslint', 'prettier', 'vite', 'webpack'].includes(dep)) {
                    techStack.tools.push(framework);
                } else {
                    techStack.frameworks.push(framework);
                }
            }
        }
    }

    private async detectPythonFrameworks(pyprojectPath: string, techStack: TechStack): Promise<void> {
        const pyproject = await this.fileDetector.readTomlFile(pyprojectPath);
        if (!pyproject) return;

        const dependencies: string[] = [];

        // Extract dependencies from different sections
        if (pyproject.project?.dependencies) {
            dependencies.push(...pyproject.project.dependencies);
        }
        if (pyproject.tool?.poetry?.dependencies) {
            dependencies.push(...Object.keys(pyproject.tool.poetry.dependencies));
        }

        const frameworkMap: Record<string, string> = {
            'django': 'Django',
            'flask': 'Flask',
            'fastapi': 'FastAPI',
            'tornado': 'Tornado',
            'pytorch': 'PyTorch',
            'torch': 'PyTorch',
            'tensorflow': 'TensorFlow',
            'keras': 'Keras',
            'scikit-learn': 'scikit-learn',
            'sklearn': 'scikit-learn',
            'pandas': 'Pandas',
            'numpy': 'NumPy',
            'pytest': 'pytest',
            'black': 'Black',
            'ruff': 'Ruff',
            'mypy': 'mypy'
        };

        for (const dep of dependencies) {
            const depName = dep.split(/[>=<~]/)[0].trim().toLowerCase();
            for (const [key, framework] of Object.entries(frameworkMap)) {
                if (depName.includes(key)) {
                    if (['pytest', 'black', 'ruff', 'mypy'].includes(key)) {
                        techStack.tools.push(framework);
                    } else {
                        techStack.frameworks.push(framework);
                    }
                    break;
                }
            }
        }
    }
}
