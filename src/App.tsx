import AuthGuard from "@/components/auth/auth-guard.tsx";
import Layout from "@/components/layout";
import useNotifier from "@/hooks/useNotifier";
import ErrorFallback from "@/pages/feedbacks/fallback";
import {appRoutes, type AppRouteType} from "@/routes";
import GuardedRoute from "@/routes/guarded-route";
import {useAppSelector} from "@/store";
import {useLogoutMutation} from "@/store/slice";
import {selectCurrentUser, selectTokenExp} from "@/store/slice/auth-slice";

import {ThemeProvider} from "@/theme";
import {ScrollToTop} from "@/utils";
import {type JSX, useEffect, useRef} from "react";
import {ErrorBoundary} from "react-error-boundary";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {BrowserRouter as Router, Route, Routes, useNavigate} from "react-router-dom";

import {FullscreenProvider} from "./context/fullscreen-context";
import {selectActiveStore} from "./store/slice/store-slice";
import "@/config/i18next-config";

// Recursive function to render routes and their nested children
const renderRoutes = (routes: AppRouteType[], parentPath = ""): JSX.Element[] => {
    return routes.flatMap((route, index) => {
        // Combine the parent path and current route path, ensuring no double slashes
        const fullPath = (parentPath ? `${parentPath}/${route.to}` : route.to).replace(/\/+/g, "/");

        // Set defaults for layout and auth guard
        const useLayout = route.useLayout ?? true;
        const authGuard = route.authGuard ?? true;

        // Prepare the element with layout and guards if needed
        let element: JSX.Element = <route.element/>;

        // Wrap with Layout if useLayout is true
        if (useLayout) {
            element = <Layout>{element}</Layout>;
        }

        // Wrap with GuardedRoute if authGuard is true
        if (authGuard) {
            element = <GuardedRoute authGuard={authGuard}>{element}</GuardedRoute>;
        }

        const currentRoute = <Route key={`${fullPath}-${index}`} path={fullPath} element={element}/>;

        // If the route has children, recursively render them
        if (route.children && route.children.length > 0) {
            return [currentRoute, ...renderRoutes(route.children, fullPath)];
        }

        return [currentRoute];
    });
};

// Component with router-dependent logic
const AppContent = () => {
    const {i18n} = useTranslation();
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
            <ScrollToTop/>
            <ErrorBoundary FallbackComponent={ErrorFallback}>
                <AuthGuard currentUser={currentUser}/>
                <Routes>{renderRoutes(appRoutes)}</Routes>
                {/*<Routes>{appRoutes.map((route, index) => renterRoute(route, index))}</Routes>*/}
            </ErrorBoundary>
        </>
    );
};

function App() {
    return (
        <ThemeProvider>
            <FullscreenProvider>
                <Router>
                    <AppContent/>
                </Router>
            </FullscreenProvider>
        </ThemeProvider>
    );
}

export default App;
