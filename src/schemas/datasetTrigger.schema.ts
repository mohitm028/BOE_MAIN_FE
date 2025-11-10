import * as yup from 'yup';


export const datasetTriggerSchema = yup.object({
  // NDM Transmission toggle
  isNdmTransmission: yup
    .boolean()
    .default(false),

  // Source job or process name - always required
  sourceJobName: yup
    .string()
    .required('Source job or process name is required')
    .matches(/^[A-Z0-9]+$/, 'Only uppercase letters and numbers allowed')
    .max(8, 'Maximum 8 characters allowed'),

  // NDM source node - only required when NDM transmission is enabled
  ndmSourceNode: yup
    .string()
    .when('isNdmTransmission', {
      is: true,
      then: (schema) => schema
        .required('NDM source node is required')
        .matches(/^[A-Z0-9]+$/, 'Only uppercase letters and numbers allowed')
        .max(8, 'Maximum 8 characters allowed'),
      otherwise: (schema) => schema.optional(),
    }),

  // Dataset name - auto-generated from other fields
  datasetName: yup
    .string()
    .required('Dataset name is required')
    .max(44, 'Dataset name cannot be longer than 44 characters')
    .test('dataset-rules', 'Invalid dataset name', function(value) {
      if (!value) return false;
      
      // Check for at least two segments
      const segments = value.split('.');
      if (segments.length < 2) {
        return this.createError({
          message: 'Dataset name must have at least two segments separated by periods'
        });
      }
      
      // Check for double periods
      if (value.includes('..')) {
        return this.createError({
          message: 'Dataset name cannot contain two successive periods'
        });
      }
      
      // Check for ending period
      if (value.endsWith('.')) {
        return this.createError({
          message: 'Dataset name cannot end with a period'
        });
      }
      
      // Check each segment
      for (const segment of segments) {
        // Empty segment check
        if (!segment || segment.trim() === '') {
          return this.createError({
            message: 'Dataset segments cannot be empty'
          });
        }
        
        // Segment length check
        if (segment.length > 8) {
          return this.createError({
            message: `Segment '${segment}' cannot be longer than 8 characters`
          });
        }
        
        // First character check
        if (!/^[A-Z#@$]/.test(segment[0])) {
          return this.createError({
            message: `First character of segment '${segment}' must be a letter or #, @, $`
          });
        }
        
        // All characters check
        if (!/^[A-Z0-9#@$-]+$/.test(segment)) {
          return this.createError({
            message: `Segment '${segment}' contains invalid characters`
          });
        }
      }
      
      // Check for accented characters
      if (/[àáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ]/i.test(value)) {
        return this.createError({
          message: 'Dataset name cannot contain accented characters'
        });
      }
      
      return true;
    }),
});

// Type inference from schema
export type DatasetTriggerFormData = yup.InferType<typeof datasetTriggerSchema>;

// Default values for the form
export const defaultDatasetTriggerValues: DatasetTriggerFormData = {
  isNdmTransmission: false,
  sourceJobName: '',
  ndmSourceNode: '',
  datasetName: '',
};

// Helper to generate dataset name
export const generateDatasetName = (
  sourceJobName: string,
  isNdmTransmission: boolean,
  ndmSourceNode?: string,
  jobName?: string
): string => {
    
  let datasetName = 'CA7TRIG.CA7P.'+jobName;
  
  if (sourceJobName) {
    datasetName += '.' + sourceJobName;
  }
  
  if (isNdmTransmission && ndmSourceNode) {
    datasetName += '.' + ndmSourceNode;
  }
  
  return datasetName;
};
