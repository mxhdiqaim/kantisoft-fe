import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Translation files
import restaurantTranslations from "@/locales/restaurant.json";
import inventoryTranslations from "@/locales/inventory.json";

export type BusinessType = "restaurant" | "inventory";

// This would ideally come from user settings or an API call
const businessType: BusinessType = "restaurant"; // or "inventory"

i18n.use(initReactI18next) // passes i18n down to react-i18next
    .init({
        resources: {
            restaurant: {
                translation: restaurantTranslations,
            },
            inventory: {
                translation: inventoryTranslations,
            },
        },
        lng: businessType, // Set the default "language"
        fallbackLng: "restaurant", // Fallback if the selected type is not found

        interpolation: {
            escapeValue: false, // React already safes from xss
        },
    });

export default i18n;

export type { i18n as I18nType } from "i18next";
