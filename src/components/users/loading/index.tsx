import { Box, Paper, Skeleton, useTheme } from "@mui/material";

const UsersPageLoading = () => {
    const theme = useTheme();
    return (
        <Box>
            {/* Header Skeleton */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Skeleton variant="text" width={250} height={40} />
                <Skeleton variant="rectangular" width={120} height={36} sx={{ borderRadius: 1 }} />
            </Box>

            {/* Table Skeleton */}
            <Paper
                elevation={0}
                sx={{
                    border: `1px solid ${theme.palette.divider}`,
                    height: "70vh",
                    width: "100%",
                }}
            >
                <Skeleton variant="rectangular" width="100%" height="100%" />
            </Paper>
        </Box>
    );
};

export default UsersPageLoading;
