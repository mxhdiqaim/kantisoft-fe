import {store} from "@/store";
import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import {Provider} from "react-redux";
import App from "./App";
import "./index.css";
import {SnackbarProvider} from "notistack";
import * as Sentry from "@sentry/react";
import {getEnvVariable} from "@/utils";

const VITE_APP_SENTRY_DSN = getEnvVariable("VITE_APP_SENTRY_DSN");

Sentry.init({
    dsn: VITE_APP_SENTRY_DSN,
    // tracesSampleRate: 1.0,
    sendDefaultPii: true,
    integrations: [
        Sentry.replayIntegration()
    ],
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0
});

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <Provider store={store}>
            <SnackbarProvider
                maxSnack={3}
                autoHideDuration={3000}
                variant="default"
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "center",
                }}
            >
                <App/>
            </SnackbarProvider>
        </Provider>
    </StrictMode>,
);
