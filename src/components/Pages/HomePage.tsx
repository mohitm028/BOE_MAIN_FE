import { UserContext } from '@/contexts/UserContext';
import { useContext } from 'react';
import RequestDetailsPanel from '../request/RequestDetailsPanel';
import SingleRequestPage from './SingleRequestPage';
import Practice from './practice/practice';

const HomePage = () => {
    const userContext = useContext(UserContext);

    const user = userContext?.user;

    return <Practice></Practice>;
};

export default HomePage;
