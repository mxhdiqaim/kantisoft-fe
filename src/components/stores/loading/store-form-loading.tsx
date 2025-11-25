import {Box, Grid, Paper, Skeleton, useTheme} from "@mui/material";

const StoreFormLoading = () => {
    const theme = useTheme();
    return (
        <Box>
            <Skeleton variant="text" width={100} height={36} sx={{mb: 2}}/>
            <Skeleton variant="text" width={250} height={48} sx={{mb: 3}}/>
            <Paper
                elevation={0}
                sx={{p: 4, border: `1px solid ${theme.palette.divider}`, borderRadius: theme.borderRadius.small}}
            >
                <Grid container spacing={3}>
                    <Grid size={12}>
                        <Skeleton variant="rectangular" height={56}/>
                    </Grid>
                    <Grid size={12}>
                        <Skeleton variant="rectangular" height={56}/>
                    </Grid>
                    <Grid size={{xs: 12, sm: 6}}>
                        <Skeleton variant="rectangular" height={56}/>
                    </Grid>
                    <Grid size={12}>
                        <Skeleton variant="rectangular" width={120} height={46}/>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

export default StoreFormLoading;