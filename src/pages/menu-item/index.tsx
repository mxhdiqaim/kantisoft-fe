import { useMemo, useState } from "react";
import { Box, Button, Grid, Paper, Typography, useTheme } from "@mui/material";
import { useGetMenuItemsQuery } from "@/store/slice";
import useNotifier from "@/hooks/useNotifier";
import MenuItemsTable from "@/components/menu-items/menu-items-table";
import MenuItemFormModal from "@/components/order-tracking/menu-item-form-modal";
import type { MenuItemType } from "@/types/menu-item-type";
import { useTranslation } from "react-i18next";
import { getApiError } from "@/helpers/get-api-error";
import ApiErrorDisplay from "@/components/feedback/api-error-display";
import { selectCurrentUser } from "@/store/slice/auth-slice";
import { useAppSelector } from "@/store";
import MenuItemsPageSkeleton from "@/components/menu-items/loading";

const MenuItems = () => {
    const notify = useNotifier();
    const theme = useTheme();
    const { t } = useTranslation();

    const currentUser = useAppSelector(selectCurrentUser);

    const [formModalOpen, setFormModalOpen] = useState(false);
    const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItemType | null>(null);
    const { data: menuItems, isLoading, isError, error } = useGetMenuItemsQuery();

    const totalMenuItems = useMemo(() => menuItems?.length || 0, [menuItems]);

    const handleOpenFormModal = (menuItem: MenuItemType | null = null) => {
        setSelectedMenuItem(menuItem);
        setFormModalOpen(true);
    };

    const handleCloseFormModal = () => {
        setSelectedMenuItem(null);
        setFormModalOpen(false);
    };

    if (isLoading) return <MenuItemsPageSkeleton />;

    if (isError) {
        notify(`Failed to load ${t("menuItem")}.`, "error");
        const apiError = getApiError(error, `Failed to load ${t("menuItem")}.`);
        return <ApiErrorDisplay statusCode={apiError.type} message={apiError.message} />;
    }

    return (
        <Box>
            <Grid container spacing={2} mb={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="h4">{t("menuItem")}</Typography>
                    <Typography variant="subtitle1">
                        Total {t("menuItem")}: {totalMenuItems}
                    </Typography>
                </Grid>
                {currentUser && (currentUser.role === "manager" || currentUser.role === "admin") && (
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Box display="flex" justifyContent="flex-end">
                            <Button variant="contained" onClick={() => handleOpenFormModal()}>
                                Add {t("item")}
                            </Button>
                        </Box>
                    </Grid>
                )}
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
                <MenuItemsTable menuItems={menuItems ?? []} loading={isLoading} onEdit={handleOpenFormModal} />
            </Paper>
            <MenuItemFormModal open={formModalOpen} onClose={handleCloseFormModal} menuItemToEdit={selectedMenuItem} />
        </Box>
    );
};

export default MenuItems;
