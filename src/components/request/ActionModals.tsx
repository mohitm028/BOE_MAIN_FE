import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';

// --- Type Definitions for Modal Props ---
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (reason: string) => void;
}

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
};

// --- Comment Modal ---
export const CommentModal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
}) => {
    const [comment, setComment] = useState('');

    const handleSubmit = () => {
        onSubmit(comment);
        setComment('');
    };

    return (
        <Modal open={isOpen} onClose={onClose}>
            <Box sx={modalStyle}>
                <Typography variant="h6" component="h2" gutterBottom>
                    Add Comment
                </Typography>
                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    placeholder="Write your comment here..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    variant="outlined"
                    sx={{ mb: 2 }}
                />
                <Box display="flex" justifyContent="flex-end" sx={{ gap: 1 }}>
                    <Button
                        onClick={onClose}
                        variant="outlined"
                        color="secondary"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        color="primary"
                        disabled={!comment.trim()}
                    >
                        Submit
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

// --- Decline Reason Modal ---
export const DeclineReasonModal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
}) => {
    const [reason, setReason] = useState('');

    const handleSubmit = () => {
        onSubmit(reason);
        setReason('');
    };

    return (
        <Modal open={isOpen} onClose={onClose}>
            <Box sx={modalStyle}>
                <Typography variant="h6" component="h2" gutterBottom>
                    Add Decline Reason
                </Typography>
                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    placeholder="Write your reason here..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    variant="outlined"
                    sx={{ mb: 2 }}
                />
                <Box display="flex" justifyContent="flex-end" sx={{ gap: 1 }}>
                    <Button onClick={onClose} variant="outlined">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        color="error"
                        disabled={!reason.trim()}
                    >
                        Submit
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

// --- Cancel Reason Modal ---
export const CancelReasonModal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
}) => {
    const [reason, setReason] = useState('');

    const handleSubmit = () => {
        onSubmit(reason);
        setReason('');
    };

    return (
        <Modal open={isOpen} onClose={onClose}>
            <Box sx={modalStyle}>
                <Typography variant="h6" component="h2" gutterBottom>
                    Add Cancel Reason
                </Typography>
                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    placeholder="Write your reason here..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    variant="outlined"
                    sx={{ mb: 2 }}
                />
                <Box display="flex" justifyContent="flex-end" sx={{ gap: 1 }}>
                    <Button onClick={onClose} variant="outlined">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        color="error"
                        disabled={!reason.trim()}
                    >
                        Submit
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};
