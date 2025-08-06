import AppSkeleton from "@/components/spinners/app-skeleton-loading";
import {appRoutes} from "@/routes";
import {useAppSelector} from "@/store";
import {selectCurrentUser} from "@/store/slice/auth-slice";
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";

const HomeScreen = () => {
    const navigate = useNavigate();
    const currentUser = useAppSelector(selectCurrentUser);

    useEffect(() => {
        if (currentUser) {
            // Find the first accessible, non-hidden, primary route for the user's role.
            // The appRoutes supposed to be ordered by precedence (most important routes first), but for now they are not
            const destinationRoute = appRoutes.find(
                (route) =>
                    !route.hidden &&
                    route.icon && // A good indicator of a primary navigation item
                    route.roles?.includes(currentUser.role),
            );

            if (destinationRoute) {
                // If a suitable page is found, redirect the user there.
                navigate(destinationRoute.to, {replace: true});
            } else {
                // As a fallback, if no specific page is found for the user's role,
                // send them to the login page.
                navigate("/login", {replace: true});
            }
        } else {
            // If there's no authenticated user, they must log in.
            navigate("/login", {replace: true});
        }
    }, [currentUser, navigate]);

    // Render a loading spinner to provide feedback while the redirection logic runs.
    return <AppSkeleton/>;
};

export default HomeScreen;
