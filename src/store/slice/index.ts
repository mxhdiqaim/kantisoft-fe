import type {ActivityLogResponse} from "@/types";
import type {
    InventorySummaryType,
    SalesTrendType,
    SaleSummarySchemaType,
    TopSellsItemType,
    TopSellsSchemaType,
} from "@/types/dashboard-types.ts";
import type {AddMenuItemType, MenuItemType} from "@/types/menu-item-type.ts";
import type {
    CreateOrderType,
    OrdersByPeriodResponse,
    Period as TimePeriod,
    SingleOrderType
} from "@/types/order-types.ts";
import type {CreateStoreType, StoreType} from "@/types/store-types";
import type {CreateUserType, RegisterUserType, UserType} from "@/types/user-types";
import {
    type BaseQueryFn,
    createApi,
    type FetchArgs,
    fetchBaseQuery,
    type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import type {RootState} from "..";
import {logOut, setCredentials} from "./auth-slice";

const baseUrl = import.meta.env.VITE_APP_API_URL;

// Create a new base query that wraps fetchBaseQuery
const baseQuery = fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, {getState}) => {
        // Get the token from the auth state
        const token = (getState() as RootState).auth.token;
        if (token) {
            headers.set("authorization", `Bearer ${token}`);
        }
        return headers;
    },
});

// Lock to prevent multiple logout dispatches
let isLoggingOut = false;

// base query function that includes logout logic on 401
const baseQueryWithAuth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
    args,
    api,
    extraOptions,
) => {
    const result = await baseQuery(args, api, extraOptions);

    // Check if the error is a 401 and the request was NOT to the login endpoint
    const isLoginAttempt = typeof args === "object" && "url" in args && args.url.includes("/login");

    // If a 401 Unauthorised error occurs, dispatch the logOut action
    if (result.error && result.error.status === 401 && !isLoginAttempt) {
        if (!isLoggingOut) {
            isLoggingOut = true; // Set the lock
            console.warn("Session expired, initiating logout.");

            // Dispatch the logOut action to clear credentials
            api.dispatch(logOut());

            // Reset the entire API state to clear cache and stop other queries
            api.dispatch(apiSlice.util.resetApiState());

            // Redirect to login page
            window.location.href = "/login";
        }
        // Preventing other queries from failing and causing unhandled exceptions
        // while the logout is in progress, return a promise that never resolves.
        // The page reload to "/login" will render this moot.
        return new Promise(() => {
        });
    }

    return result;
};

