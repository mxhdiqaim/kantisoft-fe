import type { AppRouteType } from "@/routes";
import type { Period } from "@/types/order-types.ts";
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
