import {Box, Card, CardContent, Grid, Skeleton, Stack} from "@mui/material";

const ViewRawMaterialSkeleton = () => {
    return (
        <Box>
            <Skeleton variant="text" width={120} height={40} sx={{mb: 2}}/>
            <Skeleton variant="text" width={250} height={48} sx={{mb: 2}}/>
            <Grid container spacing={3}>
                <Grid size={{xs: 12, md: 4}}>
                    <Card>
                        <CardContent>
                            <Stack spacing={2} alignItems="center">
                                <Skeleton variant="rectangular" width="100%" height={120}/>
                                <Skeleton variant="text" width="80%" height={32}/>
                                <Skeleton variant="text" width="60%" height={24}/>
                                <Skeleton variant="rectangular" width={80} height={24} sx={{borderRadius: '16px'}}/>
                            </Stack>
                        </CardContent>
                        <Box sx={{p: 2, display: "flex", flexDirection: "column", gap: 1}}>
                            <Skeleton variant="rectangular" width="100%" height={40}/>
                            <Skeleton variant="rectangular" width="100%" height={40}/>
                        </Box>
                    </Card>
                </Grid>
                <Grid size={{xs: 12, md: 8}}>
                    <Card>
                        <CardContent sx={{p: 3}}>
                            <Skeleton variant="text" width="40%" height={32} sx={{mb: 2}}/>
                            <Grid container spacing={2}>
                                {[...Array(6)].map((_, index) => (
                                    <Grid key={index} size={{xs: 12, sm: 6}}>
                                        <Skeleton variant="text" width="50%" height={20}/>
                                        <Skeleton variant="text" width="70%" height={24}/>
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

export default ViewRawMaterialSkeleton;
