import { type JSX } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import GuardedRoute from "@/routes/guarded-route";
import { ErrorBoundary } from "react-error-boundary";
import AuthProvider from "@/context/auth-context";
import ErrorFallback from "@/pages/errors/fallback";
import Layout from "@/components/navigations/layouts";
import { ScrollToTop, resolveChildren } from "@/utils";
import { appRoutes, type AppRouteType } from "@/routes";

import { ThemeProvider } from "./theme";

// function to handle nested children route rendering
const handleNestedRoutes = (
  childRoute: AppRouteType,
  index: number,
): JSX.Element => {
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
  return (
    <Route key={index} path={childRoute.to} element={<childRoute.element />} />
  );
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

function App() {
  return (
    <ThemeProvider>
      <Router>
        <ScrollToTop />
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <AuthProvider>
            <Routes>
              <Route path={"/"} element={<Navigate to={"/order-tracking"} />} />
              {appRoutes.map((route, index) => renterRoute(route, index))}
            </Routes>
          </AuthProvider>
        </ErrorBoundary>
      </Router>
    </ThemeProvider>
  );
}

export default App;
