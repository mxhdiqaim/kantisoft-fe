import {
    CreateUserScreen,
    DashboardScreen,
    EditStoreScreen,
    LoginScreen,
    MenuItemScreen,
    NotFoundScreen,
    OrderTrackingScreen,
    SalesHistoryScreen,
    StoreFormScreen,
    StoreScreen,
    UsersScreen,
    ViewSalesHistoryScreen,
    ViewStoreScreen,
} from "@/pages";
import { DashboardOutlined } from "@mui/icons-material";
import AddAlertOutlinedIcon from "@mui/icons-material/AddAlertOutlined";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import RestaurantMenuOutlinedIcon from "@mui/icons-material/RestaurantMenuOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";

import { IconButton } from "@mui/material";
import { type ComponentType, type ReactNode } from "react";

export interface AppRouteType {
    to: string;
    element: ComponentType;
    title?: string;
    icon?: ReactNode;
    useLayout?: boolean;
    authGuard?: boolean;
    hidden?: boolean;
    children?: AppRouteType[];
}

// Application routes with layout
export const appRoutes: AppRouteType[] = [
    {
        to: "/dashboard",
        title: "Dashboard",
        element: DashboardScreen,
        icon: (
            <IconButton size={"medium"}>
                <DashboardOutlined />
            </IconButton>
        ),
    },
    {
        to: "/order-tracking",
        title: "nav.orderTracking",
        element: OrderTrackingScreen,
        icon: (
            <IconButton size={"medium"}>
                <AddAlertOutlinedIcon />
            </IconButton>
        ),
    },
    {
        to: "/sales-history",
        title: "nav.salesHistory",
        element: SalesHistoryScreen,
        icon: (
            <IconButton size={"medium"}>
                <ManageAccountsOutlinedIcon />
            </IconButton>
        ),
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
        icon: (
            <IconButton size={"medium"}>
                <RestaurantMenuOutlinedIcon />
            </IconButton>
        ),
    },
    // Users management
    {
        to: "/users",
        title: "Users",
        element: UsersScreen,
        icon: (
            <IconButton size={"medium"}>
                <GroupOutlinedIcon />
            </IconButton>
        ),
    },
    {
        to: "/users/new",
        title: "Create User",
        element: CreateUserScreen,
        hidden: true,
    },

    // Store management
    {
        to: "/stores",
        title: "Stores",
        element: StoreScreen,
        icon: (
            <IconButton size={"medium"}>
                <StorefrontOutlinedIcon />
            </IconButton>
        ),
    },
    {
        to: "/stores/new",
        title: "Create Store",
        element: StoreFormScreen,
        hidden: true,
    },
    {
        to: "/stores/:id/view",
        title: "View Store",
        element: ViewStoreScreen,
        hidden: true,
    },
    {
        to: "/stores/:id/edit",
        title: "Edit Store",
        element: EditStoreScreen,
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
