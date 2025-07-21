import { createContext, useState, useEffect, type FC, type ReactNode } from "react";

export interface FullscreenContextType {
    isFullscreen: boolean;
    toggleFullscreen: () => void;
}

export const FullscreenContext = createContext<FullscreenContextType | undefined>(undefined);

export const FullscreenProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [isFullscreen, setIsFullscreen] = useState(false);

    const handleFullscreenChange = () => {
        setIsFullscreen(!!document.fullscreenElement);
    };

    useEffect(() => {
        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () => {
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
        };
    }, []);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch((err) => {
                console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            });
        } else if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    };

    return (
        <FullscreenContext.Provider value={{ isFullscreen, toggleFullscreen }}>{children}</FullscreenContext.Provider>
    );
};
