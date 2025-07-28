/* eslint-disable @typescript-eslint/no-explicit-any */
import * as yup from "yup";

// Base schema type that all other schemas will extend
export const baseSchema = yup.object().shape({
    id: yup.string().uuid().required(), // uuid string
    createdAt: yup.string().required(), // ISO date
    lastModified: yup.string().required(), // ISO date
});

// Type inference from the base schema
export type BaseSchema = yup.InferType<typeof baseSchema>;

// Helper types to extend base schema
export type ExtendSchema<T> = BaseSchema & T;

// Helper function to extend base schema
// export const extendBaseSchema = <T extends yup.ObjectSchema<any>>(
//     schema: T,
// ): yup.ObjectSchema<ExtendSchema<yup.InferType<T>>> => {
//     // eslint-disable-next-line
//     // @ts-ignore
//     return baseSchema.concat(schema);
// };

export const extendBaseSchema = <T extends yup.AnyObject>(fields: T): yup.ObjectSchema<any> => {
    return yup.object({
        id: yup.string().uuid().required(),
        createdAt: yup.string().required(),
        lastModified: yup.string().required(),
        ...fields,
    });
};

export type ErrCallbackType = (err: string) => void;

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
