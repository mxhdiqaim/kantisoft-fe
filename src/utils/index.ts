import type { AppRouteType } from "@/routes";
import type { Period } from "@/types/order-types.ts";
import type { UserRoleType } from "@/types/user-types";
import type { ChipProps } from "@mui/material";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// fixes scroll behaviour on route change
export const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
};

export const resolveChildren = (item: AppRouteType) => {
    if (item?.children) return true;

    return false;
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
