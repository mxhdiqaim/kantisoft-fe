import { createContext, useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import type { UserLogin, UserType } from "@/types/user-types";
import { jwtDecode } from "jwt-decode";
import axiosInstance from "@/utils/axios-instance";

import type { ErrCallbackType, AuthValuesType } from "@/types";

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
      console.log("testing logout");

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
