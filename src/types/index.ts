/* eslint-disable @typescript-eslint/no-explicit-any */
import * as yup from "yup";

export const ORDER_PERIODS = ["today", "week", "month", "all-time"] as const;

// Base schema type that all other schemas will extend
export const baseSchema = yup.object().shape({
    id: yup.string().uuid().required(), // uuid string
    createdAt: yup.string().required(), // ISO date
    lastModified: yup.string().required(), // ISO date
});

// Type inference from the base schema
export type BaseSchema = yup.InferType<typeof baseSchema>;

export const extendBaseSchema = <T extends yup.AnyObject>(fields: T): yup.ObjectSchema<any> => {
    return yup.object({
        id: yup.string().uuid().required(),
        createdAt: yup.string().required(),
        lastModified: yup.string().required(),
        ...fields,
    });
};

export const searchSchema = yup.object({
    search: yup.string().min(2).optional(),
});

export type SearchTermType = yup.InferType<typeof searchSchema>;

export const timePeriodSchema = yup
    .string()
    .oneOf(ORDER_PERIODS, "Invalid period. Must be 'day', 'week', or 'month'.")
    .required("Period is required.");


export const filterSchema = yup.object({
    timePeriod: timePeriodSchema,
});

export type TimePeriod = (typeof ORDER_PERIODS)[number];

export interface ActivityLogType {
    id: string;
    userId: string;
    storeId: string;
    action: string;
    entityId?: string;
    entityType?: string;
    details: string;
    isRead: boolean;
    createdAt: string;
}

export interface ActivityLogUser {
    firstName: string;
    lastName: string;
    role: string;
}

export interface ActivityLogStore {
    name: string;
}

export interface ActivityLogEntry {
    activityLog: ActivityLogType;
    user?: ActivityLogUser;
    store?: ActivityLogStore;
}

export interface ActivityLogResponse {
    data: ActivityLogEntry[];
    totalCount: number;
    limit: number;
    offset: number;
}

export type DrawerAnchor = "left" | "bottom" | "right" | "top";