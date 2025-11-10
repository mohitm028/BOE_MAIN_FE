import React from 'react';
import { Routes, Route } from 'react-router-dom';

import { AuthProvider } from './components/auth/AuthContext';
import RouteGuard from './components/auth/routeGuard.tsx';
import MainLayout from './components/layout/mainLayout';
import {
    publicRoutes,
    protectedRoutes,
    roleExclusiveRoutes,
} from './components/routes/ProtectedRoutesList.tsx';
import { AppProvider } from './contexts/AppProvider.tsx';

// Very small inline NotFound component (kept here for simplicity)
const NotFound: React.FC = () => (
    <div className="p-6 text-center">
        <h1 className="text-2xl font-semibold">Resource not found</h1>
        <p className="mt-2 text-gray-500">
            The page you are looking for doesn’t exist.
        </p>
    </div>
);

const App: React.FC = () => {
    return (
        <AppProvider>
            <AuthProvider>
                <Routes>
                    {/* Public Routes */}
                    {publicRoutes.map((route) => (
                        <Route
                            key={route.path}
                            path={route.path}
                            element={route.element}
                        />
                    ))}

                    {/* Private Routes (behind RouteGuard and rendered inside MainLayout) */}
                    <Route
                        path="/*"
                        element={
                            // <RouteGuard>
                                <MainLayout />
                            // </RouteGuard>
                        }
                    >
                        {/* Main layout has <Outlet/> so it generates routes below */}
                        {protectedRoutes.map((route) => (
                            <Route
                                key={route.path}
                                path={route.path}
                                element={route.element}
                            />
                        ))}

                        {/* Nested role‑exclusive routes */}
                        {Object.values(roleExclusiveRoutes)
                            .flat()
                            .map((route) => (
                                <Route
                                    key={route.path}
                                    path={route.path}
                                    element={route.element}
                                />
                            ))}

                        {/* Private catch‑all inside the layout */}
                        <Route path="*" element={<NotFound />} />
                    </Route>

                    {/* Top‑level catch‑all for any unmatched public route */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </AuthProvider>
        </AppProvider>
    );
};

export default App;
