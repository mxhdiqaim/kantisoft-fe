import StoresPageLoading from "@/components/stores/loading";
import {useDeleteStoreMutation, useGetAllStoresQuery} from "@/store/slice";
import {AddOutlined, DeleteOutline, EditOutlined, MoreVert, VisibilityOutlined} from "@mui/icons-material";
import {Box, Chip, Grid, Tooltip, Typography, useTheme} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import type {GridColDef, GridRenderCellParams} from "@mui/x-data-grid";
import type {StoreType} from "@/types/store-types.ts";
import {type MouseEvent, useMemo, useState} from "react";
import TableStyledBox from "@/components/ui/data-grid-table/table-styled-box.tsx";
import StoreDeleteConfirmation from "@/components/stores/store-delete-confirmation.tsx";
import useNotifier from "@/hooks/useNotifier.ts";
import {getApiError} from "@/helpers/get-api-error.ts";
import DataGridTable from "@/components/ui/data-grid-table";
import TableSearchActions from "@/components/ui/data-grid-table/table-search-action.tsx";
import {useSearch} from "@/use-search.ts";
import CustomButton from "@/components/ui/button.tsx";
import TableStyledMenuItem from "@/components/ui/data-grid-table/table-style-menuitem.tsx";

const StoresPage = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const {t} = useTranslation();
    const notify = useNotifier();

    const {data: storesData, isLoading, isError} = useGetAllStoresQuery();
    const [deleteStore, {isLoading: isDeleting}] = useDeleteStoreMutation();

    const memoizedStores = useMemo(() => storesData || [], [storesData]);

    const {searchControl, searchSubmit, handleSearch, filteredData} = useSearch({
        initialData: memoizedStores,
        searchKeys: ["name", "storeType", "location"],
    });

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

    const [storeToDelete, setStoreToDelete] = useState<StoreType | null>(null);
    const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);

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
                field: "branchType",
                headerName: "Branch Type",
                minWidth: 120,
                align: "left",
                headerAlign: "left",
                renderCell: (params: GridRenderCellParams<StoreType>) => {
                    const isMain = params.row.branchType === "main";
                    const label = isMain ? `Main ${t("store")}` : `Branch ${t("store")}`;
                    const color = isMain ? "primary" : "secondary";
                    return (
                        <TableStyledBox>
                            <Chip
                                label={label}
                                size="medium"
                                color={color}
                                sx={{textTransform: "capitalize", borderRadius: theme.borderRadius.small}}
                            />
                        </TableStyledBox>
                    );
                },
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
                    const isMainStore = params.row.branchType === "main";
                    const hasBranches = storesData?.length > 1;
                    const isDeleteDisabled = isMainStore && hasBranches;

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
                        <CustomButton
                            variant={"text"}
                            sx={{
                                borderRadius: "10px",
                                color: theme.palette.text.primary,
                            }}
                            onClick={(e) => handleMenuClick(e, params.row.id)}
                            startIcon={
                                <Tooltip title="More Actions" placement={"top"}>
                                    <MoreVert/>
                                </Tooltip>
                            }
                        >
                            <TableStyledMenuItem onClick={handleView}>
                                <VisibilityOutlined sx={{mr: 1}}/>
                                View
                            </TableStyledMenuItem>
                            <TableStyledMenuItem onClick={handleEdit}>
                                <EditOutlined sx={{mr: 1}}/>
                                Edit
                            </TableStyledMenuItem>
                            <TableStyledMenuItem onClick={handleDelete} disabled={isDeleteDisabled}>
                                <DeleteOutline sx={{mr: 1}}/>
                                Delete
                            </TableStyledMenuItem>
                        </CustomButton>
                    );
                },
            },
        ],
        [anchorEl, selectedRowId, navigate, theme.borderRadius.small, storesData, t],
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
                <CustomButton title={`New ${t("store")}`} variant="contained" startIcon={<AddOutlined/>}
                              onClick={() => navigate("/stores/new")}/>
            </Box>
            <TableSearchActions
                searchControl={searchControl}
                searchSubmit={searchSubmit}
                handleSearch={handleSearch}
                // onExportCsv={handleExportCsv}
                // onExportXlsx={handleExportXlsx}
            />
            <Grid container spacing={2}>
                <Grid size={12}>
                    <DataGridTable data={filteredData} loading={isLoading} columns={columns}/>
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
