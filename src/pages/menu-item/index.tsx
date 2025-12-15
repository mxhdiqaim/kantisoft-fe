import {type MouseEvent, useMemo, useState} from "react";
import {Box, Grid, Tooltip, Typography, useTheme} from "@mui/material";
import {useDeleteMenuItemMutation, useGetMenuItemsQuery} from "@/store/slice";
import useNotifier from "@/hooks/useNotifier";
import MenuItemFormModal from "@/components/order-tracking/menu-item-form-modal";
import type {MenuItemType} from "@/types/menu-item-type";
import {useTranslation} from "react-i18next";
import {getApiError} from "@/helpers/get-api-error";
import ApiErrorDisplay from "@/components/feedback/api-error-display";
import {selectCurrentUser} from "@/store/slice/auth-slice";
import {useAppSelector} from "@/store";
import MenuItemsPageSkeleton from "@/components/menu-items/loading";

import {DeleteOutline, EditOutlined, MoreVert} from "@mui/icons-material";
import DataGridTable from "@/components/ui/data-grid-table";
import type {GridColDef} from "@mui/x-data-grid";
import TableStyledBox from "@/components/ui/data-grid-table/table-styled-box.tsx";
import {ngnFormatter} from "@/utils";
import TableSearchActions from "@/components/ui/data-grid-table/table-search-action.tsx";
import {useSearch} from "@/use-search.ts";
import {exportToCsv, exportToXlsx, getExportFormattedData} from "@/utils/export-data-utils.ts";
import CustomButton from "@/components/ui/button.tsx";
import {UserRoleEnum} from "@/types/user-types.ts";
import TableStyledMenuItem from "@/components/ui/data-grid-table/table-style-menuitem.tsx";
import {useMemoizedArray} from "@/hooks/use-memoized-array.ts";

