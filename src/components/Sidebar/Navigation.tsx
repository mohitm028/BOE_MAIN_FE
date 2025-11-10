'use client';

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Home,
    Edit,
    Settings,
    PenTool,
    Newspaper,
    ClipboardListIcon,
} from 'lucide-react';
import NavItem from './NavItem';
import NavSection from './NavSection';

import { useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';

const Navigation: React.FC = () => {
    const userState = useContext(UserContext); // Access user role from context
    const [isSchedulingExpanded, setIsSchedulingExpanded] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const [isCA7Expanded, setIsCA7Expanded] = useState(false);

    const [showDraftModal, setShowDraftModal] = useState(false);
    const [isApprovalsExpanded, setIsApprovalsExpanded] = useState(false);
    const [pendingNav, setPendingNav] = useState<{
        label: string;
        path?: string;
        directToStep?: number;
    } | null>(null);
    const [isOperationalRequestsExpanded, setIsOperationalRequestsExpanded] =
        useState(false);
    const operationalrequestsSubItems = [
        {
            label: 'Operational Request 1',
            path: '/operational/request1',
            active: location.pathname === '/operational/request1',
        },
        {
            label: 'Operational Request 2',
            path: '/operational/request2',
            active: location.pathname === '/operational/request2',
        },
    ];

    const mainNavItems = [
        { icon: Home, label: 'Home', path: '/home' },
        // { icon: Newspaper, label: 'Document', path: '/new-test' },
        {
            icon: ClipboardListIcon,
            label: 'All Job List',
            path: '/all-job-list',
        },
    ];

    const schedulingSubItems = [
        {
            label: 'Job Form',
            path: '/add-job',
            active: location.pathname === '/add-job',
        },
        {
            label: 'My Request',
            path: '/schedule-job-v1',
            active:
                location.pathname === '/schedule-job-v1' ||
                location.pathname === '/',
        },
        {
            label: 'Dataset Trigger',
            path: '/dataset-trigger',
            active: location.pathname === '/dataset-trigger',
        },
        {
            label: 'Calender Scheduling Form',
            path: '/calender-schedule',
            active: location.pathname === '/calender-schedule',
        },
    ];

    const ca7SubItems = [
        {
            label: 'Pending Requests',
            path: 'pending-request',
            active: location.pathname === '/pending-request',
        },
        {
            label: 'Implementation Requests',
            path: '/implementation',
            active: location.pathname === '/implementation',
        },
        {
            label: 'Requests Assigned to Me',
            path: '/assigned-to-me',
            active: location.pathname === '/assigned-to-me',
        },
        {
            label: 'All Requests',
            path: '/all-requests',
            active: location.pathname === '/all-requests',
        },
    ].filter((item) => {
        if (userState?.user?.role === 'USER') {
            return item.label === 'Pending Requests';
        } else if (userState?.user?.role === 'MANAGER') {
            return item.label === 'All Requests';
        } else if (userState?.user?.role === 'CA7ADMIN') {
            return true; //Show all items
        }
        return false; // Default to not show any items
    });

    const approvalsSubItems = [
        {
            label: 'Pending Approvals',
            path: '/approval/pending-approval',
            active: location.pathname === '/approval/pending-approval',
        },
        {
            label: 'Approved By Me',
            path: '/approval/approved-by-me',
            active: location.pathname === '/approval/approved-by-me',
        },
        {
            label: 'All Requests',
            path: '/approval/requests',
            active: location.pathname === '/approval/requests',
        },
    ];

    const operationSubItems = [
        { label: 'AddRQ', path: '/', active: location.pathname === '/' },
    ];

    const handleNavClick = (
        label: string,
        path?: string,
        directToStep?: number
    ) => {
        const isLeavingForm = location.pathname === '/schedule-job-v1'; // adjust to your wizard route
        console.log(
            `Navigating to ${label} at ${path}, isLeavingForm: ${isLeavingForm}`
        );
        if (isLeavingForm) {
            console.log(
                'Navigating away from form, prompting to save draft...'
            );
            setPendingNav({ label, path, directToStep });
            setShowDraftModal(true); // open popup instead of navigating directly
            return;
        }

        if (path) {
            if (directToStep) {
                navigate(path, { state: { startStep: directToStep } });
            } else {
                navigate(path);
            }
        }
    };

    return (
        <nav className="flex-1 py-2">
            {mainNavItems.map((item, index) => (
                <NavItem
                    key={index}
                    icon={item.icon}
                    label={item.label}
                    onClick={() => handleNavClick(item.label, item.path)}
                    active={location.pathname === item.path}
                />
            ))}

            <NavSection
                icon={Edit}
                label="Scheduling"
                subItems={schedulingSubItems}
                expanded={isSchedulingExpanded}
                onClick={() => setIsSchedulingExpanded(!isSchedulingExpanded)}
                onSubItemClick={(label, path, item) =>
                    handleNavClick(label, path, item?.directToStep)
                }
            />

            <NavSection
                icon={Settings}
                label="CA7 Administration"
                subItems={ca7SubItems}
                expanded={isCA7Expanded}
                onClick={() => setIsCA7Expanded(!isCA7Expanded)}
                onSubItemClick={(label, path, item) =>
                    handleNavClick(label, path, item?.directToStep)
                }
            />

            <NavSection
                icon={Edit}
                label="Approvals"
                subItems={approvalsSubItems}
                expanded={isApprovalsExpanded}
                onClick={() => setIsApprovalsExpanded(!isApprovalsExpanded)}
                onSubItemClick={(label, path, item) =>
                    handleNavClick(label, path, item?.directToStep)
                }
            />

            <NavSection
                icon={Settings}
                label="Operational Requests"
                subItems={operationalrequestsSubItems}
                expanded={isOperationalRequestsExpanded}
                onClick={() =>
                    setIsOperationalRequestsExpanded(
                        !isOperationalRequestsExpanded
                    )
                }
                onSubItemClick={(label, path, item) =>
                    handleNavClick(label, path, item?.directToStep)
                }
            />
        </nav>
    );
};

export default Navigation;
