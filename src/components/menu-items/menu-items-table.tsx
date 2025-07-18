import {
    Box,
    IconButton,
    Menu,
    MenuItem as MuiMenuItem,
    styled,
    Tooltip,
    Typography,
} from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { EditOutlined, MoreVert, DeleteOutline } from "@mui/icons-material";
import CustomNoRowsOverlay from "@/components/customs/custom-no-rows-overlay";
import { useTheme } from "@mui/material";
import { useMemo, useState, type MouseEvent } from "react";
import { ngnFormatter } from "@/utils";
import type { MenuItemType } from "@/types/menu-item-type";
import { useDeleteMenuItemMutation } from "@/store/slice";
import useNotifier from "@/hooks/useNotifier";

const StyledBox = styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    height: "100%",
    gap: theme.spacing(1),
}));

export interface Props {
    menuItems: MenuItemType[];
    loading: boolean;
    onEdit: (menuItem: MenuItemType) => void;
}

const MenuItemsTable = ({ menuItems, loading, onEdit }: Props) => {
    const theme = useTheme();
    const notify = useNotifier();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
    const [deleteMenuItem, { isLoading: isDeleting }] =
        useDeleteMenuItemMutation();

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

    const columns: GridColDef<MenuItemType>[] = useMemo(
        () => [
            {
                flex: 0.4,
                field: "itemCode",
                headerName: "Item Code",
                minWidth: 150,
                renderCell: (params) => (
                    <StyledBox sx={{ justifyContent: "center" }}>
                        <Typography variant="body2" className="capitalize">
                            {params?.value}
                        </Typography>
                    </StyledBox>
                ),
            },
            {
                flex: 1,
                field: "name",
                headerName: "Name",
                minWidth: 150,
                renderCell: (params) => (
                    <StyledBox>
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
                    </StyledBox>
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
                    <StyledBox sx={{ justifyContent: "center" }}>
                        <Typography variant="body2" fontWeight="medium">
                            {ngnFormatter.format(params.value)}
                        </Typography>
                    </StyledBox>
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
                    <StyledBox sx={{ justifyContent: "center" }}>
                        <Typography
                            variant="body2"
                            className="capitalize"
                            sx={{
                                backgroundColor: params.value
                                    ? theme.palette.success.main
                                    : theme.palette.error.main,
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
                    </StyledBox>
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
                    const isOpen =
                        Boolean(anchorEl) && selectedRowId === params.row.id;

                    const handleEdit = () => {
                        onEdit(params.row);
                        handleMenuClose();
                    };

                    return (
                        <>
                            <Tooltip title="More Actions">
                                <IconButton
                                    onClick={(e) =>
                                        handleMenuClick(e, params.row.id)
                                    }
                                >
                                    <MoreVert />
                                </IconButton>
                            </Tooltip>
                            <Menu
                                anchorEl={anchorEl}
                                open={isOpen}
                                onClose={handleMenuClose}
                            >
                                <MuiMenuItem onClick={handleEdit}>
                                    <EditOutlined sx={{ mr: 1 }} />
                                    Edit
                                </MuiMenuItem>
                                <MuiMenuItem
                                    onClick={() => handleDelete(params.row.id)}
                                    sx={{ color: "error.main" }}
                                    disabled={
                                        isDeleting &&
                                        selectedRowId === params.row.id
                                    }
                                >
                                    <DeleteOutline sx={{ mr: 1 }} />
                                    Delete
                                </MuiMenuItem>
                            </Menu>
                        </>
                    );
                },
            },
        ],
        [theme, anchorEl, selectedRowId],
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
