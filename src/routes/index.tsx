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
    // pathKey: string;
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
        // pathKey: "routes.dashboard",
        title: "dashboard",
        element: DashboardScreen,
        icon: (
            <IconButton size={"medium"}>
                <DashboardOutlined />
            </IconButton>
        ),
    },
    {
        to: "/order-tracking",
        // pathKey: "routes.orderTracking",
        title: "orderTracking",
        element: OrderTrackingScreen,
        icon: (
            <IconButton size={"medium"}>
                <AddAlertOutlinedIcon />
            </IconButton>
        ),
    },
    {
        to: "/sales-history",
        // pathKey: "routes.salesHistory",
        title: "salesHistory",
        element: SalesHistoryScreen,
        icon: (
            <IconButton size={"medium"}>
                <ManageAccountsOutlinedIcon />
            </IconButton>
        ),
    },
    {
        to: "/sales-history/:id/view",
        // pathKey: "routes.viewSale",
        title: "viewSalesHistory",
        element: ViewSalesHistoryScreen,
        hidden: true,
    },
    {
        to: "/menu-item",
        // pathKey: "routes.menuItem",
        title: "menuItem",
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
        // pathKey: "routes.users",
        title: "users",
        element: UsersScreen,
        icon: (
            <IconButton size={"medium"}>
                <GroupOutlinedIcon />
            </IconButton>
        ),
    },
    {
        to: "/users/new",
        // pathKey: "routes.createUser",
        title: "createUser",
        element: CreateUserScreen,
        hidden: true,
    },

    // Store management
    {
        to: "/stores",
        // pathKey: "routes.stores",
        title: "stores",
        element: StoreScreen,
        icon: (
            <IconButton size={"medium"}>
                <StorefrontOutlinedIcon />
            </IconButton>
        ),
    },
    {
        to: "/stores/new",
        // pathKey: "routes.createStore",
        title: "createStore",
        element: StoreFormScreen,
        hidden: true,
    },
    {
        to: "/stores/:id/view",
        // pathKey: "routes.viewStore",
        title: "viewStore",
        element: ViewStoreScreen,
        hidden: true,
    },
    {
        to: "/stores/:id/edit",
        // pathKey: "routes.editStore",
        title: "editStore",
        element: EditStoreScreen,
        hidden: true,
    },

    // Auth pages
    {
        to: "/login",
        // pathKey: "routes.login",
        title: "login",
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
        // pathKey: "routes.notFound",
        title: "notFound",
        element: NotFoundScreen,
        hidden: true,
        useLayout: false,
    },
];
