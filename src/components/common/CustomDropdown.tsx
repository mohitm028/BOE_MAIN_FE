import React, { useRef, useEffect, useState } from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

export interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface CustomDropdownProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  options: DropdownOption[];
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  showContinue?: boolean;
  onContinue?: () => void;
  className?: string;
}

export function CustomDropdown<T extends FieldValues>({
  name,
  control,
  label,
  options,
  placeholder = '--Select--',
  disabled = false,
  required = false,
  error = false,
  helperText,
  showContinue = false,
  onContinue,
  className = '',
}: CustomDropdownProps<T>) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    if (!disabled) {
      setOpen((prevOpen) => !prevOpen);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const hasError = error || !!fieldState.error;
        const errorMessage = helperText || fieldState.error?.message;
        
        return (
          <div className={`${className}`}>
            {/* Label - Smaller text */}
            {label && (
              <label className="block text-xs text-gray-600 mb-1">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
              </label>
            )}

            {/* Dropdown Container */}
            <div className="relative" ref={dropdownRef}>
              {/* Dropdown Button - More compact */}
              <button
                type="button"
                onClick={handleToggle}
                disabled={disabled}
                className={`
                  w-full px-3 py-2 text-sm border rounded-md text-left 
                  flex items-center justify-between transition-all
                  ${disabled 
                    ? 'bg-gray-100 text-gray-700 cursor-not-allowed border-gray-300' 
                    : 'bg-white hover:border-blue-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                  }
                  ${hasError ? 'border-red-500' : 'border-gray-300'}
                  ${open ? 'ring-2 ring-blue-500/20 border-blue-500' : ''}
                  focus:outline-none
                `}
              >
                <span className={`text-sm ${field.value ? 'text-gray-900' : 'text-gray-500'}`}>
                  {field.value 
                    ? options.find(opt => opt.value === field.value)?.label || field.value
                    : placeholder
                  }
                </span>
                <svg 
                  className={`h-4 w-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {open && (
                <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                  {/* Header */}
                  <div className="px-3 py-2 text-xs text-gray-500 bg-gray-100 border-b border-gray-200 sticky top-0 z-10">
                    {placeholder}
                  </div>

                  {/* Options */}
                  {options.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        if (!option.disabled) {
                          field.onChange(option.value);
                          handleClose();
                        }
                      }}
                      disabled={option.disabled}
                      className={`
                        w-full px-3 py-2 text-sm text-left transition-colors
                        ${option.disabled 
                          ? 'text-gray-400 cursor-not-allowed bg-gray-50' 
                          : 'text-gray-700 hover:bg-gray-100'
                        }
                        ${field.value === option.value ? 'bg-blue-50' : ''}
                      `}
                    >
                      {option.label}
                    </button>
                  ))}

                  {/* Continue Option for Region Dropdown */}
                  {showContinue && field.value && (
                    <>
                      <div className="border-t border-gray-200"></div>
                      <button
                        type="button"
                        onClick={() => {
                          handleClose();
                          onContinue?.();
                        }}
                        className="w-full px-3 py-2 text-sm text-left text-blue-600 font-medium hover:bg-blue-50 transition-colors"
                      >
                        Continue
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Error Message */}
            {hasError && errorMessage && (
              <span className="text-xs text-red-500 mt-1 block">{errorMessage}</span>
            )}
          </div>
        );
      }}
    />
  );
}

export default CustomDropdown;