import AuthGuard from "@/components/auth/auth-guard.tsx";
import Layout from "@/components/navigations/layouts";
import useNotifier from "@/hooks/useNotifier";
import ErrorFallback from "@/pages/feedbacks/fallback";
import { appRoutes, type AppRouteType } from "@/routes";
import GuardedRoute from "@/routes/guarded-route";
import { useAppSelector } from "@/store";
import { useLogoutMutation } from "@/store/slice";
import { selectCurrentUser, selectTokenExp } from "@/store/slice/auth-slice";

import { ThemeProvider } from "@/theme";
import { resolveChildren, ScrollToTop } from "@/utils";
import { type JSX, useEffect, useRef } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";

import { FullscreenProvider } from "./context/fullscreen-context";
import { selectActiveStore } from "./store/slice/store-slice";
import "@/config/i18next-config";

// function to handle nested children route rendering
const handleNestedRoutes = (childRoute: AppRouteType, index: number): JSX.Element => {
    // Set default authGuard to true if not explicitly set to false
    // This means all routes require authentication by default
    const authGuard = childRoute.authGuard ?? true;

    // Handle routes that have child routes (nested navigation)
    if (childRoute.children) {
        return (
            <>
                {/* Render the parent route first */}
                <Route
                    key={`parent-${index}`}
                    path={childRoute.to}
                    element={
                        <GuardedRoute authGuard={authGuard}>
                            <Layout>
                                <childRoute.element />
                            </Layout>
                        </GuardedRoute>
                    }
                />
                {/* Map through and render all child routes as siblings
            This allows for complete page navigation rather than nested views */}
                {childRoute.children.map((route, childIndex) => (
                    <Route
                        key={`child-${index}-${childIndex}`}
                        // Combine parent and child paths for a full route path
                        path={`${childRoute.to}/${route.to}`}
                        element={
                            <GuardedRoute authGuard={authGuard}>
                                <Layout>
                                    <route.element />
                                </Layout>
                            </GuardedRoute>
                        }
                    />
                ))}
            </>
        );
    }

    // Handle routes that don't need layout or authentication
    // Typically used for authentication pages (login/register) or error pages
    return <Route key={index} path={childRoute.to} element={<childRoute.element />} />;
};

const renterRoute = (route: AppRouteType, index: number) => {
    const isNestedRoute = resolveChildren(route);
    if (isNestedRoute) return handleNestedRoutes(route, index);

    const authGuard = route.authGuard ?? true;
    const withLayout = route.useLayout ?? true;

    if (withLayout && authGuard) {
        return (
            <Route
                key={index}
                path={route.to}
                element={
                    <GuardedRoute authGuard={authGuard}>
                        <Layout>
                            <route.element />
                        </Layout>
                    </GuardedRoute>
                }
            />
        );
    }

    return <Route key={index} path={route.to} element={<route.element />} />;
};

// Component with router-dependent logic
const AppContent = () => {
    const { i18n } = useTranslation();
    const navigate = useNavigate();
    const notify = useNotifier();

    const activeStore = useSelector(selectActiveStore);
    const currentUser = useAppSelector(selectCurrentUser);

    const [logout] = useLogoutMutation();
    const tokenExp = useSelector(selectTokenExp);

    const isLoggingOutRef = useRef(false);

    // Effect to handle session timeout
    useEffect(() => {
        if (!tokenExp || !currentUser) {
            return;
        }

        const handleSessionTimeout = async () => {
            if (isLoggingOutRef.current) {
                return;
            }
            isLoggingOutRef.current = true;

            try {
                await logout({}).unwrap();
            } catch (error) {
                console.error("Server logout failed on session timeout:", error);
                notify("Your session has expired. Please log in again.", "warning");
            }
        };

        const timeRemaining = tokenExp - Date.now();

        if (timeRemaining <= 0) {
            handleSessionTimeout();
            return;
        }

        const timerId = setTimeout(handleSessionTimeout, timeRemaining);

        return () => clearTimeout(timerId);
    }, [tokenExp, currentUser, logout, navigate, notify]);

    // Effect of language change
    useEffect(() => {
        if (activeStore?.storeType) {
            const currentLanguage = i18n.language;
            const targetLanguage = activeStore.storeType;

            if (currentLanguage !== targetLanguage) {
                i18n.changeLanguage(targetLanguage);
            }
        }
    }, [activeStore, i18n]);

    return (
        <>
            <ScrollToTop />
            <ErrorBoundary FallbackComponent={ErrorFallback}>
                <AuthGuard currentUser={currentUser} />
                <Routes>{appRoutes.map((route, index) => renterRoute(route, index))}</Routes>
            </ErrorBoundary>
        </>
    );
};

function App() {
    return (
        <ThemeProvider>
            <FullscreenProvider>
                <Router>
                    <AppContent />
                </Router>
            </FullscreenProvider>
        </ThemeProvider>
    );
}

export default App;
