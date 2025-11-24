import {orderPeriodSchema, type Period} from "@/types/order-types.ts";
import * as yup from "yup";

export type OrderByType = "quantity" | "revenue";

export const salesSummarySchema = yup.object({
    avgOrderValue: yup.number().default(0),
    totalOrders: yup.number().default(0),
    totalRevenue: yup.number().default(0),
});

export const salesFilterSchema = yup.object({
    period: orderPeriodSchema,
});

export type SaleSummarySchemaType = yup.InferType<typeof salesSummarySchema>;

export type TopSellsSchemaType = {
    timePeriod?: Period;
    limit?: number;
    orderBy?: OrderByType;
};

export type TopSellsItemType = {
    itemId: string;
    itemName: string;
    totalQuantitySold: number;
    totalRevenueGenerated: string;
};

export type InventorySummaryType = {
    totalLowStockItems: number;
    totalOutOfStockItems: number;
    outOfStockDetails: {
        id: string;
        name: string;
    }[];
};

export type SalesTrendType = {
    date: string;
    dailyRevenue: number;
    dailyOrders: number;
};
