// src/components/common/TailwindStyledMuiComponents.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  FormHelperText,
  Button,
  styled,
} from '@mui/material';
import { Controller, Control, FieldValues, Path } from 'react-hook-form';

// Styled TextField to match Tailwind design
export const StyledTextField = styled(TextField)(({ disabled, error }) => ({
  '& .MuiOutlinedInput-root': {
    fontSize: '0.875rem', // text-sm
    backgroundColor: disabled ? '#f3f4f6' : '#ffffff',
    borderRadius: '0.375rem', // rounded-md
    transition: 'all 150ms',
    '& fieldset': {
      borderColor: error ? '#ef4444' : '#d1d5db', // border-gray-300 or border-red-500
      borderWidth: '1px',
      transition: 'all 150ms',
    },
    '&:hover fieldset': {
      borderColor: disabled ? '#d1d5db' : '#3b82f6', // hover:border-blue-500
    },
    '&.Mui-focused fieldset': {
      borderColor: '#3b82f6', // focus:border-blue-500
      borderWidth: '1px',
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)', // focus:ring-2 focus:ring-blue-500
    },
    '&.Mui-disabled': {
      opacity: 0.6,
      cursor: 'not-allowed',
      '& fieldset': {
        borderColor: '#d1d5db',
      },
    },
  },
  '& .MuiInputBase-input': {
    padding: '0.5rem 0.75rem', // px-3 py-2
    fontSize: '0.875rem', // text-sm
    lineHeight: '1.25rem',
    color: disabled ? '#6b7280' : '#111827',
    '&::placeholder': {
      color: '#9ca3af',
      opacity: 1,
    },
    '&.Mui-disabled': {
      WebkitTextFillColor: '#6b7280',
      cursor: 'not-allowed',
    },
  },
  '& .MuiInputLabel-root': {
    fontSize: '0.875rem', // text-sm
    fontWeight: 500, // font-medium
    color: '#374151', // text-gray-700
    backgroundColor: '#ffffff',
    padding: '0 0.25rem',
    marginLeft: '-0.25rem',
    '&.Mui-focused': {
      color: '#374151',
    },
    '&.Mui-error': {
      color: '#374151',
    },
  },
  '& .MuiFormHelperText-root': {
    marginTop: '0.25rem', // mt-1
    marginLeft: 0,
    fontSize: '0.75rem', // text-xs
    '&.Mui-error': {
      color: '#ef4444', // text-red-500
    },
  },
}));

// Styled Select to match Tailwind design
export const StyledSelect = styled(Select)(({ disabled, error }) => ({
  fontSize: '0.875rem', // text-sm
  backgroundColor: disabled ? '#f3f4f6' : '#ffffff',
  borderRadius: '0.375rem', // rounded-md
  transition: 'all 150ms',
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: error ? '#ef4444' : '#d1d5db', // border-gray-300 or border-red-500
    borderWidth: '1px',
    transition: 'all 150ms',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: disabled ? '#d1d5db' : '#3b82f6', // hover:border-blue-500
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#3b82f6', // focus:border-blue-500
    borderWidth: '1px',
    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)', // focus:ring-2 focus:ring-blue-500
  },
  '&.Mui-disabled': {
    opacity: 0.6,
    cursor: 'not-allowed',
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#d1d5db',
    },
  },
  '& .MuiSelect-select': {
    padding: '0.5rem 0.75rem', // px-3 py-2
    fontSize: '0.875rem', // text-sm
    lineHeight: '1.25rem',
    color: disabled ? '#6b7280' : '#111827',
    minHeight: 'auto',
  },
}));

// Styled FormControl wrapper
export const StyledFormControl = styled(FormControl)(() => ({
  '& .MuiInputLabel-root': {
    fontSize: '0.875rem', // text-sm
    fontWeight: 500, // font-medium
    color: '#374151', // text-gray-700
    position: 'relative',
    transform: 'none',
    marginBottom: '0.5rem', // mb-2
    '&.Mui-focused': {
      color: '#374151',
    },
    '& .MuiFormLabel-asterisk': {
      color: '#ef4444', // text-red-500
    },
  },
}));

