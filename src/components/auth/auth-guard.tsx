import {appRoutes} from "@/routes";
import type {UserType} from "@/types/user-types";
import {useEffect} from "react";
import {useLocation, useNavigate} from "react-router-dom";

interface Props {
    currentUser: UserType;
}

const AuthGuard = ({currentUser}: Props) => {
    const navigate = useNavigate();
    const location = useLocation();

    const publicAuthRoutes = ["/login", "/register", "/forget-password"];

    // The path the user was trying to access before being redirected to log in
    const from = location.state?.from?.pathname || "/";


    useEffect(() => {
        // If a user is logged in AND they are on a public auth page, redirect them.
        if (currentUser && publicAuthRoutes.includes(location.pathname)) {
            // Fallback to the dashboard.
            const destinationRoute = appRoutes.find(
                (route) =>
                    route.authGuard && // Check for PROTECTED routes
                    route.roles?.includes(currentUser.role) &&
                    route.title === "dashboard",
            );

            // If a previous location exists in history, go back to it.
            if (window.history.length > 2) {
                // eslint-disable-next-line
                // @ts-ignore
                navigate(-1, {replace: true});
            } else if (destinationRoute) {
                // If there's no history, redirect to their default route (dashboard).
                navigate(destinationRoute.to, {replace: true});
            } else {
                // Final fallback if something goes wrong, redirect to the homepage.
                navigate(from, {replace: true});
            }
        }

        // If a user is NOT logged in and tries to access a protected route, redirect to log in.
        const currentRoute = appRoutes.find(route => route.to === location.pathname);
        if (currentRoute?.authGuard && !currentUser) {
            navigate("/login", {
                replace: true,
                state: {from: location}
            });
        }

    }, [currentUser, location.pathname, navigate]);

    return null;
};

export default AuthGuard;