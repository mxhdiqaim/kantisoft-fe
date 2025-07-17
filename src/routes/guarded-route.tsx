import ServerDown from "@/components/status-comp/server-down";

import Spinner from "@/components/status-comp/spinner";
import { useAuthStatus } from "@/hooks/use-auth-status";
import { memo, type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

type GuardProps = {
    authGuard: boolean;
    children: ReactNode;
};

// This is your GuardedRoute component that checks authentication status
const GuardedRoute = memo(function GuardedRoute({
    children,
    authGuard,
}: GuardProps) {
    const { isLoading, isAuthenticated, isServerOk } = useAuthStatus();
    const location = useLocation();

    // Show loading spinner if still checking status
    if (isLoading) return <Spinner />;

    // Show server down page if the server isn't responding
    if (!isServerOk) return <ServerDown />;

    // If route requires auth and user is NOT authenticated, redirect to login
    if (authGuard && !isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If route requires auth and user is authenticated, show the page
    if (authGuard && isAuthenticated) {
        return <>{children}</>;
    }

    // If no authentication is required, just render the children
    return <>{children}</>;
});

export default GuardedRoute;