// Custom Button matching original design
export const TailwindButton = styled(Button)(({ variant, color }) => ({
  textTransform: 'none',
  fontSize: '0.875rem',
  fontWeight: 500,
  padding: '0.5rem 1rem',
  borderRadius: '0.375rem',
  transition: 'all 150ms',
  boxShadow: 'none',
  
  ...(variant === 'contained' && color === 'primary' && {
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    '&:hover': {
      backgroundColor: '#2563eb',
      boxShadow: 'none',
    },
    '&.Mui-disabled': {
      backgroundColor: '#9ca3af',
      color: '#ffffff',
      opacity: 0.7,
    },
  }),
  
  ...(variant === 'contained' && color === 'error' && {
    backgroundColor: '#ef4444',
    color: '#ffffff',
    '&:hover': {
      backgroundColor: '#dc2626',
      boxShadow: 'none',
    },
  }),
  
  ...(variant === 'outlined' && {
    borderColor: '#d1d5db',
    color: '#374151',
    '&:hover': {
      borderColor: '#9ca3af',
      backgroundColor: '#f9fafb',
    },
  }),
}));

// Form TextField Component
interface FormTextFieldProps {
  name: string;
  control: Control<any>;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  type?: string;
  onBlur?: () => void;
  onChange?: (value: string) => void;
}

export const FormTextField: React.FC<FormTextFieldProps> = ({
  name,
  control,
  label,
  placeholder,
  disabled = false,
  required = false,
  className = '',
  type = 'text',
  onBlur,
  onChange,
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className={className}>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
          <StyledTextField
            {...field}
            fullWidth
            size="small"
            placeholder={placeholder}
            disabled={disabled}
            error={!!error}
            type={type}
            variant="outlined"
            onChange={(e) => {
              const value = type === 'text' && name === 'jobName' 
                ? e.target.value.toUpperCase() 
                : e.target.value;
              field.onChange(value);
              onChange?.(value);
            }}
            onBlur={() => {
              field.onBlur();
              onBlur?.();
            }}
            InputProps={{
              sx: { 
                backgroundColor: disabled ? '#f3f4f6' : '#ffffff',
              }
            }}
            sx={{ '& fieldset': { border: 'none' } }}
          />
          {error && (
            <span className="block mt-1 text-xs text-red-500">{error.message}</span>
          )}
        </div>
      )}
    />
  );
};

// Form Select Component
export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface FormSelectProps {
  name: string;
  control: Control<any>;
  label: string;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  onChange?: (value: string) => void;
}

export const FormSelect: React.FC<FormSelectProps> = ({
  name,
  control,
  label,
  options,
  placeholder,
  disabled = false,
  required = false,
  className = '',
  onChange,
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className={className}>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
          <StyledFormControl fullWidth size="small" error={!!error}>
            <StyledSelect
              {...field}
              disabled={disabled}
              displayEmpty
              onChange={(e) => {
                field.onChange(e);
                onChange?.(e.target.value as string);
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    maxHeight: 300,
                    '& .MuiMenuItem-root': {
                      fontSize: '0.875rem',
                      padding: '0.5rem 0.75rem',
                    },
                  },
                },
              }}
              renderValue={(value) => {
                if (!value) {
                  return <span className="text-gray-400">{placeholder || '--Select--'}</span>;
                }
                const option = options.find(opt => opt.value === value);
                return option?.label || value as React.ReactNode;
              }}
            >
              {placeholder && (
                <MenuItem value="" disabled>
                  <span className="text-gray-400">{placeholder}</span>
                </MenuItem>
              )}
              {options.map((option) => (
                <MenuItem 
                  key={option.value} 
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.label}
                </MenuItem>
              ))}
            </StyledSelect>
            {error && (
              <FormHelperText sx={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem' }}>
                {error.message}
              </FormHelperText>
            )}
          </StyledFormControl>
        </div>
      )}
    />
  );
};

// Date Picker Component
interface FormDatePickerProps {
  name: string;
  control: Control<any>;
  label: string;
  disabled?: boolean;
  required?: boolean;
  disablePast?: boolean;
  className?: string;
}

