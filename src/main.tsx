import { store } from "@/store";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import "./index.css";
import { SnackbarProvider } from "notistack";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <Provider store={store}>
            <SnackbarProvider
                maxSnack={3}
                autoHideDuration={3000}
                variant="default"
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
            >
                <App />
            </SnackbarProvider>
        </Provider>
    </StrictMode>,
);
