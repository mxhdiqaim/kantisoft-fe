import * as yup from "yup";
import {extendBaseSchema} from "@/types";

export const STORE_TYPES: readonly string[] = ["restaurant", "pharmacy", "supermarket"] as const;
export const STORE_BRANCH_TYPES: readonly string[] = ["main", "branch"] as const;

// Base schema for a store, matching the backend
export const baseStoreSchema = yup.object({
    name: yup.string().required("Store name is required."),
    location: yup.string().optional(),
    storeType: yup.string().oneOf(STORE_TYPES).default("restaurant").required("You must select store type"),
    branchType: yup.string().oneOf(STORE_BRANCH_TYPES).default("main"),
});

export const createStoreSchema = baseStoreSchema;

export const storeSchema = extendBaseSchema(baseStoreSchema);

export type StoreType = yup.InferType<typeof storeSchema>;
export type CreateStoreType = yup.InferType<typeof createStoreSchema>;

export type Pagination = {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
};

export type PaginatedStoreResponse = {
    data: StoreType[];
    pagination: Pagination;
};
