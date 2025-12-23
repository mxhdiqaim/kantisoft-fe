import * as yup from "yup";
import {extendBaseSchema, timePeriodSchema} from "@/types";
import {unitOfMeasurementSchema} from "@/types/unit-of-measurement-types.ts";
import type {InventoryTransactionResponseType} from "@/types/inventory-types.ts";

// Create a new schema with only the desired fields from unitOfMeasurementSchema
const partialUnitOfMeasurementSchema = yup.object({
    id: yup.reach(unitOfMeasurementSchema, 'id'),
    name: yup.reach(unitOfMeasurementSchema, 'name'),
    symbol: yup.reach(unitOfMeasurementSchema, 'symbol'),
    conversionFactorToBase: yup.reach(unitOfMeasurementSchema, 'conversionFactorToBase'),
});

// Base schema for a store, matching the backend
export const baseRawMaterialSchema = yup.object({
    name: yup.string().required("Raw Material name is required."),
    description: yup.string().optional(),
    latestUnitPricePresentation: yup.number().required("Latest unit price in presentation is required.").min(0, "Latest unit price must be at least 0."),
    unitOfMeasurement: yup.array(partialUnitOfMeasurementSchema).min(1, "At least one unit of measurement is required.").required("Unit of Measurement is required."),
    latestUnitPriceBase: yup.number().required("Latest unit price in base is required.").min(0, "Latest unit price must be at least 0."),
});

export const rawMaterialSchema = extendBaseSchema(baseRawMaterialSchema);

export type RawMaterialType = yup.InferType<typeof rawMaterialSchema>;

export const createRawMaterialSchema = yup.object({
    name: yup.string().required("Raw Material name is required."),
    description: yup.string().optional(),
    unitOfMeasurementId: yup.string().uuid().required("Unit of Measurement is required."),
    latestUnitPricePresentation: yup.number().required("Unit price is required.").min(0, "Unit price must be at least 0."),
});

export type CreateRawMaterialType = yup.InferType<typeof createRawMaterialSchema>;

const RawMaterialStatusEnum = {
    ACTIVE: "active",
    INACTIVE: "inactive",
    ARCHIVED: "archived",
} as const;

export const RAW_MATERIAL_STATUS = Object.values(RawMaterialStatusEnum);

export const baseSingleRawMaterialSchema = yup.object({
    name: yup.string().required("Raw Material name is required."),
    description: yup.string().optional(),
    unitOfMeasurementId: yup.string().uuid().required("Unit of Measurement is required."),
    latestUnitPrice: yup.number().required("Latest unit price is required.").min(0, "Latest unit price must be at least 0."),
    status: yup.string().oneOf(RAW_MATERIAL_STATUS).required("Status is required."),
})

export const singleRawMaterialSchema = extendBaseSchema(baseSingleRawMaterialSchema);

export type SingleRawMaterialType = yup.InferType<typeof singleRawMaterialSchema>;

export const updateRawMaterialSchema = yup.object({
    name: yup.string().required("Raw Material name is required."),
    description: yup.string().optional(),
    unitOfMeasurementId: yup.string().uuid().required("Unit of Measurement is required."),
    latestUnitPricePresentation: yup.number().required("Latest unit price in presentation is required.").min(0, "Latest unit price must be at least 0."),
});

export type UpdateRawMaterialType = yup.InferType<typeof updateRawMaterialSchema>;

export const updateRawMaterialResponseSchema = extendBaseSchema(yup.object({
    name: yup.string().required("Raw Material name is required."),
    unitOfMeasurementId: yup.string().uuid().required("Unit of Measurement is required."),
    description: yup.string().optional(),
    latestUnitPrice: yup.number().required("Latest unit price is required.").min(0, "Latest unit price must be at least 0."),
    status: yup.string().oneOf(RAW_MATERIAL_STATUS).required("Status is required."),
    latestUnitPricePresentation: yup.number().required("Latest unit price in presentation is required.").min(0, "Latest unit price must be at least 0."),
    unitOfMeasurement: yup.array(unitOfMeasurementSchema).min(1, "At least one unit of measurement is required.").required("Unit of Measurement is required."),
}))

export type UpdateRawMaterialResponseType = yup.InferType<typeof updateRawMaterialResponseSchema>;

export const RawMaterialInventoryStatusEnum = {
    IN_STOCK: "inStock",
    LOW_STOCK: "lowStock",
    OUT_OF_STOCK: "outOfStock",
    ON_ORDER: "onOrder",
} as const;

export const RAW_MATERIAL_INVENTORY_STATUS = Object.values(RawMaterialInventoryStatusEnum);

