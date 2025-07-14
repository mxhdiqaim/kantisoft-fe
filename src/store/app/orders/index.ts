/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
    CreateOrderType,
    OrderPeriod,
    OrderType,
} from "@/types/order-types.ts";
import axiosInstance from "@/utils/axios-instance";
import { createAsyncThunk, createSlice, type Dispatch } from "@reduxjs/toolkit";

interface ReduxType {
    getState: any;
    dispatch: Dispatch<any>;
}

interface OrdersState {
    orders: OrderType[];
    order: OrderType | null;
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

export const fetchOrders = createAsyncThunk("orders/getAll", async () => {
    const response = await axiosInstance.get(`${ORDER_URL}/`);

    return response.data;
});

export const createOrders = createAsyncThunk(
    "orders/create",
    async (
        data: Omit<CreateOrderType, "amountReceived">,
        { dispatch }: ReduxType,
    ) => {
        console.log("data", data);
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

export const getOrder = createAsyncThunk(
    "orders/get",
    async (id: string, { dispatch }: ReduxType) => {
        const response = await axiosInstance.get(`/${ORDER_URL}/${id}`);

        dispatch(fetchOrders());
        return response.data;
    },
);

export const getOrderByPeriod = createAsyncThunk(
    "orders/get-by-period",
    async (period: OrderPeriod = "day", { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`${ORDER_URL}/by-period`, {
                params: { period },
            });
            // Assuming the backend returns an array of orders in response.data
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
            .addCase(getOrder.pending, (state) => {
                state.loading = true;
            })
            .addCase(getOrder.fulfilled, (state, action) => {
                state.order = action.payload.data;
                state.loading = false;
            })
            .addCase(getOrder.rejected, (state) => {
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

        builder
            .addCase(getOrderByPeriod.pending, (state) => {
                state.loading = true;
            })
            .addCase(getOrderByPeriod.fulfilled, (state, action) => {
                state.orders = action.payload; // Update the orders list with the fetched data
                state.loading = false;
            })
            .addCase(getOrderByPeriod.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default appOrdersSlice.reducer;
