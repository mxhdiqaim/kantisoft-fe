import {
    ActivityLogScreen,
    AddUserScreen,
    ChangePasswordScreen,
    DashboardScreen,
    EditStoreScreen,
    EditUserScreen,
    ForgetPasswordScreen,
    HomeScreen,
    LoginScreen,
    MenuItemScreen,
    NotFoundScreen,
    OrderTrackingScreen,
    ProfileScreen,
    RegisterScreen,
    SalesHistoryScreen,
    StoreFormScreen,
    StoreScreen,
    UsersScreen,
    ViewSalesHistoryScreen,
    ViewStoreScreen,
    ViewUserScreen,
} from "@/pages";
import {type UserRole, UserRoleEnum} from "@/types/user-types";
import {DashboardOutlined} from "@mui/icons-material";
import AddAlertOutlinedIcon from "@mui/icons-material/AddAlertOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import PlaylistAddCheckCircleOutlinedIcon from "@mui/icons-material/PlaylistAddCheckCircleOutlined";
import RestaurantMenuOutlinedIcon from "@mui/icons-material/RestaurantMenuOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";

import {IconButton} from "@mui/material";
import {type ComponentType, type ReactNode} from "react";

export interface AppRouteType {
    to: string;
    // pathKey: string;
    element: ComponentType;
    title?: string;
    icon?: ReactNode;
    useLayout?: boolean;
    authGuard?: boolean;
    hidden?: boolean; // True = Hide from the sidebar, but it accessed through navigation
    children?: AppRouteType[];
    roles?: UserRole[]; // Add role property
}

// Application routes with layout
export const appRoutes: AppRouteType[] = [
    {
        to: "/",
        title: "home",
        element: HomeScreen,
        hidden: true,
        roles: [UserRoleEnum.GUEST],
    },
    {
        to: "/user/profile",
        title: "Profile",
        element: ProfileScreen,
        hidden: true,
        authGuard: true,
        useLayout: true,
        roles: [UserRoleEnum.GUEST],
    },
    {
        to: "/user/change-password",
        title: "Change Password",
        element: ChangePasswordScreen,
        hidden: true,
        authGuard: true,
        useLayout: true,
        roles: [UserRoleEnum.GUEST],
    },
    {
        to: "/dashboard",
        title: "dashboard",
        element: DashboardScreen,
        icon: (
            <IconButton size={"medium"}>
                <DashboardOutlined/>
            </IconButton>
        ),
        roles: [UserRoleEnum.MANAGER, UserRoleEnum.ADMIN],
    },
    {
        to: "/order-tracking",
        title: "orderTracking",
        element: OrderTrackingScreen,
        icon: (
            <IconButton size={"medium"}>
                <AddAlertOutlinedIcon/>
            </IconButton>
        ),
        roles: [UserRoleEnum.MANAGER, UserRoleEnum.ADMIN, UserRoleEnum.USER, UserRoleEnum.GUEST],
    },
    {
        to: "/sales-history",
        title: "salesHistory",
        element: SalesHistoryScreen,
        icon: (
            <IconButton size={"medium"}>
                <ManageAccountsOutlinedIcon/>
            </IconButton>
        ),
        roles: [UserRoleEnum.MANAGER, UserRoleEnum.ADMIN, UserRoleEnum.USER, UserRoleEnum.GUEST],
    },
    {
        to: "/sales-history/:id/view",
        title: "viewSalesHistory",
        element: ViewSalesHistoryScreen,
        hidden: true,
        roles: [UserRoleEnum.MANAGER, UserRoleEnum.ADMIN, UserRoleEnum.USER],
    },
    {
        to: "/menu-item",
        title: "menuItem",
        element: MenuItemScreen,
        icon: (
            <IconButton size={"medium"}>
                <RestaurantMenuOutlinedIcon/>
            </IconButton>
        ),
        roles: [UserRoleEnum.MANAGER, UserRoleEnum.ADMIN, UserRoleEnum.USER],
    },

    // Users management
    {
        to: "/users",
        title: "usersManagement",
        element: UsersScreen,
        icon: (
            <IconButton size={"medium"}>
                <GroupOutlinedIcon/>
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
                <StorefrontOutlinedIcon/>
            </IconButton>
        ),
        roles: [UserRoleEnum.MANAGER],
    },
    {
        to: "/stores/new",
        title: "createStore",
        element: StoreFormScreen,
        hidden: true,
        roles: [UserRoleEnum.MANAGER],
    },
    {
        to: "/stores/:id/view",
        title: "viewStore",
        element: ViewStoreScreen,
        hidden: true,
        roles: [UserRoleEnum.MANAGER],
    },
    {
        to: "/stores/:id/edit",
        title: "editStore",
        element: EditStoreScreen,
        hidden: true,
        roles: [UserRoleEnum.MANAGER],
    },

    {
        to: "/activity-log",
        title: "Activity Log",
        element: ActivityLogScreen,
        icon: (
            <IconButton size={"medium"}>
                <PlaylistAddCheckCircleOutlinedIcon/>
            </IconButton>
        ),
        roles: [UserRoleEnum.MANAGER, UserRoleEnum.ADMIN],
    },

    // Public Routes
    {
        to: "/login",
        element: LoginScreen,
        useLayout: false,
        authGuard: false,
        roles: [UserRoleEnum.GUEST],
    },

    {
        to: "/register",
        element: RegisterScreen,
        useLayout: false,
        authGuard: false,
        roles: [UserRoleEnum.GUEST],
    },
    {
        to: "/forget-password",
        element: ForgetPasswordScreen,
        useLayout: false,
        authGuard: false,
        roles: [UserRoleEnum.GUEST]
    },

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
