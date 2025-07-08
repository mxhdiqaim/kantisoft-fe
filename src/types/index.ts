import * as yup from "yup";
import type { CreateUser, UserLogin, UserType } from "@/types/user-types";

// Base schema type that all other schemas will extend
export const baseSchema = yup.object().shape({
  id: yup.string().uuid().required(), // uuid string
  createdAt: yup.string().required(), // ISO date
  updatedAt: yup.string().required(), // ISO date
});

// Type inference from the base schema
export type BaseSchema = yup.InferType<typeof baseSchema>;

// Helper types to extend base schema
export type ExtendSchema<T> = BaseSchema & T;

// Helper function to extend base schema
// eslint-disable-next-line
export const extendBaseSchema = <T extends yup.ObjectSchema<any>>(
  schema: T,
): yup.ObjectSchema<ExtendSchema<yup.InferType<T>>> => {
  // eslint-disable-next-line
  // @ts-ignore
  return baseSchema.concat(schema);
};

export type ErrCallbackType = (err: string) => void;

export type AuthValuesType = {
  loading: boolean;
  setLoading: (value: boolean) => void;
  logout: () => void;
  isInitialized: boolean;
  user: UserType | null;
  setUser: (value: UserType | null) => void;
  setIsInitialized: (value: boolean) => void;
  login: (params: UserLogin, errorCallback?: ErrCallbackType) => void;
  register?: (params: CreateUser, errorCallback?: ErrCallbackType) => void;
};
