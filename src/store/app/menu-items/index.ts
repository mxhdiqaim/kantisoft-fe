/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AddMenuItemType, MenuItemType } from "@/types/menu-item-type.ts";
import axiosInstance from "@/utils/axios-instance";
import { createAsyncThunk, createSlice, type Dispatch } from "@reduxjs/toolkit";

interface ReduxType {
    getState: any;
    dispatch: Dispatch<any>;
}

interface MenuItemsState {
    menuItems: MenuItemType[];
    menuItem: MenuItemType | null;
    loading: boolean;
    error?: any;
}

const initialState: MenuItemsState = {
    menuItems: [],
    menuItem: null,
    loading: false,
    error: null,
};

const MENU_ITEM_URL = "/menu-items" as const;

export const fetchMenuItems = createAsyncThunk(
    "menu-items/getAll",
    async () => {
        const response = await axiosInstance.get(`${MENU_ITEM_URL}/`);

        return response.data;
    },
);

export const createMenuItems = createAsyncThunk(
    "menu-items/create",
    async (data: AddMenuItemType, { dispatch }: ReduxType) => {
        try {
            const response = await axiosInstance.post(
                `${MENU_ITEM_URL}/create`,
                data,
            );

            dispatch(fetchMenuItems());
            return response.data;
        } catch (error) {
            console.log("error", error);
        }
    },
);

export const getMenuItems = createAsyncThunk(
    "menu-items/get",
    async (id: string, { dispatch }: ReduxType) => {
        const response = await axiosInstance.get(`/${MENU_ITEM_URL}/${id}`);

        dispatch(fetchMenuItems());
        return response.data;
    },
);

export const appMenuItemsSlice = createSlice({
    name: "appMenuItems",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMenuItems.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchMenuItems.fulfilled, (state, action) => {
                state.menuItems = action.payload;
                state.loading = false;
            })
            .addCase(fetchMenuItems.rejected, (state) => {
                state.loading = false;
            });

        builder
            .addCase(getMenuItems.pending, (state) => {
                state.loading = true;
            })
            .addCase(getMenuItems.fulfilled, (state, action) => {
                state.menuItem = action.payload.data;
                state.loading = false;
            })
            .addCase(getMenuItems.rejected, (state) => {
                state.loading = false;
                // state.article = null;
            });
        builder
            .addCase(createMenuItems.pending, (state) => {
                state.loading = true;
            })
            .addCase(createMenuItems.fulfilled, (state, action) => {
                state.menuItem = action.payload;
                state.loading = false;
            })
            .addCase(createMenuItems.rejected, (state) => {
                state.loading = false;
            });
    },
});

export default appMenuItemsSlice.reducer;
