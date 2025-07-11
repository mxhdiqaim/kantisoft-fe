import MenuItem from "@/components/order-tracking/menu-item";
import OrderCart from "@/components/order-tracking/order-cart";
import PaymentModal from "@/components/order-tracking/payment-modal";
import { useMenuItems } from "@/hooks/use-menu-items";
import type { CartItem, MenuItemType } from "@/types/menu-cart-type";
import { Alert, Box, CircularProgress, Grid, Snackbar } from "@mui/material";
import { useState } from "react";

// Mocking axios
const mock = {
    post: (url: string, data: unknown) => {
        if (url === "/api/orders") {
            console.log("Order submitted:", data);
            return Promise.resolve({ data: { success: true } });
        }
        return Promise.resolve({ data: {} });
    },
};

const OrderTracking = () => {
    const { menuItems, loading } = useMenuItems();

    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: "success" | "error";
    } | null>(null);

    const handleAddToCart = (item: MenuItemType) => {
        setCartItems((prev) => {
            const existingItem = prev.find(
                (cartItem) => cartItem.id === item.id,
            );
            if (existingItem) {
                return prev.map((cartItem) =>
                    cartItem.id === item.id
                        ? { ...cartItem, quantity: cartItem.quantity + 1 }
                        : cartItem,
                );
            }
            return [...prev, { ...item, quantity: 1 }];
        });
    };

    const handleUpdateQuantity = (itemId: string, quantity: number) => {
        if (quantity === 0) {
            handleRemoveItem(itemId);
        } else {
            setCartItems((prev) =>
                prev.map((item) =>
                    item.id === itemId ? { ...item, quantity } : item,
                ),
            );
        }
    };

    const handleRemoveItem = (itemId: string) => {
        setCartItems((prev) => prev.filter((item) => item.id !== itemId));
    };

    const handleOpenPaymentDialog = () => {
        setPaymentDialogOpen(true);
    };

    const handleClosePaymentDialog = () => {
        setPaymentDialogOpen(false);
    };

    const handleCompleteSale = async (
        paymentMethod: string,
        amountReceived?: number,
    ) => {
        const orderDetails = {
            items: cartItems.map((item) => ({
                id: item.id,
                quantity: item.quantity,
            })),
            total: cartItems.reduce(
                (acc, item) => acc + item.price * item.quantity,
                0,
            ),
            paymentMethod,
            amountReceived,
        };
        try {
            await mock.post("/api/orders", orderDetails);
            setSnackbar({
                open: true,
                message: "Order completed successfully!",
                severity: "success",
            });
            setCartItems([]);
            setPaymentDialogOpen(false);
        } catch (error) {
            setSnackbar({
                open: true,
                message: "Failed to complete order.",
                severity: "error",
            });
            console.error("Failed to submit order", error);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar(null);
    };

    if (loading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    mt: 4,
                    height: "calc(100vh - 150px)",
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 8 }}>
                    <Grid container spacing={2}>
                        {menuItems.map((item) => (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.id}>
                                <MenuItem
                                    item={item}
                                    onAddToCart={handleAddToCart}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <OrderCart
                        cartItems={cartItems}
                        onUpdateQuantity={handleUpdateQuantity}
                        onRemoveItem={handleRemoveItem}
                        onOpenPaymentDialog={handleOpenPaymentDialog}
                    />
                </Grid>
            </Grid>
            <PaymentModal
                open={paymentDialogOpen}
                onClose={handleClosePaymentDialog}
                onCompleteSale={handleCompleteSale}
                cartItems={cartItems}
            />
            {snackbar && (
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                >
                    <Alert
                        onClose={handleCloseSnackbar}
                        severity={snackbar.severity}
                        sx={{ width: "100%" }}
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            )}
        </Box>
    );
};

export default OrderTracking;
