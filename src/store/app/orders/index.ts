/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
    CreateOrderType,
    OrderPeriod,
    OrderType,
    SingleOrderType,
} from "@/types/order-types.ts";
import axiosInstance from "@/utils/axios-instance";
import { createAsyncThunk, createSlice, type Dispatch } from "@reduxjs/toolkit";

interface ReduxType {
    getState: any;
    dispatch: Dispatch<any>;
}

interface OrdersState {
    orders: OrderType[];
    order: SingleOrderType | null;
    loading: boolean;
    submitted: boolean;
    error?: any;
}

const initialState: OrdersState = {
    orders: [],
    order: null,
    loading: false,
    submitted: false,
    error: null,
};

const ORDER_URL = "/orders" as const;

export const fetchOrders = createAsyncThunk("orders/fetch-orders", async () => {
    const response = await axiosInstance.get(`${ORDER_URL}/`);

    return response.data;
});

export const createOrders = createAsyncThunk(
    "orders/create-orders",
    async (
        data: Omit<CreateOrderType, "amountReceived">,
        { dispatch }: ReduxType,
    ) => {
        try {
            const response = await axiosInstance.post(
                `${ORDER_URL}/create`,
                data,
            );

            dispatch(fetchOrders());
            return response.data;
        } catch (error) {
            console.log("error", error);
        }
    },
);

export const getOrderById = createAsyncThunk(
    "orders/get-order-by-id",
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`${ORDER_URL}/${id}`);

            return response.data;
        } catch (error: any) {
            console.log("error", error);
            return rejectWithValue(error.response?.data);
        }
    },
);

export const getOrdersByPeriod = createAsyncThunk(
    "orders/get-order-by-period",
    async (period: OrderPeriod = "day", { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`${ORDER_URL}/by-period`, {
                params: { period },
            });

            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data);
        }
    },
);

export const appOrdersSlice = createSlice({
    name: "appOrders",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrders.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.orders = action.payload;
                state.loading = false;
            })
            .addCase(fetchOrders.rejected, (state) => {
                state.loading = false;
            });
        builder
            .addCase(getOrdersByPeriod.pending, (state) => {
                state.loading = true;
            })
            .addCase(getOrdersByPeriod.fulfilled, (state, action) => {
                state.orders = action.payload;
                state.loading = false;
            })
            .addCase(getOrdersByPeriod.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        builder
            .addCase(getOrderById.pending, (state) => {
                state.loading = true;
            })
            .addCase(getOrderById.fulfilled, (state, action) => {
                state.order = action.payload;
                state.loading = false;
            })
            .addCase(getOrderById.rejected, (state) => {
                state.loading = false;
                // state.article = null;
            });
        builder
            .addCase(createOrders.pending, (state) => {
                state.submitted = true;
            })
            .addCase(createOrders.fulfilled, (state, action) => {
                state.order = action.payload;
                state.submitted = false;
            })
            .addCase(createOrders.rejected, (state) => {
                state.submitted = false;
            });
    },
});

export default appOrdersSlice.reducer;
