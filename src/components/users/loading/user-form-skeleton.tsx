import { Box, Grid, Paper, Skeleton, useTheme } from "@mui/material";

const UserFormSkeleton = () => {
    const theme = useTheme();
    return (
        <Box>
            {/* Skeleton for the "Back" button */}
            <Skeleton variant="text" width={120} height={40} sx={{ mb: 2 }} />
            {/* Skeleton for the main title */}
            <Skeleton variant="text" width="40%" height={60} sx={{ mb: 3 }} />

            <Paper
                elevation={0}
                sx={{
                    p: { xs: 2, md: 4 },
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: theme.borderRadius.small,
                }}
            >
                <Grid container spacing={3}>
                    {/* Create skeletons for the 7 form fields */}
                    {[...Array(7)].map((_, index) => (
                        <Grid size={{ xs: 12, sm: 6 }} key={index}>
                            <Skeleton variant="rectangular" height={56} animation="wave" />
                        </Grid>
                    ))}

                    {/* Skeleton for the submit button */}
                    <Grid size={{ xs: 12 }}>
                        <Skeleton variant="rectangular" width={120} height={48} animation="wave" />
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

export default UserFormSkeleton;
