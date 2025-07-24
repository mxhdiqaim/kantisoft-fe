import { Box, Button, Typography, useTheme } from "@mui/material";
import { SentimentVeryDissatisfied } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const NotFoundScreen = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                minHeight: "80vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: theme.palette.background.default,
                px: 2,
            }}
        >
            <SentimentVeryDissatisfied sx={{ fontSize: 80, color: theme.palette.error.main, mb: 2 }} />
            <Typography variant="h1" color="error" fontWeight={700} gutterBottom>
                404
            </Typography>
            <Typography variant="h5" sx={{ mb: 2 }}>
                Oops! Page not found.
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 4 }}>
                The page you are looking for does not exist or has been moved.
            </Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/dashboard")}
                sx={{ px: 4, py: 1.5, fontWeight: 600 }}
            >
                Go to Dashboard
            </Button>
        </Box>
    );
};

export default NotFoundScreen;
