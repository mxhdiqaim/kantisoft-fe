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

export const createRawMaterialSchema = baseRawMaterialSchema;

export const rawMaterialSchema = extendBaseSchema(baseRawMaterialSchema);

export type RawMaterialType = yup.InferType<typeof rawMaterialSchema>;
export type CreateRawMaterialType = yup.InferType<typeof createRawMaterialSchema>;