const MenuItems = () => {
    const theme = useTheme();
    const notify = useNotifier();
    const {t} = useTranslation();

    const currentUser = useAppSelector(selectCurrentUser);

    const {data: menuItems, isLoading, isError, error} = useGetMenuItemsQuery({});
    const [deleteMenuItem, {isLoading: isDeleting}] = useDeleteMenuItemMutation();

    const memoizedMenuItems = useMemoizedArray(menuItems);

    console.log("MenuItems rendered with items:", memoizedMenuItems);

    const {searchControl, searchSubmit, handleSearch, filteredData} = useSearch({
        initialData: memoizedMenuItems,
        searchKeys: ["name", "itemCode"],
    });

    const [formModalOpen, setFormModalOpen] = useState(false);
    const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItemType | null>(null);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

    const totalMenuItems = useMemo(() => menuItems?.length || 0, [menuItems]);

    const handleOpenFormModal = (menuItem: MenuItemType | null = null) => {
        setSelectedMenuItem(menuItem);
        setFormModalOpen(true);
    };

    const handleCloseFormModal = () => {
        setSelectedMenuItem(null);
        setFormModalOpen(false);
    };

    // Define custom formatters for MenuItemsTable
    const menuItemsFieldFormatters = useMemo(
        () => ({
            itemCode: (row: MenuItemType) => row.itemCode,
            name: (row: MenuItemType) => row.name,
            price: (row: MenuItemType) => row.price, // Raw number
            isAvailable: (row: MenuItemType) => (row.isAvailable ? "Yes" : "No"),
        }),
        [],
    );

    const prepareExportData = () => {
        return getExportFormattedData(
            filteredData, // Your data source
            columns,      // Your column definitions
            menuItemsFieldFormatters // Your specific formatters
        );
    };

    const handleExportCsv = () => {
        const dataToExport = prepareExportData();

        if (dataToExport.length === 0) {
            notify("No data to export.", "error");
            return;
        }

        const filename = `menu_items_data.csv`;
        exportToCsv(dataToExport, filename); // Uses generic utility
    };

    // Export to XLSX function
    const handleExportXlsx = () => {
        const dataToExport = prepareExportData();

        if (dataToExport.length === 0) {
            notify("No data to export.", "error");
            return;
        }

        const filename = `menu_items_data.xlsx`;
        exportToXlsx(dataToExport, filename, "Sales History", columns); // Uses generic utility
    };

    const handleMenuClick = (event: MouseEvent<HTMLElement>, rowId: string) => {
        setAnchorEl(event.currentTarget);
        setSelectedRowId(rowId);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedRowId(null);
    };

    const handleDelete = async (rowId: string) => {
        try {
            await deleteMenuItem(rowId).unwrap();
            notify("Menu item deleted successfully", "success");
        } catch (error) {
            console.error("Failed to delete menu item:", error);
            notify("Failed to delete menu item", "error");
        }

        handleMenuClose();
    };

    const columns: GridColDef[] = useMemo(
        () => [
            {
                flex: 1,
                field: "itemCode",
                headerName: "Item Code",
                minWidth: 150,
                renderCell: (params) => (
                    <TableStyledBox>
                        <Typography variant="body2" className="capitalize">
                            {params?.value}
                        </Typography>
                    </TableStyledBox>
                ),
            },
            {
                flex: 1,
                field: "name",
                headerName: "Name",
                minWidth: 150,
                renderCell: (params) => (
                    <TableStyledBox>
                        <Typography
                            variant="body2"
                            sx={{
                                fontWeight: 400,
                                textTransform: "capitalize",
                                color: theme.palette.text.primary,
                                backgroundColor: theme.palette.background.paper,
                                padding: "4px 8px",
                                borderRadius: "4px",
                            }}
                        >
                            {params.value}
                        </Typography>
                    </TableStyledBox>
                ),
            },
            {
                flex: 1,
                field: "price",
                headerName: "Price",
                type: "number",
                minWidth: 100,
                align: "left",
                headerAlign: "left",
                renderCell: (params) => (
                    <TableStyledBox sx={{justifyContent: "left"}}>
                        <Typography variant="body2" fontWeight="medium">
                            {ngnFormatter.format(params.value)}
                        </Typography>
                    </TableStyledBox>
                ),
            },
            {
                flex: 1,
                field: "isAvailable",
                headerName: "Is Available",
                minWidth: 100,
                align: "left",
                headerAlign: "left",
                renderCell: (params) => (
                    <TableStyledBox sx={{justifyContent: "left"}}>
                        <Typography
                            variant="body2"
                            className="capitalize"
                            sx={{
                                backgroundColor: params.value ? theme.palette.success.main : theme.palette.error.main,
                                p: "4px 8px",
                                borderRadius: "4px",
                                color: theme.palette.primary.contrastText,
                                fontWeight: "500",
                                textTransform: "capitalize",
                                width: "50px",
                            }}
                        >
                            {params.value ? "Yes" : "No"}
                        </Typography>
                    </TableStyledBox>
                ),
            },
            {
                flex: 1,
                field: "store",
                headerName: "Store",
                minWidth: 150,
                align: "left",
                headerAlign: "left",
                renderCell: (params) => (
                    <TableStyledBox>
                        <Typography>
                            {params.value?.name || "N/A"}
                        </Typography>
                    </TableStyledBox>
                ),
            },
            {
                flex: 1,
                field: "quantity",
                headerName: "Quantity",
                minWidth: 120,
                align: "left",
                headerAlign: "left",
                valueGetter: (params: { row: MenuItemType }) => params?.row.inventory?.quantity,
                renderCell: (params) => (
                    <TableStyledBox>
                        <Typography variant="body2">
                            {params.value ?? "N/A"}
                        </Typography>
                    </TableStyledBox>
                ),
            },
            {
                flex: 1,
                field: "stockStatus",
                headerName: "Stock Status",
                minWidth: 120,
                align: "left",
                headerAlign: "left",
                valueGetter: (params: { row: MenuItemType }) => params?.row.inventory?.status,
                renderCell: (params) => (
                    <TableStyledBox>
                        <Typography variant="body2" className="capitalize">
                            {params.value ?? "N/A"}
                        </Typography>
                    </TableStyledBox>
                ),
            },

            {
                field: "actions",
                headerName: "Actions",
                type: "actions",
                width: 100,
                align: "center",
                headerAlign: "center",
                renderCell: (params) => {

                    const handleEdit = () => {
                        handleOpenFormModal(params.row);
                        handleMenuClose();
                    };

                    if (!currentUser || currentUser.role === UserRoleEnum.GUEST) {
                        return null; // No actions for guests or logged-out users
                    }

                    const canInteract = [UserRoleEnum.MANAGER, UserRoleEnum.ADMIN].includes(currentUser.role);

                    return (
                        canInteract && (
                            <CustomButton
                                variant={"text"}
                                // anchorEl={anchorEl}
                                // open={isOpen}
                                // onClose={handleMenuClose}
                                sx={{
                                    borderRadius: "10px",
                                    color: theme.palette.text.primary,
                                }}

                                onClick={(e) => handleMenuClick(e, params.row)}
                                startIcon={
                                    <Tooltip title="More Actions" placement={"top"}>
                                        <MoreVert/>
                                    </Tooltip>
                                }
                            >
                                <TableStyledMenuItem onClick={handleEdit}>
                                    <EditOutlined sx={{mr: 1}}/>
                                    Edit
                                </TableStyledMenuItem>
                                <TableStyledMenuItem
                                    onClick={() => handleDelete(params.row.id)}
                                    sx={{color: "error.main"}}
                                    disabled={isDeleting && selectedRowId === params.row.id}
                                >
                                    <DeleteOutline sx={{mr: 1}}/>
                                    Delete
                                </TableStyledMenuItem>
                            </CustomButton>
                        )
                    );
                },
            },
        ],
        [theme, anchorEl, selectedRowId, currentUser, handleOpenFormModal],
    );

    if (isLoading) return <MenuItemsPageSkeleton/>;

    if (isError) {
        notify(`Failed to load ${t("menuItem")}.`, "error");
        const apiError = getApiError(error, `Failed to load ${t("menuItem")}.`);
        return <ApiErrorDisplay statusCode={apiError.type} message={apiError.message}/>;
    }

    return (
        <Box>
            <Grid container spacing={2} mb={2}>
                <Grid size={{xs: 12, md: 6}}>
                    <Typography variant="h4">{t("menuItem")}</Typography>
                    <Typography variant="subtitle1">
                        Total {t("menuItem")}: {totalMenuItems}
                    </Typography>
                </Grid>
                {currentUser && (currentUser.role === "manager" || currentUser.role === "admin") && (
                    <Grid size={{xs: 12, md: 6}}>
                        <Box display="flex" justifyContent="flex-end">
                            <CustomButton
                                title={`Add ${t("item")}`}
                                variant="contained"
                                onClick={() => handleOpenFormModal()}
                            />
                        </Box>
                    </Grid>
                )}
            </Grid>

            <TableSearchActions
                searchControl={searchControl}
                searchSubmit={searchSubmit}
                handleSearch={handleSearch}
                onExportCsv={handleExportCsv}
                onExportXlsx={handleExportXlsx}
            />

            <Grid container spacing={2} sx={{mt: 2}}>
                <Grid size={12}>
                    <DataGridTable data={filteredData} columns={columns} loading={isLoading}/>
                </Grid>
            </Grid>

            <MenuItemFormModal open={formModalOpen} onClose={handleCloseFormModal} menuItemToEdit={selectedMenuItem}/>
        </Box>
    );
};

export default MenuItems;
