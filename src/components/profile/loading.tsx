import { Box, Card, CardContent, Divider, Grid, Skeleton } from "@mui/material";

const ViewUserSkeleton = () => {
    return (
        <Box>
            <Skeleton variant="text" width="20%" height={48} sx={{ mb: 3 }} />
            <Grid container spacing={3}>
                {/* Left Column: Profile Card Skeleton */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card>
                        <CardContent sx={{ textAlign: "center", p: 3 }}>
                            <Skeleton variant="circular" width={120} height={120} sx={{ margin: "auto", mb: 2 }} />
                            <Skeleton variant="text" width="60%" height={32} sx={{ margin: "auto", mb: 1 }} />
                            <Skeleton variant="text" width="30%" height={28} sx={{ margin: "auto" }} />
                        </CardContent>
                        <Divider />
                        <Box sx={{ p: 2 }}>
                            <Skeleton variant="rectangular" height={42} sx={{ borderRadius: 1 }} />
                        </Box>
                    </Card>
                </Grid>

                {/* Right Column: Details Card Skeleton */}
                <Grid size={{ xs: 12, md: 8 }}>
                    <Card>
                        <CardContent sx={{ p: 3 }}>
                            <Skeleton variant="text" width="40%" height={32} />
                            <Divider sx={{ my: 2 }} />
                            <Grid container spacing={3}>
                                {[...Array(3)].map((_, index) => (
                                    <Grid size={{ xs: 12, sm: 6 }} key={index}>
                                        <Box display="flex" alignItems="center">
                                            <Skeleton variant="circular" width={24} height={24} sx={{ mr: 1.5 }} />
                                            <Box width="70%">
                                                <Skeleton variant="text" height={20} />
                                                <Skeleton variant="text" height={24} />
                                            </Box>
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ViewUserSkeleton;
