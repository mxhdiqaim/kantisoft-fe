import { useMemo, useState } from "react";
import {
    Box,
    Button,
    Grid,
    Paper,
    Skeleton,
    Typography,
    useTheme,
} from "@mui/material";
import { useGetMenuItemsQuery } from "@/store/slice";
import useNotifier from "@/hooks/useNotifier";
import MenuItemsTable from "@/components/menu-items/menu-items-table";
import MenuItemFormModal from "@/components/order-tracking/menu-item-form-modal";
import type { MenuItemType } from "@/types/menu-item-type";

const MenuItems = () => {
    const notify = useNotifier();
    const theme = useTheme();
    const [formModalOpen, setFormModalOpen] = useState(false);
    const [selectedMenuItem, setSelectedMenuItem] =
        useState<MenuItemType | null>(null);
    const { data: menuItems, isLoading, isError } = useGetMenuItemsQuery();

    const totalMenuItems = useMemo(() => menuItems?.length || 0, [menuItems]);

    const handleOpenFormModal = (menuItem: MenuItemType | null = null) => {
        setSelectedMenuItem(menuItem);
        setFormModalOpen(true);
    };

    const handleCloseFormModal = () => {
        setSelectedMenuItem(null);
        setFormModalOpen(false);
    };

    if (isLoading) {
        return (
            <Box>
                <Typography variant="h4">Menu Items</Typography>
                <Skeleton variant="rectangular" height={400} />
            </Box>
        );
    }

    if (isError) {
        notify("Failed to load menu items.", "error");
        return (
            <Typography color="error">
                Failed to load menu items. Please try again later.
            </Typography>
        );
    }

    return (
        <Box>
            <Grid container spacing={2} mb={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="h4">Menu Items</Typography>
                    <Typography variant="subtitle1">
                        Total Menu Items: {totalMenuItems}
                    </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Box display="flex" justifyContent="flex-end">
                        <Button
                            variant="contained"
                            onClick={() => handleOpenFormModal()}
                        >
                            Add Menu Item
                        </Button>
                    </Box>
                </Grid>
            </Grid>
            <Paper
                elevation={-1}
                sx={{
                    border: `1px solid ${theme.palette.grey[100]}`,
                    width: "100%",
                    "& .capitalize-cell": {
                        textTransform: "capitalize",
                    },
                }}
            >
                <MenuItemsTable
                    menuItems={menuItems ?? []}
                    loading={isLoading}
                    onEdit={handleOpenFormModal}
                />
            </Paper>
            <MenuItemFormModal
                open={formModalOpen}
                onClose={handleCloseFormModal}
                menuItemToEdit={selectedMenuItem}
            />
        </Box>
    );
};

export default MenuItems;
