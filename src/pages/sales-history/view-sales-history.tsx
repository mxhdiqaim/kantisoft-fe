/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Divider,
    Button,
    useTheme,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useGetOrder } from "@/hooks/use-orders";
import {
    ArrowBackIosNewOutlined,
    LocalPrintshopOutlined,
} from "@mui/icons-material";
import { ngnFormatter } from "@/utils";
import { useRef } from "react";

const ViewSalesHistory = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const theme = useTheme();
    const printRef = useRef<HTMLDivElement>(null);

    const { order, loading } = useGetOrder(id as string);

    if (loading || !order) {
        return <Typography>Loading...</Typography>;
    }

    const handlePrint = () => {
        window.print();
    };

    return (
        <Box>
            <Button
                variant="outlined"
                size="small"
                onClick={() => navigate(-1)}
            >
                <ArrowBackIosNewOutlined fontSize="small" sx={{ height: 16 }} />
                Go Back
            </Button>
            <Button
                variant="contained"
                size="small"
                onClick={handlePrint}
                sx={{ ml: 2 }}
            >
                <LocalPrintshopOutlined fontSize="small" sx={{ height: 16 }} />
                Print
            </Button>
            <Box sx={{ py: 2 }} ref={printRef} className="print-area">
                <Typography variant="h4" gutterBottom>
                    Sales History Details
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="subtitle1">
                    <b>Order ID:</b> {order.id}
                </Typography>
                <Typography variant="subtitle1">
                    <b>Status:</b>
                    <Box
                        component={"span"}
                        sx={{
                            ml: 1,
                            color:
                                theme.palette.mode === "dark"
                                    ? theme.palette.text.primary
                                    : theme.palette.primary.contrastText,
                            padding: "4px 8px",
                            borderRadius: "4px",
                            fontWeight: "500",
                            textTransform: "capitalize",
                            backgroundColor:
                                order.orderStatus === "completed"
                                    ? theme.palette.success.light
                                    : order.orderStatus === "pending"
                                      ? theme.palette.warning.light
                                      : theme.palette.error.light,
                        }}
                    >
                        {order.orderStatus}
                    </Box>
                </Typography>
                <Typography variant="subtitle1">
                    <b>Date:</b> {new Date(order.orderDate).toLocaleString()}
                </Typography>
                <Typography variant="subtitle1">
                    <b>Seller:</b> {order.seller?.firstName}{" "}
                    {order.seller?.lastName}
                </Typography>
                <Typography variant="subtitle1">
                    <b>Payment Method:</b>{" "}
                    <Box
                        component={"span"}
                        sx={{ textTransform: "capitalize" }}
                    >
                        {order.paymentMethod}
                    </Box>
                </Typography>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                    <b>Total Amount:</b>{" "}
                    <Box component={"span"}>
                        {ngnFormatter.format(order.totalAmount)}
                    </Box>
                </Typography>

                <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
                    Order Items
                </Typography>
                <TableContainer component={Paper}>
                    <Table size="medium" sx={{ height: 50 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Item</TableCell>
                                <TableCell>Quantity</TableCell>
                                <TableCell>Unit Price</TableCell>
                                <TableCell>Subtotal</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody sx={{ borderBottom: "1px solid" }}>
                            {order.orderItems?.map((item: any) => (
                                <TableRow key={item.menuItemId}>
                                    <TableCell>{item.menuItem?.name}</TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell>
                                        {ngnFormatter.format(item.priceAtOrder)}
                                    </TableCell>
                                    <TableCell>
                                        {ngnFormatter.format(item.subTotal)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    );
};
export default ViewSalesHistory;
