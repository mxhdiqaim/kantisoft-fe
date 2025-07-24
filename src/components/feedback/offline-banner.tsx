import { useOnlineStatus } from "@/hooks/use-online-status";
import { CloudOff } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";

const OfflineBanner = () => {
    const isOnline = useOnlineStatus();

    if (isOnline) {
        return null;
    }

    return (
        <Box
            sx={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                py: 1.5,
                bgcolor: "warning.main",
                color: "white",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: (theme) => theme.zIndex.modal + 1,
                boxShadow: 3,
            }}
        >
            <CloudOff sx={{ mr: 1 }} />
            <Typography variant="body2" fontWeight="medium">
                You are currently offline. Checkout your internet connection and
                try again.
            </Typography>
        </Box>
    );
};

export default OfflineBanner;