export const FormDatePicker: React.FC<FormDatePickerProps> = ({
  name,
  control,
  label,
  disabled = false,
  required = false,
  disablePast = false,
  className = '',
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className={className}>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
          <StyledTextField
            {...field}
            fullWidth
            size="small"
            type="date"
            disabled={disabled}
            error={!!error}
            variant="outlined"
            InputProps={{
              inputProps: {
                min: disablePast ? new Date().toISOString().split('T')[0] : undefined,
              },
              sx: { 
                backgroundColor: disabled ? '#f3f4f6' : '#ffffff',
              }
            }}
          />
          {error && (
            <span className="block mt-1 text-xs text-red-500">{error.message}</span>
          )}
          {disablePast && (
            <span className="block mt-1 text-xs text-gray-500">Date cannot be before current date</span>
          )}
        </div>
      )}
    />
  );
};

// Action Button Component
interface ActionButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
  className?: string;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  loading = false,
  loadingText = 'Processing...',
  className = '',
}) => {
  const baseClasses = "px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 transition-colors";
  
  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-gray-400",
    secondary: "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 disabled:bg-gray-400",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-gray-400",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${className} ${
        (disabled || loading) ? 'cursor-not-allowed opacity-60' : ''
      }`}
    >
      {loading ? loadingText : children}
    </button>
  );
};

// Time Picker Dropdown Component
interface TimePickerDropdownProps<T extends FieldValues> {
  hourName: Path<T>;
  minuteName: Path<T>;
  control: Control<T>;
  label: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  hourError?: string;
  minuteError?: string;
}

export const TimePickerDropdown = <T extends FieldValues>({
  hourName,
  minuteName,
  control,
  label,
  disabled = false,
  required = false,
  className = '',
  hourError,
  minuteError,
}: TimePickerDropdownProps<T>) => {
  const hourOptions: SelectOption[] = Array.from({ length: 24 }, (_, i) => ({
    value: i.toString().padStart(2, '0'),
    label: i.toString().padStart(2, '0'),
  }));

  const minuteOptions: SelectOption[] = Array.from({ length: 60 }, (_, i) => ({
    value: i.toString().padStart(2, '0'),
    label: i.toString().padStart(2, '0'),
  }));

  return (
    <div className={className}>
      <label className="block mb-2 text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="grid grid-cols-2 gap-4">
        <FormSelect
          name={hourName}
          control={control}
          label="HH"
          options={hourOptions}
          disabled={disabled}
          className=""
        />
        <FormSelect
          name={minuteName}
          control={control}
          label="MM"
          options={minuteOptions}
          disabled={disabled}
          className=""
        />
      </div>
      {(hourError || minuteError) && (
        <span className="block mt-1 text-xs text-red-500">
          {hourError || minuteError}
        </span>
      )}
    </div>
  );
};

// Form Section Component
interface FormSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'highlighted' | 'bordered';
}

export const FormSection: React.FC<FormSectionProps> = ({
  title,
  children,
  className = '',
  icon,
  variant = 'default',
}) => {
  const variantClasses = {
    default: 'bg-white',
    highlighted: 'bg-gray-50 border border-gray-200 rounded-lg',
    bordered: 'bg-blue-50 border border-blue-200 rounded-lg',
  };

  return (
    <div className={`${variantClasses[variant]} ${className}`}>
      {variant !== 'default' ? (
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            {icon && (
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                {icon}
              </div>
            )}
            <h3 className="text-md font-medium text-gray-900">{title}</h3>
          </div>
          <div className="space-y-4">{children}</div>
        </div>
      ) : (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
          <div className="space-y-4">{children}</div>
        </div>
      )}
    </div>
  );
};

// Conditional Field Wrapper Component
interface ConditionalFieldWrapperProps {
  condition: boolean;
  children: React.ReactNode;
  title?: string;
  className?: string;
  variant?: 'default' | 'highlighted';
}

export const ConditionalFieldWrapper: React.FC<ConditionalFieldWrapperProps> = ({
  condition,
  children,
  title,
  className = '',
  variant = 'highlighted',
}) => {
  if (!condition) return null;

  return (
    <div 
      className={`
        mt-6 max-w-4xl
        ${variant === 'highlighted' 
          ? 'p-6 bg-blue-50 rounded-lg border border-blue-200' 
          : 'p-4 bg-gray-50 rounded-md border border-gray-200'
        }
        ${className}
      `}
    >
      {title && (
        <h4 className="text-md font-medium text-gray-900 mb-4">{title}</h4>
      )}
      {children}
    </div>
  );
};

// Error Summary Component
interface ErrorSummaryProps {
  errors: Record<string, string[]>;
  title?: string;
  className?: string;
}

export const ErrorSummary: React.FC<ErrorSummaryProps> = ({
  errors,
  title = 'Please fix the following errors:',
  className = '',
}) => {
  const errorEntries = Object.entries(errors).filter(([_, messages]) => messages.length > 0);
  
  if (errorEntries.length === 0) return null;

  return (
    <div className={`p-4 bg-red-50 border border-red-200 rounded-md ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">{title}</h3>
          <div className="mt-2 text-sm text-red-700">
            <ul className="list-disc pl-5 space-y-1">
              {errorEntries.map(([field, messages]) => 
                messages.map((message, index) => (
                  <li key={`${field}-${index}`}>{message}</li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// Form Radio Group Component
interface FormRadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface FormRadioGroupProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  options: FormRadioOption[];
  disabled?: boolean;
  required?: boolean;
  className?: string;
  layout?: 'vertical' | 'horizontal';
}

export const FormRadioGroup = <T extends FieldValues>({
  name,
  control,
  label,
  options,
  disabled = false,
  required = false,
  className = '',
  layout = 'vertical',
}: FormRadioGroupProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className={className}>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
          <div className={`space-${layout === 'vertical' ? 'y' : 'x'}-2 ${layout === 'horizontal' ? 'flex flex-wrap' : ''}`}>
            {options.map((option) => (
              <label key={option.value} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  {...field}
                  value={option.value}
                  checked={field.value === option.value}
                  disabled={disabled || option.disabled}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 focus:ring-2 disabled:opacity-50"
                />
                <span className={`ml-2 text-sm ${
                  disabled || option.disabled ? 'text-gray-400' : 'text-gray-700'
                }`}>
                  {option.label}
                </span>
              </label>
            ))}
          </div>
          {error && (
            <span className="block mt-1 text-xs text-red-500">{error.message}</span>
          )}
        </div>
      )}
    />
  );
};

