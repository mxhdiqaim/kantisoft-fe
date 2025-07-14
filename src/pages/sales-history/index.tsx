import { useMemo } from "react";
import Spinner from "@/components/status-comp/spinner";
import {
    Box,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    styled,
    Tooltip,
    Typography,
    useTheme,
} from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useOrders } from "@/hooks/use-orders";
import { orderPeriodSchema, type OrderPeriod } from "@/types/order-types";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { relativeTime } from "@/utils/get-relative-time";
import { VisibilityOutlined } from "@mui/icons-material";

// Create a schema for the form object
const salesFilterSchema = yup.object({
    period: orderPeriodSchema,
});

const StyledBox = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    height: "100%",
    gap: theme.spacing(2),
}));

const SalesHistory = () => {
    const { control, watch } = useForm<{ period: OrderPeriod }>({
        mode: "onChange",
        resolver: yupResolver(salesFilterSchema),
        defaultValues: {
            period: "day",
        },
    });

    const theme = useTheme();

    const period = watch("period");
    const { orders, loading, error } = useOrders(period);

    const totalRevenue = useMemo(() => {
        return orders.reduce((acc, order) => acc + (order.totalAmount || 0), 0);
    }, [orders]);

    const getTitle = () => {
        switch (period) {
            case "day":
                return "Today's Sales";
            case "week":
                return "This Week's Sales";
            case "month":
                return "This Month's Sales";
            default:
                return "Sales History";
        }
    };

    const columns: GridColDef[] = [
        {
            flex: 1,
            field: "seller",
            headerName: "Seller Name",
            width: 200,
            renderCell: (params) => (
                <StyledBox>
                    <Typography variant="body2">
                        {params.value.firstName} {params.value.lastName}
                    </Typography>
                </StyledBox>
            ),
        },
        {
            flex: 1,
            field: "orderDate",
            headerName: "Time",
            align: "center",
            headerAlign: "center",
            width: 150,
            renderCell: (params) => (
                <StyledBox sx={{ alignItems: "center" }}>
                    <Typography variant="body2">
                        {relativeTime(new Date(), new Date(params.value))}
                    </Typography>
                </StyledBox>
            ),
        },
        {
            flex: 1,
            field: "totalAmount",
            headerName: "Total Amount",
            type: "number",
            width: 180,
            align: "center",
            headerAlign: "center",
            renderCell: (params) => (
                <StyledBox sx={{ alignItems: "center" }}>
                    <Typography variant="body2" fontWeight="medium">
                        ₦{params.value.toFixed(2)}
                    </Typography>
                </StyledBox>
            ),
        },
        {
            flex: 1,
            field: "paymentMethod",
            headerName: "Payment Method",
            width: 180,
            align: "center",
            headerAlign: "center",
            cellClassName: "capitalize-cell",
        },
        {
            flex: 1,
            field: "orderStatus",
            headerName: "Status",
            width: 150,
            align: "center",
            headerAlign: "center",
            renderCell: (params) => (
                <StyledBox sx={{ alignItems: "center" }}>
                    <Typography
                        variant="body2"
                        className="capitalize"
                        sx={{
                            color:
                                theme.palette.mode === "dark"
                                    ? theme.palette.text.primary
                                    : theme.palette.primary.contrastText,
                            padding: "4px 8px",
                            borderRadius: "4px",
                            fontWeight: "500",
                            textTransform: "capitalize",
                            backgroundColor:
                                params.value === "completed"
                                    ? theme.palette.success.light
                                    : params.value === "pending"
                                      ? theme.palette.warning.light
                                      : theme.palette.error.light,
                        }}
                    >
                        {params.value}
                    </Typography>
                </StyledBox>
            ),
        },
        {
            field: "actions",
            headerName: "Actions",
            type: "actions",
            width: 100,
            align: "center",
            headerAlign: "center",
            renderCell: (params) => (
                <Tooltip title="View Order">
                    <IconButton
                        onClick={() => {
                            console.log(`View order: ${params.row.id}`);
                        }}
                    >
                        <VisibilityOutlined />
                    </IconButton>
                </Tooltip>
            ),
        },
    ];

    if (loading && !orders.length) {
        return <Spinner />;
    }

    if (error) {
        return (
            <Typography color="error" align="center" sx={{ mt: 4 }}>
                {error}
            </Typography>
        );
    }

    return (
        <Box sx={{ p: 3, mx: "auto" }}>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography variant="h4" component="h1">
                        {getTitle()}
                    </Typography>
                    <Controller
                        name="period"
                        control={control}
                        render={({ field }) => (
                            <FormControl sx={{ minWidth: 120 }} size="small">
                                <InputLabel id="period-select-label">
                                    Period
                                </InputLabel>
                                <Select
                                    {...field}
                                    labelId="period-select-label"
                                    label="Period"
                                >
                                    <MenuItem value={"day"}>Day</MenuItem>
                                    <MenuItem value={"week"}>Week</MenuItem>
                                    <MenuItem value={"month"}>Month</MenuItem>
                                </Select>
                            </FormControl>
                        )}
                    />
                </Box>
                <Box sx={{ textAlign: "right" }}>
                    <Typography variant="h5" component="p" color="primary">
                        Total Revenue: ₦{totalRevenue.toFixed(2)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Refresh {relativeTime(new Date(), new Date())}
                    </Typography>
                </Box>
            </Box>

            <Box
                sx={{
                    height: 600,
                    width: "100%",
                    "& .capitalize-cell": {
                        textTransform: "capitalize",
                    },
                }}
            >
                <DataGrid
                    rows={orders}
                    columns={columns}
                    loading={loading}
                    initialState={{
                        pagination: {
                            paginationModel: { pageSize: 10 },
                        },
                    }}
                    disableColumnResize
                    pageSizeOptions={[10, 25, 50]}
                    disableRowSelectionOnClick
                    sx={{
                        border: "none",
                        "& .MuiDataGrid-columnHeaderTitle": {
                            fontWeight: 600,
                        },
                    }}
                />
            </Box>
        </Box>
    );
};

export default SalesHistory;
