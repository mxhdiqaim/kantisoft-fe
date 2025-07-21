import { configureStore } from "@reduxjs/toolkit";

import { apiSlice } from "./slice";
import authReducer from "./slice/auth-slice";
import storeReducer from "./slice/store-slice";

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authReducer,
        store: storeReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }).concat(apiSlice.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
