import * as yup from 'yup';

// Calendar Scheduling validation schema based on old project patterns
export const calendarSchedulingSchema = yup.object({
  // Basic scheduling information
  scheduleType: yup
    .string()
    .required('Schedule type is required')
    .oneOf(['one-time', 'recurring'], 'Invalid schedule type'),

  // Date/time fields
  scheduleDate: yup
    .string()
    .required('Schedule date is required')
    .test('future-date', 'Date must be in the future', function(value) {
      if (!value) return false;
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    }),

  scheduleHour: yup
    .string()
    .required('Schedule hour is required')
    .matches(/^(0[0-9]|1[0-9]|2[0-3])$/, 'Invalid hour format (00-23)'),

  scheduleMinute: yup
    .string()
    .required('Schedule minute is required')
    .matches(/^[0-5][0-9]$/, 'Invalid minute format (00-59)'),

  // Recurring schedule fields
  frequency: yup
    .string()
    .when('scheduleType', {
      is: 'recurring',
      then: (schema) => schema
        .required('Frequency is required for recurring schedules')
        .oneOf([
          'Daily',
          'Weekly', 
          'Monthly',
          'Annually'
        ], 'Invalid frequency'),
      otherwise: (schema) => schema.optional(),
    }),

  // Weekly specific
  runDays: yup
    .array()
    .of(yup.string().required())
    .when(['scheduleType', 'frequency'], {
      is: (scheduleType: string, frequency: string) => 
        scheduleType === 'recurring' && frequency === 'Weekly',
      then: (schema) => schema
        .min(1, 'Please select at least one day for weekly schedules')
        .required('Run days are required for weekly frequency'),
      otherwise: (schema) => schema.optional(),
    }),

  // Monthly specific
  dayOfMonth: yup
    .number()
    .when(['scheduleType', 'frequency'], {
      is: (scheduleType: string, frequency: string) => 
        scheduleType === 'recurring' && frequency === 'Monthly',
      then: (schema) => schema
        .required('Day of month is required for monthly schedules')
        .min(1, 'Day must be between 1 and 31')
        .max(31, 'Day must be between 1 and 31'),
      otherwise: (schema) => schema.optional(),
    }),

  // End date for recurring schedules
  endDate: yup
    .string()
    .when('scheduleType', {
      is: 'recurring',
      then: (schema) => schema
        .optional()
        .test('end-after-start', 'End date must be after start date', function(value) {
          if (!value) return true; // End date is optional
          const { scheduleDate } = this.parent;
          if (!scheduleDate) return true;
          
          return new Date(value) > new Date(scheduleDate);
        }),
      otherwise: (schema) => schema.optional(),
    }),

  // Description
  description: yup
    .string()
    .max(255, 'Description must be 255 characters or less')
    .optional(),

  // Priority
  priority: yup
    .string()
    .optional()
    .oneOf(['Low', 'Normal', 'High', 'Critical'], 'Invalid priority level'),
});

// Type inference from schema  
export type CalendarSchedulingFormData = yup.InferType<typeof calendarSchedulingSchema>;