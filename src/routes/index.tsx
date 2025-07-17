import { type ComponentType, type ReactNode } from "react";
import {
    LoginScreen,
    NotFoundScreen,
    OrderTrackingScreen,
    SalesHistoryScreen,
    ViewSalesHistoryScreen,
} from "@/pages";

// MUI Icons
import { IconButton } from "@mui/material";
import AddAlertOutlinedIcon from "@mui/icons-material/AddAlertOutlined";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";

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
        title: "Order Tracking",
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
        title: "Sales History",
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
        title: "Sales History",
        element: ViewSalesHistoryScreen,
        hidden: true,
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
