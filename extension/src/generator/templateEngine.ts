import { AgentTemplate, PlaceholderValues, ProjectContext } from '../types';
import * as fs from 'fs/promises';
import * as path from 'path';

export class TemplateEngine {
    private templatesDir: string;

    constructor(templatesDir: string) {
        this.templatesDir = templatesDir;
    }

    async loadTemplate(templateName: string): Promise<AgentTemplate | null> {
        const templatePath = path.join(this.templatesDir, `${templateName}.md`);
        
        try {
            const content = await fs.readFile(templatePath, 'utf-8');
            return this.parseTemplate(content, templateName);
        } catch (error) {
            console.error(`Failed to load template ${templateName}:`, error);
            return null;
        }
    }

    async loadAllTemplates(): Promise<AgentTemplate[]> {
        try {
            const files = await fs.readdir(this.templatesDir);
            const templateFiles = files.filter(f => f.endsWith('.md'));
            
            const templates: AgentTemplate[] = [];
            for (const file of templateFiles) {
                const templateName = file.replace('.md', '');
                const template = await this.loadTemplate(templateName);
                if (template) {
                    templates.push(template);
                }
            }
            
            return templates;
        } catch (error) {
            console.error('Failed to load templates:', error);
            return [];
        }
    }

    private parseTemplate(content: string, name: string): AgentTemplate {
        // Parse YAML frontmatter
        const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
        let model = 'claude-4-5-sonnet'; // default
        let description = '';
        let triggers: string[] | undefined;

        if (frontmatterMatch) {
            const frontmatter = frontmatterMatch[1];
            const modelMatch = frontmatter.match(/model:\s*(.+)/);
            const descMatch = frontmatter.match(/description:\s*(.+)/);
            const triggersMatch = frontmatter.match(/triggers:\s*\n((?:\s+-\s+.+\n?)+)/);

            if (modelMatch) model = modelMatch[1].trim();
            if (descMatch) description = descMatch[1].trim();
            if (triggersMatch) {
                triggers = triggersMatch[1]
                    .split('\n')
                    .map(line => line.replace(/^\s*-\s*/, '').trim())
                    .filter(line => line.length > 0);
            }
        }

        return {
            name,
            model,
            description,
            content,
            triggers
        };
    }

    replacePlaceholders(template: AgentTemplate, values: PlaceholderValues): string {
        let content = template.content;

        for (const [key, value] of Object.entries(values)) {
            const placeholder = `{{${key}}}`;
            const regex = new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
            content = content.replace(regex, value || 'N/A');
        }

        return content;
    }

    buildPlaceholderValues(context: ProjectContext, activeAgents?: string[]): PlaceholderValues {
        const values: PlaceholderValues = {
            tech_stack: this.formatTechStack(context.techStack),
            source_dirs: context.directories.sourceDir || 'src',
            test_dirs: context.directories.testDir || 'tests',
            doc_dirs: context.directories.docsDir || 'docs',
            config_dirs: context.directories.configDir || 'config',
            build_command: context.commands.build || 'N/A',
            test_command: context.commands.test || 'N/A',
            lint_command: context.commands.lint || 'N/A',
            dev_command: context.commands.dev || 'npm start',
            type_check_command: context.commands.typeCheck || 'N/A',
            format_command: context.commands.format || 'N/A',
            deploy_command: context.commands.deploy || 'N/A',
            train_command: context.commands.train || 'N/A',
            
            // ML-specific
            ml_framework: this.detectMLFramework(context),
            model_dirs: context.directories.modelsDir || 'models',
            data_dirs: context.directories.dataDir || 'data',
            
            // API-specific
            api_framework: this.detectAPIFramework(context),
            api_dirs: context.directories.apiDir || 'api',
            api_base_url: 'http://localhost:3000',
            auth_method: 'JWT',
            
            // DevOps-specific
            cicd_platform: context.hasCI ? this.detectCIPlatform() : 'N/A',
            container_runtime: context.hasDocker ? 'Docker' : 'N/A',
            cloud_provider: 'N/A',
            
            // Security-specific
            auth_dirs: 'auth',
            dependency_audit_command: this.getDependencyAuditCommand(context),
            security_scan_command: 'N/A',
            
            // Code style
            naming_convention: this.getNamingConvention(context),
            line_length: '100',
            docstring_style: this.getDocstringStyle(context),
            
            // Architecture
            architecture_pattern: this.getArchitecturePattern(context),
            test_framework: this.getTestFramework(context)
        };

        // Add active agents table for orchestrator
        if (activeAgents) {
            values.active_agents_table = this.buildActiveAgentsTable(activeAgents);
        }

        return values;
    }

