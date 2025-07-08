// ** MUI Components
import React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Box, { type BoxProps } from "@mui/material/Box";

import type { FallbackProps } from "react-error-boundary";
import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import BlankLayout from "@/components/layout/blank-layout";

// ** Styled Components
const BoxWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  [theme.breakpoints.down("md")]: {
    width: "90vw",
  },
}));

const Img = styled("img")(({ theme }) => ({
  marginTop: theme.spacing(15),
  marginBottom: theme.spacing(15),
  [theme.breakpoints.down("lg")]: {
    height: 450,
    marginTop: theme.spacing(10),
    marginBottom: theme.spacing(10),
  },
  [theme.breakpoints.down("md")]: {
    height: 400,
  },
}));

const ErrorFallback = (props: FallbackProps) => {
  const { error, resetErrorBoundary } = props;

  const navigate = useNavigate();
  const location = useLocation();
  const errorLocation = useRef(location.pathname);

  // on page change reset error and render
  React.useEffect(() => {
    if (location.pathname !== errorLocation.current) {
      resetErrorBoundary();
    }
  }, [location.pathname, resetErrorBoundary]);

  useEffect(() => {
    console.error("Error occured:", error);
  }, [error]);

  return (
    <BlankLayout>
      <Box className="content-center">
        <Box
          sx={{
            p: 5,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <BoxWrapper>
            <Typography variant="h1" sx={{ mb: 2.5 }}>
              ⚠️
            </Typography>
            <Typography
              variant="h5"
              sx={{
                mb: 2.5,
                letterSpacing: "0.18px",
                fontSize: "1.5rem !important",
              }}
            >
              Something went wrong
            </Typography>
            <Typography variant="body2">
              We could not display the page. Check Console or Contact Support
            </Typography>
          </BoxWrapper>

          <Img alt="error-illustration" src="/images/under_maintenance.svg" />

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              onClick={() => navigate(-1)}
              sx={{ px: 5.5 }}
            >
              Go back
            </Button>

            <Button component={Link} to="/" variant="outlined" sx={{ px: 5.5 }}>
              Home
            </Button>
          </Box>
        </Box>
      </Box>
    </BlankLayout>
  );
};

export default ErrorFallback;
