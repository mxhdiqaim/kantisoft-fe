import StoresPageLoading from "@/components/stores/loading";
import {useDeleteStoreMutation, useGetAllStoresQuery} from "@/store/slice";
import {AddOutlined, DeleteOutline, EditOutlined, MoreVert, VisibilityOutlined} from "@mui/icons-material";
import {Box, Button, Chip, Grid, IconButton, Menu, MenuItem, Tooltip, Typography, useTheme} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import type {GridColDef, GridRenderCellParams} from "@mui/x-data-grid";
import type {StoreType} from "@/types/store-types.ts";
import {type MouseEvent, useMemo, useState} from "react";
import TableStyledBox from "@/components/ui/table-styled-box.tsx";
import StoreDeleteConfirmation from "@/components/stores/store-delete-confirmation.tsx";
import useNotifier from "@/hooks/useNotifier.ts";
import {getApiError} from "@/helpers/get-api-error.ts";
import DataGridTable from "@/components/ui/data-grid-table";

const StoresPage = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const {t} = useTranslation();
    const notify = useNotifier();

    const {data: storesData, isLoading, isError} = useGetAllStoresQuery();
    const [deleteStore, {isLoading: isDeleting}] = useDeleteStoreMutation();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedRowId, setSelectedRowId] = useState<string | null>(null);


    const [storeToDelete, setStoreToDelete] = useState<StoreType | null>(null);
    const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const flattenedStores = useMemo(() => {
        if (!storesData || storesData.length === 0) {
            return [];
        }
        const mainStore = storesData[0];
        const branches = mainStore.branches || [];
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {branches: _, ...mainStoreWithoutBranches} = mainStore;
        return [mainStoreWithoutBranches, ...branches];
    }, [storesData]);

    const handleMenuClick = (event: MouseEvent<HTMLElement>, rowId: string) => {
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
            {
                flex: 1,
                field: "name",
                headerName: "Store Name",
                minWidth: 150,
                align: "left",
                headerAlign: "left",
                renderCell: (params) => (
                    <TableStyledBox>
                        <Typography variant="body2">{params.value}</Typography>
                    </TableStyledBox>
                ),
            },
            {
                flex: 1,
                field: "location",
                headerName: "Location",
                minWidth: 150,
                align: "left",
                headerAlign: "left",
                renderCell: (params) => (
                    <TableStyledBox>
                        <Typography variant="body2">{params.value}</Typography>
                    </TableStyledBox>
                ),
            },
            {
                flex: 1,
                field: "storeType",
                headerName: "Type",
                minWidth: 150,
                align: "left",
                headerAlign: "left",
                renderCell: (params) => (
                    <TableStyledBox>
                        <Chip
                            label={params.value}
                            size="medium"
                            sx={{textTransform: "capitalize", borderRadius: theme.borderRadius.small}}
                        />
                    </TableStyledBox>
                ),
            },
            {
                flex: 1,
                field: "createdAt",
                headerName: "Date Created",
                width: 180,
                align: "left",
                headerAlign: "left",
                renderCell: (params: GridRenderCellParams<StoreType, string>) => {
                    const date = new Date(params.value as string);
                    if (isNaN(date.getTime())) {
                        return "Invalid Date";
                    }
                    return (
                        <TableStyledBox>
                            <Typography variant="body2" fontWeight="500">
                                {date.toLocaleDateString()}
                            </Typography>
                        </TableStyledBox>
                    );
                },
            },
            {
                // flex: 1,
                field: "actions",
                headerName: "Actions",
                width: 120,
                sortable: false,
                align: "center",
                headerAlign: "center",
                renderCell: (params) => {
                    const isOpen = Boolean(anchorEl) && selectedRowId === params.row.id;

                    const handleView = () => {
                        navigate(`/stores/${params.row.id}/view`);
                        handleMenuClose();
                    };
                    const handleEdit = () => {
                        navigate(`/stores/${params.row.id}/edit`);
                        handleMenuClose();
                    };

                    const handleDelete = () => {
                        handleDeleteClick(params.row);
                        handleMenuClose();
                    };
                    return (
                        <>
                            <Tooltip title="More Actions">
                                <IconButton onClick={(e) => handleMenuClick(e, params.row.id)}>
                                    <MoreVert/>
                                </IconButton>
                            </Tooltip>
                            <Menu anchorEl={anchorEl} open={isOpen} onClose={handleMenuClose}>
                                <MenuItem onClick={handleView}>
                                    <VisibilityOutlined sx={{mr: 1}}/>
                                    View
                                </MenuItem>
                                <MenuItem onClick={handleEdit}>
                                    <EditOutlined sx={{mr: 1}}/>
                                    Edit
                                </MenuItem>
                                <MenuItem onClick={handleDelete}>
                                    <DeleteOutline sx={{mr: 1}}/>
                                    Delete
                                </MenuItem>
                            </Menu>
                        </>
                    );
                },
            },
        ],
        [anchorEl, selectedRowId, navigate, theme.borderRadius.small],
    );

    if (isLoading) return <StoresPageLoading/>;

    if (isError) {
        return (
            <Typography color="error" align="center" sx={{mt: 4}}>
                Failed to load stores. Please try again later.
            </Typography>
        );
    }

    return (
        <Box>
            <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3}}>
                <Typography variant="h4">{t("store")} Management</Typography>
                <Button variant="contained" startIcon={<AddOutlined/>} onClick={() => navigate("/stores/new")}>
                    New {t("store")}
                </Button>
            </Box>
            <Grid container spacing={2}>
                <Grid size={12}>
                    <DataGridTable data={flattenedStores} loading={isLoading} columns={columns}/>
                </Grid>
            </Grid>

            <StoreDeleteConfirmation
                open={isDeleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                onConfirm={handleConfirmDelete}
                storeName={storeToDelete?.name ?? ""}
                isLoading={isDeleting}
            />
        </Box>
    );
};

export default StoresPage;
