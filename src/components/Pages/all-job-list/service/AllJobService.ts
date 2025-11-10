import axios from 'axios';

const BASE_API = 'http://localhost:8080/api/job-request';
const JOB_AGGREGATE_API = 'http://localhost:8080/api/job-aggregate';

type ID = string | number;

export const JobAggregateService = {
    GET_API: {
        getAllJobDefinitionsWithRequestInfo: () => {
            const response = axios.get(
                `${JOB_AGGREGATE_API}/list-with-request-info`
            );
            return response.then((res) => res.data);
        },
        getSingleJobDefinitionWithRequestInfo: (id: ID) => {
            const response = axios.get(`${JOB_AGGREGATE_API}/get-by-id/${id}`);
            return response.then((res) => res.data);
        },
    },
};

export const AllJobFlowService = {
    COMMON_API: {
        getAllJobRequest: () => {
            const response = axios.get(`${BASE_API}/all-list`);
            return response.then((res) => res.data);
        },
        getSingleJobRequestById: (jobDefinitionId: ID) => {
            return axios
                .get(`${BASE_API}/get-detail-by-id/${jobDefinitionId}`)
                .then((res) => res.data);
        },
    },
    USER_API: {
        sendJobToManager: (jobDefinitionId: ID) => {
            return axios
                .post(`${BASE_API}/send-to-manager/${jobDefinitionId}`)
                .then((res) => res.data);
        },
    },
    MANAGER_API: {
        approveAsManager: (jobDefinitionId: ID) => {
            return axios
                .post(`${BASE_API}/approve-as-manager/${jobDefinitionId}`)
                .then((res) => res.data);
        },
        denyAsManager: (jobDefinitionId: ID) => {
            return axios
                .post(`${BASE_API}/deny-as-manager/${jobDefinitionId}`)
                .then((res) => res.data);
        },
        addCommentAsManager: (jobDefinitionId: ID, comment: string) => {
            return axios
                .post(
                    `${BASE_API}/comment-as-manager/${jobDefinitionId}`,
                    comment
                )
                .then((res) => {
                    res.data;
                });
        },
    },
    CA7ADMIN_API: {
        sendBackToRequestor: (jobDefinitionId: ID) => {
            return axios
                .post(`${BASE_API}/send-back-to-requestor/${jobDefinitionId}`)
                .then((res) => res.data);
        },

        approveForInstallation: (
            jobDefinitionId: ID,
            assigneeId: ID | undefined
        ) => {
            if (assigneeId === undefined) {
                console.error('Assignee id is undefined');
            }

            return axios
                .post(`${BASE_API}/approve-for-install/${jobDefinitionId}`)
                .then((res) => res.data);
        },

        installJob: (jobDefinitionId: ID) => {
            return axios
                .post(`${BASE_API}/insatll-job/${jobDefinitionId}`)
                .then((res) => res.data);
        },
    },
};
