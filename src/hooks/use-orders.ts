import type { AppDispatch, RootState } from "@/store";
import { getOrdersByPeriod, getOrderById } from "@/store/app/orders";
import type { OrderPeriod } from "@/types/order-types.ts";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import useNotifier from "./useNotifier";

export const useGetOrder = (id: string) => {
    if (!id || id === undefined || id === null) {
        throw new Error("Order ID is required");
    }
    const notify = useNotifier();
    const dispatch = useDispatch<AppDispatch>();

    const { order, loading, error } = useSelector(
        (state: RootState) => state.orders,
    );

    useEffect(() => {
        // Fetch if the order in store is not the one we need
        if (!order || order.id !== id) {
            dispatch(getOrderById(id));
        }

        // Handle error notifications
        if (error) {
            notify(
                typeof error === "string" ? error : "An unknown error occurred",
                "error",
            );
        }
    }, [dispatch, id, order, error, notify]);

    return { order, loading, error };
};

export const useGetOrderByPeriod = (period: OrderPeriod) => {
    const notify = useNotifier();
    const dispatch = useDispatch<AppDispatch>();

    const { orders, loading, error } = useSelector(
        (state: RootState) => state.orders,
    );

    useEffect(() => {
        dispatch(getOrdersByPeriod(period));
    }, [dispatch, period]);

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