// Form Checkbox Component
interface FormCheckboxProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  disabled?: boolean;
  className?: string;
  description?: string;
}

export const FormCheckbox = <T extends FieldValues>({
  name,
  control,
  label,
  disabled = false,
  className = '',
  description,
}: FormCheckboxProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className={className}>
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                type="checkbox"
                {...field}
                checked={!!field.value}
                disabled={disabled}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 disabled:opacity-50"
              />
            </div>
            <div className="ml-3 text-sm">
              <label className={`font-medium ${
                disabled ? 'text-gray-400' : 'text-gray-700'
              } cursor-pointer`}>
                {label}
              </label>
              {description && (
                <p className="text-gray-500 mt-1">{description}</p>
              )}
            </div>
          </div>
          {error && (
            <span className="block mt-1 text-xs text-red-500 ml-7">{error.message}</span>
          )}
        </div>
      )}
    />
  );
};

// Form Toggle Component
interface FormToggleProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  disabled?: boolean;
  className?: string;
  description?: string;
}

export const FormToggle = <T extends FieldValues>({
  name,
  control,
  label,
  disabled = false,
  className = '',
  description,
}: FormToggleProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className={`flex items-center justify-between ${className}`}>
          <div className="flex-1">
            <label className={`text-sm font-medium ${
              disabled ? 'text-gray-400' : 'text-gray-700'
            }`}>
              {label}
            </label>
            {description && (
              <p className="text-sm text-gray-500 mt-1">{description}</p>
            )}
            {error && (
              <span className="block mt-1 text-xs text-red-500">{error.message}</span>
            )}
          </div>
          <label className="relative inline-flex items-center cursor-pointer ml-4">
            <input
              type="checkbox"
              {...field}
              checked={!!field.value}
              disabled={disabled}
              className="sr-only peer"
            />
            <div className={`
              w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 
              rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white 
              after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white 
              after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 
              after:transition-all peer-checked:bg-blue-600
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}></div>
          </label>
        </div>
      )}
    />
  );
};

// Form Multi Select Component
interface FormMultiSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface FormMultiSelectProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  options: FormMultiSelectOption[];
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  maxSelections?: number;
  showSelectAll?: boolean;
  searchable?: boolean;
}

export const FormMultiSelect = <T extends FieldValues>({
  name,
  control,
  label,
  options,
  placeholder = '--Select Options--',
  disabled = false,
  required = false,
  className = '',
  maxSelections,
  showSelectAll = false,
  searchable = false,
}: FormMultiSelectProps<T>) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredOptions = searchable
    ? options.filter(option => 
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const selectedValues = Array.isArray(field.value) ? field.value : [];
        const selectedCount = selectedValues.length;
        
        const handleSelectAll = () => {
          const allValues = filteredOptions
            .filter(opt => !opt.disabled)
            .map(opt => opt.value);
          field.onChange(allValues);
        };

        const handleClearAll = () => {
          field.onChange([]);
        };

        const handleToggleOption = (optionValue: string) => {
          const isSelected = selectedValues.includes(optionValue);
          if (isSelected) {
            field.onChange(selectedValues.filter(v => v !== optionValue));
          } else {
            if (!maxSelections || selectedCount < maxSelections) {
              field.onChange([...selectedValues, optionValue]);
            }
          }
        };

        return (
          <div className={className}>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              {label} {required && <span className="text-red-500">*</span>}
            </label>
            
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                disabled={disabled}
                className={`
                  w-full px-3 py-2.5 text-sm border rounded-md text-left 
                  flex items-center justify-between transition-all
                  ${disabled
                    ? 'bg-gray-100 text-gray-700 cursor-not-allowed border-gray-300' 
                    : 'bg-white hover:border-blue-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                  }
                  ${error ? 'border-red-500' : 'border-gray-300'}
                  ${isOpen ? 'ring-2 ring-blue-500/20 border-blue-500' : ''}
                  focus:outline-none
                `}
              >
                <span className={selectedCount > 0 ? 'text-gray-900' : 'text-gray-500'}>
                  {selectedCount > 0 
                    ? `${selectedCount} item${selectedCount > 1 ? 's' : ''} selected`
                    : placeholder
                  }
                </span>
                <svg 
                  className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isOpen && !disabled && (
                <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-hidden flex flex-col">
                  {/* Search Input */}
                  {searchable && (
                    <div className="p-3 border-b border-gray-200">
                      <input
                        type="text"
                        placeholder="Search options..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                  )}

                  {/* Header with actions */}
                  <div className="px-3 py-2 text-xs text-gray-500 bg-gray-100 border-b border-gray-200 flex justify-between items-center sticky top-0 z-10">
                    <span>{placeholder}</span>
                    <div className="flex gap-2">
                      {showSelectAll && filteredOptions.some(opt => !opt.disabled) && (
                        <button
                          type="button"
                          onClick={handleSelectAll}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Select All
                        </button>
                      )}
                      {selectedCount > 0 && (
                        <button
                          type="button"
                          onClick={handleClearAll}
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          Clear All
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Options */}
                  <div className="flex-1 overflow-auto">
                    {filteredOptions.map((option) => {
                      const isSelected = selectedValues.includes(option.value);
                      const isDisabled = option.disabled || 
                        (maxSelections && selectedCount >= maxSelections && !isSelected);

                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => !isDisabled && handleToggleOption(option.value)}
                          disabled={isDisabled}
                          className={`
                            w-full px-3 py-2 text-sm text-left transition-colors flex items-center
                            ${isDisabled
                              ? 'text-gray-400 cursor-not-allowed bg-gray-50' 
                              : 'text-gray-700 hover:bg-gray-100'
                            }
                            ${isSelected ? 'bg-blue-50 font-medium' : ''}
                          `}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            readOnly
                            className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          {option.label}
                        </button>
                      );
                    })}
                    
                    {filteredOptions.length === 0 && (
                      <div className="px-3 py-4 text-sm text-gray-500 text-center">
                        No options found
                      </div>
                    )}
                  </div>

                  {/* Footer info */}
                  {maxSelections && (
                    <div className="px-3 py-2 text-xs text-gray-500 bg-gray-50 border-t border-gray-200">
                      {selectedCount}/{maxSelections} selections
                    </div>
                  )}
                </div>
              )}
            </div>

            {error && (
              <span className="block mt-1 text-xs text-red-500">{error.message}</span>
            )}
          </div>
        );
      }}
    />
  );
};

// Form Textarea Component
interface FormTextareaProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  rows?: number;
  maxLength?: number;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

export const FormTextarea = <T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  disabled = false,
  required = false,
  className = '',
  rows = 3,
  maxLength,
  resize = 'vertical',
}: FormTextareaProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const characterCount = field.value ? field.value.length : 0;
        
        return (
          <div className={className}>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              {label} {required && <span className="text-red-500">*</span>}
            </label>
            <textarea
              {...field}
              rows={rows}
              maxLength={maxLength}
              placeholder={placeholder}
              disabled={disabled}
              className={`
                w-full px-3 py-2 text-sm border rounded-md transition-colors
                focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
                ${disabled 
                  ? 'bg-gray-100 text-gray-700 cursor-not-allowed border-gray-300' 
                  : 'bg-white border-gray-300 hover:border-blue-500'
                }
                ${error ? 'border-red-500' : ''}
                ${resize === 'none' ? 'resize-none' : 
                  resize === 'vertical' ? 'resize-y' : 
                  resize === 'horizontal' ? 'resize-x' : 'resize'
                }
              `}
            />
            <div className="flex justify-between items-center mt-1">
              {error && (
                <span className="text-xs text-red-500">{error.message}</span>
              )}
              {maxLength && (
                <span className={`text-xs ml-auto ${
                  characterCount > maxLength * 0.9 ? 'text-orange-500' : 'text-gray-500'
                }`}>
                  {characterCount}/{maxLength}
                </span>
              )}
            </div>
          </div>
        );
      }}
    />
  );
};

// Enhanced Time Picker Component
interface FormTimePickerProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  format?: '12h' | '24h';
  minuteStep?: number;
  allowEmpty?: boolean;
}

export const FormTimePicker = <T extends FieldValues>({
  name,
  control,
  label,
  disabled = false,
  required = false,
  className = '',
  format = '24h',
  minuteStep = 15,
  allowEmpty = false,
}: FormTimePickerProps<T>) => {
  const generateTimeOptions = () => {
    const options = [];
    
    if (allowEmpty) {
      options.push({ value: '', label: '--Select Time--' });
    }
    
    const maxHours = format === '12h' ? 12 : 24;
    const startHour = format === '12h' ? 1 : 0;
    
    for (let hour = startHour; hour <= maxHours; hour++) {
      for (let minute = 0; minute < 60; minute += minuteStep) {
        const displayHour = format === '12h' ? hour : hour.toString().padStart(2, '0');
        const displayMinute = minute.toString().padStart(2, '0');
        
        if (format === '12h') {
          // 12-hour format with AM/PM
          const ampmHour = hour === 12 ? 12 : hour;
          options.push({
            value: `${ampmHour.toString().padStart(2, '0')}:${displayMinute} AM`,
            label: `${ampmHour}:${displayMinute} AM`
          });
          if (hour !== 12) {
            options.push({
              value: `${(ampmHour + 12).toString().padStart(2, '0')}:${displayMinute} PM`,
              label: `${ampmHour}:${displayMinute} PM`
            });
          }
        } else {
          // 24-hour format
          const value = `${displayHour}:${displayMinute}`;
          options.push({
            value,
            label: value
          });
        }
      }
    }
    
    return options;
  };

  const timeOptions = generateTimeOptions();

  return (
    <FormSelect
      name={name}
      control={control}
      label={label}
      options={timeOptions}
      placeholder="--Select Time--"
      disabled={disabled}
      required={required}
      className={className}
    />
  );
};

// Form Field Group Component
interface FormFieldGroupProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  description?: string;
  variant?: 'default' | 'card' | 'bordered';
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

export const FormFieldGroup: React.FC<FormFieldGroupProps> = ({
  title,
  children,
  className = '',
  description,
  variant = 'default',
  collapsible = false,
  defaultCollapsed = false,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  const variantClasses = {
    default: 'space-y-4',
    card: 'p-6 bg-white rounded-lg shadow-sm border border-gray-200 space-y-4',
    bordered: 'p-4 border border-gray-300 rounded-md space-y-4',
  };

  return (
    <div className={`${variantClasses[variant]} ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          {description && (
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          )}
        </div>
        {collapsible && (
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            <svg 
              className={`h-5 w-5 text-gray-400 transition-transform ${isCollapsed ? '' : 'rotate-180'}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}
      </div>
      
      {(!collapsible || !isCollapsed) && (
        <div className="space-y-4">
          {children}
        </div>
      )}
    </div>
  );
};

// Loading Spinner Component
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'gray' | 'white';
  text?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'blue',
  text,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  const colorClasses = {
    blue: 'text-blue-600',
    gray: 'text-gray-600',
    white: 'text-white',
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg 
        className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]}`} 
        fill="none" 
        viewBox="0 0 24 24"
      >
        <circle 
          className="opacity-25" 
          cx="12" 
          cy="12" 
          r="10" 
          stroke="currentColor" 
          strokeWidth="4"
        ></circle>
        <path 
          className="opacity-75" 
          fill="currentColor" 
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      {text && (
        <span className={`text-sm ${colorClasses[color]}`}>{text}</span>
      )}
    </div>
  );
};

// Form Validation Icon Component
interface FormValidationIconProps {
  isValid?: boolean;
  isValidating?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

export const FormValidationIcon: React.FC<FormValidationIconProps> = ({
  isValid,
  isValidating = false,
  size = 'sm',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
  };

  if (isValidating) {
    return (
      <div className={`${sizeClasses[size]} ${className}`}>
        <LoadingSpinner size={size} color="gray" />
      </div>
    );
  }

  if (isValid === true) {
    return (
      <svg 
        className={`${sizeClasses[size]} text-green-500 ${className}`} 
        fill="currentColor" 
        viewBox="0 0 20 20"
      >
        <path 
          fillRule="evenodd" 
          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
          clipRule="evenodd" 
        />
      </svg>
    );
  }

  if (isValid === false) {
    return (
      <svg 
        className={`${sizeClasses[size]} text-red-500 ${className}`} 
        fill="currentColor" 
        viewBox="0 0 20 20"
      >
        <path 
          fillRule="evenodd" 
          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" 
          clipRule="evenodd" 
        />
      </svg>
    );
  }

  return null;
};

// Form Step Indicator Component
interface Step {
  id: string;
  title: string;
  description?: string;
  status: 'completed' | 'current' | 'upcoming';
  optional?: boolean;
}

interface FormStepIndicatorProps {
  steps: Step[];
  className?: string;
  variant?: 'horizontal' | 'vertical';
  showConnectors?: boolean;
}

export const FormStepIndicator: React.FC<FormStepIndicatorProps> = ({
  steps,
  className = '',
  variant = 'horizontal',
  showConnectors = true,
}) => {
  if (variant === 'vertical') {
    return (
      <div className={`space-y-4 ${className}`}>
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-start">
            <div className="flex-shrink-0 flex flex-col items-center">
              {/* Step indicator */}
              <div className={`
                flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors
                ${
                  step.status === 'completed'
                    ? 'bg-green-500 border-green-500 text-white'
                    : step.status === 'current'
                    ? 'bg-blue-500 border-blue-500 text-white'
                    : 'bg-white border-gray-300 text-gray-500'
                }
              `}>
                {step.status === 'completed' ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </div>
              
              {/* Connector line */}
              {showConnectors && index < steps.length - 1 && (
                <div className={`
                  w-0.5 h-8 mt-2 transition-colors
                  ${step.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'}
                `} />
              )}
            </div>
            
            {/* Step content */}
            <div className="ml-4 flex-1">
              <h3 className={`text-sm font-medium ${
                step.status === 'current' ? 'text-blue-900' :
                step.status === 'completed' ? 'text-green-900' :
                'text-gray-500'
              }`}>
                {step.title}
                {step.optional && (
                  <span className="ml-2 text-xs text-gray-400">(Optional)</span>
                )}
              </h3>
              {step.description && (
                <p className={`text-xs mt-1 ${
                  step.status === 'current' ? 'text-blue-700' :
                  step.status === 'completed' ? 'text-green-700' :
                  'text-gray-400'
                }`}>
                  {step.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Horizontal variant
  return (
    <div className={`flex items-center ${className}`}>
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <div className="flex flex-col items-center">
            {/* Step indicator */}
            <div className={`
              flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors
              ${
                step.status === 'completed'
                  ? 'bg-green-500 border-green-500 text-white'
                  : step.status === 'current'
                  ? 'bg-blue-500 border-blue-500 text-white'
                  : 'bg-white border-gray-300 text-gray-500'
              }
            `}>
              {step.status === 'completed' ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <span className="text-sm font-medium">{index + 1}</span>
              )}
            </div>
            
            {/* Step label */}
            <div className="text-center mt-2 max-w-24">
              <h3 className={`text-xs font-medium ${
                step.status === 'current' ? 'text-blue-900' :
                step.status === 'completed' ? 'text-green-900' :
                'text-gray-500'
              }`}>
                {step.title}
                {step.optional && (
                  <span className="block text-gray-400">(Optional)</span>
                )}
              </h3>
              {step.description && (
                <p className={`text-xs mt-1 ${
                  step.status === 'current' ? 'text-blue-700' :
                  step.status === 'completed' ? 'text-green-700' :
                  'text-gray-400'
                }`}>
                  {step.description}
                </p>
              )}
            </div>
          </div>
          
          {/* Connector line */}
          {showConnectors && index < steps.length - 1 && (
            <div className={`
              flex-1 h-0.5 mx-4 transition-colors
              ${step.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'}
            `} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

// Form Currency Input Component
interface FormCurrencyInputProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  currency?: string;
  currencyPosition?: 'left' | 'right';
  allowNegative?: boolean;
  maxValue?: number;
  minValue?: number;
  decimalPlaces?: number;
}

export const FormCurrencyInput = <T extends FieldValues>({
  name,
  control,
  label,
  placeholder = '0.00',
  disabled = false,
  required = false,
  className = '',
  currency = '$',
  currencyPosition = 'left',
  allowNegative = false,
  maxValue,
  minValue,
  decimalPlaces = 2,
}: FormCurrencyInputProps<T>) => {
  const formatCurrency = (value: string | number) => {
    if (!value && value !== 0) return '';
    
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numValue)) return '';
    
    return numValue.toFixed(decimalPlaces);
  };

  const parseCurrency = (value: string) => {
    // Remove currency symbol and non-numeric characters except decimal point and minus
    const cleaned = value.replace(/[^0-9.-]/g, '');
    const numValue = parseFloat(cleaned);
    
    if (isNaN(numValue)) return '';
    
    // Apply constraints
    let constrainedValue = numValue;
    if (minValue !== undefined && constrainedValue < minValue) {
      constrainedValue = minValue;
    }
    if (maxValue !== undefined && constrainedValue > maxValue) {
      constrainedValue = maxValue;
    }
    if (!allowNegative && constrainedValue < 0) {
      constrainedValue = 0;
    }
    
    return constrainedValue.toString();
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const displayValue = field.value ? formatCurrency(field.value) : '';
        
        return (
          <div className={className}>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              {label} {required && <span className="text-red-500">*</span>}
            </label>
            
            <div className="relative">
              {currencyPosition === 'left' && (
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">{currency}</span>
                </div>
              )}
              
              <input
                type="text"
                inputMode="decimal"
                placeholder={placeholder}
                disabled={disabled}
                value={displayValue}
                onChange={(e) => {
                  const parsed = parseCurrency(e.target.value);
                  field.onChange(parsed);
                }}
                onBlur={field.onBlur}
                className={`
                  w-full px-3 py-2 text-sm border rounded-md transition-colors
                  focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
                  ${currencyPosition === 'left' ? 'pl-8' : 'pr-8'}
                  ${disabled 
                    ? 'bg-gray-100 text-gray-700 cursor-not-allowed border-gray-300' 
                    : 'bg-white border-gray-300 hover:border-blue-500'
                  }
                  ${error ? 'border-red-500' : ''}
                `}
              />
              
              {currencyPosition === 'right' && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">{currency}</span>
                </div>
              )}
            </div>
            
            <div className="flex justify-between items-center mt-1">
              {error && (
                <span className="text-xs text-red-500">{error.message}</span>
              )}
              {(minValue !== undefined || maxValue !== undefined) && (
                <span className="text-xs text-gray-500 ml-auto">
                  {minValue !== undefined && maxValue !== undefined
                    ? `Range: ${currency}${minValue} - ${currency}${maxValue}`
                    : minValue !== undefined
                    ? `Min: ${currency}${minValue}`
                    : `Max: ${currency}${maxValue}`
                  }
                </span>
              )}
            </div>
          </div>
        );
      }}
    />
  );
};

