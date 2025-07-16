import { configureStore } from "@reduxjs/toolkit";

// import { apiSlice } from "./app/slice";
// import authReducer from "./app/slice/auth-slice";

import menuItem from "./app/menu-items";
import orders from "./app/orders";

export const store = configureStore({
    reducer: {
        menuItem,
        orders,
        // [apiSlice.reducerPath]: apiSlice.reducer,
        // auth: authReducer,
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
    // middleware: (getDefaultMiddleware) =>
    //     getDefaultMiddleware({
    //         serializableCheck: false,
    //     }).concat(apiSlice.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
