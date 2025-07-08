import { type FC } from "react";
import type { ReactNode } from "react";
import { Outlet } from "react-router-dom";

// ** MUI Imports
import { styled } from "@mui/material/styles";
import Box, { type BoxProps } from "@mui/material/Box";

// Styled component for a Blank Layout component
const BlankLayoutWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  height: "100vh",

  // For V1 Blank layout pages
  "& .content-center": {
    display: "flex",
    minHeight: "100vh",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(5),
  },

  // For V2 Blank layout pages
  "& .content-right": {
    display: "flex",
    minHeight: "100vh",
    overflowX: "hidden",
    position: "relative",
  },
}));

type Props = {
  children: ReactNode;
};

const BlankLayout: FC<Props> = ({ children }) => {
  return (
    <BlankLayoutWrapper className="layout-wrapper">
      <Box
        className="app-content"
        sx={{ minHeight: "100vh", overflowX: "hidden", position: "relative" }}
      >
        {children ? children : <Outlet />}
      </Box>
    </BlankLayoutWrapper>
  );
};

export default BlankLayout;
