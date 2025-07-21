import type {
    InventorySummaryType,
    SalesTrendType,
    SaleSummarySchemaType,
    TopSellsItemType,
    TopSellsSchemaType,
} from "@/types/dashboard-types.ts";
import type { AddMenuItemType, MenuItemType } from "@/types/menu-item-type.ts";
import type { CreateOrderType, OrdersByPeriodResponse, Period, SingleOrderType } from "@/types/order-types.ts";
import {
    type BaseQueryFn,
    createApi,
    type FetchArgs,
    fetchBaseQuery,
    type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import type { RootState } from "..";
import { logOut, setCredentials } from "./auth-slice";

const baseUrl = import.meta.env.VITE_APP_API_URL;

// Create a new base query that wraps fetchBaseQuery
const baseQuery = fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
        // Get the token from the auth state
        const token = (getState() as RootState).auth.token;
        if (token) {
            headers.set("authorization", `Bearer ${token}`);
        }
        return headers;
    },
});

// Create a new base query function that includes logout logic on 401
const baseQueryWithAuth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
    args,
    api,
    extraOptions,
) => {
    const result = await baseQuery(args, api, extraOptions);

    // If a 401 Unauthorized error occurs, dispatch the logOut action
    if (result.error && result.error.status === 401) {
        api.dispatch(logOut());

        console.warn("Session expired, logging out.");

        // Resetting the API state
        api.dispatch(apiSlice.util.resetApiState());
        return { error: { status: 401, data: "Session expired" } };
    }

    return result;
};

// Define your API slice
export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: baseQueryWithAuth,
    // Define tags for caching and automatic refetching
    tagTypes: ["Order", "MenuItem", "User", "Summary", "TopSells", "InventorySummary", "SalesTrend"],
    endpoints: (builder) => ({
        // Health Check Endpoint
        healthCheck: builder.query<{ status: string }, void>({
            query: () => "/",
        }),

        // Auth Endpoints
        login: builder.mutation({
            query: (credentials) => ({
                url: "/users/login", // Your backend login route
                method: "POST",
                body: credentials,
            }),
            async onQueryStarted(_args, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;

                    // On success, dispatch setCredentials to store token and user
                    dispatch(setCredentials(data));
                } catch (error) {
                    console.error("Login failed:", error);
                }
            },
        }),

        // Logout Endpoint
        logout: builder.mutation({
            query: () => ({
                url: "/users/logout",
                method: "POST",
            }),
            async onQueryStarted(_args, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    // 2. Dispatch the logOut action to clear credentials and localStorage
                    dispatch(logOut());
                    // 3. Clear the RTK Query cache
                    dispatch(apiSlice.util.resetApiState());
                } catch (error) {
                    console.error("Logout failed:", error);
                    // Even if the server call fails, force a local logout
                    dispatch(logOut());
                    dispatch(apiSlice.util.resetApiState());
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

        // Dashboard Endpoint
        getSalesSummary: builder.query<SaleSummarySchemaType, Period>({
            query: (period = "today") => ({
                url: "/dashboard/sales-summary",
                params: { period },
            }),
            providesTags: ["Summary"],
        }),

        getTopSells: builder.query<TopSellsItemType[], TopSellsSchemaType>({
            query: ({ period = "month", limit = "5", orderBy = "quantity" }) => ({
                url: "/dashboard/top-sells",
                params: { period, limit, orderBy },
            }),
            providesTags: ["TopSells"],
        }),

        getInventorySummary: builder.query<InventorySummaryType, void>({
            query: () => "/dashboard/inventory-summary",
            providesTags: ["InventorySummary"],
        }),

        getSalesTrend: builder.query<SalesTrendType[], Period | void>({
            query: (period = "week") => ({
                url: "/dashboard/sales-trend",
                params: { period },
            }),
            providesTags: ["SalesTrend"],
        }),

        // Order Endpoints
        getOrdersByPeriod: builder.query<OrdersByPeriodResponse, Period>({
            query: (period = "today") => ({
                url: "/orders/by-period",
                params: { period },
            }),
            providesTags: ["Order"],
        }),
        getOrderById: builder.query<SingleOrderType, string>({
            query: (id) => `/orders/${id}`,
            providesTags: (_result, _error, id) => [{ type: "Order", id }],
        }),
        createOrder: builder.mutation<SingleOrderType, Omit<CreateOrderType, "amountReceived">>({
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
        deleteMenuItem: builder.mutation<void, string>({
            query: (id) => ({
                url: `/menu-items/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["MenuItem"],
        }),
        updateMenuItem: builder.mutation<MenuItemType, Partial<MenuItemType> & Pick<MenuItemType, "id">>({
            query: ({ id, ...patch }) => ({
                url: `/menu-items/${id}`,
                method: "PATCH",
                body: patch,
            }),
            invalidatesTags: (_result, _error, { id }) => [{ type: "MenuItem", id }, "MenuItem"],
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
    useLogoutMutation,
    useRegisterMutation,
    useHealthCheckQuery,
    useDeleteMenuItemMutation,
    useUpdateMenuItemMutation,
    useGetSalesSummaryQuery,
    useGetTopSellsQuery,
    useGetInventorySummaryQuery,
    useGetSalesTrendQuery,
} = apiSlice;
