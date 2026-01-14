export type PhaseStatus = 'not_started' | 'in_progress' | 'awaiting_approval' | 'approved' | 'skipped';

export interface PhaseStep {
  id: string;
  name: string;
  agent: string;
  status: PhaseStatus;
  artifactPath?: string;
  completedAt?: string;
  notes?: string;
}

export interface Phase {
  id: string;
  number: number;
  name: string;
  description: string;
  steps: PhaseStep[];
  status: PhaseStatus;
}

export interface Feature {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  currentPhase: number;
  currentStep: number;
  phases: Phase[];
  overallStatus: 'planning' | 'designing' | 'implementing' | 'reviewing' | 'completed' | 'blocked';
}

export const createInitialPhases = (): Phase[] => [
  {
    id: 'phase-0',
    number: 0,
    name: 'System State Diagram Validation',
    description: 'Ensure system state machine diagram exists and is current',
    status: 'not_started',
    steps: [
      {
        id: 'step-0-1',
        name: 'State Diagram Validation',
        agent: '@architecture-agent',
        status: 'not_started',
        artifactPath: 'docs/system-state-diagram.md',
      },
    ],
  },
  {
    id: 'phase-1',
    number: 1,
    name: 'Product Planning',
    description: 'Define requirements, epics, and user stories',
    status: 'not_started',
    steps: [
      {
        id: 'step-1-1',
        name: 'PRD Generation',
        agent: '@prd-agent',
        status: 'not_started',
        artifactPath: 'docs/planning/prd/',
      },
      {
        id: 'step-1-2',
        name: 'Epic Breakdown',
        agent: '@epic-agent',
        status: 'not_started',
        artifactPath: 'docs/planning/epics/',
      },
      {
        id: 'step-1-3',
        name: 'User Stories',
        agent: '@story-agent',
        status: 'not_started',
        artifactPath: 'docs/planning/stories/',
      },
    ],
  },
  {
    id: 'phase-2',
    number: 2,
    name: 'Architecture & Design',
    description: 'Design system architecture and technical specifications',
    status: 'not_started',
    steps: [
      {
        id: 'step-2-1',
        name: 'Architecture Design',
        agent: '@architecture-agent',
        status: 'not_started',
        artifactPath: 'docs/planning/architecture/',
      },
      {
        id: 'step-2-2',
        name: 'Technical Design',
        agent: '@design-agent',
        status: 'not_started',
        artifactPath: 'docs/planning/design/',
      },
    ],
  },
  {
    id: 'phase-3',
    number: 3,
    name: 'Test Strategy',
    description: 'Define test strategy before implementation (TDD)',
    status: 'not_started',
    steps: [
      {
        id: 'step-3-1',
        name: 'Test Design',
        agent: '@test-design-agent',
        status: 'not_started',
        artifactPath: 'docs/planning/test-design/',
      },
    ],
  },
  {
    id: 'phase-4',
    number: 4,
    name: 'Implementation',
    description: 'Implement the feature based on planning artifacts',
    status: 'not_started',
    steps: [
      {
        id: 'step-4-1',
        name: 'Code Implementation',
        agent: '@domain-agent',
        status: 'not_started',
      },
    ],
  },
  {
    id: 'phase-5',
    number: 5,
    name: 'Review & QA',
    description: 'Code review and documentation updates',
    status: 'not_started',
    steps: [
      {
        id: 'step-5-1',
        name: 'Code Review',
        agent: '@review-agent',
        status: 'not_started',
      },
      {
        id: 'step-5-2',
        name: 'Documentation',
        agent: '@docs-agent',
        status: 'not_started',
      },
    ],
  },
];

export const createFeature = (name: string, description: string): Feature => {
  const now = new Date().toISOString();
  return {
    id: `feature-${Date.now()}`,
    name,
    description,
    createdAt: now,
    updatedAt: now,
    currentPhase: 0,
    currentStep: 0,
    phases: createInitialPhases(),
    overallStatus: 'planning',
  };
};
