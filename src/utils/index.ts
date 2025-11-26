import type {Period} from "@/types/order-types.ts";
import type {UserRoleType, UserType} from "@/types/user-types";
import type {ChipProps} from "@mui/material";
import {useEffect} from "react";
import {useLocation} from "react-router-dom";

// fixes scroll behaviour on route change
export const ScrollToTop = () => {
    const {pathname} = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
};

export const ngnFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "NGN",
});

export const getTitle = (period: Period) => {
    switch (period) {
        case "today":
            return "Today";
        case "week":
            return "This Week";
        case "month":
            return "This Month";
        case "all-time":
            return "All Time";
        default:
            return "Sales History";
    }
};

/**
 * Returns a specific MUI color for a user role to be used in Chips.
 * @param {UserRoleType} role - The role of the user.
 * @returns {ChipProps['color']} A MUI color prop for the Chip component.
 */
export const getRoleChipColor = (role: UserRoleType): ChipProps["color"] => {
    const colors: Record<UserRoleType, ChipProps["color"]> = {
        manager: "secondary",
        admin: "primary",
        user: "info",
        guest: "default",
    };

    return colors[role] || "default";
};

export const getActionColor = (action: string) => {
    const lowerAction = action.toLowerCase();

    if (lowerAction.includes("create") || lowerAction.includes("login") || lowerAction.includes("viewed"))
        return "success";
    if (lowerAction.includes("update") || lowerAction.includes("password_changed")) return "warning";
    if (lowerAction.includes("delete") || lowerAction.includes("cancelled")) return "error";
    if (lowerAction.includes("failed") || lowerAction.includes("error")) return "error";
    return "default";
};


// Function to safely parse user data from localStorage
export const getUserDataFromStorage = (): UserType | null => {
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
export const getTokenExpFromStorage = (): number | null => {
    const storedTokenExp = localStorage.getItem("tokenExp");
    if (storedTokenExp) {
        const exp = parseInt(storedTokenExp, 10);

        return isNaN(exp) ? null : exp;
    }
    return null;
};
