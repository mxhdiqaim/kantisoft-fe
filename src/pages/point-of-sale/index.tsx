import EachMenuItem from "@/components/order-tracking/each-menu-item.tsx";
import MenuIteFormModal from "@/components/order-tracking/menu-item-form-modal";
import OrderCart from "@/components/order-tracking/order-cart";
import PaymentModal from "@/components/order-tracking/payment-modal";
import MenuItemSkeleton from "@/components/spinners/manu-item-skeleton";
import OrderCartSkeleton from "@/components/spinners/order-cart-skeleton";
import {getApiError} from "@/helpers/get-api-error";
import useNotifier from "@/hooks/useNotifier";
import {useCreateOrderMutation, useGetMenuItemsQuery} from "@/store/slice";
import type {CartItem} from "@/types/cart-item-type";
import type {MenuItemType} from "@/types/menu-item-type";
import type {CreateOrderType} from "@/types/order-types";
import {Box, Grid, Skeleton, TextField, Typography, useTheme} from "@mui/material";
import {useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import Icon from "@/components/ui/icon.tsx";
import SearchSvgIcon from "@/assets/icons/search.svg";
import {iconStyle} from "@/styles";

const PointOfSale = () => {
    const notify = useNotifier();
    const theme = useTheme();
    const {t} = useTranslation();
    const {data: menuItems, isLoading: isLoadingMenuItems, isError} = useGetMenuItemsQuery({});

    const [createOrder, {isLoading: isCreatingOrder}] = useCreateOrderMutation();

    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
    const [addMenuItemOpen, setAddMenuItemOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const handleAddToCart = (item: MenuItemType) => {
        setCartItems((prev) => {
            const existingItem = prev.find((cartItem) => cartItem.id === item.id);
            if (existingItem) {
                return prev.map((cartItem) =>
                    cartItem.id === item.id ? {...cartItem, quantity: cartItem.quantity + 1} : cartItem,
                );
            }
            return [...prev, {...item, quantity: 1}];
        });
    };

    const handleUpdateQuantity = (itemId: string, quantity: number) => {
        if (quantity === 0) {
            handleRemoveItem(itemId);
        } else {
            setCartItems((prev) => prev.map((item) => (item.id === itemId ? {...item, quantity} : item)));
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

    const handleCompleteSale = async (orderData: Omit<CreateOrderType, "amountReceived">) => {
        try {
            await createOrder(orderData).unwrap();
            notify("Order completed successfully!", "success");
            setCartItems([]);
            setPaymentDialogOpen(false);
        } catch (error) {
            console.log(error);
            const defaultMessage = "Failed to complete order.";
            const apiError = getApiError(error, defaultMessage);
            notify(apiError.message, "error");
        }
    };

    const filteredMenuItems = useMemo(() => {
        return (menuItems ?? []).filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [menuItems, searchQuery]);

    if (isLoadingMenuItems) {
        return (
            <Box>
                <Grid container spacing={3} mb={2}>
                    <Grid size={{xs: 12, md: 8}}>
                        <Grid size={12} mb={2}>
                            <Skeleton variant="rectangular" height={56}/>
                        </Grid>
                        <Grid container spacing={2}>
                            {Array.from(new Array(9)).map((_, index) => (
                                <Grid size={{xs: 12, sm: 6, md: 4}} key={index}>
                                    <MenuItemSkeleton/>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                    <Grid size={{xs: 12, md: 4}}>
                        <OrderCartSkeleton/>
                    </Grid>
                </Grid>
            </Box>
        );
    }

    if (isError) {
        return <Typography color="error">Failed to load menu items. Please try again later.</Typography>;
    }

    return (
        <Box>
            <Grid container spacing={3} mb={2}>
                <Grid size={{xs: 12, md: 8}}>
                    <Grid size={{xs: 12}}>
                        <TextField
                            placeholder="Search by name"
                            variant="outlined"
                            fullWidth
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            slotProps={{
                                input: {
                                    startAdornment: <Icon src={SearchSvgIcon} alt={"Search Icon"} sx={{...iconStyle}}/>,
                                }
                            }}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    height: 40,
                                    // maxWidth: {xs: "100%", md: 500},
                                    borderRadius: theme.borderRadius.small - 2,
                                },
                                "& .MuiInputBase-input": {
                                    textAlign: "left",
                                },
                            }}
                        />
                    </Grid>
                    <Grid container spacing={2} mt={2}>
                        {filteredMenuItems.length > 0 ? (
                            filteredMenuItems.map((item) => (
                                <Grid size={{xs: 12, sm: 6, md: 4}} key={item.id}>
                                    <EachMenuItem item={item} onAddToCart={handleAddToCart}/>
                                </Grid>
                            ))
                        ) : (
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    height: "60vh",
                                    width: "100%",
                                }}
                            >
                                <Typography variant={"h4"}>
                                    No {t("item")} found, Please add {t("item")}
                                </Typography>
                            </Box>
                        )}
                    </Grid>
                </Grid>
                <Grid size={{xs: 12, md: 4}}>
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
            <MenuIteFormModal open={addMenuItemOpen} onClose={() => setAddMenuItemOpen(false)}/>
        </Box>
    );
};

export default PointOfSale;
