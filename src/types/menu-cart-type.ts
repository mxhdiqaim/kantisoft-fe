import { extendBaseSchema } from "@/types";
import * as yup from "yup";

export const menuItemSchema = extendBaseSchema(
    yup.object().shape({
        name: yup.string().required().min(2),
        price: yup.number().required(),
        isAvailable: yup.boolean().required().default(true),
    }),
);

// TS Type
export type MenuItemType = yup.InferType<typeof menuItemSchema>;
export type AddMenuItemType = Pick<
    MenuItemType,
    "name" | "price" | "isAvailable"
>;
export type EditMenuItemType = Partial<MenuItemType>;

export interface CartItem extends MenuItemType {
    quantity: number;
}
