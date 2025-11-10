import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// Types
export interface JobDefinitionData {
  // Primary fields
  jobName: "";
  region: "";
  lpar: "";
  
  // Secondary fields
  uid: "";
  jclLibrary: "";
  distributionEmailList: "";
  changeRequestNumber: "";
  crqNumber: "";
  isFutureScheduled: "";
  
  // Future schedule fields
  activateJobOn: "";
  activationTimeHH: "";
  activationTimeMM: "";
  
  // EMEA specific fields
  conditionCodeCheck: boolean;
  calloutPriority: "";
  
  // Other fields
  isJobOnRequest: "";
}

export interface ValidationError {
  field: "";
  message: "";
}

interface JobContextType {
  // State
  jobData: JobDefinitionData | null;
  isValidating: boolean;
  showSecondaryFields: boolean;
  validationErrors: ValidationError[];
  apiCallFailed: boolean;
  
  // Actions
  updateJobData: (data: Partial<JobDefinitionData>) => void;
  setJobData: (data: JobDefinitionData) => void;
  validatePrimaryFields: () => Promise<boolean>;
  validateAllFields: () => boolean;
  setShowSecondaryFields: (show: boolean) => void;
  resetJobData: () => void;
  submitJob: () => Promise<boolean>;
}

// Initial job data
const initialJobData: JobDefinitionData = {
  jobName: '',
  region: '',
  lpar: '',
  uid: '255',
  jclLibrary: 'NBSP.NBS.JCLLIB',
  distributionEmailList: '',
  changeRequestNumber: '',
  crqNumber: '',
  isFutureScheduled: 'No',
  activateJobOn: '',
  activationTimeHH: '',
  activationTimeMM: '',
  conditionCodeCheck: false,
  calloutPriority: '',
  isJobOnRequest: 'No',
};

// Create context
const JobContext = createContext<JobContextType | undefined>(undefined);

// Provider component
export const JobProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [jobData, setJobDataState] = useState<JobDefinitionData | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [showSecondaryFields, setShowSecondaryFields] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [apiCallFailed, setApiCallFailed] = useState(false);

  // Validation regex patterns
  const jobNameRegex = /^[A-Z@#$][A-Z0-9@#$]{8}$/;
  const regionRegex = /^[a-zA-Z]+$/;
  const lparRegex = /^[a-zA-Z0-9]+$/;

  // Update job data partially
  const updateJobData = useCallback((data: Partial<JobDefinitionData>) => {
    setJobDataState(prev => ({
      ...(prev || initialJobData),
      ...data,
    }));
  }, []);

  // Set complete job data
  const setJobData = useCallback((data: JobDefinitionData) => {
    setJobDataState(data);
  }, []);

  // Validate primary fields (first 3 fields)
  const validatePrimaryFields = useCallback(async (): Promise<boolean> => {
    const errors: ValidationError[] = [];
    
    if (!jobData) {
      setValidationErrors([{ field: 'general', message: 'No job data provided' }]);
      return false;
    }

    // Validate job name
    if (!jobData.jobName) {
      errors.push({ field: 'jobName', message: 'Job Name is required' });
      } 
    else if (!jobNameRegex.test(jobData.jobName)) {
      errors.push({ 
        field: 'jobName', 
        message: 'Job Name must be 8 character, cannot start with a number and can contain A-Z, 0-9, @, # or $. All chars must be uppercase' 
      });
    }

    // Validate region
    if (!jobData.region) {
      errors.push({ field: 'region', message: 'Region is required' });
    } else if (!regionRegex.test(jobData.region)) {
      errors.push({ field: 'region', message: 'Region must contain only alphabets' });
    }

    // Validate LPAR
    if (!jobData.lpar) {
      errors.push({ field: 'lpar', message: 'LPAR is required' });
    } else if (!lparRegex.test(jobData.lpar)) {
      errors.push({ field: 'lpar', message: 'LPAR must be alphanumeric' });
    }

    setValidationErrors(errors);

    if (errors.length === 0) {
      // Simulate API call for validation
      setIsValidating(true);
      setApiCallFailed(false);
      
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setShowSecondaryFields(true);
        return true;
      } catch (error) {
        setApiCallFailed(true);
        console.error('API validation failed:', error);
        return false;
      } finally {
        setIsValidating(false);
      }
    }

    return false;
  }, [jobData, jobNameRegex, regionRegex, lparRegex]);

  // Validate all fields
  const validateAllFields = useCallback((): boolean => {
    if (!jobData) return false;

    const errors: ValidationError[] = [];

    // Primary field validation
    if (!jobData.jobName || !jobNameRegex.test(jobData.jobName)) {
      errors.push({ field: 'jobName', message: 'Invalid job name' });
    }
    if (!jobData.region || !regionRegex.test(jobData.region)) {
      errors.push({ field: 'region', message: 'Invalid region' });
    }
    if (!jobData.lpar || !lparRegex.test(jobData.lpar)) {
      errors.push({ field: 'lpar', message: 'Invalid LPAR' });
    }

    // Secondary field validation
    if (!jobData.uid) {
      errors.push({ field: 'uid', message: 'UID is required' });
    }
    if (!jobData.jclLibrary) {
      errors.push({ field: 'jclLibrary', message: 'JCL Library is required' });
    }

    // Future schedule validation
    if (jobData.isFutureScheduled === 'Yes') {
      if (!jobData.activateJobOn) {
        errors.push({ field: 'activateJobOn', message: 'Activation date is required' });
      }
     
    }

    // EMEA specific validation
    if (jobData.region === 'EMEA' && !jobData.calloutPriority) {
      errors.push({ field: 'calloutPriority', message: 'Callout Priority is required for EMEA region' });
    }

    setValidationErrors(errors);
    return errors.length === 0;
  }, [jobData, jobNameRegex, regionRegex, lparRegex]);

  // Reset job data
  const resetJobData = useCallback(() => {
    setJobDataState(null);
    setShowSecondaryFields(false);
    setValidationErrors([]);
    setApiCallFailed(false);
    setIsValidating(false);
  }, []);

  // Submit job
  const submitJob = useCallback(async (): Promise<boolean> => {
    if (!validateAllFields()) {
      return false;
    }

    try {
      setIsValidating(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Job submitted successfully:', jobData);
      return true;
    } catch (error) {
      console.error('Job submission failed:', error);
      return false;
    } finally {
      setIsValidating(false);
    }
  }, [jobData, validateAllFields]);

  const value: JobContextType = {
    jobData,
    isValidating,
    showSecondaryFields,
    validationErrors,
    apiCallFailed,
    updateJobData,
    setJobData,
    validatePrimaryFields,
    validateAllFields,
    setShowSecondaryFields,
    resetJobData,
    submitJob,
  };

  return <JobContext.Provider value={value}>{children}</JobContext.Provider>;
};

// Custom hook to use job context
export const useJob = () => {
  const context = useContext(JobContext);
  if (context === undefined) {
    throw new Error('useJob must be used within a JobProvider');
  }
  return context;
};
