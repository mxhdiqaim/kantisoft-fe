import type { StoreType } from "@/types/store-types";
import { DeleteOutline, EditOutlined, MoreVert, VisibilityOutlined } from "@mui/icons-material";
import { Chip, IconButton, Menu, MenuItem, Tooltip, Typography, useTheme } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useMemo, useState, type MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import CustomNoRowsOverlay from "../customs/custom-no-rows-overlay";
import TableStyledBox from "../ui/table-styled-box";
import type { GridRenderCellParams } from "@mui/x-data-grid";
import StoreDeleteConfirmation from "./store-delete-confirmation";
import { useDeleteStoreMutation } from "@/store/slice";
import { getApiError } from "@/helpers/get-api-error";
import useNotifier from "@/hooks/useNotifier";

interface Props {
    data: StoreType[];
    loading: boolean;
}

const StoresTable = ({ data, loading }: Props) => {
    const navigate = useNavigate();
    const theme = useTheme();
    const notify = useNotifier();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

    const [deleteStore, { isLoading: isDeleting }] = useDeleteStoreMutation();

    const [storeToDelete, setStoreToDelete] = useState<StoreType | null>(null);
    const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const handleMenuClick = (event: MouseEvent<HTMLElement>, rowId: string) => {
        console.log(`Clicked row: ${rowId}`);
        setAnchorEl(event.currentTarget);
        setSelectedRowId(rowId);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedRowId(null);
    };

    const handleDeleteClick = (store: StoreType) => {
        setStoreToDelete(store);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!storeToDelete) return;
        try {
            await deleteStore(storeToDelete.id).unwrap();
            notify("Store deleted successfully", "success");
        } catch (error) {
            const defaultMessage = "Failed to delete store";
            const apiError = getApiError(error, defaultMessage);
            notify(apiError.message, "error");
            console.log(error);
        } finally {
            setDeleteDialogOpen(false);
            setStoreToDelete(null);
        }
    };

    const columns: GridColDef<StoreType>[] = useMemo(
        () => [
            { field: "name", headerName: "Store Name", flex: 1, minWidth: 200 },
            { field: "location", headerName: "Location", flex: 1, minWidth: 250 },
            {
                field: "storeType",
                headerName: "Type",
                width: 150,
                align: "center",
                headerAlign: "center",
                renderCell: (params) => (
                    <Chip
                        label={params.value}
                        size="medium"
                        sx={{ textTransform: "capitalize", borderRadius: theme.borderRadius.small }}
                    />
                ),
            },
            {
                field: "createdAt",
                headerName: "Date Created",
                width: 180,
                align: "center",
                headerAlign: "center",
                renderCell: (params: GridRenderCellParams<StoreType, string>) => {
                    const date = new Date(params.value as string);
                    if (isNaN(date.getTime())) {
                        return "Invalid Date";
                    }
                    return (
                        <TableStyledBox sx={{ alignItems: "center", justifyContent: "center" }}>
                            <Typography variant="body2" fontWeight="500">
                                {date.toLocaleDateString()}
                            </Typography>
                        </TableStyledBox>
                    );
                },
            },
            {
                field: "actions",
                headerName: "Actions",
                width: 120,
                sortable: false,
                align: "center",
                headerAlign: "center",
                renderCell: (params) => {
                    const isOpen = Boolean(anchorEl) && selectedRowId === params.row.id;

                    const handleView = () => {
                        console.log(`View Store: ${params.row.id}`);
                        navigate(`/stores/${params.row.id}/view`);
                        handleMenuClose();
                    };
                    const handleEdit = () => {
                        console.log(`Edit Store: ${params.row.id}`);
                        navigate(`/stores/${params.row.id}/edit`);
                        handleMenuClose();
                    };

                    const handleDelete = () => {
                        console.log(`Delete Store: ${params.row.id}`);
                        handleDeleteClick(params.row);
                        handleMenuClose();
                    };
                    return (
                        <>
                            <Tooltip title="More Actions">
                                <IconButton onClick={(e) => handleMenuClick(e, params.row.id)}>
                                    <MoreVert />
                                </IconButton>
                            </Tooltip>
                            <Menu anchorEl={anchorEl} open={isOpen} onClose={handleMenuClose}>
                                <MenuItem onClick={handleView}>
                                    <VisibilityOutlined sx={{ mr: 1 }} />
                                    View
                                </MenuItem>
                                <MenuItem onClick={handleEdit}>
                                    <EditOutlined sx={{ mr: 1 }} />
                                    Edit
                                </MenuItem>
                                <MenuItem onClick={handleDelete}>
                                    <DeleteOutline sx={{ mr: 1 }} />
                                    Delete
                                </MenuItem>
                            </Menu>
                        </>
                    );
                },
            },
        ],
        [anchorEl, selectedRowId, navigate],
    );
    return (
        <>
            <DataGrid
                rows={data ?? []}
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
                }}
                initialState={{
                    pagination: {
                        paginationModel: { pageSize: 10 },
                    },
                }}
                disableColumnResize
                pageSizeOptions={[10, 25, 50]}
                disableRowSelectionOnClick
                sx={{
                    border: "none",
                    "& .MuiDataGrid-columnHeaderTitle": {
                        fontWeight: 600,
                    },
                }}
            />
            <StoreDeleteConfirmation
                open={isDeleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                onConfirm={handleConfirmDelete}
                storeName={storeToDelete?.name ?? ""}
                isLoading={isDeleting}
            />
        </>
    );
};

export default StoresTable;
