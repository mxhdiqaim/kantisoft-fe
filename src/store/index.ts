import { configureStore } from "@reduxjs/toolkit";

import menuItem from "./app/menu-items";

export const store = configureStore({
    reducer: {
        menuItem,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