// Define your API slice
export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: baseQueryWithAuth,
    // Define tags for caching and automatic refetching
    tagTypes: [
        "Order",
        "MenuItem",
        "User",
        "Summary",
        "TopSells",
        "InventorySummary",
        "SalesTrend",
        "Store",
        "ActivityLog",
    ],
    endpoints: (builder) => ({
        // Health Check Endpoint
        healthCheck: builder.query<{ status: string }, void>({
            query: () => "/health",
        }),

        // Auth Endpoints
        login: builder.mutation({
            query: (credentials) => ({
                url: "/auth/login",
                method: "POST",
                body: credentials,
            }),
            async onQueryStarted(_args, {dispatch, queryFulfilled}) {
                try {
                    const {data} = await queryFulfilled;

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
                url: "/auth/logout",
                method: "POST",
            }),
            async onQueryStarted(_args, {dispatch, queryFulfilled}) {
                try {
                    await queryFulfilled;
                    // Dispatch the logOut action to clear credentials and localStorage
                    dispatch(logOut());
                    // Clear the RTK Query cache
                    dispatch(apiSlice.util.resetApiState());

                    // Redirect to login page
                    window.location.href = "/login";

                    // reload
                    window.location.reload();
                } catch (error) {
                    console.error("Logout failed:", error);
                    // Even if the server call fails, force a local logout
                    dispatch(logOut());
                    dispatch(apiSlice.util.resetApiState());

                    // Redirect to login page
                    window.location.href = "/login";

                    // reload
                    window.location.reload();
                }
            },
        }),

        registerManagerAndStore: builder.mutation<
            { user: RegisterUserType; token: string },
            Omit<RegisterUserType, "confirmPassword">
        >({
            query: (body) => ({
                url: "/auth/register",
                method: "POST",
                body,
            }),
        }),

        updatePassword: builder.mutation<{ message: string }, { oldPassword: string; newPassword: string }>({
            query: (body) => ({
                url: "/users/update-password",
                method: "PATCH",
                body,
            }),
        }),

        getActivities: builder.query<ActivityLogResponse, { limit?: number; offset?: number }>({
            query: ({limit = 20, offset = 0} = {}) => ({
                url: "/activities",
                params: {limit, offset},
            }),
            providesTags: ["ActivityLog"],
        }),

        // Dashboard Endpoint
        getSalesSummary: builder.query<SaleSummarySchemaType, TimePeriod>({
            query: (timePeriod = "today") => ({
                url: "/dashboard/sales-summary",
                params: {timePeriod},
            }),
            providesTags: ["Summary"],
        }),

        getTopSells: builder.query<TopSellsItemType[], TopSellsSchemaType>({
            query: ({timePeriod = "today", limit = "5", orderBy = "quantity"}) => ({
                url: "/dashboard/top-sells",
                params: {timePeriod, limit, orderBy},
            }),
            providesTags: ["TopSells"],
        }),

        getInventorySummary: builder.query<InventorySummaryType, void>({
            query: () => "/dashboard/inventory-summary",
            providesTags: ["InventorySummary"],
        }),

        getSalesTrend: builder.query<SalesTrendType[], TimePeriod | void>({
            query: (timePeriod = "week") => ({
                url: "/dashboard/sales-trend",
                params: {timePeriod},
            }),
            providesTags: ["SalesTrend"],
        }),

        // Order Endpoints
        getOrdersByPeriod: builder.query<OrdersByPeriodResponse, TimePeriod>({
            query: (timePeriod = "today") => ({
                url: "/orders/by-period",
                params: {timePeriod},
            }),
            providesTags: ["Order"],
        }),
        getOrderById: builder.query<SingleOrderType, string>({
            query: (id) => `/orders/${id}`,
            providesTags: (_result, _error, id) => [{type: "Order", id}],
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
            query: ({id, ...patch}) => ({
                url: `/menu-items/${id}`,
                method: "PATCH",
                body: patch,
            }),
            invalidatesTags: (_result, _error, {id}) => [{type: "MenuItem", id}, "MenuItem"],
        }),

        // User Management Endpoints
        getAllUsers: builder.query<UserType[], void>({
            query: () => "/users",
            providesTags: (result) =>
                result
                    ? [...result.map(({id}) => ({type: "User" as const, id})), {type: "User", id: "LIST"}]
                    : [{type: "User", id: "LIST"}],
        }),
        createUser: builder.mutation<UserType, CreateUserType>({
            query: (newUser) => ({
                url: "/users/create",
                method: "POST",
                body: newUser,
            }),
            invalidatesTags: [{type: "User", id: "LIST"}],
        }),
        getUserById: builder.query<UserType, string>({
            query: (id) => `/users/${id}`,
            providesTags: (_result, _error, id) => [{type: "User", id}],
        }),
        deleteUser: builder.mutation<{ message: string }, string>({
            query: (id) => ({
                url: `/users/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: [{type: "User", id: "LIST"}],
        }),
        updateUser: builder.mutation<UserType, Partial<UserType> & Pick<UserType, "id">>({
            query: ({id, ...patch}) => ({
                url: `/users/${id}`,
                method: "PATCH",
                body: patch,
            }),
            invalidatesTags: (_result, _error, {id}) => [
                {type: "User", id},
                {type: "User", id: "LIST"},
            ],
        }),

        // Store Endpoints
        getAllStores: builder.query<StoreType[], void>({
            query: () => "/stores",
            providesTags: (result) =>
                result
                    ? [...result.map(({id}) => ({type: "Store" as const, id})), {type: "Store", id: "LIST"}]
                    : [{type: "Store", id: "LIST"}],
        }),
        getStoreById: builder.query<StoreType, string>({
            query: (id) => `/stores/${id}`,
            providesTags: (_result, _error, id) => [{type: "Store", id}],
        }),
        createStore: builder.mutation<StoreType, CreateStoreType>({
            query: (newStore) => ({
                url: "/stores",
                method: "POST",
                body: newStore,
            }),
            invalidatesTags: [{type: "Store", id: "LIST"}],
        }),
        updateStore: builder.mutation<StoreType, Partial<StoreType> & Pick<StoreType, "id">>({
            query: ({id, ...patch}) => ({
                url: `/stores/${id}`,
                method: "PATCH",
                body: patch,
            }),
            invalidatesTags: (_result, _error, {id}) => [
                {type: "Store", id},
                {type: "Store", id: "LIST"},
            ],
        }),
        deleteStore: builder.mutation<{ message: string }, string>({
            query: (id) => ({
                url: `/stores/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: [{type: "Store", id: "LIST"}],
        }),
    }),
});

// Export auto-generated hooks for use in your components
export const {
    useHealthCheckQuery,
    // auth hooks
    useLoginMutation,
    useLogoutMutation,
    useRegisterManagerAndStoreMutation,
    // order hooks
    useGetOrdersByPeriodQuery,
    useGetOrderByIdQuery,
    useCreateOrderMutation,
    // menu item hooks
    useGetMenuItemsQuery,
    useCreateMenuItemMutation,
    useDeleteMenuItemMutation,
    useUpdateMenuItemMutation,
    // Dashboard Hooks
    useGetSalesSummaryQuery,
    useGetTopSellsQuery,
    useGetInventorySummaryQuery,
    useGetSalesTrendQuery,
    // User Management Hooks
    useGetAllUsersQuery,
    useGetUserByIdQuery,
    useDeleteUserMutation,
    useCreateUserMutation,
    useUpdateUserMutation,
    useUpdatePasswordMutation,
    // Store Management Hooks
    useGetAllStoresQuery,
    useGetStoreByIdQuery,
    useCreateStoreMutation,
    useUpdateStoreMutation,
    useDeleteStoreMutation,

    // activity log hooks
    useGetActivitiesQuery,
} = apiSlice;
