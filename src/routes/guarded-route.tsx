import { AuthGuard } from "@/components/auth/auth-guard";
import ServerDown from "@/components/status-comp/server-down";

import Spinner from "@/components/status-comp/spinner";
import { useStatusGuard } from "@/hooks/use-status-guard";
import ErrorFallback from "@/pages/errors/fallback";
import { memo, type ReactNode } from "react";
import { ErrorBoundary } from "react-error-boundary";

type GuardProps = {
  authGuard: boolean;
  children: ReactNode;
};

// This is your GuardedRoute component that checks authentication status
const GuardedRoute = memo(function GuardedRoute({
  children,
  authGuard,
}: GuardProps) {
  const { loading, isServerOk } = useStatusGuard();

  // Show loading spinner if still checking status
  if (loading) return <Spinner />;

  // Show server down page if the server isn't responding
  if (!isServerOk) return <ServerDown />;

  // If this route requires authentication (authGuard is true)
  if (authGuard) {
    return (
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <AuthGuard fallback={<Spinner />}>{children}</AuthGuard>
      </ErrorBoundary>
    );
  }

  // If no authentication is required, just render the children
  return <>{children}</>;
});

export default GuardedRoute;
