import { Box, Grid, Paper, Skeleton, useTheme } from "@mui/material";

const ViewStoreLoading = () => {
    const theme = useTheme();
    return (
        <Box>
            {/* Header Skeleton */}
            <Skeleton variant="text" width={150} height={32} sx={{ mb: 2 }} />
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Skeleton variant="text" width={300} height={48} />
                <Skeleton variant="rectangular" width={80} height={36} />
            </Box>

            {/* Details Skeleton */}
            <Paper
                elevation={0}
                sx={{
                    p: { xs: 2, md: 4 },
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: theme.borderRadius.medium,
                }}
            >
                <Grid container spacing={3}>
                    {Array.from(new Array(4)).map((_, index) => (
                        <Grid size={{ xs: 12, sm: 6 }} key={index}>
                            <Skeleton variant="text" width="40%" />
                            <Skeleton variant="text" width="70%" height={28} />
                        </Grid>
                    ))}
                </Grid>
            </Paper>
        </Box>
    );
};

export default ViewStoreLoading;
