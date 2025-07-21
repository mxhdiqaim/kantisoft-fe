/* eslint-disable @typescript-eslint/no-explicit-any */
import ViewSalesHistoryLoading from "@/components/sales-history/spinners/view-sales-history-loading";
import { useGetOrderByIdQuery } from "@/store/slice";
import { ngnFormatter } from "@/utils";
import { ArrowBackIosNewOutlined, LocalPrintshopOutlined } from "@mui/icons-material";
import {
    Box,
    Button,
    Chip,
    Divider,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    useTheme,
} from "@mui/material";
import { useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ViewSalesHistory = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const theme = useTheme();
    const printRef = useRef<HTMLDivElement>(null);

    const {
        data: order,
        isLoading: loading,
        isError,
    } = useGetOrderByIdQuery(id!, {
        skip: !id,
    });

    const handlePrint = () => {
        window.print();
    };

    if (loading) return <ViewSalesHistoryLoading />;

    if (isError || !order) {
        return <Typography>Failed to load order details.</Typography>;
    }

    const getStatusChipColor = (status: string) => {
        switch (status) {
            case "completed":
                return "success";
            case "pending":
                return "warning";
            default:
                return "error";
        }
    };

    return (
        <Box>
            {/* --- Action Buttons --- */}
            <Box className="no-print" sx={{ mb: 3, display: "flex", gap: 1 }}>
                <Button variant="outlined" size="small" onClick={() => navigate(-1)}>
                    <ArrowBackIosNewOutlined fontSize="small" sx={{ height: 16, mr: 0.5 }} />
                    Go Back
                </Button>
                <Button variant="contained" size="small" onClick={handlePrint}>
                    <LocalPrintshopOutlined fontSize="small" sx={{ height: 16, mr: 0.5 }} />
                    Print Receipt
                </Button>
            </Box>

            {/* --- Printable Receipt Area --- */}
            <Paper
                ref={printRef}
                className="printable-area"
                elevation={0}
                sx={{
                    p: { xs: 2, md: 4 },
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: theme.borderRadius.small,
                }}
            >
                <style type="text/css" media="print">
                    {`
                        @page { size: auto; margin: 0mm; }
                        body { background-color: #fff; }
                        
                        /* Hide everything on the page */
                        body * {
                            visibility: hidden;
                        }
                        
                        /* Make the printable area and its children visible */
                        .printable-area, .printable-area * {
                            visibility: visible;
                        }
                        
                        /* Position the printable area to fill the page */
                        .printable-area {
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: 100%;
                            border: none !important;
                            box-shadow: none !important;
                        }

                        .no-print {
                            display: none;
                        }
                    `}
                </style>

                {/* --- Receipt Header --- */}
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3 }}>
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: "bold", color: theme.palette.text.primary }}>
                            Receipt
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Order Reference: {order.reference || order.id}
                        </Typography>
                    </Box>
                    <Chip
                        label={order.orderStatus}
                        color={getStatusChipColor(order.orderStatus)}
                        size="medium"
                        sx={{ textTransform: "capitalize", fontWeight: "bold" }}
                    />
                </Box>

                <Divider sx={{ mb: 3 }} />

                {/* --- Order Details Grid --- */}
                <Grid container spacing={2} sx={{ mb: 4 }}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="body2" color="text.secondary">
                            Date
                        </Typography>
                        <Typography variant="body1" fontWeight="500">
                            {new Date(order.orderDate).toLocaleString()}
                        </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="body2" color="text.secondary">
                            Seller
                        </Typography>
                        <Typography
                            variant="body1"
                            fontWeight="500"
                        >{`${order.seller?.firstName} ${order.seller?.lastName}`}</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="body2" color="text.secondary">
                            Payment Method
                        </Typography>
                        <Typography variant="body1" fontWeight="500" sx={{ textTransform: "capitalize" }}>
                            {order.paymentMethod}
                        </Typography>
                    </Grid>
                </Grid>

                {/* --- Order Items Table --- */}
                <Typography variant="h6" sx={{ mb: 2 }}>
                    Order Items
                </Typography>
                <TableContainer>
                    <Table size="medium">
                        <TableHead>
                            <TableRow
                                sx={{
                                    "& .MuiTableCell-head": {
                                        fontWeight: "bold",
                                        backgroundColor: theme.palette.action.hover,
                                    },
                                }}
                            >
                                <TableCell>Item Code</TableCell>
                                <TableCell>Item</TableCell>
                                <TableCell align="center">Quantity</TableCell>
                                <TableCell align="right">Unit Price</TableCell>
                                <TableCell align="right">Subtotal</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {order.orderItems?.map((item: any) => (
                                <TableRow
                                    key={item.menuItemId}
                                    sx={{ "&:nth-of-type(odd)": { backgroundColor: theme.palette.action.hover } }}
                                >
                                    <TableCell>{item.menuItem?.itemCode || "N/A"}</TableCell>
                                    <TableCell>{item.menuItem?.name}</TableCell>
                                    <TableCell align="center">{item.quantity}</TableCell>
                                    <TableCell align="right">{ngnFormatter.format(item.priceAtOrder)}</TableCell>
                                    <TableCell align="right">{ngnFormatter.format(item.subTotal)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Divider sx={{ my: 3 }} />

                {/* --- Grand Total --- */}
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Box sx={{ textAlign: "right" }}>
                        <Typography variant="body1" color="text.secondary">
                            Total Amount
                        </Typography>
                        <Typography variant="h5" fontWeight="bold" color="primary.main">
                            {ngnFormatter.format(order.totalAmount)}
                        </Typography>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
};

export default ViewSalesHistory;
