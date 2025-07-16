import { configureStore } from "@reduxjs/toolkit";

import menuItem from "./app/menu-items";
import orders from "./app/orders";

export const store = configureStore({
    reducer: {
        menuItem,
        orders,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
            caches: {
                orders: {
                    maxAge: 60 * 1000, // 1 minute
                },
            },
        }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
