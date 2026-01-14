import type { Feature, Phase, PhaseStatus } from '../types/workflow';
import { useWorkflow } from '../context/WorkflowContext';
import './WorkflowDiagram.css';

interface WorkflowDiagramProps {
  feature: Feature;
}

const statusColors: Record<PhaseStatus, string> = {
  not_started: '#6b7280',
  in_progress: '#f59e0b',
  awaiting_approval: '#8b5cf6',
  approved: '#10b981',
  skipped: '#9ca3af',
};

const statusLabels: Record<PhaseStatus, string> = {
  not_started: 'Not Started',
  in_progress: 'In Progress',
  awaiting_approval: 'Awaiting Approval',
  approved: 'Approved',
  skipped: 'Skipped',
};

export function WorkflowDiagram({ feature }: WorkflowDiagramProps) {
  const { updateStepStatus, approvePhase, skipPhase } = useWorkflow();

  const handleStepClick = (phase: Phase, stepIndex: number) => {
    const step = phase.steps[stepIndex];
    const nextStatus: Record<PhaseStatus, PhaseStatus> = {
      not_started: 'in_progress',
      in_progress: 'awaiting_approval',
      awaiting_approval: 'approved',
      approved: 'not_started',
      skipped: 'not_started',
    };
    updateStepStatus(feature.id, phase.id, step.id, nextStatus[step.status]);
  };

  return (
    <div className="workflow-diagram">
      <div className="workflow-header">
        <h2>Workflow Progress</h2>
        <div className="workflow-legend">
          {Object.entries(statusLabels).map(([status, label]) => (
            <div key={status} className="legend-item">
              <span
                className="legend-dot"
                style={{ backgroundColor: statusColors[status as PhaseStatus] }}
              />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="phases-container">
        {feature.phases.map((phase, phaseIndex) => (
          <div key={phase.id} className="phase-wrapper">
            <div
              className={`phase-card ${phase.status}`}
              style={{ borderLeftColor: statusColors[phase.status] }}
            >
              <div className="phase-header">
                <span className="phase-number">Phase {phase.number}</span>
                <span
                  className="phase-status-badge"
                  style={{ backgroundColor: statusColors[phase.status] }}
                >
                  {statusLabels[phase.status]}
                </span>
              </div>
              <h3 className="phase-name">{phase.name}</h3>
              <p className="phase-description">{phase.description}</p>

              <div className="steps-container">
                {phase.steps.map((step, stepIndex) => (
                  <div
                    key={step.id}
                    className={`step-item ${step.status}`}
                    onClick={() => handleStepClick(phase, stepIndex)}
                  >
                    <span
                      className="step-indicator"
                      style={{ backgroundColor: statusColors[step.status] }}
                    />
                    <div className="step-content">
                      <span className="step-name">{step.name}</span>
                      <span className="step-agent">{step.agent}</span>
                    </div>
                    <span className="step-status">{statusLabels[step.status]}</span>
                  </div>
                ))}
              </div>

              {phase.status !== 'approved' && phase.status !== 'skipped' && (
                <div className="phase-actions">
                  <button
                    className="btn btn-approve"
                    onClick={() => approvePhase(feature.id, phase.id)}
                  >
                    Approve Phase
                  </button>
                  <button
                    className="btn btn-skip"
                    onClick={() => skipPhase(feature.id, phase.id)}
                  >
                    Skip Phase
                  </button>
                </div>
              )}
            </div>

            {phaseIndex < feature.phases.length - 1 && (
              <div className="phase-connector">
                <svg width="24" height="40" viewBox="0 0 24 40">
                  <path
                    d="M12 0 L12 40"
                    stroke={phase.status === 'approved' ? '#10b981' : '#d1d5db'}
                    strokeWidth="2"
                    strokeDasharray={phase.status === 'approved' ? '0' : '4'}
                  />
                  <path
                    d="M6 32 L12 40 L18 32"
                    fill="none"
                    stroke={phase.status === 'approved' ? '#10b981' : '#d1d5db'}
                    strokeWidth="2"
                  />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
