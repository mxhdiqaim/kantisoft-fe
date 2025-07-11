import CustomCard from "@/components/customs/custom-card";
import type { MenuItemType } from "@/types/menu-cart-type";
import { Box, Button, Divider, Typography } from "@mui/material";

interface Props {
    item: MenuItemType;
    onAddToCart: (item: MenuItemType) => void;
}

const MenuItem = ({ item, onAddToCart }: Props) => {
    return (
        <CustomCard>
            <Box>
                <Typography variant="h4">{item.name}</Typography>
                <Typography color="text.secondary">
                    ₦{item.price.toFixed(2)}
                </Typography>
                <Divider />
                <Button
                    sx={{ mt: 1 }}
                    variant={"contained"}
                    size="small"
                    onClick={() => onAddToCart(item)}
                >
                    Add to Cart
                </Button>
            </Box>
        </CustomCard>
    );
};

export default MenuItem;
