import { useContext } from "react";
import { AuthContext } from "../context/auth-context.tsx";

export const useAuth = () => useContext(AuthContext);
