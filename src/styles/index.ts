import type {SxProps} from "@mui/material";
import {TransactionTypeEnum} from "@/types/inventory-types.ts";

export const iconStyle: SxProps = {
    width: {xs: 15, md: 18},
    height: {xs: 15, md: 18},
};

export const getStatusChipColor = (status: string) => {
    switch (status) {
        case "inStock":
            return "success";
        case "lowStock":
            return "warning";
        case "outOfStock":
            return "error";
        case "discontinued":
            return "default";
        default:
            return "default";
    }
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