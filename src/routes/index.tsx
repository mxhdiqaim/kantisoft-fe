import {
    AddUserScreen,
    DashboardScreen,
    EditStoreScreen,
    HomeScreen,
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
    ViewUserScreen,
    EditUserScreen,
    ProfileScreen,
    RegisterScreen,
} from "@/pages";
import { DashboardOutlined } from "@mui/icons-material";
import AddAlertOutlinedIcon from "@mui/icons-material/AddAlertOutlined";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import RestaurantMenuOutlinedIcon from "@mui/icons-material/RestaurantMenuOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";

import { IconButton } from "@mui/material";
import { type ComponentType, type ReactNode } from "react";
import { UserRoleEnum, type UserRole } from "@/types/user-types";

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
    roles?: UserRole[]; // Add roles property
}

// Application routes with layout
export const appRoutes: AppRouteType[] = [
    {
        to: "/home",
        // pathKey: "routes.home",
        title: "home",
        element: HomeScreen,
        hidden: true, // Hide from sidebar
        roles: [UserRoleEnum.GUEST],
    },
    {
        to: "/profile",
        title: "Profile",
        element: ProfileScreen,
        hidden: true, // Hide from sidebar as it's accessed via app bar
        authGuard: true,
        useLayout: true,
        roles: [UserRoleEnum.GUEST],
    },
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
        roles: [UserRoleEnum.MANAGER, UserRoleEnum.ADMIN],
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
        roles: [UserRoleEnum.MANAGER, UserRoleEnum.ADMIN, UserRoleEnum.USER, UserRoleEnum.GUEST],
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
        roles: [UserRoleEnum.MANAGER, UserRoleEnum.ADMIN, UserRoleEnum.USER, UserRoleEnum.GUEST],
    },
    {
        to: "/sales-history/:id/view",
        // pathKey: "routes.viewSale",
        title: "viewSalesHistory",
        element: ViewSalesHistoryScreen,
        hidden: true,
        roles: [UserRoleEnum.MANAGER, UserRoleEnum.ADMIN, UserRoleEnum.USER],
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
        roles: [UserRoleEnum.MANAGER, UserRoleEnum.ADMIN, UserRoleEnum.USER],
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
        roles: [UserRoleEnum.MANAGER, UserRoleEnum.ADMIN],
    },
    {
        to: "/user/:id/view",
        title: "viewUser",
        element: ViewUserScreen,
        hidden: true,
        roles: [UserRoleEnum.MANAGER, UserRoleEnum.ADMIN],
    },
    {
        to: "/user/new",
        title: "createUser",
        element: AddUserScreen,
        hidden: true,
        roles: [UserRoleEnum.MANAGER, UserRoleEnum.ADMIN],
    },
    {
        to: "/user/:id/edit",
        title: "editUser",
        element: EditUserScreen,
        hidden: true,
        roles: [UserRoleEnum.MANAGER, UserRoleEnum.ADMIN, UserRoleEnum.USER],
    },

    // Store management
    {
        to: "/stores",
        title: "stores",
        element: StoreScreen,
        icon: (
            <IconButton size={"medium"}>
                <StorefrontOutlinedIcon />
            </IconButton>
        ),
        roles: [UserRoleEnum.MANAGER],
    },
    {
        to: "/stores/new",
        // pathKey: "routes.createStore",
        title: "createStore",
        element: StoreFormScreen,
        hidden: true,
        roles: [UserRoleEnum.MANAGER],
    },
    {
        to: "/stores/:id/view",
        // pathKey: "routes.viewStore",
        title: "viewStore",
        element: ViewStoreScreen,
        hidden: true,
        roles: [UserRoleEnum.MANAGER],
    },
    {
        to: "/stores/:id/edit",
        // pathKey: "routes.editStore",
        title: "editStore",
        element: EditStoreScreen,
        hidden: true,
        roles: [UserRoleEnum.MANAGER],
    },

    // Public Routes
    {
        to: "/login",
        // pathKey: "routes.login",
        title: "login",
        element: LoginScreen,
        useLayout: false,
        authGuard: false,
        roles: [UserRoleEnum.GUEST],
    },

    {
        to: "/register",
        title: "Register Screen",
        element: RegisterScreen,
        useLayout: false,
        authGuard: false,
        hidden: true,
        roles: [UserRoleEnum.GUEST],
    },
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
        title: "notFound",
        element: NotFoundScreen,
        hidden: true,
        useLayout: false,
        roles: [UserRoleEnum.GUEST],
    },
];
