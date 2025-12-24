export interface TechStack {
    languages: string[];
    frameworks: string[];
    tools: string[];
    packageManager?: string;
    buildSystem?: string;
}

export interface DetectedCommands {
    build?: string;
    test?: string;
    lint?: string;
    dev?: string;
    typeCheck?: string;
    format?: string;
    deploy?: string;
    train?: string;
}

export interface DirectoryStructure {
    sourceDir?: string;
    testDir?: string;
    docsDir?: string;
    configDir?: string;
    apiDir?: string;
    modelsDir?: string;
    dataDir?: string;
}

export interface ProjectContext {
    techStack: TechStack;
    commands: DetectedCommands;
    directories: DirectoryStructure;
    projectType: string;
    hasCI: boolean;
    hasDocker: boolean;
}

export interface AgentTemplate {
    name: string;
    model: string;
    description: string;
    content: string;
    triggers?: string[];
}

export interface AgentConfig {
    include?: string[];
    exclude?: string[];
    overrides?: Record<string, string>;
}

export interface GeneratedAgent {
    name: string;
    model: string;
    path: string;
    content: string;
    isGenerated: boolean;
}

export interface PlaceholderValues {
    tech_stack: string;
    source_dirs: string;
    test_dirs: string;
    doc_dirs: string;
    config_dirs: string;
    build_command: string;
    test_command: string;
    lint_command: string;
    dev_command: string;
    type_check_command: string;
    [key: string]: string;
}
