import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Box, Typography } from "@mui/material";

const Logout = () => {
  const auth = useAuth();

  const { logout } = auth;

  useEffect(() => {
    logout();
  }, [logout]);

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography variant="h5">You are Logged out</Typography>
    </Box>
  );
};

export default Logout;
