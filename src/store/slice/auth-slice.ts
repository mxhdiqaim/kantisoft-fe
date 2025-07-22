import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../index";
import type { UserType } from "@/types/user-types";

type AuthState = {
    user: UserType | null; // Example user object
    token: string | null;
};

// Function to safely parse user data from localStorage
const getUserDataFromStorage = (): UserType | null => {
    const storedUser = localStorage.getItem("userData");
    if (storedUser) {
        try {
            return JSON.parse(storedUser) as UserType;
        } catch (error) {
            console.error("Failed to parse user data from localStorage", error);
            // Clear corrupted data
            localStorage.removeItem("userData");
            return null;
        }
    }
    return null;
};

// Attempt to load token from localStorage for persistence across reloads
const initialState: AuthState = {
    user: getUserDataFromStorage(), // Load user data on initial load
    token: localStorage.getItem("token"),
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        // Action to set the token and user data after login
        setCredentials: (state, action: PayloadAction<{ user: UserType; token: string }>) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            // Persist the token to localStorage
            localStorage.setItem("token", action.payload.token);
            localStorage.setItem("userData", JSON.stringify(action.payload.user));
        },
        // Action to clear the token and user data on logout
        logOut: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem("token");
            localStorage.removeItem("userData");
            localStorage.removeItem("activeStoreState");
        },
    },
});

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;

// Selectors to easily access auth state
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectCurrentToken = (state: RootState) => state.auth.token;
