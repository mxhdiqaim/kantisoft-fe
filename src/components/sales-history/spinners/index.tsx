import { Box, Paper, Skeleton, useTheme } from "@mui/material";

const SalesHistoryLoading = () => {
    const theme = useTheme();

    return (
        <Box sx={{ mx: "auto" }}>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1,
                }}
            >
                <Skeleton variant="text" width={210} height={40} />
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Skeleton variant="text" width={180} height={40} />
                    <Skeleton variant="rectangular" width={120} height={40} />
                </Box>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
                <Skeleton variant="text" width={150} height={24} />
            </Box>

            <Box sx={{ mb: 1 }}>
                <Skeleton variant="rectangular" height={118} sx={{ borderRadius: theme.borderRadius.small }} />
            </Box>

            <Paper
                elevation={0}
                sx={{
                    border: `1px solid ${theme.palette.grey[100]}`,
                    width: "100%",
                    borderRadius: theme.borderRadius.small,
                }}
            >
                <Skeleton variant="rectangular" height={500} sx={{ borderRadius: theme.borderRadius.small }} />
            </Paper>
        </Box>
    );
};

export default SalesHistoryLoading;
