import SummaryCard from "@/components/dashboard/summary-card";
import { useGetSalesSummaryQuery } from "@/store/slice";
import { salesFilterSchema } from "@/types/dashboard-types";
import type { Period } from "@/types/order-types.ts";
import { getTitle } from "@/utils";
import { relativeTime } from "@/utils/get-relative-time.ts";
import { yupResolver } from "@hookform/resolvers/yup";
import { AttachMoney, PointOfSale, ShoppingCart } from "@mui/icons-material";
import {
    Box,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Skeleton,
    Typography,
    useTheme,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";

const Index = () => {
    const theme = useTheme();
    const { control, watch } = useForm<{ period: Period }>({
        mode: "onChange",
        resolver: yupResolver(salesFilterSchema),
        defaultValues: {
            period: "today",
        },
    });
    const period = watch("period");
    const { data: salesSummary, isLoading, isError, fulfilledTimeStamp } = useGetSalesSummaryQuery(period);

    const summaryCards = useMemo(() => {
        if (!salesSummary) return [];

        const { totalRevenue, totalOrders, avgOrderValue } = salesSummary;

        return [
            {
                title: "Total Revenue",
                value: totalRevenue,
                icon: <AttachMoney />,
                color: theme.palette.success.main,
                prefix: "₦",
            },
            {
                title: "Total Orders",
                value: totalOrders,
                icon: <ShoppingCart />,
                color: theme.palette.info.main,
            },
            {
                title: "Avg. Order Value",
                value: avgOrderValue,
                icon: <PointOfSale />,
                color: theme.palette.warning.main,
                prefix: "₦",
            },
        ];
    }, [salesSummary, theme]);

    const [lastFetched, setLastFetched] = useState<Date | null>(null);

    useEffect(() => {
        if (fulfilledTimeStamp) {
            setLastFetched(new Date(fulfilledTimeStamp));
        }
    }, [fulfilledTimeStamp]);

    if (isLoading) {
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
                    {Array.from(new Array(4)).map((_, index) => (
                        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                            <Skeleton variant="rectangular" height={118} />
                        </Grid>
                    ))}
                </Grid>

                <Paper
                    elevation={-1}
                    sx={{
                        border: `1px solid ${theme.palette.grey[100]}`,
                        width: "100%",
                    }}
                >
                    <Skeleton variant="rectangular" height={500} />
                </Paper>
            </Box>
        );
    }

    if (isError) {
        return (
            <Typography color="error" align="center" sx={{ mt: 4 }}>
                Failed to load sales history. Please try again later.
            </Typography>
        );
    }

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
                <Typography variant="h4">Dashboard</Typography>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "right",
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Typography variant="h4" component="h1">
                            {getTitle(period)}&apos;s Sales Summary
                        </Typography>
                        <Controller
                            name="period"
                            control={control}
                            render={({ field }) => (
                                <FormControl sx={{ minWidth: 120 }} size="small">
                                    <InputLabel id="period-select-label">Period</InputLabel>
                                    <Select {...field} labelId="period-select-label" label="Period">
                                        <MenuItem value={"today"}>Today</MenuItem>
                                        <MenuItem value={"week"}>This Week</MenuItem>
                                        <MenuItem value={"month"}>This Month</MenuItem>
                                        <MenuItem value={"all-time"}>All Time</MenuItem>
                                    </Select>
                                </FormControl>
                            )}
                        />
                    </Box>
                </Box>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Typography
                    variant="h6"
                    component="span"
                    color="text.secondary"
                    align="right"
                    mb={1}
                    sx={{
                        fontWeight: 400,
                        textAlign: "right",
                    }}
                >
                    {lastFetched ? `Last updated ${relativeTime(new Date(), lastFetched)}` : "Fetching data..."}
                </Typography>
            </Box>
            <Grid container spacing={3} mb={3}>
                {summaryCards.map((card, index) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={card.title}>
                        <SummaryCard
                            index={index}
                            title={card.title}
                            value={card.value}
                            icon={card.icon}
                            color={card.color}
                            prefix={card.prefix}
                        />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default Index;
