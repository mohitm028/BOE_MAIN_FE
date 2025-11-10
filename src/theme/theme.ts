import { createTheme } from '@mui/material/styles';

// Create custom theme that aligns with Bank of America branding
const theme = createTheme({
  palette: {
    primary: {
      main: '#dc2626', // Bank of America red
      light: '#ef4444',
      dark: '#b91c1c',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#2563eb', // Blue
      light: '#3b82f6',
      dark: '#1e40af',
      contrastText: '#ffffff',
    },
    error: {
      main: '#ef4444',
    },
    warning: {
      main: '#f59e0b',
    },
    info: {
      main: '#3b82f6',
    },
    success: {
      main: '#10b981',
    },
    grey: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
    background: {
      default: '#f9fafb',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    // Align with Tailwind's text sizes
    h1: {
      fontSize: '2.25rem', // text-4xl
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '1.875rem', // text-3xl
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.5rem', // text-2xl
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.25rem', // text-xl
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.125rem', // text-lg
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1rem', // text-base
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '0.875rem', // text-sm
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.75rem', // text-xs
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none', // Disable uppercase transformation
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 6, // Slightly rounded corners like Tailwind's rounded-md
  },
  components: {
    // TextField customization
    MuiTextField: {
      defaultProps: {
        size: 'small',
        variant: 'outlined',
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
              borderColor: '#2563eb',
            },
          },
        },
      },
    },
    // Button customization
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '0.375rem', // rounded-md
          padding: '0.5rem 1rem',
          fontWeight: 500,
          transition: 'all 200ms',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
          },
        },
        outlined: {
          borderWidth: '1px',
          '&:hover': {
            borderWidth: '1px',
          },
        },
        sizeSmall: {
          padding: '0.375rem 0.75rem',
          fontSize: '0.875rem',
        },
        sizeLarge: {
          padding: '0.625rem 1.25rem',
          fontSize: '1rem',
        },
      },
    },
    // Select customization
    MuiSelect: {
      defaultProps: {
        size: 'small',
      },
      styleOverrides: {
        select: {
          paddingTop: '0.5rem',
          paddingBottom: '0.5rem',
        },
      },
    },
    // Dialog customization
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: '0.5rem', // rounded-lg
          boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
        },
      },
    },
    // Alert customization
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: '0.375rem', // rounded-md
        },
        standardError: {
          backgroundColor: '#fef2f2',
          color: '#991b1b',
        },
        standardWarning: {
          backgroundColor: '#fffbeb',
          color: '#92400e',
        },
        standardInfo: {
          backgroundColor: '#eff6ff',
          color: '#1e40af',
        },
        standardSuccess: {
          backgroundColor: '#f0fdf4',
          color: '#166534',
        },
      },
    },
    // Chip customization
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '0.375rem', // rounded-md
          fontWeight: 500,
        },
        sizeSmall: {
          fontSize: '0.75rem',
        },
      },
    },
    // Paper customization
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none', // Remove default gradient
        },
        rounded: {
          borderRadius: '0.375rem', // rounded-md
        },
      },
    },
    // FormControl customization
    MuiFormControl: {
      defaultProps: {
        size: 'small',
      },
    },
    // InputLabel customization
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
        },
      },
    },
    // FormHelperText customization
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          marginTop: '0.25rem',
          fontSize: '0.75rem',
        },
      },
    },
    // Stepper customization
    MuiStepper: {
      styleOverrides: {
        root: {
          padding: '1.5rem 0',
        },
      },
    },
    MuiStepLabel: {
      styleOverrides: {
        label: {
          fontWeight: 500,
          '&.Mui-active': {
            fontWeight: 600,
          },
          '&.Mui-completed': {
            fontWeight: 500,
          },
        },
      },
    },
    // CircularProgress customization
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          color: 'currentColor',
        },
      },
    },
    // Skeleton customization
    MuiSkeleton: {
      styleOverrides: {
        root: {
          backgroundColor: '#e5e7eb',
        },
      },
    },
    // Tooltip customization
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#1f2937',
          fontSize: '0.75rem',
          borderRadius: '0.375rem',
          padding: '0.375rem 0.75rem',
        },
        arrow: {
          color: '#1f2937',
        },
      },
    },
  },
});

export default theme;
