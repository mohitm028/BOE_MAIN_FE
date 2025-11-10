import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// Types
export interface Schedule {
  id: string;
  schidId: string;
  frequency: string;
  submitTimeHour: string;
  submitTimeMinute: string;
  holidayAction: string;
  hasIntervals: boolean;
  expectedDays?: string[];
  runDays?: string[];
  runMonths?: string[];
  runOccurrences?: string[];
  holidays?: string[];
  repeatStartHour?: string;
  repeatStartMinute?: string;
  repeatEndHour?: string;
  repeatEndMinute?: string;
  repeatType?: string;
  repeatIntervalHour?: string;
  repeatIntervalMinute?: string;
}

export interface DatasetTrigger {
  id: string;
  datasetName: string;
  isNdmTransmission: boolean;
  ndmSourceNode?: string;
  sourceJobName?: string;
  sourceJobLpar?: string;
  triggerCondition?: string;
  description?: string;
}

export interface JobTrigger {
  id: string;
  triggerJobName: string;
  triggerJobLpar: string;
  triggerCondition: string;
  description?: string;
}

interface FrequencyContextType {
  // State
  schedules: Schedule[];
  datasetTriggers: DatasetTrigger[];
  jobTriggers: JobTrigger[];
  
  // Schedule Actions
  addSchedule: (schedule: Omit<Schedule, 'id' | 'schidId'>) => void;
  updateSchedule: (id: string, data: Partial<Schedule>) => void;
  removeSchedule: (id: string) => void;
  
  // Dataset Trigger Actions
  addDatasetTrigger: (trigger: Omit<DatasetTrigger, 'id'>) => void;
  updateDatasetTrigger: (id: string, data: Partial<DatasetTrigger>) => void;
  removeDatasetTrigger: (id: string) => void;
  
  // Job Trigger Actions
  addJobTrigger: (trigger: Omit<JobTrigger, 'id'>) => void;
  updateJobTrigger: (id: string, data: Partial<JobTrigger>) => void;
  removeJobTrigger: (id: string) => void;
  
  // General Actions
  hasAnyFrequency: () => boolean;
  resetFrequencies: () => void;
  getFrequencySummary: () => { scheduleCount: number; datasetCount: number; jobCount: number };
}

// Helper function to generate unique ID
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Create context
const FrequencyContext = createContext<FrequencyContextType | undefined>(undefined);

// Provider component
export const FrequencyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [datasetTriggers, setDatasetTriggers] = useState<DatasetTrigger[]>([]);
  const [jobTriggers, setJobTriggers] = useState<JobTrigger[]>([]);

  // Schedule Actions
  const addSchedule = useCallback((schedule: Omit<Schedule, 'id' | 'schidId'>) => {
    
     //Determine the schidId based on the current length
    const frequencyBase:Record<string, number> = {
      "Daily": 10,
      "Weekly": 20,
      "Monthly": 30,
      "Annually": 40,
    };
    const frequencyKey = schedule.frequency;
    const baseSchidId = frequencyBase[frequencyKey];
     if (baseSchidId === undefined) {
      console.error(`Invalid frequency type: ${schedule.frequency}`);
      return;
    }
    setSchedules((prevSchedules) => {
    const exisingSchedules = prevSchedules.filter(
      (s) => s.frequency.toLowerCase() === frequencyKey.toLowerCase()
    );
    
   
    const newSchid =baseSchidId + exisingSchedules.length + 1; // Start from base and increment
    console.log('Calculated schidId:', newSchid);

    // Create new schedule with generated ID and schidId

    const newSchedule: Schedule = {
      ...schedule,
      id: generateId(),
      schidId: newSchid.toString(), // Convert to string for consistency
    };
     return [...prevSchedules, newSchedule];
    } );
  },[]);

  const updateSchedule = useCallback((id: string, data: Partial<Schedule>) => {
    setSchedules(prev => 
      prev.map(schedule => 
        schedule.id === id ? { ...schedule, ...data } : schedule
      )
    );
  }, []);

  const removeSchedule = useCallback((id: string) => {
    setSchedules(prev => prev.filter(schedule => schedule.id !== id));
  }, []);

  // Dataset Trigger Actions
  const addDatasetTrigger = useCallback((trigger: Omit<DatasetTrigger, 'id'>) => {
    // Maximum 10 dataset triggers allowed
    if (datasetTriggers.length >= 10) {
      console.warn('Maximum 5 dataset triggers allowed');
      return;
    }
    
    const newTrigger: DatasetTrigger = {
      ...trigger,
      id: generateId(),
    };
    
    setDatasetTriggers(prev => [...prev, newTrigger]);
  }, [datasetTriggers.length]);

  const updateDatasetTrigger = useCallback((id: string, data: Partial<DatasetTrigger>) => {
    setDatasetTriggers(prev => 
      prev.map(trigger => 
        trigger.id === id ? { ...trigger, ...data } : trigger
      )
    );
  }, []);

  const removeDatasetTrigger = useCallback((id: string) => {
    setDatasetTriggers(prev => prev.filter(trigger => trigger.id !== id));
  }, []);

  // Job Trigger Actions
  const addJobTrigger = useCallback((trigger: Omit<JobTrigger, 'id'>) => {
    const newTrigger: JobTrigger = {
      ...trigger,
      id: generateId(),
    };
    
    setJobTriggers(prev => [...prev, newTrigger]);
  }, []);

  const updateJobTrigger = useCallback((id: string, data: Partial<JobTrigger>) => {
    setJobTriggers(prev => 
      prev.map(trigger => 
        trigger.id === id ? { ...trigger, ...data } : trigger
      )
    );
  }, []);

  const removeJobTrigger = useCallback((id: string) => {
    setJobTriggers(prev => prev.filter(trigger => trigger.id !== id));
  }, []);

  // General Actions
  const hasAnyFrequency = useCallback((): boolean => {
    return schedules.length > 0 || datasetTriggers.length > 0 || jobTriggers.length > 0;
  }, [schedules.length, datasetTriggers.length, jobTriggers.length]);

  const resetFrequencies = useCallback(() => {
    setSchedules([]);
    setDatasetTriggers([]);
    setJobTriggers([]);
  }, []);

  const getFrequencySummary = useCallback(() => {
    return {
      scheduleCount: schedules.length,
      datasetCount: datasetTriggers.length,
      jobCount: jobTriggers.length,
    };
  }, [schedules.length, datasetTriggers.length, jobTriggers.length]);

  const value: FrequencyContextType = {
    schedules,
    datasetTriggers,
    jobTriggers,
    addSchedule,
    updateSchedule,
    removeSchedule,
    addDatasetTrigger,
    updateDatasetTrigger,
    removeDatasetTrigger,
    addJobTrigger,
    updateJobTrigger,
    removeJobTrigger,
    hasAnyFrequency,
    resetFrequencies,
    getFrequencySummary,
  };

  return <FrequencyContext.Provider value={value}>{children}</FrequencyContext.Provider>;
};

// Custom hook to use frequency context
export const useFrequency = () => {
  const context = useContext(FrequencyContext);
  if (context === undefined) {
    throw new Error('useFrequency must be used within a FrequencyProvider');
  }
  return context;
};
