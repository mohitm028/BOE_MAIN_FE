import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Paper,
    IconButton,
    CircularProgress,
    // Grid,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import RequestDetailsPanel from './RequestDetailsPanel';
import {
    CommentModal,
    DeclineReasonModal,
    CancelReasonModal,
} from './ActionModals';

import { UserContext } from '../../contexts/UserContext';
import { JobRequestData } from './RequestTypes';
import { RequestDataType } from './RequestTypes';
import RequestActions from './ActionsComponent';
import RequestStepper from './StepperComponent';
import { dummyRequestV2List } from '../data/requestsv2';
import { AllJobFlowService } from '../Pages/all-job-list/service/AllJobService';
import { Command as CommandPrimitive } from 'cmdk';

const RequestMainComponent: React.FC<{
    id: number;
    requestId: number | string;
}> = ({ requestId }) => {
    const userState = useContext(UserContext);
    const navigate = useNavigate();
    const location = useLocation();

    // const userRole = userContext?.user?.role ?? 'USER';
    // const userRole = 'USER';
    // const userRole = 'MANAGER';
    const userRole = 'CA7ADMIN';
    const statusToFindJobWith = 'IMPLEMENTED';

    // State management
    const [activeStep, setActiveStep] = useState<number>(1);
    const [requestData, setRequestData] = useState<JobRequestData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [isCommentModalOpen, setCommentModalOpen] = useState<boolean>(false);
    const [isDeclineModalOpen, setDeclineModalOpen] = useState<boolean>(false);
    const [isCancelModalOpen, setCancelModalOpen] = useState<boolean>(false);

    const [assigneeId, setAssigneeId] = useState<number | string | undefined>(
        0
    );

    // --- Data Fetching and Step Initialization ---
    useEffect(() => {
        // TODO: call backend api that takes request id and gives data

        setLoading(true);
        const timer = setTimeout(() => {
            // Simulated API call (Casting to RequestData[] to satisfy TS)
            // const fetchedData = dummyRequestV2List.find(
            //     (request) => request.requestInfo.requestNumber === requestId
            // );

            const fetchData = async () => {
                try {
                    // const fetchedData =
                    //     await AllJobService.COMMON_API.getSingleJobRequestById(
                    //         requestId
                    //     );

                    const fetchedData = dummyRequestV2List.find(
                        (request) =>
                            request.requestInfo.requestNumber === requestId
                    );

                    setRequestData(fetchedData || null);

                    const reqStatus = fetchedData?.requestInfo?.requestStatus;
                    getInitialStepBasedOnRequestStatus(
                        reqStatus,
                        setActiveStep
                    );
                } catch (err: any) {
                    console.error('Failed to fetch data:', err);
                    setRequestData(null);
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        }, 1500);

        return () => clearTimeout(timer);
    }, [requestId, location.pathname]);

    useEffect(() => {
        console.log(userState?.user);
    }, [userState?.user]);

    // --- Action Handlers ---
    const handleSendToManager = () => {
        try {
            AllJobFlowService.USER_API.sendJobToManager(requestId).then(
                (response) => {
                    updateRequestStatus('SUBMITTED');
                    alert(response?.message);
                }
            );
            setActiveStep((step) => step + 1);
        } catch (err: any) {
            console.error(err);
            alert(err?.message || 'Failed to send job to manager');
        }
    };

    const handleCommentSubmit = (comment: string) => {
        setCommentModalOpen(false);
        console.log('Comment submitted:', comment);
        alert(`Comment submitted: ${comment}`);
        // TODO: Backend API call to post comment
    };

    const handleDeclineSubmit = (reason: string) => {
        setDeclineModalOpen(false);
        setRequestData((prev: any) =>
            prev ? { ...prev, requestStatus: 'DECLINED' } : null
        );
        console.log('Request Declined. Reason:', reason);
        alert(`Request Declined. Reason: ${reason}`);
        // TODO: Backend API call for Decline action
    };

    const handleCancelSubmit = (reason: string) => {
        setCancelModalOpen(false);
        setRequestData((prev: any) =>
            prev ? { ...prev, requestStatus: 'CANCELLED' } : null
        );
        console.log('Request Cancelled. Reason:', reason);
        alert(`Request Cancelled. Reason: ${reason}`);
        // TODO: Backend API call for Cancel action
    };

    const handleApprove = () => {
        try {
            AllJobFlowService.MANAGER_API.approveAsManager(requestId).then(
                (response) => {
                    updateRequestStatus('PENDING_TECHNICAL_REVIEW');
                    setActiveStep((step) => step + 1);
                    alert(response?.message || 'Request Approved by Manager');
                }
            );
        } catch (err: any) {
            console.error(err);
            alert(err?.message || 'Failed to send job to manager');
        }
    };

    const handleApproveForInstall = () => {
        try {
            AllJobFlowService.CA7ADMIN_API.approveForInstallation(
                requestId,
                assigneeId
            ).then((response) => {
                updateRequestStatus('INSTALL_SCHEDULED');
                setActiveStep((step) => step + 1);
                alert(response?.message || 'Approved for Installation');
            });
        } catch (err: any) {
            console.error(err);
            alert(err?.message || 'Failed to approve job for installation');
        }
    };

    const handleUserSignOffJob = () => {
        alert('Signed off for installation of job');
        updateRequestStatus('SIGNED_OFF');
        setActiveStep(6);
    };

    const handleInstallJob = () => {
        try {
            AllJobFlowService.CA7ADMIN_API.installJob(requestId).then(
                (response) => {
                    updateRequestStatus('IMPLEMENTED');
                    setActiveStep((step) => step + 1);
                    alert(response?.message || 'Job Installed');
                }
            );
        } catch (err: any) {
            console.error(err);
            alert(err?.message || 'Failed to install job');
        }
    };

    const handleAssign = (assignee: string) => {
        alert(`Assigned to ${assignee}. Moving to next step.`);
        // updateRequestStatus('ASSIGNED');
        setAssigneeId(assignee);
        setActiveStep((prev) => prev + 1);
        // TODO: API call to assign
    };

    const handleAssignToMyself = () => {
        alert('Assigned to myself. Moving to next step.');
        // updateRequestStatus('ASSIGNED');
        setAssigneeId(userState?.user?.id);
        setActiveStep((prev) => prev + 1);
        // TODO: API call to assign to self
    };

    // --- Loading and Not Found States ---
    if (loading) {
        return (
            <Container
                sx={{
                    p: 4,
                    bgcolor: 'grey.100',
                    minHeight: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <CircularProgress color="primary" size={40} />
                    <Typography variant="body1" sx={{ mt: 2 }}>
                        Fetching data...
                    </Typography>
                </Box>
            </Container>
        );
    }

    if (!requestData) {
        return (
            <Container
                sx={{
                    p: 4,
                    bgcolor: 'grey.100',
                    minHeight: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Typography variant="h6" color="error">
                    Request Not found
                </Typography>
            </Container>
        );
    }

    // --- Render Main Content ---
    return (
        <Container
            maxWidth="xl"
            sx={{
                px: { xs: 2, sm: 3, md: 4 },
                py: 3,
                bgcolor: 'grey.100',
                minHeight: '100vh',
            }}
        >
            <Box sx={{ position: 'relative', mb: 3 }}>
                <Typography
                    variant="h5"
                    component="h1"
                    gutterBottom
                    sx={{ fontWeight: 'bold', pr: 6 }}
                >
                    Job Schedule Request:{' '}
                    {requestData.requestInfo.requestNumber}, Role:
                    {userRole}
                </Typography>
                <IconButton
                    onClick={() => navigate('/requests')}
                    aria-label="Close"
                    sx={{
                        position: 'absolute',
                        top: -8,
                        right: 0,
                        bgcolor: 'error.main',
                        color: 'white',
                        '&:hover': { bgcolor: 'error.dark' },
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </Box>
            {/* Stepper Component */}
            <Box sx={{ mb: 3 }}>
                <RequestStepper activeStep={activeStep} />
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', lg: 'row' },
                    gap: 2.5,
                }}
            >
                {/* Left Column: Details */}
                <Box sx={{ flex: { xs: '1 1 100%', lg: '1 1 66.67%' } }}>
                    <RequestDetailsPanel requestData={requestData} />
                </Box>

                {/* Right Column: Actions */}
                <Box sx={{ flex: { xs: '1 1 100%', lg: '1 1 33.33%' } }}>
                    <Paper
                        elevation={2}
                        sx={{
                            p: 2.5,
                            height: '100%',
                            bgcolor: 'background.paper',
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: 'divider',
                        }}
                    >
                        <Typography
                            variant="h6"
                            gutterBottom
                            sx={{ fontWeight: 600, mb: 2 }}
                        >
                            Actions
                        </Typography>
                        {/* Ensure userState.role exists and is valid before passing to RequestActions */}
                        {userState?.user?.role && (
                            <RequestActions
                                role={userRole}
                                activeStep={activeStep}
                                requestStatus={
                                    requestData.requestInfo.requestStatus
                                }
                                // Step 1
                                onSendToManager={handleSendToManager}
                                // Step 2
                                onApprove={handleApprove}
                                onDecline={() => setDeclineModalOpen(true)}
                                onCancel={() => setCancelModalOpen(true)}
                                // Step 3
                                onAssign={handleAssign}
                                onAssignToMyself={handleAssignToMyself}
                                onApproveForInstall={handleApproveForInstall}
                                onReassign={() => alert('Reassigned')}
                                onSendBack={() =>
                                    alert('Request sent back to requestor')
                                }
                                // Step 5
                                onTakeBackup={() =>
                                    alert('Backup of Job Taken')
                                }
                                onReviewCode={() =>
                                    alert('Code Generated and Reviewed')
                                }
                                onGenerateBTI={() => alert('BTI Generated')}
                                onInstallJob={handleInstallJob}
                                // General
                                onComment={() => setCommentModalOpen(true)}
                            />
                        )}
                    </Paper>
                </Box>
            </Box>
            {/* Modals */}
            <CancelReasonModal
                isOpen={isCancelModalOpen}
                onClose={() => setCancelModalOpen(false)}
                onSubmit={handleCancelSubmit}
            />
            <DeclineReasonModal
                isOpen={isDeclineModalOpen}
                onClose={() => setDeclineModalOpen(false)}
                onSubmit={handleDeclineSubmit}
            />
            <CommentModal
                isOpen={isCommentModalOpen}
                onClose={() => setCommentModalOpen(false)}
                onSubmit={handleCommentSubmit}
            />
        </Container>
    );

    function updateRequestStatus(status: string) {
        setRequestData((prev: any) =>
            prev
                ? {
                      ...prev,
                      requestInfo: {
                          ...prev.requestInfo,
                          requestStatus: status,
                      },
                  }
                : null
        );
    }
};

export default RequestMainComponent;

function getInitialStepBasedOnRequestStatus(
    reqStatus: any,
    setActiveStep: React.Dispatch<React.SetStateAction<number>>
) {
    if (reqStatus === 'PENDING') {
        setActiveStep(0);
    } else if (reqStatus === 'SUBMITTED') {
        setActiveStep(1);
    } else if (reqStatus === 'PENDING_TECHNICAL_REVIEW') {
        setActiveStep(2);
    } else if (reqStatus === 'INSTALL_SCHEDULED') {
        setActiveStep(4);
    } else if (reqStatus === 'IMPLEMENTED') {
        setActiveStep(5);
    }
}
