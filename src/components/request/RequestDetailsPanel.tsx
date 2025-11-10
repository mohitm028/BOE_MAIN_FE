import React from 'react';
import {
    Box,
    Typography,
    Paper,
    IconButton,
    Collapse,
    Table,
    TableBody,
    TableCell,
    TableRow,
    TableHead,
} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { RequestDataType } from './RequestTypes'; // Import the type

// --- Collapsible Section Props ---
interface CollapsibleSectionProps {
    title: string;
    children: React.ReactNode;
    expanded: boolean;
    onToggle: () => void;
}

// --- Detail Row Props ---
interface DetailRowProps {
    label: string;
    value: string | undefined | null;
}

// --- Panel Props ---
interface RequestDetailsPanelProps {
    requestData: RequestDataType;
}

// --- Reusable Collapsible Section Component ---
const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
    title,
    children,
    expanded,
    onToggle,
}) => (
    <Paper
        variant="outlined"
        sx={{
            mt: 2,
            mb: 2,
            border: 1,
            borderColor: 'grey.300',
            borderRadius: 1,
        }}
    >
        <Box
            sx={{
                p: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                bgcolor: 'grey.50',
            }}
            onClick={onToggle}
        >
            <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                {title}
            </Typography>
            <IconButton size="small">
                {expanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </IconButton>
        </Box>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
            <Box sx={{ p: 2 }}>{children}</Box>
        </Collapse>
    </Paper>
);

// --- Detail Row Component for consistency ---
const DetailRow: React.FC<DetailRowProps> = ({ label, value }) => (
    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
        <TableCell
            component="th"
            scope="row"
            sx={{ fontWeight: 'medium', width: '35%' }}
        >
            {label}:
        </TableCell>
        <TableCell>{value || 'N/A'}</TableCell>
    </TableRow>
);

const RequestDetailsPanel: React.FC<{ requestData: any }> = ({
    requestData,
}) => {
    const [expandedSection, setExpandedSection] = React.useState<string | null>(
        'requestDetails'
    );

    const toggleSection = (section: string) => {
        setExpandedSection((prev) => (prev === section ? null : section));
    };

    return (
        <Box>
            {/* 1. Request Details Section */}
            <CollapsibleSection
                title="Request Details"
                expanded={expandedSection === 'requestDetails'}
                onToggle={() => toggleSection('requestDetails')}
            >
                <Table size="small">
                    <TableBody>
                        <DetailRow
                            label="Request ID"
                            value={requestData?.requestInfo?.requestNumber}
                        />
                        <DetailRow
                            label="Request Type"
                            value={requestData?.requestInfo?.requestType}
                        />
                        <DetailRow
                            label="Request Status"
                            value={requestData?.requestInfo?.requestStatus}
                        />
                        <DetailRow
                            label="Submit Date"
                            value={requestData?.requestInfo?.installDate}
                        />
                    </TableBody>
                </Table>
            </CollapsibleSection>

            {/* 2. Job Information Section */}
            <CollapsibleSection
                title="Job Information"
                expanded={expandedSection === 'jobInformation'}
                onToggle={() => toggleSection('jobInformation')}
            >
                <Table size="small">
                    <TableBody>
                        <DetailRow
                            label="Job Name"
                            value={requestData.jobName}
                        />
                        <DetailRow
                            label="Job Description"
                            value={requestData.jobDescription}
                        />
                        <DetailRow
                            label="Job Owner"
                            value={requestData.jobOwner}
                        />
                    </TableBody>
                </Table>
            </CollapsibleSection>

            {/* 3. Frequencies Section */}
            <CollapsibleSection
                title="Frequencies"
                expanded={expandedSection === 'frequencies'}
                onToggle={() => toggleSection('frequencies')}
            >
                {requestData.frequencies &&
                requestData.frequencies.length > 0 ? (
                    <Table size="small">
                        <TableHead sx={{ bgcolor: 'grey.200' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>
                                    Frequency
                                </TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>
                                    Start Time
                                </TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>
                                    End Time
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {requestData.frequencies.map(
                                (frequency: any, index: any) => (
                                    <TableRow key={index}>
                                        <TableCell>{frequency.name}</TableCell>
                                        <TableCell>
                                            {frequency.startTime}
                                        </TableCell>
                                        <TableCell>
                                            {frequency.endTime}
                                        </TableCell>
                                    </TableRow>
                                )
                            )}
                        </TableBody>
                    </Table>
                ) : (
                    <Typography color="text.secondary" sx={{ p: 1 }}>
                        No frequencies available.
                    </Typography>
                )}
            </CollapsibleSection>
        </Box>
    );
};

export default RequestDetailsPanel;
