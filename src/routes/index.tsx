import {type ComponentType, type ReactNode} from "react";
import {
    ActivityLogScreen,
    AddUserScreen,
    BillOfMaterialsScreen,
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
    RawMaterialInventoryScreen,
    RawMaterialInventoryTransactionScreen,
    RawMaterialsScreen,
    RegisterScreen,
    SalesHistoryScreen,
    SingleInventoryTransactionScreen,
    StoreFormScreen,
    StoreScreen,
    UnitOfMeasurementsScreen,
    UsersScreen,
    ViewSalesHistoryScreen,
    ViewStoreScreen,
    ViewUserScreen,
} from "@/pages";
import {type UserRole, UserRoleEnum} from "@/types/user-types";
import {DashboardOutlined} from "@mui/icons-material";
import AddAlertOutlinedIcon from "@mui/icons-material/AddAlertOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import RestaurantMenuOutlinedIcon from "@mui/icons-material/RestaurantMenuOutlined";
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';

export interface AppRouteType {
    to: string;
    element?: ComponentType;
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
    // ---------------------------------
    // Home
    // ---------------------------------
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
        icon: <DashboardOutlined/>,
        roles: [UserRoleEnum.MANAGER, UserRoleEnum.ADMIN],
    },

    // ---------------------------------
    // POS & SALES (Revenue)
    // ---------------------------------
    {
        to: "/pos-sale",
        title: "POS & Sales",
        icon: <AddAlertOutlinedIcon/>,
        roles: [UserRoleEnum.MANAGER, UserRoleEnum.ADMIN, UserRoleEnum.USER, UserRoleEnum.GUEST],
        children: [
            {
                to: "pos",
                title: "orderTracking",
                element: PointOfSaleScreen,
                roles: [UserRoleEnum.ADMIN, UserRoleEnum.MANAGER, UserRoleEnum.USER, UserRoleEnum.GUEST],
            },
        ]
    },

    // ---------------------------------
    // PRODUCT CATALOG (Definitions)
    // ---------------------------------
    {
        to: "/catalog",
        title: "Catalog",
        icon: <RestaurantMenuOutlinedIcon/>,
        roles: [UserRoleEnum.MANAGER, UserRoleEnum.ADMIN, UserRoleEnum.USER, UserRoleEnum.GUEST],
        children: [
            {
                to: "menu-items",
                title: "menuItem",
                element: MenuItemScreen,
                roles: [UserRoleEnum.MANAGER, UserRoleEnum.ADMIN, UserRoleEnum.USER],
                children: [
                    {
                        to: ":id/recipe", // Define BOM here
                        title: "Manage Recipe",
                        element: BillOfMaterialsScreen,
                        hidden: true,
                        roles: [UserRoleEnum.MANAGER, UserRoleEnum.ADMIN],
                    }
                ]
            },
            {
                to: "raw-materials",
                title: "Raw Materials",
                element: RawMaterialsScreen,
                roles: [UserRoleEnum.MANAGER, UserRoleEnum.ADMIN],
            },
            {
                to: "measurements",
                title: "Measurements",
                element: UnitOfMeasurementsScreen,
                roles: [UserRoleEnum.MANAGER, UserRoleEnum.ADMIN, UserRoleEnum.USER],
            },
        ]
    },

    // ---------------------------------
    // INVENTORY & STOCK (Tracking)
    // ---------------------------------
    {
        to: "/stock",
        title: "Stock Management",
        icon: <InventoryOutlinedIcon/>,
        roles: [UserRoleEnum.ADMIN, UserRoleEnum.MANAGER, UserRoleEnum.USER],
        children: [
            {
                to: "finished-goods", // Was "Inventory Management"
                title: "menuItemStock",
                element: InventoryManagementScreen,
                roles: [UserRoleEnum.MANAGER, UserRoleEnum.ADMIN, UserRoleEnum.USER],
                children: [
                    {
                        to: ":id/transactions",
                        title: "menuItemTransactions",
                        element: SingleInventoryTransactionScreen,
                        hidden: true,
                        roles: [UserRoleEnum.MANAGER, UserRoleEnum.ADMIN, UserRoleEnum.USER],
                    },
                ]
            },
            {
                to: "materials", // Your new Bulk Stock controller
                title: "Raw Material Stock",
                element: RawMaterialInventoryScreen,
                roles: [UserRoleEnum.MANAGER, UserRoleEnum.ADMIN, UserRoleEnum.USER],
            },
        ]
    },

    // ---------------------------------
    // REPORTS & RECORDS
    // ---------------------------------
    {
        to: "/records",
        title: "Reports & Records",
        icon: <HistoryEduIcon/>,
        roles: [UserRoleEnum.MANAGER, UserRoleEnum.ADMIN],
        children: [
            {
                to: "sales",
                title: "Sales History",
                element: SalesHistoryScreen,
                roles: [UserRoleEnum.MANAGER, UserRoleEnum.ADMIN],
                children: [
                    {
                        to: ":id/view",
                        element: ViewSalesHistoryScreen,
                        hidden: true,
                        roles: [UserRoleEnum.MANAGER, UserRoleEnum.ADMIN],
                    }
                ]
            },
            {
                to: "inventory-logs",
                title: "Menu Item Logs",
                element: InventoryTransactionsScreen,
                roles: [UserRoleEnum.MANAGER, UserRoleEnum.ADMIN],
            },
            {
                to: "material-logs",
                title: "Raw Material Logs",
                element: RawMaterialInventoryTransactionScreen,
                roles: [UserRoleEnum.MANAGER, UserRoleEnum.ADMIN],
            },
            {
                to: "activity",
                title: "System Activity",
                element: ActivityLogScreen,
                roles: [UserRoleEnum.MANAGER, UserRoleEnum.ADMIN],
            },
        ]
    },

    // ---------------------------------
    // SETTINGS & ADMIN
    // ---------------------------------
    {
        to: "/admin",
        title: "Administration",
        icon: <GroupOutlinedIcon/>,
        roles: [UserRoleEnum.MANAGER, UserRoleEnum.ADMIN],
        children: [
            {
                to: "users",
                title: "User Management",
                element: UsersScreen,
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
                        roles: [UserRoleEnum.MANAGER, UserRoleEnum.ADMIN, UserRoleEnum.USER, UserRoleEnum.GUEST],
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
                        roles: [UserRoleEnum.MANAGER, UserRoleEnum.ADMIN, UserRoleEnum.USER, UserRoleEnum.GUEST],
                    },
                ]
            },
            {
                to: "stores",
                title: "Store Management",
                element: StoreScreen,
                roles: [UserRoleEnum.MANAGER, UserRoleEnum.ADMIN],
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
        ]
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
        to: "/auth/register/5473",
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
        roles: [UserRoleEnum.MANAGER, UserRoleEnum.ADMIN, UserRoleEnum.USER, UserRoleEnum.GUEST],
    },
];
