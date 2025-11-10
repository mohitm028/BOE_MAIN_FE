import { forwardRef, ReactNode } from 'react';
import { Button as MuiButton, ButtonProps as MuiButtonProps, CircularProgress } from '@mui/material';
import clsx from 'clsx';

interface ButtonProps extends Omit<MuiButtonProps, 'variant' | 'color'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

const buttonVariants = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white border-transparent shadow-sm hover:shadow-md',
  secondary: 'bg-gray-600 hover:bg-gray-700 text-white border-transparent shadow-sm hover:shadow-md',
  outline: 'bg-transparent hover:bg-gray-50 text-gray-700 border-gray-300 shadow-sm hover:shadow-md',
  ghost: 'bg-transparent hover:bg-gray-100 text-gray-600 border-transparent',
  danger: 'bg-red-600 hover:bg-red-700 text-white border-transparent shadow-sm hover:shadow-md',
};

const buttonSizes = {
  sm: 'px-3 py-1.5 text-xs min-h-[2rem]',
  md: 'px-4 py-2 text-sm min-h-[2.5rem]',
  lg: 'px-6 py-3 text-base min-h-[3rem]',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    variant = 'primary',
    size = 'md',
    isLoading = false,
    loadingText,
    leftIcon,
    rightIcon,
    children,
    className,
    disabled,
    fullWidth = false,
    ...props
  }, ref) => {
    
    const isDisabled = disabled || isLoading;
    
    return (
      <MuiButton
        ref={ref}
        disabled={isDisabled}
        fullWidth={fullWidth}
        className={clsx(
          'relative',
          'font-medium',
          'rounded-lg',
          'transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'normal-case', // Prevent MUI's uppercase transformation
          buttonVariants[variant],
          buttonSizes[size],
          variant === 'primary' && 'focus:ring-blue-500',
          variant === 'secondary' && 'focus:ring-gray-500',
          variant === 'outline' && 'focus:ring-gray-500',
          variant === 'danger' && 'focus:ring-red-500',
          className
        )}
        sx={{
          textTransform: 'none', // Ensure no text transformation
          '&:hover': {
            transform: 'translateY(-1px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        }}
        {...props}
      >
        <div className={clsx(
          'flex items-center justify-center space-x-2',
          isLoading && 'opacity-0'
        )}>
          {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
        </div>
        
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <CircularProgress 
              size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} 
              className="text-current" 
            />
            {loadingText && (
              <span className="ml-2 text-sm">{loadingText}</span>
            )}
          </div>
        )}
      </MuiButton>
    );
  }
);

Button.displayName = 'Button';
