import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '../../UI';

// Import schemas and types
import {
    jobDefinitionSchema,
    JobDefinitionFormData,
} from '../../../schemas/jobDefinition.schema';

// Import validation utilities
import {
    DROPDOWN_OPTIONS,
    generateTimeOptions,
} from '../../../schemas/validation.utils';

// Import custom components
import { CustomDropdown } from '../../common/CustomDropdown';

// Import context hooks
import { useJob } from '../../../contexts/JobContext';
import { useWizard } from '../../../contexts/WizardContext';

interface JobDefinitionFormProps {
    onContinue: (data: JobDefinitionFormData) => void;
}

const JobDefinitionForm: React.FC<JobDefinitionFormProps> = ({
    onContinue,
}) => {
    // Context hooks
    const { updateWizardData } = useWizard();
    const { jobData, setJobData } = useJob();

    // State for progressive disclosure and API calls
    const [showSecondaryFields, setShowSecondaryFields] = useState(false);
    const [isApiCallInProgress, setIsApiCallInProgress] = useState(false);
    const [apiCallFailed, setApiCallFailed] = useState(false);

    // Time options
    const { hours, minutes } = generateTimeOptions();

    // Initialize form with React Hook Form
    const {
        control,
        handleSubmit,
        watch,
        formState: { errors, isValid },
        trigger,
        getValues,
        setValue,
        reset,
    } = useForm<JobDefinitionFormData>({
        resolver: yupResolver(jobDefinitionSchema),
        mode: 'onChange',
        defaultValues: {
            jobName: '',
            region: '',
            lpar: '',
            uid: '255',
            jclLibrary: 'PROD.NBSP.PROD.JCLLIB',
            distributionEmailList: '',
            changeRequestNumber: '',
            crqNumber: '',
            isFutureScheduled: 'No',
            activateJobOn: '',
            activationTimeHH: '',
            activationTimeMM: '',
            conditionCodeCheck: false,
            calloutPriority: '',
            ...jobData, // Merge with existing job data from context
        },
    });

    // Watch fields for conditional rendering
    const watchedFields = watch();
    const region = watchedFields.region;
    const isFutureScheduled = watchedFields.isFutureScheduled;
    const isEmeaRegion = region === 'EMEA';

    // Handle future scheduling field changes
    useEffect(() => {
        if (isFutureScheduled === 'No') {
            setValue('activateJobOn', '');
            setValue('activationTimeHH', '');
            setValue('activationTimeMM', '');
        }
    }, [isFutureScheduled, setValue]);

    // Dropdown options from validation utils
    const regions = [
        { value: 'EAST', label: 'EAST' },
        { value: 'WEST', label: 'WEST' },
        { value: 'NORTH', label: 'NORTH' },
        { value: 'SOUTH', label: 'SOUTH' },
        { value: 'CENTRAL', label: 'CENTRAL' },
        { value: 'EMEA', label: 'EMEA' },
    ];
    const lpars = [
        { value: 'LPAR01', label: 'LPAR01' },
        { value: 'LPAR02', label: 'LPAR02' },
        { value: 'LPAR03', label: 'LPAR03' },
        { value: 'LPAR04', label: 'LPAR04' },
        { value: 'LPAR05', label: 'LPAR05' },
    ];
    const distributionEmailLists = [
        { value: 'team1@company.com', label: 'team1@company.com' },
        { value: 'team2@company.com', label: 'team2@company.com' },
        { value: 'admin@company.com', label: 'admin@company.com' },
        { value: 'ops@company.com', label: 'ops@company.com' },
    ];

    // Check if the first 3 primary fields are completed
    const arePrimaryFieldsCompleted = (): boolean => {
        const { jobName, region, lpar } = getValues();
        return Boolean(
            jobName &&
                jobName.trim() !== '' &&
                region &&
                region.trim() !== '' &&
                lpar &&
                lpar.trim() !== ''
        );
    };

    // Helper function for disabled state styling
    const isPrimaryFieldDisabled = showSecondaryFields || isApiCallInProgress;

    // Check if primary fields are valid using React Hook Form validation
    const arePrimaryFieldsValid = async () => {
        const result = await trigger(['jobName', 'region', 'lpar']);
        return result && arePrimaryFieldsCompleted();
    };

    // Primary validation and API call
    const handlePrimaryValidation = async () => {
        // Validate primary fields
        const isValidFields = await trigger(['jobName', 'region', 'lpar']);

        if (isValidFields && arePrimaryFieldsCompleted()) {
            try {
                setIsApiCallInProgress(true);
                setApiCallFailed(false);

                // Save primary fields to context
                const formValues = getValues();
                const primaryData = {
                    jobName: formValues.jobName,
                    region: formValues.region,
                    lpar: formValues.lpar,
                };
                setJobData((prev) => ({ ...prev, ...primaryData }));

                // Simulate API call - replace with actual API
                await new Promise((resolve) => setTimeout(resolve, 1000));

                // Success - show secondary fields
                setShowSecondaryFields(true);

                // If EMEA region, set condition code check to true by default
                if (primaryData.region === 'EMEA') {
                    setValue('conditionCodeCheck', true);
                }
            } catch (error) {
                setApiCallFailed(true);
                console.error('API validation failed:', error);
                // Still allow continuing even if API fails
                setShowSecondaryFields(true);
            } finally {
                setIsApiCallInProgress(false);
            }
        }
    };

    // Auto-uppercase job name
    const handleJobNameChange = (value: string) => {
        return value.toUpperCase();
    };

    // Final form submission
    const onSubmit = async (data: JobDefinitionFormData) => {
        try {
            // Save complete data to context
            setJobData(data);
            updateWizardData({ jobDefinition: data });

            // Continue to next step
            onContinue(data);
        } catch (error) {
            console.error('Form submission error:', error);
        }
    };

    return (
        <div className="w-full">
            <div className="bg-white rounded-lg shadow-sm">
                {/* Main Form Content */}
                <div className="p-8">
                    <div className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                            Job Definition
                        </h2>
                        <p className="text-sm text-gray-600">
                            Please fill in the job details below
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="max-w-7xl">
                            {/* Main Layout: Column-based approach with enhanced visual hierarchy */}
                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 xl:gap-12">
                                {/* Left Column - Primary Fields (1/4 width) */}
                                <div className="lg:col-span-1">
                                    <div className="sticky top-4">
                                        <h4 className="text-lg font-medium text-gray-900 mb-2">
                                            Primary Information
                                        </h4>
                                        <p className="text-sm text-gray-600 mb-6">
                                            Complete these required fields to
                                            continue
                                        </p>

                                        {/* Job Name Field - Vertical stack */}
                                        <div className="mb-6">
                                            <Controller
                                                name="jobName"
                                                control={control}
                                                render={({ field }) => (
                                                    <div>
                                                        <label className="block mb-2 text-sm font-medium text-gray-700">
                                                            Job Name{' '}
                                                            <span className="text-red-500">
                                                                *
                                                            </span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className={`w-full px-3 py-2 text-sm border rounded-md transition-colors ${
                                                                isPrimaryFieldDisabled
                                                                    ? 'bg-gray-100 cursor-not-allowed opacity-60 border-gray-300'
                                                                    : 'bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                                            } ${
                                                                errors.jobName
                                                                    ? 'border-red-500'
                                                                    : 'border-gray-300'
                                                            }`}
                                                            value={
                                                                field.value ||
                                                                ''
                                                            }
                                                            onChange={(e) =>
                                                                field.onChange(
                                                                    handleJobNameChange(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                )
                                                            }
                                                            disabled={
                                                                isPrimaryFieldDisabled
                                                            }
                                                            placeholder="Enter job name"
                                                        />
                                                        {errors.jobName && (
                                                            <span className="block mt-1 text-xs text-red-500">
                                                                {
                                                                    errors
                                                                        .jobName
                                                                        .message
                                                                }
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            />
                                        </div>

                                        {/* Region Field - Vertical stack */}
                                        <div className="mb-6">
                                            <div className="max-w-full">
                                                <CustomDropdown
                                                    name="region"
                                                    control={control}
                                                    label="Region"
                                                    required
                                                    options={regions}
                                                    placeholder="--Select Region--"
                                                    disabled={
                                                        isPrimaryFieldDisabled
                                                    }
                                                    error={!!errors.region}
                                                    helperText={
                                                        errors.region?.message
                                                    }
                                                />
                                            </div>
                                        </div>

                                        {/* LPAR Field - Vertical stack */}
                                        <div className="mb-6">
                                            <div className="max-w-full">
                                                <CustomDropdown
                                                    name="lpar"
                                                    control={control}
                                                    label="LPAR"
                                                    required
                                                    options={lpars}
                                                    placeholder="--Select LPAR--"
                                                    disabled={
                                                        isPrimaryFieldDisabled
                                                    }
                                                    error={!!errors.lpar}
                                                    helperText={
                                                        errors.lpar?.message
                                                    }
                                                />
                                            </div>
                                        </div>

                                        {/* Visual completion indicator */}
                                        {arePrimaryFieldsCompleted() && (
                                            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                                                <div className="flex items-center">
                                                    <svg
                                                        className="w-4 h-4 text-green-500 mr-2"
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                    <span className="text-sm text-green-700 font-medium">
                                                        Primary fields completed
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Continue Button for Primary Validation */}
                                        {!showSecondaryFields &&
                                            arePrimaryFieldsCompleted() && (
                                                <div className="mt-6">
                                                    <button
                                                        type="button"
                                                        onClick={
                                                            handlePrimaryValidation
                                                        }
                                                        disabled={
                                                            !arePrimaryFieldsCompleted() ||
                                                            isApiCallInProgress
                                                        }
                                                        className={`w-full px-4 py-2.5 text-sm font-medium rounded-md transition-all ${
                                                            !arePrimaryFieldsCompleted() ||
                                                            isApiCallInProgress
                                                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                                : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                                        }`}
                                                    >
                                                        {isApiCallInProgress
                                                            ? 'Processing...'
                                                            : 'Continue'}
                                                    </button>
                                                </div>
                                            )}
                                    </div>
                                </div>

                                {/* Right Columns - Secondary Fields (3/4 width) */}
                                {showSecondaryFields && (
                                    <div className="lg:col-span-3">
                                        {/* Secondary Fields Grid - 3 columns */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                            {/* Column 1 - UID, JCL Library, Distribution Email List */}
                                            <div className="space-y-6">
                                                {/* UID Field */}
                                                <div className="max-w-full">
                                                    <CustomDropdown
                                                        name="uid"
                                                        control={control}
                                                        label="UID"
                                                        required
                                                        options={
                                                            DROPDOWN_OPTIONS.UIDS
                                                        }
                                                        disabled={
                                                            isApiCallInProgress
                                                        }
                                                        error={!!errors.uid}
                                                        helperText={
                                                            errors.uid?.message
                                                        }
                                                    />
                                                </div>

                                                {/* JCL Library Field */}
                                                <div className="max-w-full">
                                                    <CustomDropdown
                                                        name="jclLibrary"
                                                        control={control}
                                                        label="JCL Library"
                                                        required
                                                        options={
                                                            DROPDOWN_OPTIONS.JCL_LIBRARIES
                                                        }
                                                        disabled={
                                                            isApiCallInProgress
                                                        }
                                                        error={
                                                            !!errors.jclLibrary
                                                        }
                                                        helperText={
                                                            errors.jclLibrary
                                                                ?.message
                                                        }
                                                    />
                                                </div>

                                                {/* Distribution Email List Field */}
                                                <div className="max-w-full">
                                                    <CustomDropdown
                                                        name="distributionEmailList"
                                                        control={control}
                                                        label="Distribution Email List"
                                                        required
                                                        options={
                                                            distributionEmailLists
                                                        }
                                                        placeholder="--Select Email List--"
                                                        disabled={
                                                            isApiCallInProgress
                                                        }
                                                        error={
                                                            !!errors.distributionEmailList
                                                        }
                                                        helperText={
                                                            errors
                                                                .distributionEmailList
                                                                ?.message
                                                        }
                                                    />
                                                </div>
                                            </div>

                                            {/* Column 2 - Change Request Number */}
                                            <div className="space-y-6">
                                                {/* Change Request Number Field - Always Disabled */}
                                                <Controller
                                                    name="changeRequestNumber"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <div>
                                                            <label className="block mb-2 text-sm font-medium text-gray-700">
                                                                Change Request
                                                                Number
                                                            </label>
                                                            <input
                                                                {...field}
                                                                type="text"
                                                                className="w-full px-3 py-2 text-sm border rounded-md bg-gray-100 cursor-not-allowed opacity-60 border-gray-300 transition-colors"
                                                                disabled={true}
                                                                placeholder="Enter change request number"
                                                            />
                                                            {errors.changeRequestNumber && (
                                                                <span className="block mt-1 text-xs text-red-500">
                                                                    {
                                                                        errors
                                                                            .changeRequestNumber
                                                                            .message
                                                                    }
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                />
                                            </div>

                                            {/* Column 3 - Future Scheduling */}
                                            <div className="space-y-6">
                                                {/* Activate Schedule in Future Field */}
                                                <div className="max-w-full">
                                                    <CustomDropdown
                                                        name="isFutureScheduled"
                                                        control={control}
                                                        label="Activate schedule in future"
                                                        required
                                                        options={
                                                            DROPDOWN_OPTIONS.YES_NO
                                                        }
                                                        disabled={
                                                            isApiCallInProgress
                                                        }
                                                        error={
                                                            !!errors.isFutureScheduled
                                                        }
                                                        helperText={
                                                            errors
                                                                .isFutureScheduled
                                                                ?.message
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* EMEA Region Specific Fields - Full width section */}
                                        {isEmeaRegion && (
                                            <div className="mb-8 p-6 bg-yellow-50 rounded-lg border border-yellow-200">
                                                <h4 className="text-md font-medium text-gray-900 mb-4">
                                                    EMEA Region Specific Fields
                                                </h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    {/* Condition Code Check Field - Disabled with checkbox to remove */}
                                                    <Controller
                                                        name="conditionCodeCheck"
                                                        control={control}
                                                        render={({ field }) => (
                                                            <div>
                                                                <label className="block mb-2 text-sm font-medium text-gray-700">
                                                                    Condition
                                                                    Code Check
                                                                </label>
                                                                <div className="flex items-center space-x-3">
                                                                    <input
                                                                        type="checkbox"
                                                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-not-allowed opacity-60"
                                                                        checked={
                                                                            field.value ||
                                                                            false
                                                                        }
                                                                        disabled={
                                                                            true
                                                                        }
                                                                    />
                                                                    <span className="text-sm text-gray-500">
                                                                        Enabled
                                                                        (Only
                                                                        removal
                                                                        can be
                                                                        done)
                                                                    </span>
                                                                    <label className="flex items-center space-x-2 cursor-pointer">
                                                                        <input
                                                                            type="checkbox"
                                                                            className="w-4 h-4 text-red-600"
                                                                        />
                                                                        <span className="text-sm text-red-600">
                                                                            Remove
                                                                        </span>
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        )}
                                                    />

                                                    {/* Callout Priority Field - Required for EMEA */}
                                                    <div className="max-w-full">
                                                        <CustomDropdown
                                                            name="calloutPriority"
                                                            control={control}
                                                            label="Callout Priority"
                                                            required
                                                            options={
                                                                DROPDOWN_OPTIONS.CALLOUT_PRIORITIES
                                                            }
                                                            placeholder="SELECT ONE (Range 1 to 5)"
                                                            disabled={
                                                                isApiCallInProgress
                                                            }
                                                            error={
                                                                !!errors.calloutPriority
                                                            }
                                                            helperText={
                                                                errors
                                                                    .calloutPriority
                                                                    ?.message
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Future Scheduling Button - Only show when not already enabled */}
                                        {isFutureScheduled === 'No' && (
                                            <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h4 className="text-md font-medium text-gray-900">
                                                            Future Schedule
                                                            Configuration
                                                        </h4>
                                                        <p className="text-sm text-gray-600">
                                                            Enable future
                                                            scheduling to set
                                                            activation date and
                                                            time
                                                        </p>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                                        onClick={() =>
                                                            setValue(
                                                                'isFutureScheduled',
                                                                'Yes'
                                                            )
                                                        }
                                                    >
                                                        Enable Future Scheduling
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {/* Conditional Fields for Future Schedule - Full width section */}
                                        {isFutureScheduled === 'Yes' && (
                                            <div className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
                                                <h4 className="text-md font-medium text-gray-900 mb-4">
                                                    Future Schedule
                                                    Configuration
                                                </h4>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                    {/* Activate the job on Field */}
                                                    <Controller
                                                        name="activateJobOn"
                                                        control={control}
                                                        render={({ field }) => (
                                                            <div>
                                                                <label className="block mb-2 text-sm font-medium text-gray-700">
                                                                    Activate the
                                                                    job on
                                                                    (date){' '}
                                                                    <span className="text-red-500">
                                                                        *
                                                                    </span>
                                                                </label>
                                                                <input
                                                                    {...field}
                                                                    type="date"
                                                                    className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                                                        errors.activateJobOn
                                                                            ? 'border-red-500'
                                                                            : 'border-gray-300'
                                                                    } ${
                                                                        isApiCallInProgress
                                                                            ? 'bg-gray-100 cursor-not-allowed opacity-60'
                                                                            : 'bg-white'
                                                                    }`}
                                                                    disabled={
                                                                        isApiCallInProgress
                                                                    }
                                                                    min={
                                                                        new Date()
                                                                            .toISOString()
                                                                            .split(
                                                                                'T'
                                                                            )[0]
                                                                    } // Cannot be before current date
                                                                />
                                                                {errors.activateJobOn && (
                                                                    <span className="block mt-1 text-xs text-red-500">
                                                                        {
                                                                            errors
                                                                                .activateJobOn
                                                                                .message
                                                                        }
                                                                    </span>
                                                                )}
                                                                <span className="block mt-1 text-xs text-gray-500">
                                                                    Date cannot
                                                                    be before
                                                                    current date
                                                                </span>
                                                            </div>
                                                        )}
                                                    />

                                                    {/* Activation Time Fields */}
                                                    <div>
                                                        <label className="block mb-2 text-sm font-medium text-gray-700">
                                                            Activation Time{' '}
                                                            <span className="text-red-500">
                                                                *
                                                            </span>
                                                        </label>
                                                        <div className="grid grid-cols-2 gap-2">
                                                            <CustomDropdown
                                                                name="activationTimeHH"
                                                                control={
                                                                    control
                                                                }
                                                                label=""
                                                                options={hours}
                                                                placeholder="HH"
                                                                disabled={
                                                                    isApiCallInProgress
                                                                }
                                                                error={
                                                                    !!errors.activationTimeHH
                                                                }
                                                                helperText={
                                                                    errors
                                                                        .activationTimeHH
                                                                        ?.message
                                                                }
                                                            />
                                                            <CustomDropdown
                                                                name="activationTimeMM"
                                                                control={
                                                                    control
                                                                }
                                                                label=""
                                                                options={
                                                                    minutes
                                                                }
                                                                placeholder="MM"
                                                                disabled={
                                                                    isApiCallInProgress
                                                                }
                                                                error={
                                                                    !!errors.activationTimeMM
                                                                }
                                                                helperText={
                                                                    errors
                                                                        .activationTimeMM
                                                                        ?.message
                                                                }
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Enable/Disable Future Scheduling Control */}
                                                    <div className="max-w-full">
                                                        <Controller
                                                            name="isFutureScheduled"
                                                            control={control}
                                                            render={({
                                                                field,
                                                            }) => (
                                                                <CustomDropdown
                                                                    name="isFutureScheduled"
                                                                    control={
                                                                        control
                                                                    }
                                                                    label="Enable Future Scheduling"
                                                                    options={
                                                                        DROPDOWN_OPTIONS.YES_NO
                                                                    }
                                                                    disabled={
                                                                        isApiCallInProgress
                                                                    }
                                                                    error={
                                                                        !!errors.isFutureScheduled
                                                                    }
                                                                    helperText={
                                                                        errors
                                                                            .isFutureScheduled
                                                                            ?.message
                                                                    }
                                                                />
                                                            )}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="mt-4 text-xs text-gray-500">
                                                    <p>
                                                        • Time cannot be before
                                                        current time
                                                    </p>
                                                    <p>
                                                        • Follow 24 hours
                                                        display scheme in HH:mm
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* API Error Message */}
                            {apiCallFailed && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                    <span className="text-sm text-red-600">
                                        API call failed. You can still continue.
                                    </span>
                                </div>
                            )}

                            {/* Form Actions - Only show when secondary fields are visible */}
                            {showSecondaryFields && (
                                <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        disabled={
                                            !isValid || isApiCallInProgress
                                        }
                                    >
                                        {isApiCallInProgress
                                            ? 'Processing...'
                                            : 'Continue'}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default JobDefinitionForm;
