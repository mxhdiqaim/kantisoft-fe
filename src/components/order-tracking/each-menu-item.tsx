import CustomCard from "@/components/customs/custom-card";
import type {MenuItemType} from "@/types/menu-item-type.ts";
import {ngnFormatter} from "@/utils";
import {Box, Divider, Typography} from "@mui/material";
import CustomButton from "@/components/ui/button.tsx";

interface Props {
    item: MenuItemType;
    onAddToCart: (item: MenuItemType) => void;
}

const EachMenuItem = ({item, onAddToCart}: Props) => {
    return (
        <CustomCard>
            <Box>
                <Typography variant="h4">{item.name}</Typography>
                <Typography color="text.secondary">{ngnFormatter.format(item.price)} </Typography>
                <Divider/>
                <CustomButton
                    sx={{mt: 1}}
                    title="Add to Cart"
                    variant={"contained"}
                    size="small"
                    onClick={() => onAddToCart(item)}
                />
            </Box>
        </CustomCard>
    );
};

export default EachMenuItem;
