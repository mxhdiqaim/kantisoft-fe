import {OrderStatus} from "@/types/order-types.ts";
import {InventoryStatusEnum} from "@/types/inventory-types.ts";
import type {UserRoleType, UserStatus} from "@/types/user-types.ts";

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
