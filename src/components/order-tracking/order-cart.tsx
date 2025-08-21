import type { CartItem } from "@/types/cart-item-type";
import { ngnFormatter } from "@/utils";
import { Add, Delete, Remove } from "@mui/icons-material";
import { Box, Button, Divider, IconButton, List, ListItem, ListItemText, Typography, useTheme } from "@mui/material";

interface Props {
    cartItems: CartItem[];
    onUpdateQuantity: (itemId: string, quantity: number) => void;
    onRemoveItem: (itemId: string) => void;
    onOpenPaymentDialog: () => void;
}

const OrderCart = ({ cartItems, onUpdateQuantity, onRemoveItem, onOpenPaymentDialog }: Props) => {
    const theme = useTheme();
    const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <Box
            sx={{
                p: 2,
                border: "1px solid",
                borderColor: "grey.300",
                borderRadius: 2,
            }}
        >
            <Typography variant="h5" gutterBottom>
                Order Cart
            </Typography>
            {cartItems.length === 0 ? (
                <Typography sx={{ my: 2 }}>Cart is empty</Typography>
            ) : (
                <>
                    <List>
                        {cartItems.map((item) => (
                            <>
                                <Divider />
                                <ListItem
                                    key={item.id}
                                    secondaryAction={
                                        <IconButton
                                            edge="end"
                                            aria-label="delete"
                                            onClick={() => onRemoveItem(item.id)}
                                        >
                                            <Delete />
                                        </IconButton>
                                    }
                                >
                                    <ListItemText
                                        primary={item.name}
                                        secondary={`Subtotal: ${ngnFormatter.format(item.price * item.quantity)}`}
                                        slotProps={{
                                            primary: {
                                                sx: {
                                                    fontWeight: "bold",
                                                    fontSize: "1.5rem",
                                                    color: theme.palette.primary.main,
                                                },
                                            },
                                            secondary: {
                                                sx: {
                                                    fontSize: "1rem",
                                                },
                                            },
                                        }}
                                    />
                                    {item.quantity > 1 && (
                                        <IconButton onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}>
                                            <Remove />
                                        </IconButton>
                                    )}
                                    <Typography sx={{ mx: 1 }}>{item.quantity}</Typography>
                                    <IconButton onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>
                                        <Add />
                                    </IconButton>
                                </ListItem>
                            </>
                        ))}
                    </List>
                    <Divider />
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="h3" color={theme.palette.success.main} mt={1}>
                            Total: {ngnFormatter.format(total)}{" "}
                        </Typography>
                    </Box>
                </>
            )}
            <Button
                variant="contained"
                color="primary"
                fullWidth
                disabled={cartItems.length === 0}
                onClick={onOpenPaymentDialog}
            >
                Place Order
            </Button>
        </Box>
    );
};

export default OrderCart;
