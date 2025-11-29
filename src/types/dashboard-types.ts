import {type Period as TimePeriod} from "@/types/order-types.ts";
import * as yup from "yup";
import {timePeriodSchema} from "@/types/index.ts";

export type OrderByType = "quantity" | "revenue";

export const salesSummarySchema = yup.object({
    avgOrderValue: yup.number().default(0),
    totalOrders: yup.number().default(0),
    totalRevenue: yup.number().default(0),
});

export const filterSchema = yup.object({
    period: timePeriodSchema,
});

export type SaleSummarySchemaType = yup.InferType<typeof salesSummarySchema>;

export type TopSellsParamType = {
    timePeriod?: TimePeriod;
    limit?: number;
    orderBy?: OrderByType;
    startDate?: string;
    endDate?: string;
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
