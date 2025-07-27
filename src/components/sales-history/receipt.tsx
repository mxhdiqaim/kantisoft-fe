// src/components/sales-history/receipt.tsx

/* eslint-disable @typescript-eslint/no-explicit-any */
import { type OrderType } from "@/types/order-types"; // Assuming you have an OrderType
import type { StoreType } from "@/types/store-types";
import { ngnFormatter } from "@/utils";
import {
    Box,
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
import { forwardRef } from "react";

interface Props {
    order: OrderType;
    storeData: StoreType;
}

const Receipt = forwardRef<HTMLDivElement, Props>(({ order, storeData }, ref) => {
    const theme = useTheme();

    const getStatusChipColor = (status: string) => {
        switch (status) {
            case "completed":
                return "success";
            case "pending":
                return "warning";
            case "cancelled":
                return "error";
            default:
                return "default";
        }
    };

    return (
        <Paper
            ref={ref}
            className="print-area"
            elevation={0}
            sx={{
                p: { xs: 2, md: 2 }, // Reduced padding slightly for narrow receipt
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: theme.shape?.borderRadius ?? 1,
            }}
        >
            {/* --- Print-only CSS Styles for Thermal Printer --- */}
            <style type="text/css">
                {`
                    /* Rule for screen display */
                    .print-only {
                        display: none; /* Hide print-only elements by default on screen */
                    }
                `}
            </style>
            <style type="text/css" media="print">
                {`
                    @page { 
                        size: 80mm auto; /* Set width to 80mm, height auto */
                        margin: 0; /* Remove default page margins */
                        padding: 0; /* Ensure no padding is added by browser */
                    }
                    body { 
                        background-color: #fff; 
                        width: 80mm; /* Ensure body fits the paper width */
                        margin: 0;
                        padding: 0;
                        font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif; /* Use a common font for print */
                        font-size: 10px; /* Base font size for thermal receipt */
                        line-height: 1.2;
                    }
                    
                    /* Hide everything on the page by default in print mode */
                    body * {
                        visibility: hidden;
                    }
                    
                    /* Make the printable area and its children visible */
                    .print-area, .print-area * {
                        visibility: visible;
                        box-sizing: border-box; /* Include padding/border in element's total width */
                    }
                    
                    /* Position the printable area to fill the page */
                    .print-area {
                        position: static !important; /* Remove absolute positioning for print, let it flow */
                        width: 80mm; /* Explicitly set width */
                        max-width: 80mm; /* Ensure it doesn't overflow */
                        border: none !important;
                        box-shadow: none !important;
                        padding: 5mm !important; /* Add internal padding for content */
                    }

                    /* Elements that should NOT print */
                    .no-print {
                        display: none !important;
                    }

                    /* Elements that should ONLY print */
                    .print-only {
                        display: block !important; /* Force display on print */
                        visibility: visible !important; /* Ensure visibility */
                    }

                    /* Adjust Typography sizes for print */
                    .MuiTypography-root {
                        font-size: 10px !important; 
                        line-height: 1.2 !important;
                        margin-bottom: 0 !important; /* Reduce vertical spacing */
                    }
                    .MuiTypography-h4 { font-size: 16px !important; }
                    .MuiTypography-h5 { font-size: 14px !important; }
                    .MuiTypography-h6 { font-size: 12px !important; }
                    .MuiTypography-body1 { font-size: 10px !important; }
                    .MuiTypography-body2 { font-size: 9px !important; }
                    .MuiTypography-caption { font-size: 8px !important; }

                    /* Adjust Grid for narrow format */
                    .MuiGrid-root.MuiGrid-container {
                        margin-left: 0 !important;
                        width: 100% !important;
                    }
                    .MuiGrid-item {
                        padding-left: 0 !important;
                        padding-top: 0 !important;
                        width: 100% !important; /* Force stacking of grid items */
                        margin-bottom: 4px; /* Small space between stacked items */
                    }

                    /* Adjust Table for narrow format */
                    .MuiTableContainer-root {
                        margin-bottom: 10px !important;
                    }
                    .MuiTable-root {
                        width: 100% !important;
                        table-layout: fixed; /* Ensures column widths are respected */
                    }
                    .MuiTableCell-root {
                        padding: 2px 4px !important; /* Reduced padding */
                        border-bottom: 1px dashed ${theme.palette.divider} !important; /* Dashed line for items */
                        font-size: 9px !important;
                        line-height: 1.2;
                    }
                    .MuiTableCell-head {
                        font-size: 9px !important;
                        font-weight: bold !important;
                        background-color: transparent !important; /* Thermal printers don't do background colors well */
                        color: black !important;
                    }

                    .MuiChip-root {
                        height: auto !important; /* Allow chip height to adjust */
                        padding: 2px 5px !important;
                        font-size: 8px !important;
                        line-height: 1 !important;
                    }
                    .MuiChip-label {
                        padding: 0 !important;
                    }

                    .MuiDivider-root {
                        margin-top: 10px !important;
                        margin-bottom: 10px !important;
                        border-style: dashed !important; /* Make dividers dashed */
                        border-color: black !important;
                    }
                `}
            </style>

            {/* --- Print-Only Header (Store Info & Logo) --- */}
            <Box className="print-only" sx={{ textAlign: "center", mb: 2 }}>
                {/* Placeholder for Logo */}
                {/* If you have a logo URL, use it here: */}
                {/* <img src="/path/to/your/logo.png" alt="Store Logo" style={{ maxWidth: '60mm', height: 'auto', marginBottom: '5mm' }} /> */}
                <Typography variant="h5" sx={{ fontWeight: "bold", mb: 0.5 }}>
                    {storeData?.name}
                </Typography>
                <Typography variant="body2">{storeData?.address}</Typography>
                {storeData?.phone && <Typography variant="body2">{`Phone: ${storeData.phone}`}</Typography>}
                {storeData?.website && (
                    <Typography variant="body2">{`Web: ${storeData.website} | Email: ${storeData.email}`}</Typography>
                )}
                <Divider sx={{ my: 1 }} />
            </Box>

            {/* --- Receipt Header (Order Reference & Status) --- */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", my: 1 }}>
                <Box>
                    <Typography variant="h6" sx={{ fontWeight: "bold", color: theme.palette.text.primary }}>
                        RECEIPT
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Ref: {order.reference || order.id}
                    </Typography>
                </Box>
                <Chip
                    label={order.orderStatus}
                    color={getStatusChipColor(order.orderStatus)}
                    size="small"
                    sx={{ textTransform: "uppercase", fontWeight: "bold", p: 2 }}
                />
            </Box>

            <Divider sx={{ mb: 1 }} />

            {/* --- Order Details Grid (Stacked Vertically) --- */}
            <Grid container spacing={0.5} sx={{ mb: 1 }}>
                <Grid size={{ xs: 12, sm: 6 }} sx={{ my: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                        Date
                    </Typography>
                    <Typography variant="body1" fontWeight="500">
                        {new Date(order.orderDate).toLocaleString()}
                    </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }} sx={{ my: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                        Seller
                    </Typography>
                    <Typography
                        variant="body1"
                        fontWeight="500"
                    >{`${order.seller?.firstName} ${order.seller?.lastName}`}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }} sx={{ my: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                        Payment Method
                    </Typography>
                    <Typography variant="body1" fontWeight="500" sx={{ textTransform: "capitalize" }}>
                        {order.paymentMethod}
                    </Typography>
                </Grid>
                {order.paymentDetails?.amountPaid && (
                    <>
                        <Grid size={{ xs: 12, sm: 6 }} sx={{ my: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                                Amount Paid
                            </Typography>
                            <Typography variant="body1" fontWeight="500">
                                {ngnFormatter.format(order.paymentDetails.amountPaid)}
                            </Typography>
                        </Grid>
                        {order.paymentDetails.changeGiven > 0 && (
                            <Grid size={{ xs: 12, sm: 6 }} sx={{ my: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                    Change Given
                                </Typography>
                                <Typography variant="body1" fontWeight="500">
                                    {ngnFormatter.format(order.paymentDetails.changeGiven)}
                                </Typography>
                            </Grid>
                        )}
                    </>
                )}
            </Grid>

            {/* --- Order Items Table --- */}
            <Typography variant="body1" sx={{ mb: 0.5, fontWeight: "bold" }}>
                Items
            </Typography>
            <TableContainer>
                <Table size="small">
                    {" "}
                    {/* Use small table size */}
                    <TableHead>
                        <TableRow
                            sx={{
                                "& .MuiTableCell-head": {
                                    fontWeight: "bold",
                                    backgroundColor: theme.palette.action.hover,
                                },
                            }}
                        >
                            <TableCell sx={{ width: "30%" }}>Item</TableCell> {/* Allocate width to item name */}
                            <TableCell align="center" sx={{ width: "10%" }}>
                                Qty
                            </TableCell>
                            <TableCell align="right" sx={{ width: "30%" }}>
                                Price
                            </TableCell>
                            <TableCell align="right" sx={{ width: "30%" }}>
                                Total
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {order.orderItems?.map((item: any) => (
                            <TableRow key={item.id} sx={{ "&:nth-of-type(odd)": { backgroundColor: "transparent" } }}>
                                <TableCell>{item.menuItem?.name}</TableCell>
                                <TableCell align="center">{item.quantity}</TableCell>
                                <TableCell align="right">{ngnFormatter.format(item.priceAtOrder)}</TableCell>
                                <TableCell align="right">{ngnFormatter.format(item.subTotal)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Divider sx={{ my: 1 }} />

            {/* --- Grand Total --- */}
            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
                <Box sx={{ textAlign: "right" }}>
                    <Typography variant="body1" color="text.secondary">
                        TOTAL
                    </Typography>
                    <Typography variant="h5" fontWeight="bold" color="primary.main">
                        {ngnFormatter.format(order.totalAmount)}
                    </Typography>
                </Box>
            </Box>
            {/* Optional: Add "Amount Due" if applicable for partial payments */}
            {order.paymentDetails?.amountDue > 0 && (
                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 0.5 }}>
                    <Box sx={{ textAlign: "right" }}>
                        <Typography variant="body2" color="error.main">
                            Amount Due
                        </Typography>
                        <Typography variant="body1" fontWeight="bold" color="error.main">
                            {ngnFormatter.format(order.paymentDetails.amountDue)}
                        </Typography>
                    </Box>
                </Box>
            )}

            <Divider sx={{ my: 1 }} />

            {/* --- Thank You Message & Refund Policy --- */}
            <Box className="print-only" sx={{ textAlign: "center", my: 2 }}>
                <Typography variant="body1" sx={{ fontWeight: "bold", mb: 0.5 }}>
                    THANK YOU FOR YOUR BUSINESS!
                </Typography>
                <Typography variant="caption" sx={{ display: "block", mb: 1 }}>
                    We appreciate your patronage. Please come again!
                </Typography>
            </Box>

            {/* --- Print-Only Footer (Application Owner) --- */}
            <Box
                className="print-only"
                sx={{ textAlign: "center", mt: 2, pt: 1, borderTop: `1px dashed ${theme.palette.divider}` }}
            >
                <Typography variant="caption" color="text.secondary">
                    Powered by Haxene Limited | www.haxene.com
                </Typography>
            </Box>
        </Paper>
    );
});

Receipt.displayName = "Receipt";

export default Receipt;
