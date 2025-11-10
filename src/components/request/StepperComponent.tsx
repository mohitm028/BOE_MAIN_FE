import { Box, Stepper, Step, StepLabel, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface RequestStepperProps {
    activeStep: number;
}

const steps: string[] = [
    'Request Pending',
    'Pending Approval by Manager',
    'Pending Assignee',
    'Pending Technical Review',
    'Pending Implementation',
    'Closed',
];

const RequestStepper: React.FC<RequestStepperProps> = ({ activeStep }) => {
    return (
        <Box
            sx={{
                width: '100%',
                mb: 4,
                pt: 2,
                pb: 4,
                bgcolor: 'white',
                borderRadius: 2,
                boxShadow: 1,
            }}
        >
            <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label, index) => {
                    const stepProps: { completed?: boolean } = {};
                    const labelProps: { optional?: React.ReactNode } = {};

                    if (index < activeStep) {
                        labelProps.optional = (
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Completed
                            </Typography>
                        );
                        stepProps.completed = true;
                    }

                    return (
                        <Step key={label} {...stepProps}>
                            <StepLabel
                                {...labelProps}
                                StepIconProps={{
                                    sx: {
                                        // Blue for active step, white background for unreached, blue for completed
                                        color:
                                            index === activeStep
                                                ? '#1976d2'
                                                : index < activeStep
                                                ? '#1976d2'
                                                : '#757575', // Gray text for unreached
                                        bgcolor:
                                            index >= activeStep &&
                                            index !== activeStep
                                                ? '#ffffff'
                                                : undefined, // White background for unreached
                                        border:
                                            index >= activeStep &&
                                            index !== activeStep
                                                ? '1px solid #757575'
                                                : undefined, // Gray border for visibility
                                        borderRadius: '50%',
                                        '&.Mui-active': {
                                            color: '#1976d2', // Blue for active step
                                            bgcolor: '#ffffff', // White background for active step circle
                                            border: '1px solid #1976d2', // Blue border for active step
                                        },
                                        '&.Mui-completed': {
                                            color: '#1976d2', // Blue for completed step index
                                        },
                                    },
                                }}
                                StepIconComponent={
                                    index < activeStep
                                        ? () => (
                                              <CheckCircleIcon
                                                  sx={{ color: '#1976d2' }}
                                              />
                                          ) // Blue checkmark for completed steps
                                        : undefined
                                }
                            >
                                {label}
                            </StepLabel>
                        </Step>
                    );
                })}
            </Stepper>
        </Box>
    );
};

export default RequestStepper;
