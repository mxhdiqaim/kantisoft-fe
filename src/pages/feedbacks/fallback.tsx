import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Box, { type BoxProps } from "@mui/material/Box";
import CardContent from "@mui/material/CardContent";
import { useTheme } from "@mui/material/styles";
import type { FallbackProps } from "react-error-boundary";
import { useEffect, useRef } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import BlankLayout from "@/components/layout/blank-layout";
import CustomCard from "@/components/customs/custom-card";

const BoxWrapper = styled(Box)<BoxProps>(({ theme }) => ({
    [theme.breakpoints.down("md")]: {
        width: "90vw",
    },
}));

const Img = styled("img")(({ theme }) => ({
    marginTop: theme.spacing(6),
    marginBottom: theme.spacing(6),
    height: 320,
    [theme.breakpoints.down("lg")]: {
        height: 260,
        marginTop: theme.spacing(4),
        marginBottom: theme.spacing(4),
    },
    [theme.breakpoints.down("md")]: {
        height: 180,
    },
}));

const ErrorFallback = (props: FallbackProps) => {
    const { error, resetErrorBoundary } = props;
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const errorLocation = useRef(location.pathname);

    useEffect(() => {
        if (location.pathname !== errorLocation.current) {
            resetErrorBoundary();
        }
    }, [location.pathname, resetErrorBoundary]);

    useEffect(() => {
        console.error("Fallback Error occured:", error);
    }, [error]);

    return (
        <BlankLayout>
            <Box
                className="content-center"
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: theme.palette.background.default,
                }}
            >
                <CustomCard
                    sx={{
                        maxWidth: 480,
                        width: "100%",
                        mx: "auto",
                        boxShadow: theme.customShadows.card,
                        borderRadius: theme.borderRadius.small,
                        bgcolor: theme.palette.background.paper,
                        textAlign: "center",
                    }}
                >
                    <CardContent>
                        <BoxWrapper>
                            <Typography variant="h1" sx={{ mb: 1.5, color: theme.palette.error.main, fontWeight: 700 }}>
                                ⚠️
                            </Typography>
                            <Typography
                                variant="h5"
                                sx={{
                                    mb: 2,
                                    letterSpacing: "0.18px",
                                    fontSize: "1.5rem !important",
                                    color: theme.palette.text.primary,
                                    fontWeight: 600,
                                }}
                            >
                                Something went wrong
                            </Typography>
                            <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 2 }}>
                                We could not display the page. Check Console or Contact Support.
                            </Typography>
                        </BoxWrapper>
                        <Img alt="error-illustration" src="/images/under_maintenance.svg" />
                        <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mt: 2 }}>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={() => navigate(-1)}
                                sx={{
                                    px: 5.5,
                                    borderRadius: theme.borderRadius.medium,
                                    boxShadow: theme.customShadows.button,
                                    fontWeight: 600,
                                }}
                            >
                                Go back
                            </Button>
                            <Button
                                component={Link}
                                to="/"
                                variant="outlined"
                                color="primary"
                                sx={{
                                    px: 5.5,
                                    borderRadius: theme.borderRadius.medium,
                                    fontWeight: 600,
                                    borderColor: theme.palette.primary.main,
                                }}
                            >
                                Home
                            </Button>
                        </Box>
                    </CardContent>
                </CustomCard>
            </Box>
        </BlankLayout>
    );
};

export default ErrorFallback;
