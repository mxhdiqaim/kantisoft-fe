import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Translation files are imported directly, which is perfect for this setup.
import restaurantTranslations from "@/locales/restaurant.json";
import pharmacyTranslations from "@/locales/pharmacy.json";
import supermarketTranslations from "@/locales/supermarket.json";

export type BusinessType = "restaurant" | "pharmacy" | "supermarket";

i18n
    // Passes i18n down to react-i18next
    .use(initReactI18next)
    .init({
        // Resources are defined locally, not fetched from a backend.
        resources: {
            restaurant: {
                translation: restaurantTranslations,
            },
            pharmacy: {
                translation: pharmacyTranslations,
            },
            supermarket: {
                translation: supermarketTranslations,
            },
        },

        // The default language is set dynamically in App.tsx based on the active store.
        // We remove the hardcoded `lng` property from here.

        // Fallback language if the active store's type is not found.
        fallbackLng: "restaurant",

        // Preload all business types to ensure they are available for quick switching.
        preload: ["restaurant", "pharmacy", "supermarket"],

        // Set to true to see logs in the console, useful for debugging.
        debug: process.env.NODE_ENV === "development",

        // We use nested keys (e.g., "nav.orderTracking"), so we don't set keySeparator to false.

        interpolation: {
            escapeValue: false, // React already protects from XSS.
        },

        react: {
            // It's recommended to use Suspense for handling loading states.
            // Set to false if you prefer to manage loading manually with `i18n.isInitialized`.
            useSuspense: true,
        },
    });

export default i18n;

export type { i18n as I18nType } from "i18next";
