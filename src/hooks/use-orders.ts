import type { AppDispatch, RootState } from "@/store";
import { getOrdersByPeriod, getOrderById } from "@/store/app/orders";
import type {
    OrderPeriod,
    OrderType,
    SingleOrderType,
} from "@/types/order-types.ts";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useNotifier from "./useNotifier";

export const useGetOrder = (id: string) => {
    if (!id || id === undefined || id === null) {
        throw new Error("Order ID is required");
    }
    const notify = useNotifier();
    const dispatch = useDispatch<AppDispatch>();
    const [order, setOrder] = useState<SingleOrderType | null>(null);

    const {
        order: storeOrder,
        loading,
        error,
    } = useSelector((state: RootState) => state.orders);

    useEffect(() => {
        dispatch(getOrderById(id));
    }, [dispatch, id]);

    useEffect(() => {
        if (storeOrder) {
            setOrder({ ...storeOrder });
        }
    }, [storeOrder]);

    useEffect(() => {
        if (error) {
            notify(
                typeof error === "string" ? error : "An unknown error occurred",
                "error",
            );
        }
        if (!loading && !error) {
            notify("Order fetched successfully", "success");
        }
    }, [error, loading]);

    return { order, loading, error };
};

export const useGetOrderByPeriod = (period: OrderPeriod) => {
    const notify = useNotifier();
    const dispatch = useDispatch<AppDispatch>();
    const [orders, setOrders] = useState<OrderType[]>([]);

    const {
        orders: storeOrders,
        loading,
        error,
    } = useSelector((state: RootState) => state.orders);

    useEffect(() => {
        dispatch(getOrdersByPeriod(period));
    }, [dispatch, period]);

    useEffect(() => {
        if (storeOrders) {
            setOrders([...storeOrders]);
        }
    }, [storeOrders]);

    useEffect(() => {
        if (error) {
            notify(
                typeof error === "string" ? error : "An unknown error occurred",
                "error",
            );
        }
    }, [error, loading]);

    return { orders, loading, error };
};
