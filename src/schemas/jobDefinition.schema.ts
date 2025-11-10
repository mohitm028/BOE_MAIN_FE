import * as yup from 'yup';
import { VALIDATION_PATTERNS, ERROR_MESSAGES, validationHelpers } from './validation.utils';

// Job Definition validation schema matching original form validations exactly
export const jobDefinitionSchema = yup.object({
  // Primary fields (must be completed first - progressive disclosure)
  jobName: yup
    .string()
    .required(ERROR_MESSAGES.REQUIRED.JOB_NAME)
    .matches(VALIDATION_PATTERNS.JOB_NAME, ERROR_MESSAGES.FORMAT.JOB_NAME),

  region: yup
    .string()
    .required(ERROR_MESSAGES.REQUIRED.REGION)
    .matches(VALIDATION_PATTERNS.REGION, ERROR_MESSAGES.FORMAT.REGION),

  lpar: yup
    .string()
    .required(ERROR_MESSAGES.REQUIRED.LPAR)
    .matches(VALIDATION_PATTERNS.LPAR, ERROR_MESSAGES.FORMAT.LPAR),

  // Secondary fields - only required after primary fields are completed
  uid: yup
    .string()
    .required('UID is required'),

  jclLibrary: yup
    .string()
    .required('JCL Library is required'),

  distributionEmailList: yup
    .string()
    .required('Distribution Email List is required'),

  changeRequestNumber: yup
    .string()
    .optional(),

  crqNumber: yup
    .string()
    .optional(),

  isFutureScheduled: yup
    .string()
    .required('Future schedule selection is required')
    .oneOf(['Yes', 'No']),

  // Conditional fields for future schedule
  activateJobOn: yup
    .string()
    .when('isFutureScheduled', {
      is: 'Yes',
      then: (schema) => schema
        .required(ERROR_MESSAGES.REQUIRED.ACTIVATION_DATE)
        .test('future-date', ERROR_MESSAGES.CONDITIONAL.FUTURE_DATE, function(value) {
          if (!value) return false;
          return validationHelpers.isFutureDate(value);
        }),
      otherwise: (schema) => schema.optional(),
    }),

  activationTimeHH: yup
    .string()
    .when('isFutureScheduled', {
      is: 'Yes',
      then: (schema) => schema
        .required('Activation hour is required')
        .matches(VALIDATION_PATTERNS.HOUR, ERROR_MESSAGES.FORMAT.INVALID_HOUR),
      otherwise: (schema) => schema.optional(),
    }),

  activationTimeMM: yup
    .string()
    .when('isFutureScheduled', {
      is: 'Yes',
      then: (schema) => schema
        .required('Activation minute is required')
        .matches(VALIDATION_PATTERNS.MINUTE, ERROR_MESSAGES.FORMAT.INVALID_MINUTE),
      otherwise: (schema) => schema.optional(),
    }),

  // EMEA specific fields
  conditionCodeCheck: yup
    .boolean()
    .default(false),

  calloutPriority: yup
    .string()
    .when('region', {
      is: 'EMEA',
      then: (schema) => schema
        .required(ERROR_MESSAGES.CONDITIONAL.EMEA_CALLOUT)
        .oneOf(['1', '2', '3', '4', '5'], 'Callout Priority must be between 1 and 5'),
      otherwise: (schema) => schema.optional(),
    }),

  isJobOnRequest: yup
    .string()
    .optional(),
});

// Type inference from schema
export type JobDefinitionFormData = yup.InferType<typeof jobDefinitionSchema>;
