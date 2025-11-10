import React from 'react';
import { Button, CircularProgress, ButtonProps } from '@mui/material';
import clsx from 'clsx';

interface ActionButtonProps extends Omit<ButtonProps, 'className'> {
  loading?: boolean;
  className?: string; // Additional Tailwind classes
  loadingText?: string;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  children,
  loading = false,
  disabled = false,
  variant = 'contained',
  color = 'primary',
  className = '',
  loadingText,
  startIcon,
  ...rest
}) => {
  return (
    <Button
      variant={variant}
      color={color}
      disabled={disabled || loading}
      className={clsx('min-w-[100px]', className)}
      startIcon={
        loading ? (
          <CircularProgress size={16} color="inherit" />
        ) : (
          startIcon
        )
      }
      {...rest}
    >
      {loading && loadingText ? loadingText : children}
    </Button>
  );
};
