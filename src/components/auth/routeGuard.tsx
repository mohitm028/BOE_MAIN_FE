import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuthContext } from '../auth/AuthContext';
type Props = { children: ReactNode };

const RouteGuard = ({ children }: Props) => {
    const { isAuthenticated, loading } = useAuthContext();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div>Loading...</div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default RouteGuard;
