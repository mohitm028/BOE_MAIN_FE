// Define the structure for the Request Data object
export interface Frequency {
    // Assuming Frequency structure; adjust if you have specifics
    frequencyType?: string;
    interval?: number;
    startTime?: string;
    endTime?: string;
}

export interface VirtualResource {
    id: number;
    resourceName: string;
    resourceType: string;
    schid: string;
    retentionOption: string;
    releaseJob?: string | null;
    status: string;
    sequenceNumber: number;
    attachedToSequenceNumber?: number | null;
}

export interface Dependency {
    id: number;
    type: string;
    dependencyName: string;
    status: string;
    sequenceNumber: number;
    linkedSequenceNumber?: number | null;
    attachedToSequenceNumber?: number | null;
    leadTime?: number | null;
    schid: string;
    triggeredJobschid?: string | null;
    createdDateTime?: string | null;
    updatedDateTime?: string | null;
}

// Interface for the nested 'requestInfo' object
export interface RequestInfo {
    id: number | string;
    requestorName: string;
    requestStatus:
        | 'PENDING' //when user creates the request
        | 'SUBMITTED' // when user sends the request to manager
        // | 'PENDING_ASSIGNEE' // when user sends the request to manager
        | 'PENDING_TECHNICAL_REVIEW' // when manager approves and sends to ca7 for review
        // | 'ASSIGNED' // when ca7 assigns the job to themself or other ca7
        | 'INSTALL_SCHEDULED' // when ca7 approves and click approve for installation
        | 'IMPLEMENTED' // when the job is implemented
        // | 'PENDING_SIGNOFF' // when ca7 approves and click approve for installation

        // below are less priority
        | 'DECLINED'
        | 'CANCELLED'
        | 'CLOSED';
    requestNumber: string;
    installDate: string | null;
    installTime: string | null;
    requestType: 'ADD' | 'UPDATE'; // Based on values found in the dummy data

    // Fields present in the original JSON image but null or not fully detailed
    requestorNbr: string | null;
    distributionEmails: string | null;
    crqNumber: string | null;
    assignee: string | null;
    jobName: string | null; // Note: jobName is also at the root level
    jobDefinition: string | null;
}

// Interface for the root object
export interface JobRequestData {
    id: number | string;
    JobName: string;
    Region: string;
    jclLibrary: string;
    lparName: string;
    isJobOnRequest: 'Yes' | 'No'; // Based on dummy data string values

    // Fields present in the original JSON image but null or not fully detailed
    activateJobOn: string | null;
    calloutPriority: string | null;
    dsbDate: string | null;
    dsaDate: string | null;
    isExecutable: string | null;
    jclId: string | null;

    // The nested structure
    requestInfo: RequestInfo;
}

// Define the role type for clarity
export type UserRole = 'USER' | 'MANAGER' | 'CA7ADMIN';
