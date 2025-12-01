import {extendBaseSchema} from "@/types";
import * as yup from "yup";
import {STORE_TYPES} from "./store-types";
// import { storeSchema } from "./store-types";

// Password-specific validation rules
const PASSWORD_RULES = {
    min: 5,
    max: 100,
    requireUppercase: true,
    requireLowercase: true,
    requireNumber: true,
    requireSpecialChar: true,
} as const;

export const UserRoleEnum = {
    MANAGER: "manager",
    ADMIN: "admin",
    USER: "user",
    GUEST: "guest",
} as const;

export const UserStatusEnum = {
    ACTIVE: "active",
    INACTIVE: "inactive",
    BANNED: "banned",
    DELETED: "deleted",
} as const;

// User roles and statuses
export const USER_ROLES = Object.values(UserRoleEnum);

export const USER_STATUSES = Object.values(UserStatusEnum);

// Schema for creating a new user without ID, createdAt & updatedAt fields
export const baseUserSchema = yup.object().shape({
    firstName: yup.string().required("First Name is required"),
    lastName: yup.string().required("Last Name is required"),
    email: yup
        .string()
        .email("Please enter a valid email address")
        .required("Email address is required")
        .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, "Invalid email format"),
    password: yup
        .string()
        .required("Password is required")
        .min(PASSWORD_RULES.min, `Password must be at least ${PASSWORD_RULES.min} characters`)
        .max(PASSWORD_RULES.max, `Password cannot exceed ${PASSWORD_RULES.max} characters`)
        .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
        .matches(/[a-z]/, "Password must contain at least one lowercase letter")
        .matches(/[0-9]/, "Password must contain at least one number")
        .matches(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    confirmPassword: yup
        .string()
        .required("Please confirm your password")
        .oneOf([yup.ref("password")], "Passwords must match"),
    phone: yup.string().when({
        // The 'is' condition checks if the phone field is not empty.
        is: (val: string) => val && val.length > 0,
        // If it's not empty, then it must be exactly 11 digits.
        then: (schema) => schema.matches(/^[0-9]{11}$/, "If provided, the phone number must be exactly 11 digits"),
        // Otherwise, the field is optional and not required.
        otherwise: (schema) => schema.notRequired(),
    }),
    role: yup.string().oneOf(USER_ROLES).default("guest"),
    status: yup.string().oneOf(USER_STATUSES).default("active"),
    storeId: yup.string().uuid().required("Store must be selected"),
    // store: storeSchema.optional().nullable(), // Optional store object for user
});

export const createUserSchema = baseUserSchema;

export const createUserSchemaWithoutStatusStoreIDRole = createUserSchema.omit(["status", "storeId", "role"]);

export const registerUserSchema = createUserSchemaWithoutStatusStoreIDRole.concat(
    yup.object().shape({
        storeName: yup.string().required("Store name is required"),
        storeType: yup
            .string()
            .oneOf(STORE_TYPES as string[], "Select a valid store type")
            .required("Store type is required"),
    }),
);

export const createUserSchemaWithoutStatus = baseUserSchema.omit(["status"]);

export const updateUserSchema = createUserSchemaWithoutStatus.concat(
    yup.object().shape({
        password: yup.string().when({
            // The 'is' condition checks if the password field is not empty.
            is: (val: string) => val && val.length > 0,
            // If it's not empty, then apply all the required validation rules.
            then: (schema) =>
                schema
                    .min(PASSWORD_RULES.min, `Password must be at least ${PASSWORD_RULES.min} characters`)
                    .max(PASSWORD_RULES.max, `Password cannot exceed ${PASSWORD_RULES.max} characters`)
                    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
                    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
                    .matches(/[0-9]/, "Password must contain at least one number")
                    .matches(/[^A-Za-z0-9]/, "Password must contain at least one special character")
                    .required("Password is required if you want to change it."), // Make it required in this context
            // Otherwise, the field is optional and not required.
            otherwise: (schema) => schema.notRequired(),
        }),
        confirmPassword: yup.string().when("password", {
            is: (val: string) => val && val.length > 0,
            then: (schema) =>
                schema
                    .oneOf([yup.ref("password")], "Passwords must match")
                    .required("Please confirm your new password"),
            otherwise: (schema) => schema.notRequired(),
        }),
        storeId: yup.string().uuid().required("Store must be selected"),
    }),
);

// Creates the login schema that maintains the validation rules
export const loginUserType = yup.object().shape({
    email: yup
        .string()
        .email("Please enter a valid email address")
        .required("Email address is required")
        .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, "Invalid email format"),
    password: yup.string().required("Password is required"),
});

// Full user schema (including ID and timestamps) for database records
export const userSchema = extendBaseSchema(baseUserSchema);

// Types
export type CreateUserType = yup.InferType<typeof createUserSchema>;
export type UpdateUserType = yup.InferType<typeof updateUserSchema>;
export type RegisterUserType = yup.InferType<typeof registerUserSchema>;
export type LoginUserType = yup.InferType<typeof loginUserType>;
export type userType = yup.InferType<typeof userSchema>;
export type UserType = Omit<userType, "password" | "confirmPassword">;

// export type UserRole = (typeof USER_ROLES)[number];
export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];
export type UserRoleType = (typeof USER_ROLES)[number];
export type UserStatus = (typeof USER_STATUSES)[number];

export const roleHierarchy: Record<UserRoleType, number> = {
    manager: 0,
    admin: 1,
    user: 2,
    guest: 3,
} as const;
