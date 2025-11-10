import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import { JobDefinitionData } from './JobContext';
import { Schedule, DatasetTrigger, JobTrigger } from './FrequencyContext';

// Types
export interface WizardData {
  selectedOption: string | undefined;
  jobDefinition: JobDefinitionData | null;
  frequencies: {
    schedules: Schedule[];
    datasetTriggers: DatasetTrigger[];
    jobTriggers: JobTrigger[];
  };
  showSecondaryFields: boolean;
}

export interface WizardStep {
  number: number;
  title: string;
  isCompleted: boolean;
  isActive: boolean;
}

interface WizardContextType {
  // State
  currentStep: number;
  steps: WizardStep[];
  wizardData: WizardData;
  canProceed: boolean;
  
  // Actions
  setCurrentStep: (step: number) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  updateWizardData: (data: Partial<WizardData>) => void;
  updateStepCompletion: (stepNumber: number, isCompleted: boolean) => void;
  setCanProceed: (value: boolean) => void;
  resetWizard: () => void;
  canNavigateToStep: (step: number) => boolean;
}

// Initial state
const initialWizardData: WizardData = {
  selectedOption: undefined,
  jobDefinition: null,
  frequencies: {
    schedules: [],
    datasetTriggers: [],
    jobTriggers: [],
  },
  showSecondaryFields: false
};

const initialSteps: WizardStep[] = [
//  { number: 1, title: "Select an Option", isCompleted: false, isActive: true },
  { number: 1, title: "Job Information", isCompleted: false, isActive: false },
  { number: 2, title: "Frequency Information", isCompleted: false, isActive: false },
  { number: 3, title: "Review", isCompleted: false, isActive: false },
  { number: 4, title: "Submit", isCompleted: false, isActive: false },
];

// Create context
const WizardContext = createContext<WizardContextType | undefined>(undefined);

// Provider component
export const WizardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentStep, setCurrentStepState] = useState(1);
  const [steps, setSteps] = useState<WizardStep[]>(initialSteps);
  const [wizardData, setWizardData] = useState<WizardData>(initialWizardData);
  const [canProceed, setCanProceed] = useState(false);

  // Update current step and manage step states
  const setCurrentStep = useCallback((stepNumber: number) => {
    setCurrentStepState(stepNumber);
    setSteps(prevSteps => 
      prevSteps.map(step => ({
        ...step,
        isActive: step.number === stepNumber
      }))
    );
  }, []);

  // Navigate to next step
  const goToNextStep = useCallback(() => {
    if (currentStep < steps.length) {
      // Mark current step as completed
      updateStepCompletion(currentStep, true);
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep, steps.length]);

  // Navigate to previous step
  const goToPreviousStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  // Update wizard data
  const updateWizardData = useCallback((data: Partial<WizardData>) => {
    setWizardData(prev => ({
      ...prev,
      ...data,
    }));
  }, []);

  // Update step completion status
  const updateStepCompletion = useCallback((stepNumber: number, isCompleted: boolean) => {
    setSteps(prevSteps =>
      prevSteps.map(step =>
        step.number === stepNumber ? { ...step, isCompleted } : step
      )
    );
  }, []);

  // Check if user can navigate to a specific step
  const canNavigateToStep = useCallback((stepNumber: number) => {
    // Can always go to previous steps or current step
    if (stepNumber <= currentStep) return true;
    
    // Can only go to next step if current step is completed
    if (stepNumber === currentStep + 1) {
      const currentStepData = steps.find(s => s.number === currentStep);
      return currentStepData?.isCompleted || false;
    }
    
    // Cannot skip steps
    return false;
  }, [currentStep, steps]);

  // Reset wizard to initial state
  const resetWizard = useCallback(() => {
    setCurrentStepState(1);
    setSteps(initialSteps);
    setWizardData(initialWizardData);
    setCanProceed(false);
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    currentStep,
    steps,
    wizardData,
    canProceed,
    setCurrentStep,
    goToNextStep,
    goToPreviousStep,
    updateWizardData,
    updateStepCompletion,
    setCanProceed,
    resetWizard,
    canNavigateToStep,
  }), [currentStep, steps, wizardData, canProceed, setCurrentStep, goToNextStep, goToPreviousStep, updateWizardData, updateStepCompletion, setCanProceed, resetWizard, canNavigateToStep]);

  return <WizardContext.Provider value={value}>{children}</WizardContext.Provider>;
};

// Custom hook to use wizard context
export const useWizard = () => {
  const context = useContext(WizardContext);
  if (context === undefined) {
    throw new Error('useWizard must be used within a WizardProvider');
  }
  return context;
};
