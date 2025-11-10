import React, { useState } from 'react';
import {
    Box,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Typography,
    SelectChangeEvent,
} from '@mui/material';
import { UserRole } from './RequestTypes';

// --- Props Interface ---
interface RequestActionsProps {
    role: UserRole | string;
    activeStep: number;
    requestStatus: string; // Use string for status flexibility

    // Action Handlers (callbacks)
    onApprove: () => void;
    onDecline: () => void;
    onCancel: () => void;
    onSendToManager: () => void;
    onAssign: (assignee: string) => void;
    onAssignToMyself: () => void;
    onComment: () => void;
    onApproveForInstall: () => void;
    onReassign: () => void;
    onSendBack: () => void;
    onTakeBackup: () => void;
    onReviewCode: () => void;
    onGenerateBTI: () => void;
    onInstallJob: () => void;
}

const AssigneeOptions = [
    { id: '11', name: 'Pranjal' },
    { id: '12', name: 'Asgar' },
    { id: '13', name: 'Monica' },
    { id: '14', name: 'Cade' },
];

const RequestActions: React.FC<RequestActionsProps> = ({
    role,
    activeStep,
    requestStatus,
    onApprove,
    onDecline,
    onCancel,
    onSendToManager,
    onAssign,
    onAssignToMyself,
    onComment,
    onApproveForInstall,
    onReassign,
    onSendBack,
    onTakeBackup,
    onReviewCode,
    onGenerateBTI,
    onInstallJob,
}) => {
    const [selectedAssignee, setSelectedAssignee] = useState('');

    const handleAssignChange = (event: SelectChangeEvent<string>) => {
        const assignee = event.target.value;
        setSelectedAssignee(assignee);
        if (assignee) {
            onAssign(assignee);
            setSelectedAssignee(''); // Reset after assignment
        }
    };

    if (role === 'USER' && requestStatus === 'PENDING') {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                    variant="contained"
                    color="success"
                    onClick={onSendToManager}
                >
                    Send to Manager
                </Button>
                <Button variant="outlined" onClick={onComment}>
                    Add Comments
                </Button>
            </Box>
        );
    }

    // --- Actions for AU (User/Requestor) ---
    if (role === 'MANAGER' && requestStatus === 'SUBMITTED') {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button variant="contained" color="success" onClick={onApprove}>
                    Approve
                </Button>
                <Button variant="contained" color="error" onClick={onCancel}>
                    Cancel Request
                </Button>
                <Button variant="outlined" onClick={onComment}>
                    Add Comments
                </Button>
            </Box>
        );
    }

    // --- Actions for AM (Manager/Admin) ---
    if (role === 'CA7ADMIN' && requestStatus !== 'IMPLEMENTED') {
        // Step 2: Pending Assignee
        if (activeStep === 2) {
            return (
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        p: 2,
                        bgcolor: 'grey.50',
                        borderRadius: 1,
                        border: '1px solid #e0e0e0',
                    }}
                >
                    <Typography variant="subtitle1" fontWeight="bold">
                        Technical Review Actions
                    </Typography>

                    <FormControl fullWidth size="small">
                        <InputLabel>Assign To</InputLabel>
                        <Select
                            label="Assign To"
                            value={selectedAssignee}
                            onChange={handleAssignChange}
                        >
                            <MenuItem value="">
                                <em>Select Assignee</em>
                            </MenuItem>
                            {AssigneeOptions.map((assignee) => (
                                <MenuItem
                                    key={assignee.name}
                                    value={assignee.name}
                                >
                                    {assignee.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={onAssignToMyself}
                    >
                        Assign to Myself
                    </Button>

                    <Button variant="outlined" onClick={onComment}>
                        Add Comments
                    </Button>
                </Box>
            );
        }

        // Step 3: Technical Review/Install Scheduling
        if (activeStep === 3) {
            return (
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        p: 2,
                        bgcolor: 'grey.50',
                        borderRadius: 1,
                        border: '1px solid #e0e0e0',
                    }}
                >
                    <Typography variant="subtitle1" fontWeight="bold">
                        Review & Scheduling Actions
                    </Typography>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={onApproveForInstall}
                    >
                        Approve for Installation
                    </Button>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={onReassign}
                    >
                        Reassign
                    </Button>
                    <Button
                        variant="contained"
                        color="warning"
                        onClick={onSendBack}
                    >
                        Send Back to Requestor
                    </Button>
                    <Button variant="outlined" onClick={onComment}>
                        Add Comments
                    </Button>
                </Box>
            );
        }

        // Step 4: Installation Steps
        if (activeStep === 4) {
            return (
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1.5,
                        p: 2,
                        bgcolor: 'grey.50',
                        borderRadius: 1,
                        border: '1px solid #e0e0e0',
                    }}
                >
                    <Typography variant="subtitle1" fontWeight="bold">
                        Installation Steps
                    </Typography>

                    <Button variant="outlined" onClick={onReassign}>
                        Reassign
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={onTakeBackup}
                    >
                        Take Backup of Job
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={onReviewCode}
                    >
                        Generate & Review Code
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={onGenerateBTI}
                    >
                        Generate BTI
                    </Button>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={onInstallJob}
                        sx={{ mt: 1 }}
                    >
                        Install Job (Complete Step)
                    </Button>
                    <Button
                        variant="contained"
                        color="warning"
                        onClick={onSendBack}
                        sx={{ mt: 1 }}
                    >
                        Send Back to Requestor
                    </Button>
                    <Button variant="outlined" onClick={onComment}>
                        Add Comments
                    </Button>
                </Box>
            );
        }
    }

    // Default/Other Steps: Just comments button (e.g., Step 5, 6, 7 if not closed)
    if (requestStatus !== 'CLOSED') {
        return (
            <Box
                sx={{
                    p: 2,
                    bgcolor: 'background.paper',
                    borderRadius: 1,
                    boxShadow: 1,
                }}
            >
                <Button variant="outlined" fullWidth onClick={onComment}>
                    Add Comments
                </Button>
            </Box>
        );
    }

    return null; // No actions available
};

export default RequestActions;
