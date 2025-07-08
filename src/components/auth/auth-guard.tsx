import { type ReactNode, type ReactElement, useEffect } from "react";
import { createSearchParams, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

interface Props {
  children: ReactNode;
  fallback: ReactElement | null;
}

export const AuthGuard = (props: Props) => {
  const { children, fallback } = props;
  const auth = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.user && localStorage.getItem("userData")) {
      if (location.pathname !== "/") {
        navigate(
          {
            pathname: "/login",
            search: createSearchParams({
              returnUrl: location.pathname,
            }).toString(),
          },
          { replace: true },
        );
      } else {
        navigate("/login", { replace: true });
      }
    }
  }, []);

  if (auth.loading || !auth.user) {
    return fallback;
  }

  return <>{children}</>;
};
