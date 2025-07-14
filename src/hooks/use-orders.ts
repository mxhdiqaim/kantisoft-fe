import type { AppDispatch, RootState } from "@/store";
import { getOrderByPeriod } from "@/store/app/orders";
import type { OrderPeriod, OrderType } from "@/types/order-types.ts";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useNotifier from "./useNotifier";

export const useOrders = (period: OrderPeriod) => {
    const notify = useNotifier();
    const dispatch = useDispatch<AppDispatch>();
    const [orders, setOrders] = useState<OrderType[]>([]);

    const {
        orders: storeOrders,
        loading,
        error,
    } = useSelector((state: RootState) => state.orders);

    useEffect(() => {
        dispatch(getOrderByPeriod(period));
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
        if (!loading && !error) {
            notify("Orders fetched successfully", "success");
        }
    }, [error, notify]);

    return { orders, loading, error };
};
