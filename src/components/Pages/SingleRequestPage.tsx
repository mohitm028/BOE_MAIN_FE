import { useParams } from 'react-router-dom';
import RequestMainComponent from '../request/RequestMainComponent';
import React from 'react';

const SingleRequestPage: React.FC = () => {
    // const { id } = useParams();
    // // return <RequestListComponent role={role} />;
    // return <RequestMainComponent requestId={id as string} />;

    const { id, requestId } = useParams<{ id: string; requestId: string }>();

    return <RequestMainComponent id={id!} requestId={requestId!} />;
};
export default SingleRequestPage;
