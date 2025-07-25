/* eslint-disable @typescript-eslint/no-explicit-any */
import { extendBaseSchema } from "@/types";
import * as yup from "yup";

const coreMenuItemSchema = yup.object({
    name: yup.string().required("Name is required").min(2, "Name must be at least 2 characters"),
    itemCode: yup.number().optional().min(100, "Item code must be at least 100"),
    price: yup
        .number()
        .typeError("Price must be a number")
        .positive("Price must be greater than 0")
        .required("Price is required"),
    isAvailable: yup.boolean().required().default(true),
});

// Schema for a full menu item object, including base fields like id and timestamps
export const menuItemSchema = extendBaseSchema({
    name: yup.string().required("Name is required").min(2, "Name must be at least 2 characters"),
    itemCode: yup.number().optional().min(100, "Item code must be at least 100"),
    price: yup
        .number()
        .typeError("Price must be a number")
        .positive("Price must be greater than 0")
        .required("Price is required"),
    isAvailable: yup.boolean().required().default(true),
});

// The schema for creating a new menu item is the same as the core schema
export const createMenuItemSchema = coreMenuItemSchema;

export type CreateMenuItemType = yup.InferType<typeof createMenuItemSchema>;

// Inferred type for a full menu item object
// export type MenuItemType = yup.InferType<typeof menuItemSchema>;
export type MenuItemType = any;
// Inferred type for creating a menu item, ensuring consistency
export type AddMenuItemType = Pick<MenuItemType, "name" | "price" | "isAvailable"> & {
    itemCode?: number;
};
export type EditMenuItemType = Partial<MenuItemType>;
