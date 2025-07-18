import { useState, useEffect } from "react";

/**
 * A custom hook to track the browser's online/offline status.
 * @returns {boolean} `true` if the browser is online, `false` otherwise.
 */
export const useOnlineStatus = (): boolean => {
    const [isOnline, setIsOnline] = useState(() => navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    return isOnline;
};
