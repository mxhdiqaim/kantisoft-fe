import type {RootState} from "@/store";
import type {UserType} from "@/types/user-types";
import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import {jwtDecode} from "jwt-decode";

type AuthState = {
    user: UserType | null;
    token: string | null;
    tokenExp: number | null;
};

// Function to safely parse user data from localStorage
const getUserDataFromStorage = (): UserType | null => {
    const storedUser = localStorage.getItem("userData");
    if (storedUser) {
        try {
            return JSON.parse(storedUser) as UserType;
        } catch (error) {
            console.error("Failed to parse user data from localStorage", error);
            localStorage.removeItem("userData");
            return null;
        }
    }
    return null;
};

// Function to safely get token expiration time from localStorage
const getTokenExpFromStorage = (): number | null => {
    const storedTokenExp = localStorage.getItem("tokenExp");
    if (storedTokenExp) {
        const exp = parseInt(storedTokenExp, 10);

        return isNaN(exp) ? null : exp;
    }
    return null;
};


// Initial state now includes the token's expiration time
const initialState: AuthState = {
    user: getUserDataFromStorage(),
    token: localStorage.getItem("token"),
    tokenExp: getTokenExpFromStorage(),
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<{ user: UserType; token: string }>) => {
            const {user, token} = action.payload;
            state.user = user;
            state.token = token;
            localStorage.setItem("token", token);
            localStorage.setItem("userData", JSON.stringify(user));

            try {
                // Decode the token to get the expiration time
                const decoded: { exp: number } = jwtDecode(token);
                // The 'exp' claim is in seconds, convert it to milliseconds
                const exp = decoded.exp * 1000;
                state.tokenExp = exp;
                localStorage.setItem("tokenExp", exp.toString());
            } catch (error) {
                console.error("Failed to decode token:", error);
                state.tokenExp = null;
                localStorage.removeItem("tokenExp");
            }
        },
        logOut: (state) => {
            state.user = null;
            state.token = null;
            state.tokenExp = null; // Clear expiration time on logout
            localStorage.removeItem("token");
            localStorage.removeItem("userData");
            localStorage.removeItem("activeStoreState");
            localStorage.removeItem("tokenExp"); // Also clear from storage
        },
    },
});

export const {setCredentials, logOut} = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectCurrentToken = (state: RootState) => state.auth.token;
// Selector for the token expiration time
export const selectTokenExp = (state: RootState) => state.auth.tokenExp;