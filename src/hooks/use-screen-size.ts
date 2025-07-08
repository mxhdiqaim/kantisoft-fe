import { useTheme, useMediaQuery } from "@mui/material";

/**
 * Custom hook to determine the current screen size.
 * @returns {"mobile" | "tablet" | "laptop" | "desktop"} The current screen size.
 */
const useScreenSize = () => {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isLaptop = useMediaQuery(theme.breakpoints.between("md", "lg"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));

  if (isMobile) return "mobile";
  if (isTablet) return "tablet";
  if (isLaptop) return "laptop";
  if (isDesktop) return "desktop";

  return "unknown"; // Fallback for unexpected cases
};

export default useScreenSize;
