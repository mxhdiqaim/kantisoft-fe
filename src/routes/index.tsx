import { type ComponentType, type ReactNode } from "react";
import {
    LoginScreen,
    MenuItemScreen,
    NotFoundScreen,
    OrderTrackingScreen,
    SalesHistoryScreen,
    ViewSalesHistoryScreen,
} from "@/pages";

// MUI Icons
import { IconButton } from "@mui/material";
import AddAlertOutlinedIcon from "@mui/icons-material/AddAlertOutlined";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import RestaurantMenuOutlinedIcon from "@mui/icons-material/RestaurantMenuOutlined";

export interface AppRouteType {
    to: string;
    element: ComponentType;
    title?: string;
    icon?: {
        default?: ReactNode;
        active?: ReactNode;
    };
    useLayout?: boolean;
    authGuard?: boolean;
    hidden?: boolean;
    children?: AppRouteType[];
}

const ICON_ACTIVE_COLOR = "#fff";

// Application routes with layout
export const appRoutes: AppRouteType[] = [
    {
        to: "/order-tracking",
        title: "nav.orderTracking",
        element: OrderTrackingScreen,
        icon: {
            default: (
                <IconButton size={"medium"}>
                    <AddAlertOutlinedIcon />
                </IconButton>
            ),
            active: (
                <IconButton size={"medium"}>
                    <AddAlertOutlinedIcon sx={{ color: ICON_ACTIVE_COLOR }} />
                </IconButton>
            ),
        },
    },
    {
        to: "/sales-history",
        title: "nav.salesHistory",
        element: SalesHistoryScreen,
        icon: {
            default: (
                <IconButton size={"medium"}>
                    <ManageAccountsOutlinedIcon />
                </IconButton>
            ),
            active: (
                <IconButton size={"medium"}>
                    <ManageAccountsOutlinedIcon
                        sx={{ color: ICON_ACTIVE_COLOR }}
                    />
                </IconButton>
            ),
        },
    },
    {
        to: "/sales-history/:id/view",
        title: "nav.salesHistory",
        element: ViewSalesHistoryScreen,
        hidden: true,
    },
    {
        to: "/menu-item",
        title: "nav.menuItem",
        element: MenuItemScreen,
        icon: {
            default: (
                <IconButton size={"medium"}>
                    <RestaurantMenuOutlinedIcon />
                </IconButton>
            ),
            active: (
                <IconButton size={"medium"}>
                    <RestaurantMenuOutlinedIcon
                        sx={{ color: ICON_ACTIVE_COLOR }}
                    />
                </IconButton>
            ),
        },
    },

    // Auth pages
    {
        to: "/login",
        title: "Login",
        element: LoginScreen,
        useLayout: false,
        authGuard: false,
    },

    // {
    //   to: "/register",
    //   title: "Register Screen",
    //   element: RegisterScreen,
    //   useLayout: false,
    //   authGuard: false,
    // },
    // {
    //   to: "/reset-password",
    //   title: "Reset Password",
    //   element: ResetPasswordScreen,
    //   useLayout: false,
    //   authGuard: false,
    // },

    // Error Pages
    {
        to: "*",
        title: "Not Found",
        element: NotFoundScreen,
        hidden: true,
        useLayout: false,
    },
];
