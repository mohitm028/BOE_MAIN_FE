import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,Grid,TextField,Button,Typography } from '@mui/material';
import requests from '../data/requests.json';

interface Request {
  id: number;
  jobName: string;
  status: string;
  requestType: string;
  createdAt: string;
  assigneeName: string;
  requestorName: string;
}

const AllApprovalRequestPage = () => {
  const [searchQueryRequestId, setSearchQueryRequestId] = useState('');
  const [searchQueryJobName, setSearchQueryJobName] = useState('');
  const [searchQueryRequestType, setSearchQueryRequestType] = useState('');
  const [searchQueryStatus, setSearchQueryStatus] = useState('');
  const [searchResults, setSearchResults] = useState<Request[]>([]);
  const [requestsState, setRequests] = useState<Request[]>([]);
  useEffect(() => {
    setRequests(requestsState);
  }, []);

  //const [requests, setRequests] = useState([]);
//   useEffect(() => {
//     fetch('/api/requests')
//       .then(response => response.json())
//       .then(data => setRequests(data));
//   }, []);

const handleSearch = () => {
    const filteredRequests = requests.filter((request) => {
      const requestId = request.id.toString().includes(searchQueryRequestId);
      const jobName = request.jobName.toLowerCase().includes(searchQueryJobName.toLowerCase());
      const status = request.status.toLowerCase().includes(searchQueryStatus.toLowerCase());
      const requestType = request.requestType.toLowerCase().includes(searchQueryRequestType.toLowerCase());
      return requestId || jobName || status || requestType;
    });
    setSearchResults(filteredRequests);
  };
  
  return (
    <>
     <Grid container spacing={2}>
        <Grid item xs={2}>
          <TextField
            label="Search By Request ID"
            value={searchQueryRequestId}
            onChange={(event) => setSearchQueryRequestId(event.target.value)}
            fullWidth />
        </Grid>
        <Grid item xs={2}>
          <TextField
            label="Search By Job Name"
            value={searchQueryJobName}
            onChange={(event) => setSearchQueryJobName(event.target.value)}
            fullWidth />
        </Grid>
        <Grid item xs={2}>
          <TextField
            label="Search By Request Type"
            value={searchQueryRequestType}
            onChange={(event) => setSearchQueryRequestType(event.target.value)}
            fullWidth />
        </Grid>
        <Grid item xs={2}>
          <TextField
            label="Search By Status"
            value={searchQueryStatus}
            onChange={(event) => setSearchQueryStatus(event.target.value)}
            fullWidth />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleSearch}>
            Search
          </Button>
        </Grid>
        <Grid item xs={12}>
          {searchResults.length > 0 ? (
            <Grid container spacing={2}>
              {searchResults.map((request) => (
                <Grid item key={request.id} xs={12}>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Typography variant="body1">Request ID: {request.id}</Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="body1">Job Name: {request.jobName}</Typography>
                    </Grid>
                    {/* ... */}
                  </Grid>
                </Grid>
              ))}
            </Grid>
          ) : null}
        </Grid>
      </Grid>

    <TableContainer component={Paper}>
        <Table aria-label="requests table">
          <TableHead>
            <TableRow>
              <TableCell>Request ID</TableCell>
              <TableCell>Job Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Request Type</TableCell>
              <TableCell>Created On</TableCell>
              <TableCell>Assignee Name</TableCell>
              <TableCell>Requestor Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requests.map((request: { id: any; jobName: any; status: any; requestType: any; createdAt: any; assigneeName: any; requestorName: any; }) => (
              <TableRow key={request.id}>
                <TableCell>{request.id}</TableCell>
                <TableCell>{request.jobName}</TableCell>
                <TableCell>{request.status}</TableCell>
                <TableCell>{request.requestType}</TableCell>
                <TableCell>{request.createdAt}</TableCell>
                <TableCell>{request.assigneeName}</TableCell>
                <TableCell>{request.requestorName}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer></>
  );
  
};

export default AllApprovalRequestPage;