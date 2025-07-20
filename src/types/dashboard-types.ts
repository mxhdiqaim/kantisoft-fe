import { orderPeriodSchema } from "@/types/order-types.ts";
import * as yup from "yup";

export const salesSummarySchema = yup.object({
    avgOrderValue: yup.number().default(0),
    totalOrders: yup.number().default(0),
    totalRevenue: yup.number().default(0),
});

export const salesFilterSchema = yup.object({
    period: orderPeriodSchema,
});

export type SaleSummarySchemaType = yup.InferType<typeof salesSummarySchema>;
