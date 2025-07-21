import { extendBaseSchema } from "@/types";
import * as yup from "yup";
import { menuItemSchema, type MenuItemType } from "./menu-item-type";

export const OrderStatus = {
    CANCELED: "canceled",
    PENDING: "pending",
    COMPLETED: "completed",
} as const;

export const OrderPaymentMethod = {
    CARD: "card",
    CASH: "cash",
    TRANSFER: "transfer",
} as const;

// Define allowed values for better type safety and validation
const PAYMENT_METHODS = Object.values(OrderPaymentMethod);
const ORDER_STATUSES = Object.values(OrderStatus);

export const ORDER_PERIODS = ["today", "week", "month", "all-time"] as const;

// Core schema for creating and validating an order
const coreOrderSchema = yup.object({
    totalAmount: yup
        .number()
        .typeError("Total amount must be a number")
        .positive("Total amount must be greater than 0")
        .required("Total amount is required"),

    paymentMethod: yup.string().oneOf(PAYMENT_METHODS, "Invalid payment method").required("Payment method is required"),

    orderDate: yup
        .date()
        .typeError("Order date must be a valid date")
        .default(() => new Date())
        .required("Order date is required"),

    orderStatus: yup
        .string()
        .oneOf(ORDER_STATUSES, "Invalid order status")
        .default("pending")
        .required("Order status is required"),

    sellerId: yup.string().required("Seller ID is required"),
});

// Schema for a full order object, including base fields like id and timestamps
export const orderSchema = extendBaseSchema(coreOrderSchema);

// Schema for a single item when creating an order
const createOrderItemPayloadSchema = yup.object({
    menuItemId: yup.string().uuid("Menu item ID must be a valid UUID").required("Menu item ID is required"),
    name: yup.string().default(""),
    quantity: yup
        .number()
        .typeError("Quantity must be a number")
        .positive("Quantity must be a positive number")
        .required("Quantity is required"),
});

// Core schema for a full order item, often retrieved from the DB
const coreOrderItemSchema = createOrderItemPayloadSchema.shape({
    orderId: yup.string().uuid("Order ID must be a valid UUID").required("Order ID is required"),
    priceAtOrder: yup
        .number()
        .typeError("Price at order must be a number")
        .positive("Price at order must be a positive number")
        .required("Price at order is required"),
    subTotal: yup
        .number()
        .typeError("Subtotal must be a number")
        .min(0, "Subtotal cannot be negative")
        .required("Subtotal is required")
        .default(0),
});

// Schema for a full order item object, including base fields like id and timestamps
export const orderItemSchema = extendBaseSchema(coreOrderItemSchema);

export const singleOrderSchema = extendBaseSchema(
    orderSchema.shape({
        ...extendBaseSchema,
        menuItemId: yup.string().uuid().required(),
        orderId: yup.string().uuid().required(),
        priceAtOrder: yup.number().nonNullable(),
        quantity: yup.number().nullable().default(1),
        subTotal: yup.number().nonNullable().default(0),
        orderItems: yup.array().of(menuItemSchema).required(),
        seller: yup.object({
            firstName: yup.string().required("First name is required"),
            lastName: yup.string().required("Last name is required"),
        }),
    }),
);

// Schema for the payload when creating a new order with its items
export const createOrderSchema = yup.object({
    sellerId: yup.string().uuid().required("Seller ID is required"),
    paymentMethod: yup
        .string()
        .oneOf(PAYMENT_METHODS, "Invalid payment method")
        .default("cash")
        .required("Payment method is required"),
    orderStatus: yup
        .string()
        .oneOf(ORDER_STATUSES, "Invalid order status")
        .default("completed")
        .required("Order status is required"),
    items: yup
        .array()
        .of(createOrderItemPayloadSchema)
        .min(1, "An order must have at least one item")
        .required("Order items are required"),
    amountReceived: yup
        .number()
        .typeError("Amount received must be a number")
        .min(0, "Amount must be greater than or equal to 0")
        .required("Amount received is required"),
    // amountReceived: yup
    //     .number()
    //     .typeError("Amount received must be a number")
    //     .min(0, "Amount must be greater than or equal to 0")
    //     .required("Amount received is required.")
    //     // Add conditional validation using .when()
    //     .when(["paymentMethod", "items"], (fields, schema) => {
    //         const [paymentMethod, items] = fields;
    //         // This logic is complex and better handled in the component state.
    //         // The schema should only validate the type and minimum value.
    //         // We will rely on `isCashPaymentInsufficient` in the component.
    //         // For non-cash payments, the value is set programmatically.
    //         // For cash, the component logic handles the check.
    //         // Therefore, a simpler validation is more robust here.
    //         return schema; // Keep basic validation, the component logic is sufficient.
    //     }),
});

// TypeScript types inferred from schemas
export type OrderType = yup.InferType<typeof orderSchema>;
export type CreateOrderType = yup.InferType<typeof createOrderSchema>;
export type SingleOrderType = yup.InferType<typeof singleOrderSchema>;

export type OrderItemType = yup.InferType<typeof orderItemSchema>;
export type CreateOrderItemType = Pick<OrderItemType, "menuItemId" | "quantity" | "name">;

// Explicitly define the types for the constants
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const orderPeriodSchema = yup
    .string()
    .oneOf(ORDER_PERIODS, "Invalid period. Must be 'day', 'week', or 'month'.")
    .required("Period is required.");

export type Period = (typeof ORDER_PERIODS)[number];

export type _SingleOrderType = OrderType & {
    orderItems: (OrderItemType & { menuItem: MenuItemType })[];
    seller: { firstName: string; lastName: string };
};

// New type for the getOrdersByPeriod response
export interface OrdersByPeriodResponse {
    period: string;
    totalRevenue: string;
    totalOrders: number;
    mostOrderedItem: {
        name: string;
        quantity: number;
    } | null;
    topSeller: {
        name: string;
        totalRevenue: string;
    } | null;
    orders: _SingleOrderType[]; // Use SingleOrderType as it includes nested details
}
