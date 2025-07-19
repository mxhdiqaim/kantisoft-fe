import { useTranslation } from "react-i18next";
import { generatePath, useNavigate } from "react-router-dom";

/**
 * Custom hook for handling localized routing.
 * Provides functions to get a translated path or navigate to it.
 */
export const useLocalizedRoutes = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    /**
     * Gets the translated path for a given route key.
     * @param key The stable key of the route (e.g., "orderTracking").
     * @param params Optional route parameters (e.g., { id: '123' }).
     * @returns The localized URL path.
     */
    const getPath = (key: string, params?: Record<string, string | number>) => {
        const pathTemplate = t(`routes.${key}`);
        return params ? generatePath(pathTemplate, params) : pathTemplate;
    };

    /**
     * Navigates to a localized route.
     * @param key The stable key of the route.
     * @param params Optional route parameters.
     */
    const goTo = (key: string, params?: Record<string, string | number>) => {
        navigate(getPath(key, params));
    };

    return { getPath, goTo };
};
