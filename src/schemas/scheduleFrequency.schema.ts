import * as yup from 'yup';
import { VALIDATION_PATTERNS, ERROR_MESSAGES, validationHelpers } from './validation.utils';

/**
 * Schedule Frequency Form validation schema
 * Main frequency management interface for schedule management
 * Integrates with FrequencyContext and modals
 */

// Options for dropdowns
export const SCHEDULE_FREQUENCY_OPTIONS = {
  JOB_ON_REQUEST: [
    { value: 'Yes', label: 'Yes' },
    { value: 'No', label: 'No' }
  ],
  SCHEDULE_TYPE: [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'custom', label: 'Custom' }
  ],
  FREQUENCY: [
    { value: 'daily', label: 'Daily' },
    { value: 'weekdays', label: 'Weekdays Only' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' }
  ],
  DAYS_OF_WEEK: [
    { value: 'monday', label: 'Monday' },
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'wednesday', label: 'Wednesday' },
    { value: 'thursday', label: 'Thursday' },
    { value: 'friday', label: 'Friday' },
    { value: 'saturday', label: 'Saturday' },
    { value: 'sunday', label: 'Sunday' }
  ]
};

// Main validation schema
export const scheduleFrequencySchema = yup.object({
  // Primary field - whether job is on request
  isJobOnRequest: yup
    .string()
    .required('Please specify if the job is on request')
    .oneOf(['Yes', 'No'], 'Please select either Yes or No'),

  // Schedule fields (conditional on "No" selection)
  scheduleType: yup
    .string()
    .when('isJobOnRequest', {
      is: 'No',
      then: (schema) => schema
        .required('Schedule type is required')
        .oneOf(['daily', 'weekly', 'monthly', 'custom'], 'Invalid schedule type'),
      otherwise: (schema) => schema.optional(),
    }),

  startTime: yup
    .string()
    .when('isJobOnRequest', {
      is: 'No',
      then: (schema) => schema
        .required('Start time is required')
        .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
      otherwise: (schema) => schema.optional(),
    }),

  frequency: yup
    .string()
    .when('isJobOnRequest', {
      is: 'No',
      then: (schema) => schema
        .required('Frequency is required')
        .oneOf(['daily', 'weekdays', 'weekly', 'monthly'], 'Invalid frequency option'),
      otherwise: (schema) => schema.optional(),
    }),

  // Weekly run days (conditional on weekly frequency)
  runDays: yup
    .array()
    .of(yup.string().oneOf(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']))
    .when('frequency', {
      is: 'weekly',
      then: (schema) => schema
        .min(1, 'Please select at least one day for weekly schedule')
        .required('Days are required for weekly schedule'),
      otherwise: (schema) => schema.optional(),
    }),

  // Additional fields for completeness
  holidayAction: yup
    .string()
    .when('isJobOnRequest', {
      is: 'No',
      then: (schema) => schema
        .oneOf(['run-on-holiday', 'skip-holiday', 'defer-to-next'], 'Invalid holiday action'),
      otherwise: (schema) => schema.optional(),
    }),

  // Monthly day selection
  monthlyDay: yup
    .number()
    .when(['frequency', 'scheduleType'], {
      is: (frequency: string, scheduleType: string) => frequency === 'monthly' || scheduleType === 'monthly',
      then: (schema) => schema
        .required('Day of month is required')
        .min(1, 'Day must be between 1 and 31')
        .max(31, 'Day must be between 1 and 31'),
      otherwise: (schema) => schema.optional(),
    }),

  // Custom pattern for complex schedules
  customPattern: yup
    .string()
    .when('scheduleType', {
      is: 'custom',
      then: (schema) => schema
        .required('Custom pattern is required')
        .min(1, 'Pattern cannot be empty'),
      otherwise: (schema) => schema.optional(),
    })
});

// Type definition for the form data
export type ScheduleFrequencyFormData = yup.InferType<typeof scheduleFrequencySchema>;

// Default values for the form
export const defaultScheduleFrequencyValues: ScheduleFrequencyFormData = {
  isJobOnRequest: '',
  scheduleType: undefined,
  startTime: undefined,
  frequency: undefined,
  runDays: undefined,
  holidayAction: undefined,
  monthlyDay: undefined,
  customPattern: undefined
};

// Validation helper functions for additional validation logic
export const scheduleFrequencyHelpers = {
  // Check if job requires scheduling
  requiresScheduling: (isJobOnRequest: string): boolean => {
    return isJobOnRequest === 'No';
  },

  // Generate cron expression from schedule settings
  generateCronExpression: (
    scheduleType: string,
    startTime: string,
    frequency: string,
    runDays?: string[]
  ): string => {
    const [hour, minute] = startTime.split(':').map(Number);
    
    switch (scheduleType) {
      case 'daily':
        return `${minute} ${hour} * * *`;
      case 'weekly':
        if (runDays?.length) {
          const dayMap: { [key: string]: number } = {
            'sunday': 0, 'monday': 1, 'tuesday': 2, 'wednesday': 3,
            'thursday': 4, 'friday': 5, 'saturday': 6
          };
          const days = runDays.map(day => dayMap[day]).join(',');
          return `${minute} ${hour} * * ${days}`;
        }
        return `${minute} ${hour} * * 1-5`;
      case 'monthly':
        return `${minute} ${hour} 1 * *`; // First day of month by default
      default:
        return `${minute} ${hour} * * *`;
    }
  },

  // Validate time conflicts
  hasTimeConflicts: (
    startTime: string,
    endTime?: string
  ): boolean => {
    if (!endTime) return false;
    
    const start = new Date(`1970-01-01T${startTime}:00`);
    const end = new Date(`1970-01-01T${endTime}:00`);
    
    return start >= end;
  }
};