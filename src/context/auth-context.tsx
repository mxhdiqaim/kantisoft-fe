import type { AuthValuesType, ErrCallbackType } from "@/types";
import type { UserLogin, UserType } from "@/types/user-types";
import axiosInstance from "@/utils/axios-instance";
import { jwtDecode } from "jwt-decode";
import {
    createContext,
    type ReactNode,
    useEffect,
    useRef,
    useState,
} from "react";
import { useNavigate } from "react-router-dom";

const defaultProvider: AuthValuesType = {
    user: null,
    loading: true,
    setUser: () => null,
    setLoading: () => Boolean,
    isInitialized: false,
    login: () => Promise.resolve(),
    logout: () => Promise.resolve(),
    setIsInitialized: () => Boolean,
    register: () => Promise.resolve(),
};

export const AuthContext = createContext(defaultProvider);

type Props = {
    children: ReactNode;
};

const AuthProvider = ({ children }: Props) => {
    // ** States
    const [user, setUser] = useState<UserType | null>(defaultProvider.user);
    const [loading, setLoading] = useState<boolean>(defaultProvider.loading);
    const [isInitialized, setIsInitialized] = useState<boolean>(
        defaultProvider.isInitialized,
    );

    // ** Refs
    const logoutTimer = useRef<NodeJS.Timeout | null>(null);

    // ** Hooks
    const navigate = useNavigate();
    //   const [searchParams] = useSearchParams();

    useEffect(() => {
        const initAuth = async (): Promise<void> => {
            setLoading(true); // Start by setting loading to true

            const token = localStorage.getItem("token");
            const userData = localStorage.getItem("userData")
                ? JSON.parse(localStorage.getItem("userData") as string)
                : null;

            if (token && userData) {
                // setUser(userData); // Only set a user if userData is valid
                try {
                    const decodedToken: { exp: number } = jwtDecode(token);
                    const expirationTime = decodedToken.exp * 1000; // Convert to milliseconds

                    if (expirationTime <= Date.now()) {
                        // Token is expired, clear data
                        localStorage.removeItem("token");
                        localStorage.removeItem("userData");
                        setUser(null);
                    } else {
                        // Token is valid, set user and schedule auto-logout
                        setUser(userData);
                        const remainingTime = expirationTime - Date.now();
                        logoutTimer.current = setTimeout(
                            handleLogout,
                            remainingTime,
                        );
                    }
                } catch (error) {
                    // If token is invalid
                    console.error("Invalid token:", error);
                    localStorage.removeItem("token");
                    localStorage.removeItem("userData");
                    setUser(null);
                }
            } else {
                setUser(null); // Clear user if token or userData is missing
            }

            setIsInitialized(true); // Ensure the initialisation state is updated
            setLoading(false); // Finally, stop loading
        };

        initAuth().then((r) => console.log(r));
    }, []); // Remove isInitialized from dependencies

    const handleLogin = async (
        params: UserLogin,
        errorCallback?: ErrCallbackType,
    ) => {
        setLoading(true);

        try {
            const { data } = await axiosInstance.post(`/users/login`, params, {
                withCredentials: true,
            });

            const { token } = data;

            const decodedUser = jwtDecode(token);

            localStorage.setItem("token", token);
            localStorage.setItem("userData", JSON.stringify(decodedUser));

            setUser({ ...data.user });

            navigate("/order-tracking", { replace: true });
            // eslint-disable-next-line
        } catch (err: any) {
            if (errorCallback) errorCallback(err.response?.data?.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async (errorCallback?: ErrCallbackType) => {
        try {
            await axiosInstance.post(`/users/logout`);

            localStorage.removeItem("token");
            localStorage.removeItem("userData");
            setUser(null);
            setIsInitialized(false);

            navigate("/login", { replace: true });
            // eslint-disable-next-line
        } catch (err: any) {
            // It's good practice to also clear user data and redirect on failure
            localStorage.removeItem("token");
            localStorage.removeItem("userData");
            setUser(null);
            navigate("/login", { replace: true });
            console.log("testing logout 2");
            if (errorCallback) errorCallback(err.response?.data?.message);
        } finally {
            setLoading(false);
            window.location.reload();
        }
    };

    //   const handleRegister = (
    //     params: RegisterParams,
    //     errorCallback?: ErrCallbackType
    //   ) => {
    //     axios
    //       .post(authConfig.registerEndpoint, params)
    //       .then((res) => {
    //         if (res.data.error) {
    //           if (errorCallback) errorCallback(res.data.error);
    //         } else {
    //           handleLogin({ email: params.email, password: params.password });
    //         }
    //       })
    //       .catch((err: { [key: string]: string }) =>
    //         errorCallback ? errorCallback(err) : null
    //       );
    //   };

    const values = {
        user,
        loading,
        setUser,
        setLoading,
        isInitialized,
        setIsInitialized,
        login: handleLogin,
        logout: handleLogout,
        // register: handleRegister,
    };

    return (
        <AuthContext.Provider value={values}>
            {isInitialized && children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
