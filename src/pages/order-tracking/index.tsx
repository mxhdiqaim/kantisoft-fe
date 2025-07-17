/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import AddMenuItemModal from "@/components/order-tracking/add-menu-item";
import MenuItem from "@/components/order-tracking/menu-item";
import OrderCart from "@/components/order-tracking/order-cart";
import PaymentModal from "@/components/order-tracking/payment-modal";
import Spinner from "@/components/status-comp/spinner";
import useNotifier from "@/hooks/useNotifier";
import type { CartItem } from "@/types/cart-item-type";
import type { MenuItemType } from "@/types/menu-item-type";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { useCreateOrderMutation, useGetMenuItemsQuery } from "@/store/slice";

const OrderTracking = () => {
    const notify = useNotifier();
    const {
        data: menuItems,
        isLoading: isLoadingMenuItems,
        isError,
    } = useGetMenuItemsQuery();

    const [createOrder, { isLoading: isCreatingOrder }] =
        useCreateOrderMutation();

    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
    const [addMenuItemOpen, setAddMenuItemOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

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
        if (cartItems.length === 0) {
            notify("Please add items to the cart first.", "warning");
            return;
        }
        setPaymentDialogOpen(true);
    };

    const handleClosePaymentDialog = () => {
        setPaymentDialogOpen(false);
    };

    const handleCompleteSale = async (orderData: any) => {
        try {
            await createOrder(orderData).unwrap();
            notify("Order completed successfully!", "success");
            setCartItems([]);
            setPaymentDialogOpen(false);
        } catch (error) {
            notify("Failed to complete order.", "error");
            console.error("Failed to submit order", error);
        }
    };

    const filteredMenuItems = useMemo(() => {
        return (menuItems ?? []).filter((item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase()),
        );
    }, [menuItems, searchQuery]);

    if (isLoadingMenuItems) {
        return <Spinner />;
    }

    if (isError) {
        return (
            <Typography color="error">
                Failed to load menu items. Please try again later.
            </Typography>
        );
    }

    return (
        <Box>
            <Grid container spacing={2} mb={2}>
                <Grid size={{ xs: 12, md: 9 }}>
                    <TextField
                        label="Search Menu Items"
                        variant="outlined"
                        fullWidth
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                    <Button
                        variant="contained"
                        onClick={() => setAddMenuItemOpen(true)}
                        fullWidth
                        sx={{ height: "95%" }}
                    >
                        Add Menu Item
                    </Button>
                </Grid>
            </Grid>
            <Grid container spacing={3} mb={2}>
                <Grid size={{ xs: 12, md: 8 }}>
                    <Grid container spacing={2}>
                        {filteredMenuItems.map((item) => (
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
                isLoading={isCreatingOrder}
            />
            <AddMenuItemModal
                open={addMenuItemOpen}
                onClose={() => setAddMenuItemOpen(false)}
            />
        </Box>
    );
};

export default OrderTracking;
