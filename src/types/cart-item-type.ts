import type { MenuItemType } from "@/types/menu-item-type";

export interface CartItem extends MenuItemType {
    quantity: number;
}
