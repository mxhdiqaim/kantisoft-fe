import * as yup from "yup";
import { extendBaseSchema } from "@/types";

export const STORE_TYPES = ["restaurant", "pharmacy", "supermarket"] as const;

// Base schema for a store, matching the backend
export const baseStoreSchema = yup.object({
    name: yup.string().required("Store name is required."),
    location: yup.string().optional(),
    storeType: yup.string().oneOf(STORE_TYPES).default("restaurant").required("You must select store type"),
});

export const createStoreSchema = baseStoreSchema;

export const storeSchema = extendBaseSchema(baseStoreSchema);

export type StoreType = yup.InferType<typeof storeSchema>;
export type CreateStoreType = yup.InferType<typeof createStoreSchema>;
