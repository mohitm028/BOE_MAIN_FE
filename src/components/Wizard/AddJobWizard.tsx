import { useEffect } from "react";
import { useLocation } from "react-router-dom";
// import { Stepper, Step, StepLabel, Paper } from "@mui/material"; // Removed - Using original design

// Import components
import JobFormWizard from "../Forms/JobDefinition/JobFormWizard";



// Import context hooks
import { useWizard } from "../../contexts/WizardContext";
import { useJob } from "../../contexts/JobContext";
import { useFrequency } from "../../contexts/FrequencyContext";


const AddJobWizard = () => {
  const location = useLocation();

  const {
    currentStep,
    steps,
    wizardData,
    setCurrentStep,
    goToNextStep,
    goToPreviousStep,
    updateWizardData,
    updateStepCompletion,
    resetWizard,
  } = useWizard();

  const { resetJobData } = useJob();
  const { resetFrequencies } = useFrequency();

  // // Handle option selection
  // const handleSelectOption = (option: string) => {
  //   updateWizardData({ selectedOption: option });
  // };

  // Handle continue from option selection
  const handleContinueFromOption = () => {
    if (wizardData.selectedOption) {
      updateStepCompletion(1, true);
      goToNextStep();
    }
  };

  // Handle job definition continue
  const handleJobDefinitionContinue = (data: any) => {
    updateWizardData({ jobDefinition: data });
    updateStepCompletion(2, true);
    goToNextStep();
  };

  // Handle frequency continue
  const handleFrequencyContinue = (frequencies: any) => {
    updateWizardData({ frequencies });
    updateStepCompletion(3, true);
    goToNextStep();
  };

  // Handle review continue
  const handleReviewContinue = () => {
    updateStepCompletion(4, true);
    goToNextStep();
  };

  // Handle final submission
  const handleSubmit = async () => {
    try {
      // Here you would make your API call
      console.log("Final wizard data:", wizardData);
      
      // Mark as completed
      updateStepCompletion(5, true);
      
      // You can add success notification here
    } catch (error) {
      console.error("Submission failed:", error);
      // Handle error
    }
  };

  // Handle add more jobs
  const handleAddMore = () => {
    resetWizard();
    resetJobData();
    resetFrequencies();
  };

  // Handle step click in stepper
  const handleStepClick = (stepNumber: number) => {
    // Only allow going back to previous steps
    if (stepNumber < currentStep) {
      setCurrentStep(stepNumber);
    }
  };

  // Check if we should start at a specific step
  // useEffect(() => {
  //   const state = location.state as { startStep?: number } | null;
  //   if (state?.startStep && currentStep === 1) {
  //     // Set default option for "Add Job" when skipping step 1
  //     updateWizardData({ selectedOption: 'add' });
  //     updateStepCompletion(1, true);
  //     setCurrentStep(state.startStep);
  //   }
  // }, [location.state]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      // Optional: Reset state when component unmounts
      // resetWizard();
      // resetJobData();
      // resetFrequencies();
    };
  }, []);

  return (
    <div className="bg-white min-h-screen">
      {/* Title */}
      <div className="px-8 pt-8 pb-2">
        <h1 className="text-2xl font-semibold text-gray-900">Job Scheduling</h1>
      </div>

      {/* Step Indicator */}
      

      {/* Content */}
      <div className="px-8 pb-8">
        {/* {currentStep === 1 && (
          <OptionSelection
            selectedOption={wizardData.selectedOption}
            onSelectOption={handleSelectOption}
            onContinue={handleContinueFromOption}
          />
        )} */}

        {currentStep === 1 && (
          <JobFormWizard
            onContinue={handleJobDefinitionContinue}
            onBack={goToPreviousStep}
          />
        )}

      </div>
    </div>
  );
};

export default AddJobWizard;
