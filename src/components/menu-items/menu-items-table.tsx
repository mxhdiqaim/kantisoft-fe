import CustomNoRowsOverlay from "@/components/customs/custom-no-rows-overlay";
import useNotifier from "@/hooks/useNotifier";
import { useAppSelector } from "@/store";
import { useDeleteMenuItemMutation } from "@/store/slice";
import { selectCurrentUser } from "@/store/slice/auth-slice";
import type { MenuItemType } from "@/types/menu-item-type";
import { ngnFormatter } from "@/utils";

import { getExportFormattedData } from "@/utils/table-export-utils";
import { DeleteOutline, EditOutlined, FileDownloadOutlined, MoreVert } from "@mui/icons-material";
import { Box, Button, IconButton, Menu, MenuItem as MuiMenuItem, Tooltip, Typography, useTheme } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { saveAs } from "file-saver";
import { type MouseEvent, useMemo, useState } from "react";

import * as XLSX from "xlsx";
import TableStyledBox from "../ui/table-styled-box";

export interface Props {
    menuItems: MenuItemType[];
    loading: boolean;
    onEdit: (menuItem: MenuItemType) => void;
}

const MenuItemsTable = ({ menuItems, loading, onEdit }: Props) => {
    const theme = useTheme();
    const notify = useNotifier();
    const currentUser = useAppSelector(selectCurrentUser);

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
    const [deleteMenuItem, { isLoading: isDeleting }] = useDeleteMenuItemMutation();

    const [exportAnchorEl, setExportAnchorEl] = useState<null | HTMLElement>(null);
    const isExportMenuOpen = Boolean(exportAnchorEl);

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

    // Export to CSV function
    const handleExportCsv = () => {
        const dataToExport = getExportFormattedData(menuItems, columns, menuItemsFieldFormatters);

        if (dataToExport.length === 0) {
            notify("No data to export.", "error");
            // alert('No data to export.');
            setExportAnchorEl(null);
            return;
        }

        const header = Object.keys(dataToExport[0]);
        const csvContent = [
            header.join(","),
            ...dataToExport.map((row) =>
                header.map((key) => `"${String(row[key] || "").replace(/"/g, '""')}"`).join(","),
            ),
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        saveAs(blob, `menu_items_data.csv`);
        setExportAnchorEl(null);
    };

    // Export to XLSX function
    const handleExportXlsx = () => {
        const dataToExport = getExportFormattedData(menuItems, columns, menuItemsFieldFormatters);

        if (dataToExport.length === 0) {
            notify("No data to export.", "error");
            // alert('No data to export.');
            setExportAnchorEl(null);
            return;
        }

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Menu Items Data");

        const colWidths = columns
            .filter((col) => col.field !== "actions" && col.headerName)
            .map((col) => ({ wch: (col.headerName?.toString().length || 15) + 5 }));

        worksheet["!cols"] = colWidths;

        XLSX.writeFile(workbook, `menu_items_data.xlsx`);
        setExportAnchorEl(null);
    };

    const columns: GridColDef<MenuItemType>[] = useMemo(
        () => [
            {
                flex: 0.4,
                field: "itemCode",
                headerName: "Item Code",
                minWidth: 150,
                renderCell: (params) => (
                    <TableStyledBox sx={{ justifyContent: "center" }}>
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
                flex: 0.5,
                field: "price",
                headerName: "Price",
                type: "number",
                minWidth: 100,
                align: "center",
                headerAlign: "center",
                renderCell: (params) => (
                    <TableStyledBox sx={{ justifyContent: "center" }}>
                        <Typography variant="body2" fontWeight="medium">
                            {ngnFormatter.format(params.value)}
                        </Typography>
                    </TableStyledBox>
                ),
            },
            {
                flex: 0.5,
                field: "isAvailable",
                headerName: "Is Available",
                minWidth: 100,
                align: "center",
                headerAlign: "center",
                renderCell: (params) => (
                    <TableStyledBox sx={{ justifyContent: "center" }}>
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
                field: "actions",
                headerName: "Actions",
                type: "actions",
                width: 100,
                align: "center",
                headerAlign: "center",
                renderCell: (params) => {
                    const isOpen = Boolean(anchorEl) && selectedRowId === params.row.id;

                    const handleEdit = () => {
                        onEdit(params.row);
                        handleMenuClose();
                    };

                    if (!currentUser || currentUser.role === "guest") {
                        return null; // No actions for guests or logged-out users
                    }

                    const canEdit = ["manager", "admin", "user"].includes(currentUser.role);
                    const canDelete = ["manager", "admin"].includes(currentUser.role);

                    return (
                        <>
                            <Tooltip title="More Actions">
                                <IconButton onClick={(e) => handleMenuClick(e, params.row.id)}>
                                    <MoreVert />
                                </IconButton>
                            </Tooltip>
                            <Menu anchorEl={anchorEl} open={isOpen} onClose={handleMenuClose}>
                                {canEdit && (
                                    <MuiMenuItem onClick={handleEdit}>
                                        <EditOutlined sx={{ mr: 1 }} />
                                        Edit
                                    </MuiMenuItem>
                                )}
                                {canDelete && (
                                    <MuiMenuItem
                                        onClick={() => handleDelete(params.row.id)}
                                        sx={{ color: "error.main" }}
                                        disabled={isDeleting && selectedRowId === params.row.id}
                                    >
                                        <DeleteOutline sx={{ mr: 1 }} />
                                        Delete
                                    </MuiMenuItem>
                                )}
                            </Menu>
                        </>
                    );
                },
            },
        ],
        [theme, anchorEl, selectedRowId, currentUser, onEdit],
    );
    return (
        <Box
            sx={{
                height: 600,
                width: "100%",
                "& .capitalize": {
                    textTransform: "capitalize",
                },
            }}
        >
            <Box sx={{ p: 2, display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                {/* Export Button and Menu */}
                <Button
                    variant="contained"
                    size="small"
                    startIcon={<FileDownloadOutlined />}
                    sx={{ height: 45, minWidth: 200 }}
                    onClick={(event) => setExportAnchorEl(event.currentTarget)}
                >
                    Export
                </Button>
                <Menu anchorEl={exportAnchorEl} open={isExportMenuOpen} onClose={() => setExportAnchorEl(null)}>
                    <MuiMenuItem onClick={handleExportCsv}>Export as CSV</MuiMenuItem>
                    <MuiMenuItem onClick={handleExportXlsx}>Export as XLSX</MuiMenuItem>
                </Menu>
            </Box>
            <DataGrid
                rows={menuItems}
                columns={columns}
                loading={loading}
                slots={{
                    noRowsOverlay: CustomNoRowsOverlay,
                }}
                slotProps={{
                    loadingOverlay: {
                        variant: "skeleton",
                        noRowsVariant: "skeleton",
                    },
                    noRowsOverlay: {
                        period: "No menu items available.",
                    },
                }}
                initialState={{
                    pagination: {
                        paginationModel: { pageSize: 10 },
                    },
                }}
                disableColumnResize
                pageSizeOptions={[10, 25, 50]}
                // disableRowSelectionOnClick
                checkboxSelection={true}
                getRowId={(row) => row.id}
                onRowClick={(params) => {
                    if (params.id !== selectedRowId) {
                        onEdit(params.row);
                    }
                }}
                sx={{
                    border: "none",
                    "& .MuiDataGrid-columnHeaderTitle": {
                        fontWeight: 600,
                    },
                }}
            />
        </Box>
    );
};

export default MenuItemsTable;