export const rawMaterialInventorySchema = yup.object({
    rawMaterialId: yup.string().uuid().required("Raw Material ID is required."),
    quantity: yup.number().required("Quantity is required.").min(0, "Quantity must be at least 0."),
    minStockLevel: yup.number().required("Minimum stock level is required.").min(0, "Minimum stock level must be at least 0."),
    // status: yup.string().oneOf(RAW_MATERIAL_INVENTORY_STATUS).required("Inventory status is required."),
});

export const createRawMaterialInventorySchema = rawMaterialInventorySchema;

export type CreateRawMaterialInventoryType = yup.InferType<typeof createRawMaterialInventorySchema>;

export type SingleRawMaterialInventoryType = {
    id: string
    rawMaterialId: string;
    storeId: string;
    quantity: number;
    minStockLevel: number;
    status: typeof RawMaterialInventoryStatusEnum[keyof typeof RawMaterialInventoryStatusEnum];
    createdAt: string;
    lastModified: string;
}


export type UpdateRawMaterialInventoryType = Pick<CreateRawMaterialInventoryType, "minStockLevel"> & {
    id: string;
};

export type UpdateRawMaterialInventoryResponseType = CreateRawMaterialInventoryType & {
    id: string;
    storeId: string;
    status: typeof RawMaterialInventoryStatusEnum[keyof typeof RawMaterialInventoryStatusEnum];
    createdAt: string;
    lastModified: string;
}

export type MultipleRawMaterialInventoryResponseType = {
    id: string;
    quantity: number;
    minStockLevel: number;
    status: typeof RawMaterialInventoryStatusEnum[keyof typeof RawMaterialInventoryStatusEnum];
    createdAt: string;
    lastModified: string;
    rawMaterialId: string;
    rawMaterialName: string;
    latestUnitPrice: number;
    unitOfMeasurement: {
        id: string;
        name: string;
        symbol: string;
    },
    storeId: string;
    storeName: string;
};

export const RawMaterialTransactionSourceEnum = {
    PURCHASE_RECEIPT: "purchaseReceipt",
    PRODUCTION_USAGE: "productionUsage",
    INVENTORY_ADJUSTMENT: "inventoryAdjustment",
    WASTAGE: "wastage",
    TRANSFER_IN: "transferIn",
    TRANSFER_OUT: "transferOut",
} as const;

export const RAW_MATERIAL_TRANSACTION_SOURCE = Object.values(RawMaterialTransactionSourceEnum);

export const RawMaterialTransactionTypeEnum = {
    GOING_IN: "goingIn",
    GOING_OUT: "goingOut",
} as const;

export const RAW_MATERIAL_TRANSACTION_TYPE = Object.values(RawMaterialTransactionTypeEnum);

// @body { unitOfMeasurementId: string, source: RawMaterialTransactionSource, quantity: number, documentRefId: string, notes?: string }

export const stockInRawMaterialSchema = yup.object({
    source: yup.string().oneOf(RAW_MATERIAL_TRANSACTION_SOURCE).required("Transaction source is required."),
    unitOfMeasurementId: yup.string().uuid().required("Unit of Measurement is required."),
    quantity: yup.number().required("Quantity is required.").min(0.0001, "Quantity must be at least 0.0001."),
    documentRefId: yup.string().optional(),
    notes: yup.string().optional(),
});

export type StockInRawMaterialType = yup.InferType<typeof stockInRawMaterialSchema>;

export type RawMaterialInventoryTransaction = {
    id: string;
    type: typeof RAW_MATERIAL_TRANSACTION_TYPE[keyof typeof RAW_MATERIAL_TRANSACTION_TYPE];
    source: typeof RAW_MATERIAL_TRANSACTION_SOURCE[keyof typeof RAW_MATERIAL_TRANSACTION_SOURCE];
    quantity: number;
    reference: string;
    notes: string;
    transactionDate: string;
    createdAt: string;
    lastModified: string;

    users: {
        id: string;
        firstName: string;
        lastName: string;
    };
    rawMaterial: {
        id: string;
        name: string;
        unitOfMeasurementId: string;
        latestUnitPrice: number;
    };
}

export type RawMaterialInventoryTransactionsResponse = Omit<InventoryTransactionResponseType, "transactions"> & {
    transactions: RawMaterialInventoryTransaction[]
}

export const fetchRawMaterialAndFilterByPeriod = yup.object({
    timePeriod: timePeriodSchema,
    rawMaterialId: yup.string().uuid().required(),
});

export type FetchRawMaterialAndFilterByPeriodType = yup.InferType<typeof fetchRawMaterialAndFilterByPeriod>;