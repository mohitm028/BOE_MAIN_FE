import React, { ReactNode } from 'react';
import { WizardProvider } from './WizardContext';
import { JobProvider } from './JobContext';
import { FrequencyProvider } from './FrequencyContext';
import { UserProvider } from './UserContext'; // Assuming UserContext is defined elsewhere

interface AppProviderProps {
    children: ReactNode;
}

// Combine all providers into a single component
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
    return (
        <UserProvider>
            <WizardProvider>
                <JobProvider>
                    <FrequencyProvider>{children}</FrequencyProvider>
                </JobProvider>
            </WizardProvider>
        </UserProvider>
    );
};

// Export all hooks for convenience
export { useWizard } from './WizardContext';
export { useJob } from './JobContext';
export { useFrequency } from './FrequencyContext';

// Export all types
export type { WizardData, WizardStep } from './WizardContext';
export type { JobDefinitionData, ValidationError } from './JobContext';
export type { Schedule, DatasetTrigger, JobTrigger } from './FrequencyContext';
