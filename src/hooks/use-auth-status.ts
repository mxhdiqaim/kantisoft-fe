import { useHealthCheckQuery } from "@/store/app/slice";
import { selectCurrentToken } from "@/store/app/slice/auth-slice";
import { useSelector } from "react-redux";

export const useAuthStatus = () => {
    const token = useSelector(selectCurrentToken);

    // The 'skip' option prevents the query from running if there's no token.
    const { isLoading, isSuccess, isError } = useHealthCheckQuery(undefined, {
        skip: !token,
    });

    // If there is a token, we use the health check query to validate it.
    // isLoading: The query is in flight.
    // isAuthenticated: The query succeeded, meaning the token is valid.
    // isServerOk: The query did not result in a network error.
    return { isLoading, isAuthenticated: isSuccess, isServerOk: !isError };
};
