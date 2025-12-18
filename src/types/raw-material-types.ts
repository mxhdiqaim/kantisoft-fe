import * as yup from "yup";
import {extendBaseSchema} from "@/types";
import {unitOfMeasurementSchema} from "@/types/unit-of-measurement-types.ts";

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