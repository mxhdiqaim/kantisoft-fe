import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
    CreateOrderType,
    OrderPeriod,
    OrderType,
    SingleOrderType,
} from "@/types/order-types.ts";
import type { AddMenuItemType, MenuItemType } from "@/types/menu-item-type.ts";
import type { RootState } from "../index";
import { setCredentials } from "./auth-slice";

const baseUrl = import.meta.env.VITE_APP_API_URL;

// Define your API slice
export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl,
        prepareHeaders: (headers, { getState }) => {
            // You can use getState to access the token if it's in Redux state
            const token = (getState() as RootState).auth.token;

            if (token) {
                headers.set("authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    // Define tags for caching and automatic refetching
    tagTypes: ["Order", "MenuItem"],
    endpoints: (builder) => ({
        // Health Check Endpoint
        healthCheck: builder.query<{ status: string }, void>({
            query: () => "/", // This will hit your base URL's root
        }),

        // Auth Endpoints
        login: builder.mutation({
            query: (credentials) => ({
                url: "/users/login", // Your backend login route
                method: "POST",
                body: credentials,
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    // On success, dispatch setCredentials to store token and user
                    dispatch(setCredentials(data));
                } catch (error) {
                    console.error("Login failed:", error);
                }
            },
        }),
        register: builder.mutation({
            query: (user) => ({
                url: "/users/register", // Your backend register route
                method: "POST",
                body: user,
            }),
        }),

        // Order Endpoints
        getOrdersByPeriod: builder.query<OrderType[], OrderPeriod>({
            query: (period = "day") => ({
                url: "/orders/by-period",
                params: { period },
            }),
            providesTags: ["Order"],
        }),
        getOrderById: builder.query<SingleOrderType, string>({
            query: (id) => `/orders/${id}`,
            providesTags: (result, error, id) => [{ type: "Order", id }],
        }),
        createOrder: builder.mutation<
            SingleOrderType,
            Omit<CreateOrderType, "amountReceived">
        >({
            query: (newOrder) => ({
                url: "/orders/create",
                method: "POST",
                body: newOrder,
            }),
            // When a new order is created, invalidate the 'Order' tag to refetch the list
            invalidatesTags: ["Order"],
        }),

        // Menu Item Endpoints
        getMenuItems: builder.query<MenuItemType[], void>({
            query: () => "/menu-items/",
            providesTags: ["MenuItem"],
        }),
        createMenuItem: builder.mutation<MenuItemType, AddMenuItemType>({
            query: (newMenuItem) => ({
                url: "/menu-items/create",
                method: "POST",
                body: newMenuItem,
            }),
            invalidatesTags: ["MenuItem"],
        }),
    }),
});

// Export auto-generated hooks for use in your components
export const {
    useGetOrdersByPeriodQuery,
    useGetOrderByIdQuery,
    useCreateOrderMutation,
    useGetMenuItemsQuery,
    useCreateMenuItemMutation,
    useLoginMutation,
    useRegisterMutation,
    useHealthCheckQuery,
} = apiSlice;
