import { FileDetector } from './fileDetector';
import { DirectoryStructure } from '../types';

export class DirectoryMapper {
    private workspaceRoot: string;

    constructor(workspaceRoot: string) {
        this.workspaceRoot = workspaceRoot;
    }

    async mapDirectories(): Promise<DirectoryStructure> {
        const fileDetector = new FileDetector(this.workspaceRoot);
        const foundDirs = await fileDetector.detectDirectories();

        const structure: DirectoryStructure = {};

        // Map source directories
        const sourceDirs = ['src', 'lib', 'app'];
        for (const dir of sourceDirs) {
            if (foundDirs.includes(dir)) {
                structure.sourceDir = dir;
                break;
            }
        }

        // Map test directories
        const testDirs = ['tests', 'test', '__tests__'];
        for (const dir of testDirs) {
            if (foundDirs.includes(dir)) {
                structure.testDir = dir;
                break;
            }
        }

        // Map documentation directories
        const docDirs = ['docs', 'documentation'];
        for (const dir of docDirs) {
            if (foundDirs.includes(dir)) {
                structure.docsDir = dir;
                break;
            }
        }

        // Map config directories
        const configDirs = ['config', 'configs'];
        for (const dir of configDirs) {
            if (foundDirs.includes(dir)) {
                structure.configDir = dir;
                break;
            }
        }

        // Map API directories
        if (foundDirs.includes('api')) {
            structure.apiDir = 'api';
        }

        // Map models directories (for ML projects)
        if (foundDirs.includes('models')) {
            structure.modelsDir = 'models';
        }

        // Map data directories (for ML/data projects)
        if (foundDirs.includes('data')) {
            structure.dataDir = 'data';
        }

        return structure;
    }
}
