import * as yup from 'yup';
import { VALIDATION_PATTERNS, ERROR_MESSAGES } from './validation.utils';

/**
 * Progressive validation schema for Job Definition form
 * Phase 1: Primary fields only (jobName, region, lpar)
 * Phase 2: All fields including secondary and conditional
 */

// Phase 1: Primary fields validation (before "Continue" button)
export const jobDefinitionPrimarySchema = yup.object({
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
});

// Phase 2: Complete validation (after "Continue" button)
export const jobDefinitionCompleteSchema = yup.object({
  // Primary fields
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

  // Secondary fields
  uid: yup
    .string()
    .required('UID is required'),

  jclLibrary: yup
    .string()
    .required('JCL Library is required'),

  distributionEmailList: yup
    .string()
    .optional(), // Optional as per original requirements

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

  isJobOnRequest: yup
    .string()
    .required('Job on request selection is required')
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
          const selectedDate = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return selectedDate >= today;
        }),
      otherwise: (schema) => schema.optional(),
    }),



  // EMEA specific fields (EMEA is disabled, so these are optional)
  conditionCodeCheck: yup
    .boolean()
    .optional()
    .default(false),

  calloutPriority: yup
    .string()
    .optional(),


});

// Type definitions
export type JobDefinitionPrimaryData = yup.InferType<typeof jobDefinitionPrimarySchema>;
export type JobDefinitionCompleteData = yup.InferType<typeof jobDefinitionCompleteSchema>;

// Default values for the form
export const jobDefinitionDefaultValues: JobDefinitionCompleteData = {
  // Primary fields
  jobName: '',
  region: "",
  lpar: '',
  
  // Secondary fields
  uid: '255',
  jclLibrary: 'NBSP.NBS.JCLLIB',
  distributionEmailList: "",
  changeRequestNumber: "",
  crqNumber: "",
  isFutureScheduled: 'No',
  isJobOnRequest: 'No',
  
  // Conditional fields
  activateJobOn: '',
 
  conditionCodeCheck: false,
  calloutPriority: '',
};