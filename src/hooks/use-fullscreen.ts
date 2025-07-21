import { FullscreenContext, type FullscreenContextType } from "@/context/fullscreen-context";
import { useContext } from "react";

export const useFullscreen = (): FullscreenContextType => {
    const context = useContext(FullscreenContext);
    if (!context) {
        throw new Error("useFullscreen must be used within a FullscreenProvider");
    }
    return context;
};
