import { JobSchedulingWizard } from '../Wizard';
import CalendarSchedulingPage from '../Pages/CalendarSchedulingPage';
import UserProfile from '../Pages/UserProfile';
import DatasetTriggerPage from '../Pages/DatasetTriggerPage';
import AddJobWizard from '../Wizard/AddJobWizard';
import AllRequestsPage from '../Pages/AllRequestPage';
import SingleRequestPage from '../Pages/SingleRequestPage';
import ShoppingCardPage from '../Pages/ShoppingCard';
import { LoginSignup } from '../auth/login_signup/login';
import HomePage from '../Pages/HomePage';
import AllJobListPage from '../Pages/all-job-list/AllJobListPage';

// Role placeholders — assign values you need in your app (e.g., "AM", "AU", etc.)
export const ROLE_USER: string = 'USER';
export const ROLE_MANAGER: string = 'MANAGER';
export const ROLE_CA7ADMIN: string = 'CA7ADMIN';

export const publicRoutes = [{ path: '/login', element: <LoginSignup /> }];

export const protectedRoutes = [
    { path: 'home', element: <HomePage /> },
    { path: 'new-test', element: <HomePage /> },

    { path: 'schedule-job-v1', element: <JobSchedulingWizard /> },
    { path: 'dataset-trigger', element: <DatasetTriggerPage /> },
    { path: 'calender-schedule', element: <CalendarSchedulingPage /> },
    { path: 'add-job', element: <AddJobWizard /> },
    { path: 'userprofile', element: <UserProfile /> },

    // Request listing routes (common to multiple roles)
    { path: 'all-requests', element: <AllRequestsPage /> },
    { path: 'all-job-list', element: <AllJobListPage /> },
    { path: 'pending-request', element: <AllRequestsPage /> },
    { path: 'implementation', element: <AllRequestsPage /> },
    { path: 'assigned-to-me', element: <AllRequestsPage /> },
    { path: 'approval/pending-approval', element: <AllRequestsPage /> },
    { path: 'approval/approved-by-me', element: <AllRequestsPage /> },
    { path: 'approval/requests', element: <AllRequestsPage /> },

    { path: 'shopping-card', element: <ShoppingCardPage /> },

    {
        path: 'all-requests/:id',
        element: <SingleRequestPage />,
    },
    {
        path: 'job-request/:id/:requestId',
        element: <SingleRequestPage />,
    },
    {
        path: 'pending-request/:id',
        element: <SingleRequestPage />,
    },
    {
        path: 'implementation/:id',
        element: <SingleRequestPage />,
    },
    {
        path: 'assigned-to-me/:id',
        element: <SingleRequestPage />,
    },
];

// Role‑exclusive routes (grouped by role)
export const roleExclusiveRoutes = {
    AM: [
        // {
        //     path: 'all-request/:id',
        //     element: <SingleRequestPage role={ROLE_MANAGER} />,
        // },
    ],
    AU: [
        {
            path: 'approval/pending-approval/:id',
            element: <SingleRequestPage />,
        },
        {
            path: 'approval/approved-by-me/:id',
            element: <SingleRequestPage />,
        },
        {
            path: 'approval/requests/:id',
            element: <SingleRequestPage />,
        },
    ],
} as const;
