import { Box, Button, CardContent, Typography, useTheme } from "@mui/material";
import { ErrorOutline, ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import CustomCard from "../customs/custom-card";

interface ApiErrorDisplayProps {
    statusCode?: number | string;
    message?: string;
}

const ApiErrorDisplay = ({ statusCode = "Error", message = "An unexpected error occurred." }: ApiErrorDisplayProps) => {
    const theme = useTheme();
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "80vh",
                p: 3,
                textAlign: "center",
            }}
        >
            <CustomCard
                sx={{
                    maxWidth: 500,
                    width: "100%",
                    p: 1,
                    boxShadow: theme.customShadows.card,
                    borderRadius: theme.borderRadius.small,
                    border: `1px solid ${theme.palette.error.light}`,
                }}
            >
                <CardContent>
                    <ErrorOutline
                        sx={{
                            fontSize: 80,
                            color: "error.main",
                            mb: 2,
                        }}
                    />
                    <Typography
                        variant="h1"
                        component="div"
                        sx={{
                            fontWeight: 700,
                            color: "error.dark",
                            lineHeight: 1.1,
                        }}
                    >
                        {statusCode}
                    </Typography>
                    <Typography variant="h5" sx={{ mt: 1, mb: 3 }}>
                        {message}
                    </Typography>
                    <Typography color="text.secondary">
                        Please try again, or click the button below to go back to the previous page.
                    </Typography>
                    <Button variant="contained" onClick={() => navigate(-1)} startIcon={<ArrowBack />} sx={{ mt: 4 }}>
                        Go Back
                    </Button>
                </CardContent>
            </CustomCard>
        </Box>
    );
};

export default ApiErrorDisplay;
