import * as yup from "yup";

export const UnitSymbolEnum = {
    mg: "mg", // milligram
    g: "g", // gram
    kg: "kg", // kilogram
    t: "t", // tonne

    ml: "ml", // millilitre
    L: "L", // litre

    unit: "unit", // single unit
    dz: "dz", // dozen
    grs: "grs", // gross (144 units)

    sqm: "sqm", // square metre
    m2: "m2", // square metre
    m3: "m3", // cubic metre

    cm: "cm", // centimeter
    m: "m", // meter
    km: "km", // kilometer
} as const;

export const UNIT_SYMBOL_VALUES = Object.values(UnitSymbolEnum);

export const UnitNameEnum = {
    MILLIGRAM: "milligram",
    GRAM: "gram",
    KILOGRAM: "kilogram",
    TONNE: "tonne",

    MILLILITRE: "millilitre",
    LITRE: "litre",

    UNIT: "unit",
    DOZEN: "dozen",
    GROSS: "gross",

    SQUARE_METRE: "square metre",
    METRE_SQUARE: "metre square",
    CUBIC_METRE: "cubic metre",

    CENTIMETRE: "centimetre",
    METRE: "metre",
    KILOMETRE: "kilometre",
} as const;

export const UNIT_NAME_VALUES = Object.values(UnitNameEnum);

export const UnitOfMeasurementFamilyEnum = {
    WEIGHT: "weight", // Mass (e.g. kg, g)
    VOLUME: "volume", // Liquid/Capacity (e.g. L, ml)
    COUNT: "count", // Discrete units (e.g. unit, dozen)
    AREA: "area", // (Optional: m², sqm)
    LENGTH: "length", // (Optional: m, cm, km)
} as const;

export const UNIT_OF_MEASUREMENT_FAMILY_VALUES = Object.values(UnitOfMeasurementFamilyEnum);

export const unitOfMeasurementSchema = yup.object({
    id: yup.string().uuid("Unit of Measurement must be is not valid.").required("Unit of Measurement is required."),
    name: yup.string().oneOf(UNIT_NAME_VALUES, "Invalid unit name.").required("Unit of Measurement name is required."),
    symbol: yup.string().oneOf(UNIT_SYMBOL_VALUES, "Invalid unit symbol.").required("Unit of Measurement symbol is required."),
    unitOfMeasurementFamily: yup.string().oneOf(UNIT_OF_MEASUREMENT_FAMILY_VALUES, "Invalid unit of measurement family.").required("Unit of Measurement family is required."),
    isBaseUnit: yup.boolean().required("Base Unit is required."),
    conversionFactorToBase: yup.number().required("Conversion factor to base is required.").min(0, "Conversion factor must be at least 0."),
    calculationLogic: yup.string().optional(),
});

export type UnitOfMeasurementType = yup.InferType<typeof unitOfMeasurementSchema>;