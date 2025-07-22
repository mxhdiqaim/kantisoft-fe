import * as yup from "yup";
import { extendBaseSchema } from "@/types";

// Password-specific validation rules
const PASSWORD_RULES = {
    min: 8,
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

// User roles and statuses
export const USER_ROLES = Object.values(UserRoleEnum);

export const USER_STATUSES = ["active", "inactive", "banned"] as const;

// Schema for creating a new user without ID, createdAt & updatedAt fields
export const createUserType = yup.object().shape({
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
    phone: yup
        .string()
        .optional()
        .matches(/^[0-9]{11}$/, "Phone number must be 11 digits"),
    role: yup.string().oneOf(USER_ROLES).default("user"),
    status: yup.string().oneOf(USER_STATUSES).default("active"),
});

// Creates the login schema that maintains the validation rules
export const loginUserType = yup.object().shape({
    email: createUserType.fields.email,
    password: yup.string().required("Password is required"),
});

// Full user schema (including ID and timestamps) for database records
export const userSchema = extendBaseSchema(createUserType);

// Types
export type CreateUserType = yup.InferType<typeof createUserType>;
export type LoginUserType = yup.InferType<typeof loginUserType>;
export type userType = yup.InferType<typeof userSchema>;
export type UserType = Omit<userType, "password" | "confirmPassword">;

// export type UserRole = (typeof USER_ROLES)[number];
export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];
export type UserStatus = (typeof USER_STATUSES)[number];
