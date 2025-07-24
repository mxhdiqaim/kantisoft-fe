import CustomCard from "@/components/customs/custom-card";
import BlankLayout from "@/components/layout/blank-layout";
import { Box, CardContent, Button, Typography, useTheme, styled } from "@mui/material";
import { useNavigate } from "react-router-dom";

const BoxWrapper = styled(Box)(({ theme }) => ({
    [theme.breakpoints.down("md")]: {
        width: "90vw",
    },
}));

const ServerDown = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    return (
        <BlankLayout>
            <Box
                sx={{
                    height: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <CustomCard
                    sx={{
                        width: "100vw",
                        height: "100vh",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: theme.borderRadius.small,
                        textAlign: "center",
                    }}
                >
                    <CardContent>
                        <BoxWrapper mb={2}>
                            <Typography
                                variant="h1"
                                sx={{
                                    color: theme.palette.error.main,
                                    fontSize: "4rem !important",
                                    fontWeight: 700,
                                }}
                            >
                                503
                            </Typography>
                        </BoxWrapper>
                        <img
                            alt="error-illustration"
                            width={400}
                            height={400}
                            style={{
                                marginBottom: theme.spacing(4),
                                marginTop: theme.spacing(2),
                            }}
                            src="/images/server-down.svg"
                        />
                        <Typography
                            mb={1}
                            variant="h5"
                            sx={{
                                fontSize: "1.5rem !important",
                                color: theme.palette.text.primary,
                                fontWeight: 600,
                            }}
                        >
                            Service not available, please try again.
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                color: theme.palette.text.secondary,
                                mb: 3,
                            }}
                        >
                            The server is temporarily unavailable. Please check your connection or try again later.
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => navigate("/")}
                            sx={{
                                px: 5.5,
                                borderRadius: theme.borderRadius.medium,
                                boxShadow: theme.customShadows.button,
                                fontWeight: 600,
                            }}
                        >
                            Go Home
                        </Button>
                    </CardContent>
                </CustomCard>
            </Box>
        </BlankLayout>
    );
};

export default ServerDown;
