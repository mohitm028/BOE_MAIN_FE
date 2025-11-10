import {
    IDatasetTrigger,
    IJobRequest,
    IPredecessor,
    IRequestInfo,
    ISchedule,
    ITrigger,
    IVRM,
} from './JobCreationTypes';

const handleSubmitBatch = async (): Promise<void> => {
    if (
        carId &&
        cartItems.length &&
        cartItems.find((item) => item.id === carId)
    ) {
        removeItem(carId);
    }

    const {
        jobDefinition,
        requestInfo = {},
        predecessors = [],
        vrms = [],
    } = wizardData;

    const {
        datasetTriggers = [],
        schedules = [],
        jobTriggers = [],
    } = wizardData.frequencies;

    const fieldsToMove = [
        'requestorNbk',
        'requestorName',
        'requestStatus',
        'requestNumber',
        'distributionEmails',
        'crqNumber',
        'installDate',
        'installTime',
        'assignee',
        'requestType',
        'jobName',
    ] as const;

    const finalRequestInfo: IRequestInfo = {
        ...(requestInfo as RequestInfo),
    } as IRequestInfo;
    const finalJobDefinition: JobDefinitionData = { ...jobDefinition };

    for (const field of fieldsToMove) {
        if (finalJobDefinition.hasOwnProperty(field)) {
            finalRequestInfo[field] = finalJobDefinition[field] as any;
            delete finalJobDefinition[field];
        }
    }

    const finalPayload: IJobRequest = {
        jobDefinition: jobDefinition,

        requestInfo: requestInfo as IRequestInfo,
        predecessors: predecessors as IPredecessor[],
        vrms: vrms as IVRM[],

        triggers: [...jobTriggers] as ITrigger[],
        schedules: [...schedules] as ISchedule[],
        datasetTriggers: [...datasetTriggers] as IDatasetTrigger[],
    };

    // hit api

    console.log('Final Payload Constructed:', finalPayload);
};
