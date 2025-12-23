import {OrderStatus} from "@/types/order-types.ts";
import {InventoryStatusEnum, TransactionTypeEnum} from "@/types/inventory-types.ts";
import type {UserRoleType, UserStatus} from "@/types/user-types.ts";
import type {MenuItemInventoryType} from "@/types/menu-item-type.ts";
import {styled, TextField} from "@mui/material";
import CustomCard from "@/components/customs/custom-card.tsx";

export const getPaymentStatusChipColor = (status: string) => {
    switch (status) {
        case OrderStatus.COMPLETED:
            return "success";
        case OrderStatus.PENDING:
            return "warning";
        case OrderStatus.CANCELED:
            return "error";
        default:
            return "default";
    }
};

export const getInventoryStatusChipColor = (status: string) => {
    switch (status) {
        case InventoryStatusEnum.ADJUSTMENT:
        case InventoryStatusEnum.IN_STOCK:
            return "success";
        case InventoryStatusEnum.LOW_STOCK:
            return "warning";
        case InventoryStatusEnum.OUT_OF_STOCK:
            return "error";
        case InventoryStatusEnum.DISCONTINUED:
            return "default";
        default:
            return "default";
    }
};

export const getUserStatusChipColor = (status: UserStatus) => {
    const colors: Record<UserStatus, "success" | "warning" | "error"> = {
        active: "success",
        inactive: "warning",
        banned: "error",
        deleted: "error",
    };
    return colors[status] || "default";
};

export const getUserRoleChipColor = (role: UserRoleType) => {
    const colors: Record<UserRoleType, "secondary" | "primary" | "info" | "default"> = {
        manager: "secondary",
        admin: "primary",
        user: "info",
        guest: "default",
    };
    return colors[role] || "default";
};

export const getTransactionTypeChipColor = (type: typeof TransactionTypeEnum[keyof typeof TransactionTypeEnum]) => {
    const colors: Record<typeof TransactionTypeEnum[keyof typeof TransactionTypeEnum], "success" | "warning" | "error" | "info" | "default"> = {
        comingIn: "success",
        goingOut: "error",
        sale: "success",
        return: "warning",
        waste: "error",
        adjustmentIn: "info",
        adjustmentOut: "info",
        purchaseReceive: "default",
    };
    return colors[type] || "default";
};

export const getTransactionChipColor = (status: string) => {
    switch (status) {
        case TransactionTypeEnum.ADJUSTMENT_IN:
            return "success";
        case TransactionTypeEnum.ADJUSTMENT_OUT:
            return "error";
        case TransactionTypeEnum.PURCHASE_RECEIVE:
        default:
            return "default";
    }
};

export const getMenuItemsInventoryStatusChip = (status: MenuItemInventoryType) => {
    const colors: Record<MenuItemInventoryType, "success" | "warning" | "error" | "default"> = {
        inStock: "success",
        lowStock: "warning",
        outOfStock: "error",
    };
    return colors[status] || "default";
}

export const StyledTextField = styled(TextField, {
    shouldForwardProp: (prop) => prop !== "disabled",
})<{ disabled?: boolean }>(({disabled}) => ({
    "& .MuiOutlinedInput-root": {
        height: 40,
        "& fieldset": {height: 45},
        background: disabled && "#CFD1D3",
    },
}));

export const getRawMaterialStatusChipColor = (status: string) => {
    switch (status) {
        case "active":
            return "success";
        case "inactive":
            return "warning";
        case "archived":
            return "default";
        default:
            return "default";
    }
};

export const DashedCard = styled(CustomCard)(({theme}) => ({
    borderStyle: "dashed",
    boxShadow: "none",
    borderRadius: theme.borderRadius.large,
}));
