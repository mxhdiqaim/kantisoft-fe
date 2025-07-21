import { Box, Grid, Skeleton, useTheme } from "@mui/material";

const DashboardLoading = () => {
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

            <Grid container spacing={3} mb={3}>
                {Array.from(new Array(3)).map((_, index) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                        <Skeleton variant="rectangular" height={118} sx={{ borderRadius: theme.borderRadius.medium }} />
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={3}>
                <Grid size={{ xs: 12, lg: 8 }}>
                    <Skeleton variant="rectangular" height={400} sx={{ borderRadius: theme.borderRadius.medium }} />
                </Grid>
                <Grid size={{ xs: 12, lg: 4 }}>
                    <Skeleton variant="rectangular" height={400} sx={{ borderRadius: theme.borderRadius.medium }} />
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <Skeleton variant="rectangular" height={120} sx={{ borderRadius: theme.borderRadius.medium }} />
                </Grid>
            </Grid>
        </Box>
    );
};

export default DashboardLoading;
