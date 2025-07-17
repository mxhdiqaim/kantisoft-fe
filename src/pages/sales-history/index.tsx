import { useMemo } from "react";
import {
    Box,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
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
import { useGetOrdersByPeriodQuery } from "@/store/app/slice";

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
        isLoading: loading,
        isError,
    } = useGetOrdersByPeriodQuery(period);

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
                    Refresh {relativeTime(new Date(), new Date())}
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
                    // height: 600,
                    width: "100%",
                    "& .capitalize-cell": {
                        textTransform: "capitalize",
                    },
                }}
            >
                <SalesHistoryTable
                    orders={orders ?? []}
                    loading={loading}
                    period={period}
                />
            </Paper>
        </Box>
    );
};

export default SalesHistory;
