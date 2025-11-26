import {type StoreType} from "@/types/store-types";
import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type {RootState} from "..";

interface StoreState {
    activeStore: StoreType | null;
}

// Function to load state from localStorage
const loadState = (): StoreState => {
    try {
        const serializedState = localStorage.getItem("activeStoreState");
        if (serializedState === null) {
            return {activeStore: null};
        }
        const parsedState = JSON.parse(serializedState);
        return {activeStore: parsedState};
    } catch (err) {
        console.error("error:", err);
        // Return the default state if parsing fails or on any error
        return {activeStore: null};
    }
};

const initialState: StoreState = loadState();

const storeSlice = createSlice({
    name: "store",
    initialState,
    reducers: {
        setActiveStore: (state, action: PayloadAction<StoreType>) => {
            state.activeStore = action.payload;
            // Save the entire active store object to localStorage
            localStorage.setItem("activeStoreState", JSON.stringify(action.payload));
        },
        clearActiveStore: (state) => {
            state.activeStore = null;
            // Remove from localStorage
            localStorage.removeItem("activeStoreState");
        },
    },
});

export const {setActiveStore, clearActiveStore} = storeSlice.actions;

// Selector to get the active store from the state
export const selectActiveStore = (state: RootState) => state.store.activeStore;

export default storeSlice.reducer;
