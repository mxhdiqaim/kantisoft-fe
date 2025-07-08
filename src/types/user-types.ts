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

// Schema for creating a new user without ID, createdAt & updatedAt fields
export const createUserSchema = yup.object().shape({
  username: yup.string().required().min(3),
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email address is required")
    .matches(
      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      "Invalid email format",
    ),
  password: yup
    .string()
    .required("Password is required")
    .min(
      PASSWORD_RULES.min,
      `Password must be at least ${PASSWORD_RULES.min} characters`,
    )
    .max(
      PASSWORD_RULES.max,
      `Password cannot exceed ${PASSWORD_RULES.max} characters`,
    )
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character",
    ),
  confirmPassword: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("password")], "Passwords must match"),
  isActive: yup.boolean().default(true),
  role: yup
    .string()
    .oneOf(["manager", "admin", "user", "guest"])
    .default("user"),
});

// Full user schema (including ID and timestamps) for database records
export const userSchema = extendBaseSchema(
  yup.object().shape({
    username: yup.string().required().min(3),
    email: yup
      .string()
      .email()
      .required("Email address is required")
      .matches(
        /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        "Invalid email format",
      ),
    password: yup.string().required("Password is required"),
    name: yup.string().required("Name is required"),
    isActive: yup.boolean().default(true),
    role: yup
      .string()
      .oneOf(["manager", "admin", "user", "guest"])
      .default("user"),
  }),
);

// Creates the login schema that maintains the validation rules
export const userLoginSchema = yup.object().shape({
  email: userSchema.fields.email,
  password: userSchema.fields.password,
});

// Types
export type CreateUserInput = yup.InferType<typeof createUserSchema>;
export type UserSchema = yup.InferType<typeof userSchema>;
export type UserLogin = yup.InferType<typeof userLoginSchema>;

// Auth Types
export type CreateUser = Omit<
  CreateUserInput,
  "id" | "createdAt" | "updatedAt"
>;

// Types for different user scenarios
export type UserResponse = UserSchema; // Full user with all fields
export type UserType = Omit<UserSchema, "password">;
export type UserUpdate = Partial<UserSchema>;
