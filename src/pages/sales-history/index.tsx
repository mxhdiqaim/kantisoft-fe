import SalesHistoryLoading from "@/components/sales-history/loading";
import SalesHistoryOverviewCard from "@/components/sales-history/sales-history-overview-card";
import SalesHistoryTable from "@/components/sales-history/sales-history-table";
import { useGetOrdersByPeriodQuery } from "@/store/slice";
import { salesFilterSchema } from "@/types/dashboard-types.ts";
import { type Period } from "@/types/order-types";
import { getTitle, ngnFormatter } from "@/utils";
import { relativeTime } from "@/utils/get-relative-time";
import { yupResolver } from "@hookform/resolvers/yup";
import { DinnerDiningOutlined, DomainVerificationOutlined, MonetizationOn, Person2Outlined } from "@mui/icons-material";
import { Box, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

const SalesHistory = () => {
    const theme = useTheme();
    const { control, watch } = useForm<{ period: Period }>({
        mode: "onChange",
        resolver: yupResolver(salesFilterSchema),
        defaultValues: {
            period: "today",
        },
    });

    const period = watch("period");

    const { data: ordersData, isLoading, isError, fulfilledTimeStamp } = useGetOrdersByPeriodQuery(period);

    const [lastFetched, setLastFetched] = useState<Date | null>(null);

    useEffect(() => {
        if (fulfilledTimeStamp) {
            setLastFetched(new Date(fulfilledTimeStamp));
        }
    }, [fulfilledTimeStamp]);

    if (isLoading) return <SalesHistoryLoading />;

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
                <Typography variant="h4">Sales Overview</Typography>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "right",
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Typography variant="h4" component="h1">
                            {getTitle(period)}&apos;s Sales
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
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <SalesHistoryOverviewCard
                        title="Total Sales Balance"
                        color="success"
                        icon={<MonetizationOn />}
                        value={ngnFormatter.format(Number(ordersData?.totalRevenue ?? 0))}
                        isLoading={isLoading}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <SalesHistoryOverviewCard
                        title="Most Ordered Item"
                        color="warning"
                        icon={<DinnerDiningOutlined />}
                        value={ordersData?.mostOrderedItem?.name || "N/A"}
                        subValue={ordersData?.mostOrderedItem ? `(${ordersData.mostOrderedItem.quantity} sold)` : ""}
                        isLoading={isLoading}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <SalesHistoryOverviewCard
                        title="Top Seller"
                        color="secondary"
                        icon={<Person2Outlined />}
                        value={ordersData?.topSeller?.name || "N/A"}
                        isLoading={isLoading}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <SalesHistoryOverviewCard
                        title="Total Orders"
                        color="info"
                        icon={<DomainVerificationOutlined />}
                        value={ordersData?.totalOrders ?? 0}
                        isLoading={isLoading}
                    />
                </Grid>
            </Grid>

            <Paper
                elevation={-1}
                sx={{
                    border: `1px solid ${theme.palette.grey[100]}`,
                    width: "100%",
                    "& .capitalize-cell": {
                        textTransform: "capitalize",
                    },
                }}
            >
                <SalesHistoryTable orders={ordersData?.orders ?? []} loading={isLoading} period={period} />
            </Paper>
        </Box>
    );
};

export default SalesHistory;
