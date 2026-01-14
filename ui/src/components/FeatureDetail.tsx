import { useWorkflow } from '../context/WorkflowContext';
import { WorkflowDiagram } from './WorkflowDiagram';
import './FeatureDetail.css';

export function FeatureDetail() {
  const { selectedFeature, selectFeature } = useWorkflow();

  if (!selectedFeature) {
    return (
      <div className="feature-detail empty">
        <div className="empty-content">
          <span className="empty-icon">👈</span>
          <h3>Select a Feature</h3>
          <p>Choose a feature from the list to view its workflow progress</p>
        </div>
      </div>
    );
  }

  const completedPhases = selectedFeature.phases.filter(
    p => p.status === 'approved' || p.status === 'skipped'
  ).length;

  return (
    <div className="feature-detail">
      <div className="detail-header">
        <button className="btn-back" onClick={() => selectFeature(null)}>
          ← Back
        </button>
        <div className="detail-title">
          <h1>{selectedFeature.name}</h1>
          {selectedFeature.description && (
            <p className="detail-description">{selectedFeature.description}</p>
          )}
        </div>
      </div>

      <div className="detail-stats">
        <div className="stat-card">
          <span className="stat-value">{completedPhases}</span>
          <span className="stat-label">Phases Completed</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{selectedFeature.phases.length - completedPhases}</span>
          <span className="stat-label">Phases Remaining</span>
        </div>
        <div className="stat-card">
          <span className="stat-value capitalize">{selectedFeature.overallStatus}</span>
          <span className="stat-label">Current Status</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">Phase {selectedFeature.currentPhase}</span>
          <span className="stat-label">Current Phase</span>
        </div>
      </div>

      <div className="detail-artifacts">
        <h3>Artifacts</h3>
        <div className="artifacts-list">
          {selectedFeature.phases.map(phase => (
            phase.steps.filter(step => step.artifactPath).map(step => (
              <div
                key={step.id}
                className={`artifact-item ${step.status === 'approved' ? 'completed' : ''}`}
              >
                <span className="artifact-icon">
                  {step.status === 'approved' ? '📄' : '📝'}
                </span>
                <div className="artifact-info">
                  <span className="artifact-name">{step.name}</span>
                  <span className="artifact-path">{step.artifactPath}</span>
                </div>
                <span className={`artifact-status ${step.status}`}>
                  {step.status === 'approved' ? '✓ Generated' : 'Pending'}
                </span>
              </div>
            ))
          ))}
        </div>
      </div>

      <WorkflowDiagram feature={selectedFeature} />

      <div className="detail-timeline">
        <h3>Activity Timeline</h3>
        <div className="timeline">
          <div className="timeline-item">
            <span className="timeline-dot"></span>
            <div className="timeline-content">
              <span className="timeline-date">
                {new Date(selectedFeature.createdAt).toLocaleString()}
              </span>
              <span className="timeline-text">Feature created</span>
            </div>
          </div>
          {selectedFeature.phases
            .filter(p => p.status === 'approved' || p.status === 'skipped')
            .map(phase => (
              <div key={phase.id} className="timeline-item">
                <span className={`timeline-dot ${phase.status}`}></span>
                <div className="timeline-content">
                  <span className="timeline-date">
                    {phase.steps[0]?.completedAt
                      ? new Date(phase.steps[0].completedAt).toLocaleString()
                      : 'Unknown'}
                  </span>
                  <span className="timeline-text">
                    Phase {phase.number}: {phase.name} -{' '}
                    {phase.status === 'skipped' ? 'Skipped' : 'Completed'}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
