export interface IPredecessor {
    predecessorJobName: string;
    leadTime: string;
    schId: string;
    conditional: 'Y' | 'N';
    negative: 'Y' | 'N';
    jobName: string;
    type: 'JOB';
}

export interface ITrigger {
    triggeredJobName: string;
    schId: string;
    trigId: number;
    jobName: string;
    type: 'JOB';
}

export interface IVRM {
    resourceName: string;
    resourceType: string; // e.g., 'X'
    retentionOption: string; // e.g., 'F'
    schId: string;
    jobName: string;
}

export interface IDatasetTrigger {
    schId: string;
    datasetName: string;
    trigId: number;
    jobName: string;
}

export interface IJobDefinition {
    jobName: string;
    region: string; // e.g., 'AMRS'
    jclLibrary: string; // e.g., 'LIB1'
    lparName: string; // e.g., '1X'
    isJobOnRequest: 'Y' | 'N';
    calloutPriority: string; // e.g., '1'
    isExecutable: 'Y' | 'N';
    jclId: string; // e.g., '200'
    jobStatus: string; // e.g., 'submitted'
}

export interface IRequestInfo {
    requestorNbk: string; // e.g., 'NBK123'
    requestorName: string; // e.g., 'JOHN Doe'
    requestStatus: string; // e.g., 'OPEN'
    requestNumber: string; // e.g., 'REQ001'
    distributionEmails: string; // e.g., 'john.doe@example.com'
    crqNumber: string; // e.g., 'CRQ123'
    installDate: string; // YYYY-MM-DD
    installTime: string; // YYYY-MM-DD HH:mm:ss
    assignee: string; // e.g., 'Jane Smith'
    requestType: string; // e.g., 'NEW'
    jobName: string;
}

export interface ISchedule {
    frequency: string; // e.g., 'DAILY'
    holidayType: string; // e.g., 'NONE'
    holidayAction: string; // e.g., 'SKIP'
    submitTime: string; // YYYY-MM-DD HH:mm:ss
    weeksOfMonth: string; // e.g., '1,2,3,4'
    repeatStartTime: string; // YYYY-MM-DD HH:mm:ss
    repeatStopTime: string; // YYYY-MM-DD HH:mm:ss
    repeatType: string; // e.g., 'HOURLY'
    repeatInterval: string; // e.g., '1'
    runDays: string; // e.g., 'MON,TUE,WED,THU,FRI'
    runMonths: string; // e.g., 'JAN,FEB,MAR'
    runOccurrences: string; // e.g., '1,2'
    jobName: string;
    schId: string;
}

export interface IJobRequest {
    datasetTriggers: IDatasetTrigger[];
    jobDefinition: IJobDefinition;
    requestInfo: IRequestInfo;
    predecessors: IPredecessor[];
    triggers: ITrigger[];
    schedules: ISchedule[];
    vrms: IVRM[];
}
