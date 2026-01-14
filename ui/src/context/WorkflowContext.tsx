import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Feature, PhaseStatus } from '../types/workflow';
import { createFeature } from '../types/workflow';

interface WorkflowContextType {
  features: Feature[];
  selectedFeatureId: string | null;
  selectedFeature: Feature | null;
  addFeature: (name: string, description: string) => void;
  selectFeature: (id: string | null) => void;
  updateStepStatus: (featureId: string, phaseId: string, stepId: string, status: PhaseStatus) => void;
  approvePhase: (featureId: string, phaseId: string) => void;
  skipPhase: (featureId: string, phaseId: string) => void;
  deleteFeature: (featureId: string) => void;
}

const WorkflowContext = createContext<WorkflowContextType | null>(null);

const STORAGE_KEY = 'workflow-tracker-features';

export function WorkflowProvider({ children }: { children: ReactNode }) {
  const [features, setFeatures] = useState<Feature[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });
  const [selectedFeatureId, setSelectedFeatureId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(features));
  }, [features]);

  const selectedFeature = features.find(f => f.id === selectedFeatureId) || null;

  const addFeature = useCallback((name: string, description: string) => {
    const feature = createFeature(name, description);
    setFeatures(prev => [...prev, feature]);
    setSelectedFeatureId(feature.id);
  }, []);

  const selectFeature = useCallback((id: string | null) => {
    setSelectedFeatureId(id);
  }, []);

  const updateStepStatus = useCallback((featureId: string, phaseId: string, stepId: string, status: PhaseStatus) => {
    setFeatures(prev => prev.map(feature => {
      if (feature.id !== featureId) return feature;

      const updatedPhases = feature.phases.map(phase => {
        if (phase.id !== phaseId) return phase;

        const updatedSteps = phase.steps.map(step => {
          if (step.id !== stepId) return step;
          return {
            ...step,
            status,
            completedAt: status === 'approved' ? new Date().toISOString() : step.completedAt,
          };
        });

        const allApproved = updatedSteps.every(s => s.status === 'approved' || s.status === 'skipped');
        const anyInProgress = updatedSteps.some(s => s.status === 'in_progress' || s.status === 'awaiting_approval');

        return {
          ...phase,
          steps: updatedSteps,
          status: allApproved ? 'approved' : anyInProgress ? 'in_progress' : phase.status,
        };
      });

      const currentPhaseIndex = updatedPhases.findIndex(p =>
        p.status !== 'approved' && p.status !== 'skipped'
      );

      return {
        ...feature,
        phases: updatedPhases,
        currentPhase: currentPhaseIndex === -1 ? updatedPhases.length - 1 : currentPhaseIndex,
        updatedAt: new Date().toISOString(),
        overallStatus: getOverallStatus(updatedPhases),
      };
    }));
  }, []);

  const approvePhase = useCallback((featureId: string, phaseId: string) => {
    setFeatures(prev => prev.map(feature => {
      if (feature.id !== featureId) return feature;

      const updatedPhases = feature.phases.map(phase => {
        if (phase.id !== phaseId) return phase;
        return {
          ...phase,
          status: 'approved' as PhaseStatus,
          steps: phase.steps.map(step => ({
            ...step,
            status: step.status === 'not_started' ? 'approved' : step.status,
            completedAt: new Date().toISOString(),
          })),
        };
      });

      const currentPhaseIndex = updatedPhases.findIndex(p =>
        p.status !== 'approved' && p.status !== 'skipped'
      );

      return {
        ...feature,
        phases: updatedPhases,
        currentPhase: currentPhaseIndex === -1 ? updatedPhases.length - 1 : currentPhaseIndex,
        updatedAt: new Date().toISOString(),
        overallStatus: getOverallStatus(updatedPhases),
      };
    }));
  }, []);

  const skipPhase = useCallback((featureId: string, phaseId: string) => {
    setFeatures(prev => prev.map(feature => {
      if (feature.id !== featureId) return feature;

      const updatedPhases = feature.phases.map(phase => {
        if (phase.id !== phaseId) return phase;
        return {
          ...phase,
          status: 'skipped' as PhaseStatus,
          steps: phase.steps.map(step => ({
            ...step,
            status: 'skipped' as PhaseStatus,
          })),
        };
      });

      const currentPhaseIndex = updatedPhases.findIndex(p =>
        p.status !== 'approved' && p.status !== 'skipped'
      );

      return {
        ...feature,
        phases: updatedPhases,
        currentPhase: currentPhaseIndex === -1 ? updatedPhases.length - 1 : currentPhaseIndex,
        updatedAt: new Date().toISOString(),
        overallStatus: getOverallStatus(updatedPhases),
      };
    }));
  }, []);

  const deleteFeature = useCallback((featureId: string) => {
    setFeatures(prev => prev.filter(f => f.id !== featureId));
    if (selectedFeatureId === featureId) {
      setSelectedFeatureId(null);
    }
  }, [selectedFeatureId]);

  return (
    <WorkflowContext.Provider value={{
      features,
      selectedFeatureId,
      selectedFeature,
      addFeature,
      selectFeature,
      updateStepStatus,
      approvePhase,
      skipPhase,
      deleteFeature,
    }}>
      {children}
    </WorkflowContext.Provider>
  );
}

function getOverallStatus(phases: Feature['phases']): Feature['overallStatus'] {
  const allApproved = phases.every(p => p.status === 'approved' || p.status === 'skipped');
  if (allApproved) return 'completed';

  const currentPhase = phases.find(p => p.status !== 'approved' && p.status !== 'skipped');
  if (!currentPhase) return 'completed';

  switch (currentPhase.number) {
    case 0:
    case 1:
      return 'planning';
    case 2:
    case 3:
      return 'designing';
    case 4:
      return 'implementing';
    case 5:
      return 'reviewing';
    default:
      return 'planning';
  }
}

export function useWorkflow() {
  const context = useContext(WorkflowContext);
  if (!context) {
    throw new Error('useWorkflow must be used within a WorkflowProvider');
  }
  return context;
}
