import { Box, Grid, Paper, Skeleton, useTheme } from "@mui/material";

const MenuItemsPageSkeleton = () => {
    const theme = useTheme();

    return (
        <Box>
            {/* Header Skeleton */}
            <Grid container spacing={2} mb={2} alignItems="center">
                <Grid size={{ xs: 12, md: 6 }}>
                    {/* Title Skeleton */}
                    <Skeleton variant="text" width="40%" height={48} sx={{ mb: 1 }} />
                    {/* Subtitle Skeleton */}
                    <Skeleton variant="text" width="30%" height={24} />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Box display="flex" justifyContent="flex-end">
                        {/* "Add Item" Button Skeleton */}
                        <Skeleton
                            variant="rectangular"
                            width={120}
                            height={42}
                            sx={{ borderRadius: theme.shape.borderRadius }}
                        />
                    </Box>
                </Grid>
            </Grid>

            {/* Table Skeleton */}
            <Paper
                elevation={-1}
                sx={{
                    border: `1px solid ${theme.palette.divider}`,
                    p: 2,
                }}
            >
                {/* Table Header Skeleton */}
                <Skeleton variant="rectangular" height={56} sx={{ mb: 1 }} />
                {/* Table Body Skeletons (mimicking rows) */}
                {[...Array(8)].map((_, index) => (
                    <Skeleton key={index} variant="rectangular" height={52} sx={{ mb: 1 }} />
                ))}
            </Paper>
        </Box>
    );
};

export default MenuItemsPageSkeleton;
