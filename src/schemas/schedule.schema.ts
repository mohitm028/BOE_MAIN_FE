import * as yup from 'yup';
import { VALIDATION_PATTERNS, ERROR_MESSAGES, validationHelpers } from './validation.utils';

export interface ScheduleFormData {
    frequency: string;
  submitTimeHour: string;
  submitTimeMinute: string;
  holidayAction: string;
  holidaySubAction?: string;
  hasIntervals: boolean;
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
// Schedule validation schema with comprehensive rules from old project  
export const scheduleSchema = yup.object({
  frequency: yup
    .string()
    .required('Frequency is required')
    .oneOf([
      'Daily',
      'Weekly',
      'Monthly',
      'Annually',
      'Run Only on holiday',
      'Run Only on day before holiday',
      'Run Only on day after holiday',
    ]),

  submitTimeHour: yup
    .string()
    .required('Submit hour is required')
    .matches(VALIDATION_PATTERNS.HOUR, ERROR_MESSAGES.FORMAT.INVALID_HOUR),


  holidayAction: yup
    .string()
    .when('frequency', {
      is: (value: string) => value && (value.includes('Monthly') || value.includes('Annually') || value.includes('Daily') || value.includes('Weekly')),
      then: (schema) => schema.required('Holiday action is required'),
      otherwise: (schema) => schema.optional(),
    })
    .required('Holiday action is required'),

  holidaySubAction: yup
    .string()
    .when('holidayAction', {
      is: 'do-not-run',
      then: (schema) => schema
        .required('Please select when not to run the job')
        .oneOf(['onHoliday', 'after-holiday']),
      otherwise: (schema) => schema.optional(),
    }),

  // Conditional fields based on frequency
  runDays: yup
    .array()
    .of(yup.string().required())
    .when('frequency', {
      is: 'Weekly',
      then: (schema) => schema
        .min(1, 'Please select at least one day for weekly frequency')
        .required('Run days are required for weekly frequency'),
      otherwise: (schema) => schema.optional(),
    }),

  runMonths: yup
    .array()
    .of(yup.string().required())
    .when('frequency', {
      is: 'Monthly',
      then: (schema) => schema
        .min(1, 'Please select at least one month')
        .required('Months are required for monthly frequency'),
      otherwise: (schema) => schema.optional(),
    }),

  runOccurrences: yup
    .array()
    .of(yup.string().required())
    .optional(),

  holidays: yup
    .array()
    .of(yup.string().required())
    .when('frequency', {
      is: (value: string) => value && (value.includes('holiday')),
      then: (schema) => schema
        .min(1, 'Please select at least one holiday')
        .required('Holidays are required for holiday-based frequency'),
      otherwise: (schema) => schema.optional(),
    }),

  // Interval fields
  hasIntervals: yup
    .boolean()
    .default(false),

  repeatStartHour: yup
    .string()
    .when('hasIntervals', {
      is: true,
      then: (schema) => schema
        .required('Repeat start hour is required')
        .matches(VALIDATION_PATTERNS.HOUR, ERROR_MESSAGES.FORMAT.INVALID_HOUR),
      otherwise: (schema) => schema.optional(),
    }),

  repeatStartMinute: yup
    .string()
    .when('hasIntervals', {
      is: true,
      then: (schema) => schema
        .required('Repeat start minute is required')
        .matches(VALIDATION_PATTERNS.MINUTE, ERROR_MESSAGES.FORMAT.INVALID_MINUTE),
      otherwise: (schema) => schema.optional(),
    }),

  repeatEndHour: yup
    .string()
    .when('hasIntervals', {
      is: true,
      then: (schema) => schema
        .required('Repeat end hour is required')
        .matches(VALIDATION_PATTERNS.HOUR, ERROR_MESSAGES.FORMAT.INVALID_HOUR)
        .test('end-after-start', ERROR_MESSAGES.CONDITIONAL.END_AFTER_START, function(value) {
          const { repeatStartHour, repeatStartMinute, repeatEndMinute } = this.parent;
          if (!value || !repeatStartHour) return true;
          
          return validationHelpers.isTimeAfter(
            value, 
            repeatEndMinute || '0', 
            repeatStartHour, 
            repeatStartMinute || '0'
          );
        }),
      otherwise: (schema) => schema.optional(),
    }),

  repeatEndMinute: yup
    .string()
    .when('hasIntervals', {
      is: true,
      then: (schema) => schema
        .required('Repeat end minute is required')
        .matches(VALIDATION_PATTERNS.MINUTE, ERROR_MESSAGES.FORMAT.INVALID_MINUTE),
      otherwise: (schema) => schema.optional(),
    }),

  repeatType: yup
    .string()
    .when('hasIntervals', {
      is: true,
      then: (schema) => schema
        .required('Repeat type is required')
        .oneOf(['C', 'S', 'E'], 'Invalid repeat type'),
      otherwise: (schema) => schema.optional(),
    }),

  repeatIntervalHour: yup
    .string()
    .when('hasIntervals', {
      is: true,
      then: (schema) => schema
        .required('Repeat interval hour is required')
        .test('min-interval', ERROR_MESSAGES.CONDITIONAL.MIN_INTERVAL, function(value) {
          const { repeatIntervalMinute } = this.parent;
          if (!value) return false;
          
          return validationHelpers.isMinimumInterval(value, repeatIntervalMinute || '0');
        }),
      otherwise: (schema) => schema.optional(),
    }),

  repeatIntervalMinute: yup
    .string()
    .when('hasIntervals', {
      is: true,
      then: (schema) => schema
        .required('Repeat interval minute is required')
        .matches(VALIDATION_PATTERNS.MINUTE, ERROR_MESSAGES.FORMAT.INVALID_MINUTE),
      otherwise: (schema) => schema.optional(),
    }),
});

// Type inference from schema
export type ScheduleFormData = yup.InferType<typeof scheduleSchema>;
