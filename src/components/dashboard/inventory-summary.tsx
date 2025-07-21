import { useGetInventorySummaryQuery } from "@/store/slice";
import { WarningAmber, NoFood } from "@mui/icons-material";
import { Avatar, Box, Grid, Skeleton, Typography, useTheme } from "@mui/material";
import CountUp from "react-countup";
import CustomCard from "../customs/custom-card";

const InventorySummary = () => {
    const theme = useTheme();
    const { data: summary, isLoading } = useGetInventorySummaryQuery();

    if (isLoading) {
        return (
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Skeleton variant="rectangular" height={120} sx={{ borderRadius: theme.borderRadius.small }} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Skeleton variant="rectangular" height={120} sx={{ borderRadius: theme.borderRadius.small }} />
                </Grid>
            </Grid>
        );
    }

    const outOfStock = summary?.totalOutOfStockItems ?? 0;
    const lowStock = summary?.totalLowStockItems ?? 0;

    return (
        <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
                <CustomCard sx={{ boxShadow: theme.customShadows.card, borderRadius: theme.borderRadius.small }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar
                            sx={{
                                bgcolor: theme.palette.error.light,
                                color: theme.palette.error.dark,
                                width: 56,
                                height: 56,
                                mr: 2,
                            }}
                        >
                            <NoFood />
                        </Avatar>
                        <Box>
                            <Typography variant="h4" component="div" fontWeight="bold">
                                <CountUp end={outOfStock} duration={2} />
                            </Typography>
                            <Typography color="text.secondary">Out of Stock</Typography>
                        </Box>
                    </Box>
                </CustomCard>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
                <CustomCard sx={{ boxShadow: theme.customShadows.card, borderRadius: theme.borderRadius.small }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar
                            sx={{
                                bgcolor: theme.palette.warning.light,
                                color: theme.palette.warning.dark,
                                width: 56,
                                height: 56,
                                mr: 2,
                            }}
                        >
                            <WarningAmber />
                        </Avatar>
                        <Box>
                            <Typography variant="h4" component="div" fontWeight="bold">
                                <CountUp end={lowStock} duration={2} />
                            </Typography>
                            <Typography color="text.secondary">Low Availability</Typography>
                        </Box>
                    </Box>
                </CustomCard>
            </Grid>
        </Grid>
    );
};

export default InventorySummary;
