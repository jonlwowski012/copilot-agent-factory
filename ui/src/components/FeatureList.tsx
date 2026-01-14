import { useState } from 'react';
import { useWorkflow } from '../context/WorkflowContext';
import type { Feature } from '../types/workflow';
import './FeatureList.css';

const statusColors: Record<Feature['overallStatus'], string> = {
  planning: '#3b82f6',
  designing: '#8b5cf6',
  implementing: '#f59e0b',
  reviewing: '#06b6d4',
  completed: '#10b981',
  blocked: '#ef4444',
};

const statusIcons: Record<Feature['overallStatus'], string> = {
  planning: '📋',
  designing: '🏗️',
  implementing: '⚙️',
  reviewing: '🔍',
  completed: '✅',
  blocked: '🚫',
};

export function FeatureList() {
  const { features, selectedFeatureId, selectFeature, addFeature, deleteFeature } = useWorkflow();
  const [showForm, setShowForm] = useState(false);
  const [newFeatureName, setNewFeatureName] = useState('');
  const [newFeatureDesc, setNewFeatureDesc] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFeatureName.trim()) {
      addFeature(newFeatureName.trim(), newFeatureDesc.trim());
      setNewFeatureName('');
      setNewFeatureDesc('');
      setShowForm(false);
    }
  };

  const getProgress = (feature: Feature) => {
    const totalPhases = feature.phases.length;
    const completedPhases = feature.phases.filter(
      p => p.status === 'approved' || p.status === 'skipped'
    ).length;
    return Math.round((completedPhases / totalPhases) * 100);
  };

  return (
    <div className="feature-list">
      <div className="feature-list-header">
        <h2>Features</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          + New Feature
        </button>
      </div>

      {showForm && (
        <form className="new-feature-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Feature name"
            value={newFeatureName}
            onChange={e => setNewFeatureName(e.target.value)}
            autoFocus
          />
          <textarea
            placeholder="Description (optional)"
            value={newFeatureDesc}
            onChange={e => setNewFeatureDesc(e.target.value)}
            rows={2}
          />
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Create
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {features.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📦</span>
          <p>No features yet</p>
          <p className="empty-hint">Create a new feature to start tracking its progress through the workflow.</p>
        </div>
      ) : (
        <div className="features">
          {features.map(feature => (
            <div
              key={feature.id}
              className={`feature-card ${selectedFeatureId === feature.id ? 'selected' : ''}`}
              onClick={() => selectFeature(feature.id)}
            >
              <div className="feature-card-header">
                <span className="feature-status-icon">{statusIcons[feature.overallStatus]}</span>
                <span
                  className="feature-status-badge"
                  style={{ backgroundColor: statusColors[feature.overallStatus] }}
                >
                  {feature.overallStatus}
                </span>
                <button
                  className="btn-delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('Delete this feature?')) {
                      deleteFeature(feature.id);
                    }
                  }}
                >
                  ×
                </button>
              </div>
              <h3 className="feature-name">{feature.name}</h3>
              {feature.description && (
                <p className="feature-description">{feature.description}</p>
              )}
              <div className="feature-progress">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${getProgress(feature)}%`,
                      backgroundColor: statusColors[feature.overallStatus],
                    }}
                  />
                </div>
                <span className="progress-text">{getProgress(feature)}%</span>
              </div>
              <div className="feature-meta">
                <span>Phase {feature.currentPhase} of {feature.phases.length - 1}</span>
                <span>Updated {new Date(feature.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
