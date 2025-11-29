import {extendBaseSchema} from "@/types";
import * as yup from "yup";

export const InventoryStatusEnum = {
    IN_STOCK: "inStock",
    LOW_STOCK: "lowStock",
    OUT_OF_STOCK: "outOfStock"
} as const;

export const TransactionTypeEnum = {
    SALE: "sale",
    RETURN: "return",
    WASTE: "waste",
    ADJUSTMENT_IN: "adjustmentIn",
    ADJUSTMENT_OUT: "adjustmentOut",
    PURCHASE_RECEIVE: "purchaseReceive",
} as const;

export const INVENTORY_STATUS = Object.values(InventoryStatusEnum);

export const TRANSACTION_TYPE = Object.values(TransactionTypeEnum);

// Schema for creating an inventory item
export const createInventorySchema = yup.object({
    menuItemId: yup.string().uuid().required("MenuItem not selected"),
    quantity: yup.number().required("Quantity is required").min(0, "Quantity must be at least 0"),
    minStockLevel: yup.number().required("Minimum stock level is required").min(0, "Minimum stock level must be 0 or greater"),
});

export const adjustStockSchema = yup.object({
    menuItemId: yup.string().uuid().required("MenuItem not selected"),
    quantityAdjustment: yup.number().integer().min(0).required("Quantity adjustment is required"),
    transactionType: yup.string().oneOf(TRANSACTION_TYPE).default("adjustmentIn").required("Transaction type is required"),
    notes: yup.string().optional(),
})

// Schema for a full inventory object, matching the API response
export const inventorySchema = extendBaseSchema({
    menuItemId: yup.string().uuid().required(),
    storeId: yup.string().uuid().required(),
    quantity: yup.number().integer().min(0).required(),
    minStockLevel: yup.number().integer().min(0).optional(),
    status: yup.string().oneOf(INVENTORY_STATUS).default("inStock").required(),
    lastCountDate: yup.date().optional().nullable(),
    menuItem: yup
        .object({
            name: yup.string().required(),
            itemCode: yup.string().required(),
        })
        .optional(),
    store: yup
        .object({
            name: yup.string().required(),
        })
        .optional(),
});

export const inventoryTransactionSchema = extendBaseSchema({
    menuItemId: yup.string().uuid().required("MenuItem not selected"),
    storeId: yup.string().uuid().required("Store not selected"),
    transactionType: yup.string().oneOf(TRANSACTION_TYPE).required("Transaction type is required"),
    quantityChange: yup.number().required("Quantity change is required"),
    resultingQuantity: yup.number().required("Resulting quantity is required"),
    sourceDocumentId: yup.string().optional().nullable(),
    performedBy: yup.string().uuid().required("Performed by is required"),
    notes: yup.string().optional(),
    transactionDate: yup.string().required("Transaction date is required"),
    performedByUser: yup
        .object({
            firstName: yup.string().required(),
            lastName: yup.string().required(),
        })
        .optional(),
    menuItem: yup
        .object({
            name: yup.string().required(),
            itemCode: yup.string().required(),
        })
        .optional(),
});

export const inventoryTransactionsSchema = yup.object({
    // id: yup.string().uuid().required(),
    // storeId: yup.string().uuid().required(),
    // performedBy: yup.string().required(),
    type: yup.string().oneOf(TRANSACTION_TYPE).default("sale").required(),
    totalChange: yup.number().required(),
    label: yup.string().required(),
})

export const inventoryTransactionResponseSchema = yup.object({
    startDate: yup.string().required(),
    endDate: yup.string().required(),
    timePeriod: yup.string().required(),
    storeQueryType: yup.string().required(),
    transactions: yup.array().of(inventoryTransactionsSchema).required(),
})

export type CreateInventoryType = yup.InferType<typeof createInventorySchema>;
export type InventoryType = yup.InferType<typeof inventorySchema>;
export type AdjustStockType = yup.InferType<typeof adjustStockSchema>;
export type AdjustStockResponseType = Omit<InventoryType, "menuItem" | "store">;
export type InventoryTransactionType = yup.InferType<typeof inventoryTransactionSchema>;
export type InventoryTransactionResponseType = yup.InferType<typeof inventoryTransactionResponseSchema>;
// export type EditInventoryType = Partial<InventoryType>;
