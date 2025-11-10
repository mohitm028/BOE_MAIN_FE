import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  OutlinedInput
} from '@mui/material';

// Import schemas and types
import {
  jobDefinitionPrimarySchema,
  jobDefinitionCompleteSchema,
  JobDefinitionCompleteData,
  jobDefinitionDefaultValues
} from '../../../schemas/jobDefinitionProgressive.schema';

// Import validation utilities
import {
  DROPDOWN_OPTIONS,
  generateTimeOptions
} from '../../../schemas/validation.utils';

// Import context hooks
import { useWizard } from '../../../contexts/WizardContext';
import { useJob } from '../../../contexts/JobContext';
import JobDefinitionForm from './JobDefinitionForm';


interface JobDefinitionFormWizardProps {
  onContinue: (data: JobDefinitionCompleteData) => void;
  modelMessage?: string;
  modelIcon?: 'success' | 'error';
}

const JobDefinitionFormWizard: React.FC<JobDefinitionFormWizardProps> = ({
  
}) => {
  const { updateWizardData } = useWizard();
  const { jobData, setJobData } = useJob();
  const[modelMessage, setModelMessage] = useState("Job added successfully!");
  const[modelIcon, setModelIcon] = useState("success");

  // State management
  const [showSecondaryFields, setShowSecondaryFields] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [removeConditionCode, setRemoveConditionCode] = useState(false);

  // Add at the top of your component
const [showSuccess, setShowSuccess] = useState(false);
const [submittedJobs, setSubmittedJobs] = useState<JobDefinitionCompleteData[]>([]);

  // Initialize form with React Hook FormhandleBackFromFrequency
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    trigger,
    getValues,
    setValue, 
    reset,
  } = useForm<JobDefinitionCompleteData>({
    resolver: yupResolver(
      showSecondaryFields ? jobDefinitionCompleteSchema : jobDefinitionPrimarySchema
    ),
    mode: 'onChange',
    defaultValues: {
      ...jobDefinitionDefaultValues,
      ...jobData,
    },
  });


  // Watch fields for conditional rendering
  const watchedFields = watch();
  const region = watchedFields.region;
  const isFutureScheduled = watchedFields.isFutureScheduled;
  const isEmeaRegion = region === 'EMEA';

  // Check if primary fields are valid
  const arePrimaryFieldsValid = () => {
    const { jobName, region, lpar } = getValues();
    return Boolean(jobName && region && lpar);
  };


  // Handle primary validation and API call
  const handlePrimaryValidation = async () => {
    const isValid = await trigger(['jobName', 'region', 'lpar']);

    if (isValid) {
      try {
        setIsValidating(true);
       // setApiCallFailed(false);

        const primaryData = getValues(['jobName', 'region', 'lpar']);
        setJobData(prev => ({ ...prev, ...primaryData }));

        await new Promise(resolve => setTimeout(resolve, 1500));

        setShowSecondaryFields(true);

        if (primaryData.region === 'EMEA') {
          setValue('conditionCodeCheck', true);
        }
      } catch (error) {
      //  setApiCallFailed(true);
        console.error('API validation failed:', error);
        setShowSecondaryFields(true);
      } finally {
        setIsValidating(false);
      }
    }
  };

  const handleCloseModal = () => {
    setShowSuccess(false);
  };

  // Handle final form submission
  const onSubmit = async (data: JobDefinitionCompleteData) => {
    try {
      console.log('=== FORM SUBMISSION DEBUG ===');
      console.log('1. Data being submitted:', data);
      console.log('2. Form validation state - isValid:', isValid);
      console.log('3. Form errors:', errors);
      console.log('4. All form values:', getValues());
      console.log('5. Is EMEA Region:', isEmeaRegion);
      console.log('6. Remove condition code:', removeConditionCode);
      setShowSuccess(true); 
      setTimeout(() => setShowSuccess(false), 2000);
      if (isEmeaRegion && removeConditionCode) {
        data.conditionCodeCheck = false;
      }
      const isDuplicate = submittedJobs.some(
        job => job.jobName === data.jobName && job.region === data.region && job.lpar === data.lpar
      );  
      if (isDuplicate) {
        console.warn('Duplicate job submission detected:', data);
        setModelMessage("Duplicate job submission detected.");
        setModelIcon("error");
        return;
      }

      // Normalize and set job data
      const normalizedData = {
        ...data,
        jobName: data.jobName.toUpperCase(),
      };
      setJobData(normalizedData);
      updateWizardData({ jobDefinition: normalizedData });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Update submitted jobs and show success message
  setSubmittedJobs(prev => [...prev, data]); // Add to list
  console.log('Setting showSuccess to true');

  
  setModelMessage("Job added successfully!");
  setModelIcon("success");   
    } catch (error) {
      console.error('Form submission error:', error);
      alert('Form submission failed. Please check console for details.');
    }
    setShowSecondaryFields(false);
    reset(jobDefinitionDefaultValues);
  };
 const handleBackFromSecondaryField = () => {
      console.log('handleBackFromSecondaryField')
      setShowSecondaryFields(false);
    };
 
  // Compact styles for primary fields
  const primaryFieldStyles = {
    '& .MuiOutlinedInput-root': {
      fontSize: '0.875rem',
      backgroundColor: isValidating ? '#f3f4f6' : '#ffffff',
      borderRadius: '0.375rem',
      '& fieldset': {
        borderColor: '#d1d5db',
      },
      '&:hover fieldset': {
        borderColor: isValidating ? '#d1d5db' : '#3b82f6',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#3b82f6',
        borderWidth: '1px',
      },
    },
    '& .MuiInputBase-input': {
      padding: '0.625rem 0.75rem',
      fontSize: '0.875rem',
      lineHeight: '1.25rem',
    },
    '& .MuiInputLabel-root': {
      fontSize: '0.875rem',
      color: '#6b7280',
      '&.Mui-focused': {
        color: '#3b82f6',
      },
    },
    '& .MuiFormHelperText-root': {
      marginTop: '0.25rem',
      marginLeft: 0,
      fontSize: '0.75rem',
    },
  };

  // Very compact styles for secondary fields
  const compactFieldStyles = {
    '& .MuiOutlinedInput-root': {
      fontSize: '0.813rem',
      borderRadius: '0.25rem',
      minHeight: '36px',
      '& fieldset': {
        borderColor: '#d1d5db',
      },
      '&:hover fieldset': {
        borderColor: '#3b82f6',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#3b82f6',
        borderWidth: '1px',
      },
      '&.Mui-disabled': {
        backgroundColor: '#f3f4f6',
      },
    },
    '& .MuiSelect-select': {
      padding: '0.375rem 0.75rem',
      fontSize: '0.813rem',
      lineHeight: '1.25rem',
      minHeight: 'auto !important',
    },
    '& .MuiInputBase-input': {
      padding: '0.375rem 0.75rem',
      fontSize: '0.813rem',
      lineHeight: '1.25rem',
    },
  };

  // Read-only field styles
  const readOnlyFieldStyles = {
    padding: '0.375rem 0.75rem',
    fontSize: '0.813rem',
    lineHeight: '1.25rem',
    backgroundColor: '#f3f4f6',
    border: '1px solid #d1d5db',
    borderRadius: '0.25rem',
    color: '#374151',
    minHeight: '36px',
    display: 'flex',
    alignItems: 'center',
  };

 
  return (
  <>
   {showSuccess && (
  <div className="fixed top-8 right-8 z-50">
    <div className={`flex flex-col items-center px-8 py-6 rounded-lg shadow-lg
      ${modelIcon === "success" ? "bg-green-500" : "bg-red-500"}`}>
      <div>
        {modelIcon === "success" && (
          <CheckCircleIcon sx={{ fontSize: 60, color: "#fff" }} />
        )}
        {modelIcon === "error" && (
          <CancelIcon sx={{ fontSize: 60, color: "#fff" }} />
        )}
      </div>
      <div className="mt-2 text-white text-lg font-semibold">{modelMessage}</div>
      <button
        onClick={handleCloseModal}
        className="mt-4 px-6 py-2 bg-white text-pink-500 border-2 border-pink-500 rounded hover:bg-pink-50 transition-colors font-medium"
      >
        Close
      </button>
    </div>
  </div>
)}
      <div className="py-6">
      <div className="mb-4">
        <h2 className="text-lg font-medium text-gray-900">
          {showSecondaryFields ? "Complete the rest of the information" : "Enter the following information"}
        </h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Primary Fields - Progressive Disclosure */}
        {!showSecondaryFields && (
          <div className="space-y-3 w-full max-w-sm">
            {/* Job Name */}
            <Controller
              name="jobName"
              control={control}
              render={({ field }) => (
                <div>
                   <label className="block mb-2 text-sm font-medium text-gray-700">
                      Job Name <span className="text-red-500">*</span>
                    </label>
                  <TextField
                    {...field}
                    fullWidth
                    label="Enter the Job Name"
                    variant="outlined"
                    size="small"
                    disabled={isValidating}
                    error={!!errors.jobName}
                    helperText={errors.jobName?.message}
                    inputProps={{ maxLength: 8 }} 
                    onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                    sx={primaryFieldStyles}
                  />
                </div>
              )}
            />

            {/* Region Dropdown */}
            <Controller
              name="region"
              control={control}
              render={({ field }) => (
                <div>
                   <label className="block mb-2 text-sm font-medium text-gray-700">
                      Region <span className="text-red-500">*</span>
                    </label>
                  <FormControl
                    fullWidth
                    size="small"
                    error={!!errors.region}
                    disabled={isValidating}
                  >
                    
                    <Select
                      {...field}
                      displayEmpty
                      label="Region"
                      sx={primaryFieldStyles}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            '& .MuiMenuItem-root': {
                              fontSize: '0.875rem',
                              paddingY: '0.375rem',
                              '&.Mui-disabled': {
                                opacity: 0.5,
                              },
                            },
                          },
                        },
                      }}
                    >
                      
                      {DROPDOWN_OPTIONS.REGIONS.map((option) => (
                        <MenuItem
                          key={option.value}
                          value={option.value}
                          disabled={option.disabled}
                        >
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.region && (
                      <FormHelperText>{errors.region.message}</FormHelperText>
                    )}
                  </FormControl>
                  </div>
                )}
              />
           

            {/* LPAR Dropdown */}
            <Controller
              name="lpar"
              control={control}
              render={({ field }) => (
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                      LPAR <span className="text-red-500">*</span>
                    </label>
                  <FormControl
                    fullWidth
                    size="small"
                    error={!!errors.lpar}
                    disabled={isValidating}
                  >
                    
                    <Select
                      {...field}
                      displayEmpty
                      label="LPAR"
                      sx={primaryFieldStyles}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            '& .MuiMenuItem-root': {
                              fontSize: '0.875rem',
                              paddingY: '0.375rem',
                              '&.Mui-disabled': {
                                opacity: 0.5,
                              },
                            },
                          },
                        },
                      }}
                    >
                     
                      {DROPDOWN_OPTIONS.LPARS.map((option) => (
                        <MenuItem
                          key={option.value}
                          value={option.value}
                          disabled={option.disabled}
                        >
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.lpar && (
                      <FormHelperText>{errors.lpar.message}</FormHelperText>
                    )}
                  </FormControl>
                </div>
              )}

            />

            {/* Continue/Validating Button */}
            <div className="pt-1">
              <button
                type="button"
                onClick={handlePrimaryValidation}
                disabled={!arePrimaryFieldsValid() || isValidating}
                className={`
                  px-5 py-2 text-sm font-medium rounded transition-all duration-200
                  ${!arePrimaryFieldsValid()
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : isValidating
                      ? 'bg-blue-400 text-white cursor-wait'
                      : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                  }
                `}
              >
                {isValidating ? (
                  <span className="flex items-center">
                    <CircularProgress size={14} className="mr-2" sx={{ color: 'white' }} />
                    Validating
                  </span>
                ) : (
                  'Continue'
                )}
              </button>
            </div>
          </div>
        )}

        {/* Secondary Fields - 4 Column Layout */}
        {showSecondaryFields && (
          <div className="w-full">
            <div className="grid grid-cols-4 gap-x-8 gap-y-5">
              {/* Column 1 - Read-only primary fields */}
              <div className="space-y-5">
                <div>
                  <label className="block text-xs text-gray-600 mb-1.5 font-normal">Job Name</label>
                  <div style={readOnlyFieldStyles}>
                    {getValues('jobName')}
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1.5 font-normal">Region</label>
                  <div style={readOnlyFieldStyles}>
                    {getValues('region')}
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1.5 font-normal">LPAR</label>
                  <div style={readOnlyFieldStyles}>
                    {getValues('lpar')}
                  </div>
                </div>
              </div>

              {/* Column 2 */}
              <div className="space-y-5">
                <div>
                  <label className="block text-xs text-gray-600 mb-1.5 font-normal">UID</label>
                  <Controller
                    name="uid"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        fullWidth
                        size="small"
                        sx={compactFieldStyles}
                      >
                        {DROPDOWN_OPTIONS.UIDS.map((option) => (
                          <MenuItem key={option.value} value={option.value} sx={{ fontSize: '0.813rem' }}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1.5 font-normal">JCL Library</label>
                  <Controller
                    name="jclLibrary"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        fullWidth
                        size="small"
                        sx={compactFieldStyles}
                      >
                        {DROPDOWN_OPTIONS.JCL_LIBRARIES.map((option) => (
                          <MenuItem key={option.value} value={option.value} sx={{ fontSize: '0.813rem' }}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </div>

                {/* Email List */}
                <div className="flex-1">
                  <label className="block text-xs text-gray-600 mb-1.5 font-normal">
                    Distribution Email List
                  </label>
                  <Controller
                    name="distributionEmailList"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        fullWidth
                        size="small"
                        displayEmpty
                        sx={compactFieldStyles}
                      >
                        <MenuItem value="" sx={{ fontSize: '0.813rem' }}>--Select Email--</MenuItem>
                        {DROPDOWN_OPTIONS.EMAIL_LISTS?.map((option) => (
                          <MenuItem key={option.value} value={option.value} sx={{ fontSize: '0.813rem' }}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </div>
              
              </div>

              {/* Column 3 */}
              <div className="space-y-5">
                <div>
                  <label className="block text-xs text-gray-600 mb-1.5 font-normal">Change Request Number</label>
                  <Controller
                    name="changeRequestNumber"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        size="small"
                        disabled
                        sx={compactFieldStyles}
                      />
                    )}
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1.5 font-normal">Activate schedule in future</label>
                  <Controller
                    name="isFutureScheduled"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        fullWidth
                        size="small"
                        sx={compactFieldStyles}
                      >
                        {DROPDOWN_OPTIONS.YES_NO.map((option) => (
                          <MenuItem key={option.value} value={option.value} sx={{ fontSize: '0.813rem' }}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </div>

                <div className="flex-1">
                  {isFutureScheduled === 'Yes' && (
                    <div className="">
                      <div className="flex gap-6">
                        {/* Calendar and Time */}
                        <div className="">
                          <div>
                  
                            <Controller
                              name="activateJobOn"
                              control={control}
                              render={({ field }) => {
                                console.log('Activate Job On:', field.value);
                                console.log('isValid:', isValid);
                              console.log('errors:', errors);
                                return (
                                  <TextField
                                    {...field}
                                    fullWidth
                                    size="small"
                                    type="datetime-local"
                                    error={!!errors.activateJobOn}
                                    helperText={errors.activateJobOn?.message}
                                    InputProps={{
                                      inputProps: {
                                        min: new Date().toISOString().slice(0, 16),
                                      },
                                    }}

                                    value={
                                      field.value
                                        ? typeof field.value === 'string'
                                          ? field.value.slice(0, 16) // handles ISO string
                                          : ''
                                        : ''
                                    }
                                    onChange={field.onChange}
                                    sx={compactFieldStyles}
                                  />

                                )
                              }
                              }
                            />
                          </div>

                        </div>

                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Column 4 */}
              <div className="space-y-5">
                <div>
                  <label className="block text-xs text-gray-600 mb-1.5 font-normal">Is the job on request?</label>
                  <Controller
                    name="isJobOnRequest"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        fullWidth
                        size="small"
                        sx={compactFieldStyles}
                      >
                        {DROPDOWN_OPTIONS.YES_NO.map((option) => (
                          <MenuItem key={option.value} value={option.value} sx={{ fontSize: '0.813rem' }}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* EMEA Region Specific Fields */}
            {isEmeaRegion && (
              <div className="mt-6 p-5 bg-yellow-50 rounded-lg border border-yellow-200 max-w-3xl">
                <h4 className="text-sm font-medium text-gray-900 mb-4">EMEA Region Specific Fields</h4>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1.5 font-normal">Condition Code Check</label>
                    <div className="flex items-center space-x-3">
                      <FormControlLabel
                        control={
                          <Controller
                            name="conditionCodeCheck"
                            control={control}
                            render={({ field }) => (
                              <Checkbox
                                {...field}
                                checked={field.value && !removeConditionCode}
                                disabled={true}
                                size="small"
                                sx={{ padding: '4px' }}
                              />
                            )}
                          />
                        }
                        label={
                          <span className="text-xs text-gray-500">
                            Enabled (Only removal can be done)
                          </span>
                        }
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={removeConditionCode}
                            onChange={(e) => setRemoveConditionCode(e.target.checked)}
                            size="small"
                            sx={{ padding: '4px', color: '#ef4444', '&.Mui-checked': { color: '#ef4444' } }}
                          />
                        }
                        label={<span className="text-xs text-red-600">Remove</span>}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-1.5 font-normal">
                      Callout Priority <span className="text-red-500">*</span>
                    </label>
                    <Controller
                      name="calloutPriority"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          fullWidth
                          size="small"
                          displayEmpty
                          error={!!errors.calloutPriority}
                          sx={compactFieldStyles}
                        >
                          <MenuItem value="" sx={{ fontSize: '0.813rem' }}>SELECT ONE (Range 1 to 5)</MenuItem>
                          {DROPDOWN_OPTIONS.CALLOUT_PRIORITIES.map((option) => (
                            <MenuItem key={option.value} value={option.value} sx={{ fontSize: '0.813rem' }}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                    {errors.calloutPriority && (
                      <span className="text-xs text-red-500">{errors.calloutPriority.message}</span>
                    )}
                  </div>
                </div>
              </div>
            )}
 
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-12 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handleBackFromSecondaryField}
            className="px-6 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded transition-all duration-200"
          >
            Back
          </button>
          {showSecondaryFields && (
            <button
              type="submit"
               className="px-6 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded transition-all duration-200"  
            >
              Submit
            </button>
          )}
        </div>
      </form>
      {submittedJobs.length > 0 && (
        <div className="mt-10">
          <h3 className="text-md font-semibold mb-2">Submitted Jobs</h3>
          <ul className="space-y-2">
            {submittedJobs.map((job, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Job Name:</span>
                      <p className="text-sm text-gray-900">{job.jobName}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Region:</span>
                      <p className="text-sm text-gray-900">{job.region}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">LPAR</span>
                      <p className="text-sm text-gray-900">{job.lpar}</p>
                    </div>
                 
                  </div>
                </div>
            ))}
          </ul>
        </div>
)}
    </div>
      </>
  );

};

export default JobDefinitionFormWizard;