import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import type { AppRouteType } from "@/routes";

// fixes scroll behaviour on route change
export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export const resolveChildren = (item: AppRouteType) => {
  if (item?.children) return true;

  return false;
};
