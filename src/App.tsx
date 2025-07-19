/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import GuardedRoute from "@/routes/guarded-route";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "@/pages/errors/fallback";
import Layout from "@/components/navigations/layouts";
import { ScrollToTop } from "@/utils";
import { /* appRoutes */ baseAppRoutes, type AppRouteType, type BaseAppRouteType } from "@/routes";

import { ThemeProvider } from "@/theme";

import "@/config/i18next-config";
import { useTranslation } from "react-i18next";
import Login from "./pages/auth/login";
import NotFound from "./pages/errors/not-found";

// function to handle nested children route rendering
// const handleNestedRoutes = (childRoute: BaseAppRouteType, index: number): JSX.Element => {
//     // Set default authGuard to true if not explicitly set to false
//     // This means all routes require authentication by default
//     const authGuard = childRoute.authGuard ?? true;

//     // Handle routes that have child routes (nested navigation)
//     if (childRoute.children) {
//         return (
//             <>
//                 {/* Render the parent route first */}
//                 <Route
//                     key={`parent-${index}`}
//                     path={childRoute.to}
//                     element={
//                         <GuardedRoute authGuard={authGuard}>
//                             <Layout>
//                                 <childRoute.element />
//                             </Layout>
//                         </GuardedRoute>
//                     }
//                 />
//                 {/* Map through and render all child routes as siblings
//             This allows for complete page navigation rather than nested views */}
//                 {childRoute.children.map((route, childIndex) => (
//                     <Route
//                         key={`child-${index}-${childIndex}`}
//                         // Combine parent and child paths for a full route path
//                         path={`${childRoute.to}/${route.to}`}
//                         element={
//                             <GuardedRoute authGuard={authGuard}>
//                                 <Layout>
//                                     <route.element />
//                                 </Layout>
//                             </GuardedRoute>
//                         }
//                     />
//                 ))}
//             </>
//         );
//     }

//     // Handle routes that don't need layout or authentication
//     // Typically used for authentication pages (login/register) or error pages
//     return <Route key={index} path={childRoute.to} element={<childRoute.element />} />;
// };

let appRoutes: BaseAppRouteType[];

const renterRoute = (route: AppRouteType, index: number) => {
    const useLayout = route.useLayout ?? true;
    // const authGuard = route.authGuard ?? true;

    // Pass the dynamically generated routes to the Layout component
    const element = useLayout ? (
        <Layout appRoutes={appRoutes as any}>{route.element as any}</Layout>
    ) : (
        <route.element />
    );

    return <Route key={index} path={route.to} element={element} />;
};

function App() {
    const { t } = useTranslation();

    // Dynamically generate the routes with translated paths
    appRoutes = useMemo(() => {
        const resolveRoutes = (routes: BaseAppRouteType[], parentPath = "") => {
            return routes.map((route) => {
                const currentPath = t(`routes.${route.key}`);
                const newRoute = {
                    ...route,
                    to: parentPath + currentPath.replace(parentPath, ""), // Build the full path
                };
                if (route.children) {
                    newRoute.children = resolveRoutes(route.children, newRoute.to);
                }
                return newRoute;
            });
        };
        return resolveRoutes(baseAppRoutes);
    }, [t]);

    return (
        <ThemeProvider>
            <Router>
                <ScrollToTop />
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                    <Routes>
                        <Route path={"/"} element={<Navigate to={"/order-tracking"} />} />
                        {appRoutes.map((route, index) => renterRoute(route as any, index))}
                        <Route path={"/login"} element={<Login />} />
                        <Route path={"*"} element={<NotFound />} />
                    </Routes>
                </ErrorBoundary>
            </Router>
        </ThemeProvider>
    );
}

export default App;
