import {type ComponentType, type ReactNode} from "react";
import {
    ActivityLogScreen,
    AddUserScreen,
    ChangePasswordScreen,
    DashboardScreen,
    EditUserScreen,
    ForgetPasswordScreen,
    HomeScreen,
    InventoryManagementScreen,
    InventoryTransactionsScreen,
    LoginScreen,
    MenuItemScreen,
    NotFoundScreen,
    PointOfSaleScreen,
    ProfileScreen,
    RegisterScreen,
    SalesHistoryScreen,
    SingleInventoryTransactionScreen,
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
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';

import {IconButton} from "@mui/material";

export interface AppRouteType {
    to: string;
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
        roles: [UserRoleEnum.MANAGER, UserRoleEnum.ADMIN, UserRoleEnum.USER, UserRoleEnum.GUEST],
    },

    // ---------------------------------
    // Dashboard
    // ---------------------------------
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

    // ---------------------------------
    // POS Management
    // ---------------------------------
    {
        to: "/point-of-sale",
        title: "orderTracking",
        element: PointOfSaleScreen,
        icon: (
            <IconButton size={"medium"}>
                <AddAlertOutlinedIcon/>
            </IconButton>
        ),
        roles: [UserRoleEnum.MANAGER, UserRoleEnum.ADMIN, UserRoleEnum.USER, UserRoleEnum.GUEST],
    },

    // ---------------------------------
    // Sales Management
    // ---------------------------------
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
        children: [
            {
                to: ":id/view",
                title: "viewSalesHistory",
                element: ViewSalesHistoryScreen,
                hidden: true,
                roles: [UserRoleEnum.MANAGER, UserRoleEnum.ADMIN, UserRoleEnum.USER, UserRoleEnum.GUEST],
            },
        ]
    },

    // ---------------------------------
    // Menu Item Management
    // ---------------------------------
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

    // ---------------------------------
    // Inventory Management
    // ---------------------------------
    {
        to: "/inventory",
        title: "Inventory",
        element: InventoryManagementScreen,
        icon: (
            <IconButton size={"medium"}>
                <InventoryOutlinedIcon/>
            </IconButton>
        ),
        roles: [UserRoleEnum.MANAGER, UserRoleEnum.ADMIN, UserRoleEnum.USER, UserRoleEnum.GUEST],
        children: [
            {
                to: "management",
                title: "Inventory Management",
                element: InventoryManagementScreen,
                roles: [UserRoleEnum.MANAGER, UserRoleEnum.ADMIN, UserRoleEnum.USER],
            },
            {
                to: ":id/transactions",
                title: "menuItemTransactions",
                element: SingleInventoryTransactionScreen,
                hidden: true,
                roles: [UserRoleEnum.MANAGER, UserRoleEnum.ADMIN, UserRoleEnum.USER],
            },
            {
                to: "transactions",
                title: "Inventory Transactions",
                element: InventoryTransactionsScreen,
                roles: [UserRoleEnum.MANAGER, UserRoleEnum.ADMIN, UserRoleEnum.USER],
            }
        ]
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
        children: [
            {
                to: ":id/view",
                title: "viewUser",
                element: ViewUserScreen,
                hidden: true,
                roles: [UserRoleEnum.MANAGER, UserRoleEnum.ADMIN],
            },
            {
                to: "new",
                title: "createUser",
                element: AddUserScreen,
                hidden: true,
                roles: [UserRoleEnum.MANAGER, UserRoleEnum.ADMIN],
            },
            {
                to: ":id/edit",
                title: "editUser",
                element: EditUserScreen,
                hidden: true,
                roles: [UserRoleEnum.MANAGER, UserRoleEnum.ADMIN, UserRoleEnum.USER],
            },
            {
                to: "profile",
                title: "Profile",
                element: ProfileScreen,
                hidden: true,
                authGuard: true,
                useLayout: true,
                roles: [UserRoleEnum.MANAGER, UserRoleEnum.ADMIN, UserRoleEnum.USER, UserRoleEnum.GUEST],
            },
            {
                to: "change-password",
                title: "Change Password",
                element: ChangePasswordScreen,
                hidden: true,
                authGuard: true,
                useLayout: true,
                roles: [UserRoleEnum.MANAGER, UserRoleEnum.ADMIN, UserRoleEnum.USER],
            },
        ]
    },

    // ---------------------------------
    // Store management
    // ---------------------------------
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
        children: [
            {
                to: "new",
                title: "createStore",
                element: StoreFormScreen,
                hidden: true,
                roles: [UserRoleEnum.MANAGER],
            },
            {
                to: ":id/view",
                title: "viewStore",
                element: ViewStoreScreen,
                hidden: true,
                roles: [UserRoleEnum.MANAGER],
            },
            {
                to: ":id/edit",
                title: "editStore",
                element: StoreFormScreen,
                hidden: true,
                roles: [UserRoleEnum.MANAGER],
            },
        ]
    },

    // ---------------------------------
    // Activity Log
    // ---------------------------------
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

    // ---------------------------------
    // Public Routes
    // ---------------------------------
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

    // ---------------------------------
    // Error Pages
    // ---------------------------------
    {
        to: "*",
        title: "notFound",
        element: NotFoundScreen,
        hidden: true,
        useLayout: false,
        roles: [UserRoleEnum.GUEST],
    },
];
