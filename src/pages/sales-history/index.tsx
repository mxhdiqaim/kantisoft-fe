import { useEffect, useMemo, useState } from "react";
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
import { orderPeriodSchema, type OrderPeriod } from "@/types/order-types";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { relativeTime } from "@/utils/get-relative-time";
import SalesHistoryTable from "@/components/sales-history/sales-history-table";
import { ngnFormatter } from "@/utils";
import {
    MonetizationOn,
    DinnerDiningOutlined,
    Person2Outlined,
    DomainVerificationOutlined,
} from "@mui/icons-material";

import SalesHistoryOverviewCard from "@/components/sales-history/sales-history-overview-card";
import { useGetOrdersByPeriodQuery } from "@/store/slice";

// Create a schema for the form object
const salesFilterSchema = yup.object({
    period: orderPeriodSchema,
});

const SalesHistory = () => {
    const theme = useTheme();
    const { control, watch } = useForm<{ period: OrderPeriod }>({
        mode: "onChange",
        resolver: yupResolver(salesFilterSchema),
        defaultValues: {
            period: "day",
        },
    });

    const period = watch("period");

    const {
        data: orders,
        isLoading,
        isError,
        fulfilledTimeStamp,
    } = useGetOrdersByPeriodQuery(period);

    const [lastFetched, setLastFetched] = useState<Date | null>(null);

    const totalRevenue = useMemo(() => {
        return (orders ?? []).reduce(
            (acc, order) => acc + (order.totalAmount || 0),
            0,
        );
    }, [orders]);

    const getTitle = () => {
        switch (period) {
            case "day":
                return "Today";
            case "week":
                return "This Week";
            case "month":
                return "This Month";
            default:
                return "Sales History";
        }
    };

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
                        <Skeleton
                            variant="rectangular"
                            width={120}
                            height={40}
                        />
                    </Box>
                </Box>
                <Box
                    sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}
                >
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
                            {getTitle()}&apos;s Sales
                        </Typography>
                        <Controller
                            name="period"
                            control={control}
                            render={({ field }) => (
                                <FormControl
                                    sx={{ minWidth: 120 }}
                                    size="small"
                                >
                                    <InputLabel id="period-select-label">
                                        Period
                                    </InputLabel>
                                    <Select
                                        {...field}
                                        labelId="period-select-label"
                                        label="Period"
                                    >
                                        <MenuItem value={"day"}>Today</MenuItem>
                                        <MenuItem value={"week"}>
                                            This Week
                                        </MenuItem>
                                        <MenuItem value={"month"}>
                                            This Month
                                        </MenuItem>
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
                    {lastFetched
                        ? `Last updated ${relativeTime(new Date(), lastFetched)}`
                        : "Fetching data..."}
                </Typography>
            </Box>

            <Grid container spacing={3} mb={3}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <SalesHistoryOverviewCard
                        title="Total Sales Balance"
                        color="success"
                        icon={<MonetizationOn />}
                        value={ngnFormatter.format(totalRevenue)}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <SalesHistoryOverviewCard
                        title="Most Ordered Item"
                        color="warning"
                        icon={<DinnerDiningOutlined />}
                        value={"Jollof Rice"}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <SalesHistoryOverviewCard
                        title="Top Seller"
                        color="secondary"
                        icon={<Person2Outlined />}
                        value={"John Doe"}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <SalesHistoryOverviewCard
                        title="Total Orders"
                        color="info"
                        icon={<DomainVerificationOutlined />}
                        value={(orders ?? []).length}
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
                <SalesHistoryTable
                    orders={orders ?? []}
                    loading={isLoading}
                    period={period}
                />
            </Paper>
        </Box>
    );
};

export default SalesHistory;
