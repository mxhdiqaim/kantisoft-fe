import { createContext, useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import type { UserLogin, UserType } from "@/types/user-types";
import { v4 as uuidv4 } from "uuid";
// import axios from "axios";

import type { ErrCallbackType, AuthValuesType } from "@/types";

// const BaseURL: string = import.meta.env.VITE_APP_API_URL;

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
        setUser(userData); // Only set a user if userData is valid
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
      // const { data } = await axios.post(
      //   `${BaseURL}/login`,
      //   params,
      //   // { withCredentials: true }
      // );

      // Mock validation
      if (
        params.email !== "test@example.com" ||
        params.password !== "password123"
      ) {
        if (errorCallback) {
          errorCallback("Invalid email or password");
        }
        setLoading(false);
        return;
      }

      // Mock successful login response
      const mockResponse = {
        token: "mock-jwt-token",
        user: {
          id: uuidv4(),
          username: "test",
          email: params.email,
          name: "Test User",
          isActive: true,
          role: "manager" as "manager" | "admin" | "user" | "guest", // this is a test
          createdAt: `${new Date()}`,
          updatedAt: `${new Date()}`,
        },
        status: 200,
      };

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // localStorage.setItem("token", data.token);
      // localStorage.setItem("userData", JSON.stringify(data.user));

      // Store mock data
      localStorage.setItem("token", mockResponse.token);
      localStorage.setItem("userData", JSON.stringify(mockResponse.user));

      // setUser({ ...data.user });

      setUser({ ...(mockResponse.user as UserType) });

      navigate("/order-tracking", { replace: true });
      // eslint-disable-next-line
    } catch (err: any) {
      if (errorCallback) errorCallback(err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    setUser(null);
    setLoading(false);
    setIsInitialized(false);

    navigate("/login");

    window.location.reload();
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