    private formatTechStack(techStack: any): string {
        const parts: string[] = [];
        
        if (techStack.languages.length > 0) {
            parts.push(techStack.languages.join(', '));
        }
        if (techStack.frameworks.length > 0) {
            parts.push(techStack.frameworks.join(', '));
        }
        
        return parts.join(' | ') || 'General';
    }

    private detectMLFramework(context: ProjectContext): string {
        const mlFrameworks = ['PyTorch', 'TensorFlow', 'Keras', 'scikit-learn'];
        const found = context.techStack.frameworks.find((f: string) => mlFrameworks.includes(f));
        return found || 'N/A';
    }

    private detectAPIFramework(context: ProjectContext): string {
        const apiFrameworks = ['Express', 'FastAPI', 'Django', 'Flask', 'NestJS', 'Fastify'];
        const found = context.techStack.frameworks.find((f: string) => apiFrameworks.includes(f));
        return found || 'N/A';
    }

    private detectCIPlatform(): string {
        // This would need to check actual files, simplified for now
        return 'GitHub Actions';
    }

    private getDependencyAuditCommand(context: ProjectContext): string {
        if (context.techStack.languages.includes('Python')) {
            return 'pip-audit';
        }
        if (context.techStack.languages.includes('JavaScript') || context.techStack.languages.includes('TypeScript')) {
            return 'npm audit';
        }
        return 'N/A';
    }

    private getNamingConvention(context: ProjectContext): string {
        if (context.techStack.languages.includes('Python')) {
            return 'snake_case';
        }
        if (context.techStack.languages.includes('JavaScript') || context.techStack.languages.includes('TypeScript')) {
            return 'camelCase';
        }
        return 'camelCase';
    }

    private getDocstringStyle(context: ProjectContext): string {
        if (context.techStack.languages.includes('Python')) {
            return 'Google';
        }
        return 'JSDoc';
    }

    private getArchitecturePattern(context: ProjectContext): string {
        if (context.projectType === 'api-backend') {
            return 'MVC/Layered Architecture';
        }
        if (context.projectType === 'frontend') {
            return 'Component-based';
        }
        return 'Modular';
    }

    private getTestFramework(context: ProjectContext): string {
        if (context.techStack.tools.includes('Jest')) return 'Jest';
        if (context.techStack.tools.includes('Vitest')) return 'Vitest';
        if (context.techStack.tools.includes('pytest')) return 'pytest';
        if (context.techStack.tools.includes('Cypress')) return 'Cypress';
        if (context.techStack.tools.includes('Playwright')) return 'Playwright';
        return 'N/A';
    }

    private buildActiveAgentsTable(activeAgents: string[]): string {
        const header = '| Agent | Purpose | When to Use |\n|-------|---------|-------------|';
        const rows = activeAgents.map(agent => {
            const purpose = this.getAgentPurpose(agent);
            const whenToUse = this.getAgentUsage(agent);
            return `| @${agent} | ${purpose} | ${whenToUse} |`;
        });
        
        return [header, ...rows].join('\n');
    }

    private getAgentPurpose(agent: string): string {
        const purposes: Record<string, string> = {
            'docs-agent': 'Documentation generation and maintenance',
            'test-agent': 'Test creation and coverage',
            'lint-agent': 'Code quality and style checking',
            'review-agent': 'Code review and best practices',
            'security-agent': 'Security analysis and vulnerability detection',
            'api-agent': 'API development and testing',
            'debug-agent': 'Debugging and error resolution',
            'refactor-agent': 'Code refactoring and optimization',
            'performance-agent': 'Performance analysis and optimization',
            'devops-agent': 'CI/CD and deployment',
            'ml-trainer': 'Model training and experimentation',
            'data-prep': 'Data preprocessing and validation'
        };
        return purposes[agent] || 'Specialized task agent';
    }

    private getAgentUsage(agent: string): string {
        const usages: Record<string, string> = {
            'docs-agent': 'Need documentation or API docs',
            'test-agent': 'Writing tests or improving coverage',
            'lint-agent': 'Code quality issues',
            'review-agent': 'Pre-commit review',
            'security-agent': 'Security concerns',
            'api-agent': 'API development',
            'debug-agent': 'Bugs or errors',
            'refactor-agent': 'Code improvement needed',
            'performance-agent': 'Performance issues',
            'devops-agent': 'Deployment or CI/CD',
            'ml-trainer': 'Training models',
            'data-prep': 'Data processing'
        };
        return usages[agent] || 'Specialized tasks';
    }
}
