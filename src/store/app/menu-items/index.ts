/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AddMenuItemType, MenuItemType } from "@/types/menu-cart-type";
import axiosInstance from "@/utils/axios-instance";
import { createAsyncThunk, createSlice, type Dispatch } from "@reduxjs/toolkit";

interface ReduxType {
    getState: any;
    dispatch: Dispatch<any>;
}

interface ArticlesState {
    menuItems: MenuItemType[];
    menuItem: MenuItemType | null;
    loading: boolean;
    submitted: boolean;
    error?: any;
}

const initialState: ArticlesState = {
    menuItems: [],
    menuItem: null,
    loading: false,
    submitted: false,
    error: null,
};

const MENU_ITEM_URL = "/menu-items" as const;

export const fetchMenuItems = createAsyncThunk(
    "menu-items/getAll",
    async () => {
        const response = await axiosInstance.get(`${MENU_ITEM_URL}/`);

        console.log(response.data);

        return response.data;
    },
);

export const createMenuItems = createAsyncThunk(
    "menu-items/create",
    async (data: AddMenuItemType, { dispatch }: ReduxType) => {
        console.log("data", data);

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

// export const filterArticles = createAsyncThunk("articles/filter", async (filters: FilterParams) => {
//     const { search, category, publish_date } = filters;
//     const queryParams = new URLSearchParams();
//
//     // Append parameters only if they are defined
//     if (search) queryParams.append("search", search);
//     if (category && category !== "all") queryParams.append("category", category);
//     if (publish_date) queryParams.append("publish_date", publish_date);
//
//     if (category === "all") queryParams.delete("category");
//
//     const response = await axiosInstance.get(`/articles?${queryParams.toString()}`);
//
//     return response.data.data;
// });
//
// export const getCategories = createAsyncThunk("article/categories", async () => {
//     const response = await axiosInstance.get(`/util/articles/categories`);
//     return response.data;
// });
//
// export const updateArticle = createAsyncThunk(
//     "article/update",
//     async ({ id, data }: { id: number; data: any }, { dispatch }: ReduxType) => {
//         try {
//             const response = await axiosInstance.post(`/articles/${id}`, data, {
//                 headers: {
//                     "Content-Type": "multipart/form-data",
//                 },
//             });
//             await dispatch(fetchArticles());
//             return response.data;
//         } catch (err) {
//             console.log("err", err);
//         }
//     }
// );
//
// export const deleteArticle = createAsyncThunk("article/delete", async (id: number, { dispatch }: ReduxType) => {
//     const response = await axiosInstance.delete(`/articles/${id}`);
//
//     await dispatch(fetchArticles());
//     return response.data;
// });

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
                state.submitted = true;
            })
            .addCase(createMenuItems.fulfilled, (state, action) => {
                state.menuItem = action.payload;
                state.submitted = false;
            })
            .addCase(createMenuItems.rejected, (state) => {
                state.submitted = false;
            });
    },
});

export default appMenuItemsSlice.reducer;
