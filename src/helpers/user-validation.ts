import * as yup from "yup";
import {
  type CreateUserInput,
  createUserSchema,
  type UserLogin,
  userLoginSchema,
  userSchema,
  type UserSchema,
} from "@/types/user-types";

export const validateUserRegistration = async (
  data: Partial<CreateUserInput>,
) => {
  try {
    const validatedData = await createUserSchema.validate(data, {
      abortEarly: false,
    });
    // Remove confirmPassword before sending to backend
    // eslint-disable-next-line
    const { confirmPassword, ...userDataToSave } = validatedData;
    return userDataToSave;
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      throw new Error(error.message);
    }
    throw error;
  }
};

export const validateUser = async (data: Partial<UserSchema>) => {
  try {
    return await userSchema.validate(data, { abortEarly: false });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      throw new Error(error.message);
    }
    throw error;
  }
};

export const validateUserLogin = async (data: Partial<UserLogin>) => {
  try {
    return await userLoginSchema.validate(data, { abortEarly: false });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      throw new Error(error.message);
    }
    throw error;
  }
};
