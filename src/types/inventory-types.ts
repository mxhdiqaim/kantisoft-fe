import {extendBaseSchema} from "@/types";
import * as yup from "yup";

const inventoryStatusEnum = ["inStock", "lowStock", "outOfStock"] as const;

// Schema for creating an inventory item
export const createInventorySchema = yup.object({
    menuItemId: yup.string().uuid().required("MenuItem not selected"),
    quantity: yup.number().required("Quantity is required").min(0, "Quantity must be at least 0"),
    minStockLevel: yup.number().required("Minimum stock level is required").min(0, "Minimum stock level must be 0 or greater"),
});

// Schema for a full inventory object, matching the API response
export const inventorySchema = extendBaseSchema({
    menuItemId: yup.string().uuid().required(),
    storeId: yup.string().uuid().required(),
    quantity: yup.number().integer().min(0).required(),
    minStockLevel: yup.number().integer().min(0).optional(),
    status: yup.string().oneOf(inventoryStatusEnum).required(),
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

export type CreateInventoryType = yup.InferType<typeof createInventorySchema>;
export type InventoryType = yup.InferType<typeof inventorySchema>;
export type EditInventoryType = Partial<InventoryType>;
