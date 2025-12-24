import { AgentTemplate, ProjectContext } from '../types';
import { TemplateEngine } from './templateEngine';

export class AgentSelector {
    private templateEngine: TemplateEngine;

    constructor(templateEngine: TemplateEngine) {
        this.templateEngine = templateEngine;
    }

    async selectAgents(context: ProjectContext, manualSelection?: string[]): Promise<AgentTemplate[]> {
        if (manualSelection && manualSelection.length > 0) {
            return this.loadSelectedAgents(manualSelection);
        }

        return this.autoSelectAgents(context);
    }

    private async autoSelectAgents(context: ProjectContext): Promise<AgentTemplate[]> {
        const selectedAgentNames: string[] = [];

        // Always include core agents
        selectedAgentNames.push('orchestrator', 'review-agent', 'debug-agent', 'refactor-agent');

        // Documentation agent
        if (context.directories.docsDir || await this.hasDocumentation()) {
            selectedAgentNames.push('docs-agent');
        }

        // Test agent
        if (context.directories.testDir || context.commands.test) {
            selectedAgentNames.push('test-agent');
        }

        // Lint agent
        if (context.commands.lint || this.hasLinterConfig(context)) {
            selectedAgentNames.push('lint-agent');
        }

        // Security agent (for most projects with auth or APIs)
        if (context.projectType === 'api-backend' || context.directories.apiDir) {
            selectedAgentNames.push('security-agent');
        }

        // DevOps agent
        if (context.hasCI || context.hasDocker) {
            selectedAgentNames.push('devops-agent');
        }

        // Performance agent (for larger projects)
        if (context.projectType !== 'library') {
            selectedAgentNames.push('performance-agent');
        }

        // API agent
        if (context.projectType === 'api-backend' || context.directories.apiDir) {
            selectedAgentNames.push('api-agent');
        }

        // ML agents
        if (context.projectType === 'machine-learning') {
            selectedAgentNames.push('ml-trainer', 'data-prep', 'eval-agent', 'inference-agent');
        }

        // Frontend framework agents
        if (context.techStack.frameworks.includes('React')) {
            selectedAgentNames.push('frontend-react-agent');
        }
        if (context.techStack.frameworks.includes('Vue.js')) {
            selectedAgentNames.push('frontend-vue-agent');
        }
        if (context.techStack.frameworks.includes('Angular')) {
            selectedAgentNames.push('frontend-angular-agent');
        }

        // Mobile agents
        if (context.techStack.frameworks.includes('Flutter')) {
            selectedAgentNames.push('mobile-flutter-agent');
        }
        if (context.techStack.frameworks.includes('React Native')) {
            selectedAgentNames.push('mobile-react-native-agent');
        }
        if (context.techStack.languages.includes('Swift')) {
            selectedAgentNames.push('mobile-ios-agent');
        }

        // Database agent
        if (await this.hasDatabase(context)) {
            selectedAgentNames.push('database-agent');
        }

        return this.loadSelectedAgents(selectedAgentNames);
    }

    private async loadSelectedAgents(agentNames: string[]): Promise<AgentTemplate[]> {
        const agents: AgentTemplate[] = [];
        
        for (const name of agentNames) {
            const template = await this.templateEngine.loadTemplate(name);
            if (template) {
                agents.push(template);
            }
        }

        return agents;
    }

    private hasLinterConfig(context: ProjectContext): boolean {
        return context.techStack.tools.some(tool => 
            ['ESLint', 'Prettier', 'Ruff', 'Black', 'pylint'].includes(tool)
        );
    }

    private async hasDocumentation(): Promise<boolean> {
        // Could check for README, docs/ folder, etc.
        return true; // Simplified for now
    }

    private async hasDatabase(context: ProjectContext): Promise<boolean> {
        // Check for database-related frameworks/tools
        const dbIndicators = ['Django', 'Flask', 'FastAPI', 'Express', 'NestJS'];
        return context.techStack.frameworks.some((f: string) => dbIndicators.includes(f));
    }
}
