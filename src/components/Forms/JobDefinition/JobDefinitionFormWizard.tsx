import React, { useState,useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  FormHelperText,
  Checkbox,
  FormControlLabel,
  CircularProgress,
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

interface JobDefinitionFormWizardProps {
  onContinue: (data: JobDefinitionCompleteData) => void;
  onBack: () => void;
}

const JobDefinitionFormWizard: React.FC<JobDefinitionFormWizardProps> = ({
  onContinue,
  onBack,
}) => {
  const { wizardData,updateWizardData } = useWizard();
  const { jobData, setJobData } = useJob();

  const [isValidating, setIsValidating] = useState(false);
  const [apiCallFailed, setApiCallFailed] = useState(false);
  const [removeConditionCode, setRemoveConditionCode] = useState(false);

  // Initialize form with React Hook Form
  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid },
    trigger,
    getValues,
    setValue,
  } = useForm<JobDefinitionCompleteData>({
    resolver: yupResolver(
      wizardData.showSecondaryFields ? jobDefinitionCompleteSchema : jobDefinitionPrimarySchema
    ),
    mode: 'onChange',
    defaultValues: {
      ...jobDefinitionDefaultValues,
      ...jobData,
    },
  });
 const [currentStep, setCurrentStep] = useState(1);

useEffect(() => {
  // Restore draft if "resumeDraft" exists
  const savedDraft = JSON.parse(localStorage.getItem("resumeDraft") || "null");
  if (savedDraft) {
    reset(savedDraft); // react-hook-form reset
    if (savedDraft.currentStep) {
      setCurrentStep(savedDraft.currentStep);
    }
    localStorage.removeItem("resumeDraft");
  }

  // Auto-save form values + current step to localStorage
  const subscription = watch((values) => {
    const draft = {
      ...values,
      currentStep,
    };
    localStorage.setItem("currentWizardForm", JSON.stringify(draft));
  });

  return () => subscription.unsubscribe();
}, [watch, reset, currentStep]);

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


const [showDraftModal, setShowDraftModal] = useState(false);

const handleBack = () => {
  setShowDraftModal(true); // 👈 open popup instead of navigating immediately
};

const handleSaveDraft = () => {
  const values = getValues(); // react-hook-form values
  const existing = JSON.parse(localStorage.getItem("draftRequests") || "[]");
  existing.push(values);
  localStorage.setItem("draftRequests", JSON.stringify(existing));
  setShowDraftModal(false);
  // navigate away after saving
//  navigate("/shopping-card"); 
};

const handleDiscard = () => {
  setShowDraftModal(false);
  //navigate("/shopping-card");
};



  // Handle primary validation and API call
  const handlePrimaryValidation = async () => {
    const isValid = await trigger(['jobName', 'region', 'lpar']);

    if (isValid) {
      try {
        setIsValidating(true);
        setApiCallFailed(false);

        const primaryData = getValues(['jobName', 'region', 'lpar']);
        setJobData(prev => ({ ...prev, ...primaryData }));

        await new Promise(resolve => setTimeout(resolve, 1500));

      //  setShowSecondaryFields(true);
        wizardData.showSecondaryFields = true;
        if (primaryData.region === 'EMEA') {
          setValue('conditionCodeCheck', true);
        }
      } catch (error) {
        setApiCallFailed(true);
        console.error('API validation failed:', error);
       // setShowSecondaryFields(true);
       wizardData.showSecondaryFields = false;
      } finally {
        setIsValidating(false);
      }
    }
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

      if (isEmeaRegion && removeConditionCode) {
        data.conditionCodeCheck = false;
      }

      setJobData(data);
      updateWizardData({ jobDefinition: data });
      console.log('7. Successfully calling onContinue');
       const existing = JSON.parse(localStorage.getItem("cartRequests") || "[]");
       existing.push(data);
       localStorage.setItem("cartRequests", JSON.stringify(existing));
      
       onContinue(data);
    } catch (error) {
      console.error('Form submission error:', error);
      alert('Form submission failed. Please check console for details.');
    }
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
    <div className="py-6">
      <div className="mb-4">
        <h2 className="text-lg font-medium text-gray-900">
          {wizardData.showSecondaryFields ? "Complete the rest of the information" : "Enter the following information"}
        </h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Primary Fields - Progressive Disclosure */}
        {!wizardData.showSecondaryFields  && (
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
        {(wizardData.showSecondaryFields) && (
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
                                return (
                                  <TextField
                                    {...field}
                                    fullWidth
                                    size="small"
                                     type="datetime-local"
                                     pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}"
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

            {/* API Error Message */}
            {apiCallFailed && (
              <div className="mt-5 p-3 bg-red-50 border border-red-200 rounded-lg max-w-2xl">
                <span className="text-sm text-red-600">
                  API call failed. You can still continue.
                </span>
              </div>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-12 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded transition-all duration-200"
          >
            Back
          </button>
          {wizardData.showSecondaryFields && (
            <button
              type="submit"
              disabled={!isValid}
              onClick={() => {
                console.log('=== NEXT BUTTON CLICKED ===');
                console.log('Button disabled:', !isValid);
                console.log('Current errors:', errors);
                console.log('Current values:', getValues());
              }}
              className={`
                px-6 py-2 text-sm font-medium text-white rounded transition-all duration-200
                ${isValid
                  ? 'bg-blue-500 hover:bg-blue-600'
                  : 'bg-gray-300 cursor-not-allowed'
                }
              `}
            >
              Next
            </button>
          )}
          {showDraftModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="bg-white p-6 rounded shadow">
                    <p>Do you want to save the request as a draft request?</p>
                    <div className="flex justify-end space-x-4 mt-4">
                      <button onClick={handleDiscard} className="px-4 py-2 bg-gray-200 rounded">
                        No
                      </button>
                      <button onClick={handleSaveDraft} className="px-4 py-2 bg-blue-500 text-white rounded">
                        Yes
                      </button>
                    </div>
                  </div>
                </div>
            )}

        </div>
      </form>
    </div>

     
  );
};

export default JobDefinitionFormWizard;
