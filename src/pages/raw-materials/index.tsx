import {Box, Grid, Stack, Tooltip, Typography, useTheme} from "@mui/material";
import {useDeleteRawMaterialMutation, useGetAllRawMaterialsQuery} from "@/store/slice";
import TableSearchActions from "@/components/ui/data-grid-table/table-search-action.tsx";
import {useSearch} from "@/use-search.ts";
import {useMemoizedArray} from "@/hooks/use-memoized-array.ts";
import DataGridTable from "@/components/ui/data-grid-table";
import type {GridColDef} from "@mui/x-data-grid";
import {type MouseEvent, useCallback, useMemo, useState} from "react";
import TableStyledBox from "@/components/ui/data-grid-table/table-styled-box.tsx";
import {formatCurrency} from "@/utils";
import {formatDateCustom, formatRelativeDateTime} from "@/utils/get-relative-time.ts";
import RawMaterialForm from "@/components/raw-material/raw-material-form.tsx";
import CustomButton from "@/components/ui/button.tsx";
import TableStyledMenuItem from "@/components/ui/data-grid-table/table-style-menuitem.tsx";
import type {RawMaterialType} from "@/types/raw-material-types.ts";
import useNotifier from "@/hooks/useNotifier.ts";
import CustomModal from "@/components/customs/custom-modal.tsx";
import ViewRawMaterialDrawer from "@/components/raw-material/view-raw-material-drawer.tsx";

import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const RawMaterials = () => {
    const theme = useTheme();
    const notify = useNotifier();
    const [formModalOpen, setFormModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState<RawMaterialType | null>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const {data: rawMaterialData, isLoading: isFetchingRawMaterial} = useGetAllRawMaterialsQuery();

    const [deleteRawMaterial, {isLoading: isDeleting}] = useDeleteRawMaterialMutation();
    const memoizedRawMaterialData = useMemoizedArray(rawMaterialData);

    const {searchControl, searchSubmit, handleSearch, filteredData} = useSearch({
        initialData: memoizedRawMaterialData,
        searchKeys: ["name", "symbol", "unitOfMeasurementFamily", "isBaseUnit", "conversionFactorToBase"],
    });

    const handleMenuClick = (_event: MouseEvent<HTMLElement>, row: RawMaterialType) => {
        setSelectedRow(row);
    };

    const handleCloseFormModal = () => {
        setFormModalOpen(false);
        // Always reset selectedRow when modal closes to ensure clean state for next action
        setSelectedRow(null);
    };

    const handleOpenFormModal = () => {
        setFormModalOpen(true);
    };

    const handleOpenCreateModal = () => {
        // Ensure the selectedRow is null for creation
        setSelectedRow(null);
        setFormModalOpen(true);
    }

    const handleCloseDeleteModal = () => {
        setDeleteModalOpen(false);
        setSelectedRow(null);
    };

    const handleDrawerOpen = useCallback(() => {
        setDrawerOpen(true);
    }, []);

    const handleDrawerClose = useCallback(() => {
        setDrawerOpen(false);
        setSelectedRow(null);
    }, []);

    const handleDeleteFactory = async () => {
        if (selectedRow) {
            try {
                await deleteRawMaterial(selectedRow.id).unwrap();
                notify("Factory deleted successfully", "success");
                handleCloseDeleteModal();
            } catch (error) {
                console.error("Failed to delete factory:", error);
                notify("Failed to delete factory", "error");
            }
        }
    };

    const columns: GridColDef[] = useMemo(
        () => [
            {
                flex: 1,
                field: "name",
                headerName: "Name",
                minWidth: 180,
                align: "left",
                headerAlign: "left",
                renderCell: (params) => (
                    <TableStyledBox>
                        <Typography
                            variant="body2"
                            fontWeight="500"
                        >
                            {params.value}
                        </Typography>
                    </TableStyledBox>
                ),
            },
            {
                flex: 1,
                field: "description",
                headerName: "Description",
                minWidth: 200,
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
                field: "unitOfMeasurement",
                headerName: "Measurement Unit",
                minWidth: 180,
                cellClassName: "capitalize-cell",
                align: "left",
                headerAlign: "left",
                renderCell: (params) => {
                    const name = params.value.name;
                    const symbol = params.value.symbol;
                    return (
                        <TableStyledBox>
                            <Typography variant="body2" textTransform={"capitalize"}>{name}</Typography>
                            <Typography variant="body2">({symbol})</Typography>
                        </TableStyledBox>
                    )
                },
            },
            {
                flex: 1,
                field: "latestUnitPricePresentation",
                headerName: "Price per unit",
                minWidth: 150,
                cellClassName: "capitalize-cell",
                align: "left",
                headerAlign: "left",
                renderCell: (params) => (
                    <TableStyledBox>
                        <Typography variant="body2">{formatCurrency(params.value)}</Typography>
                    </TableStyledBox>
                ),
            },
            {
                flex: 1,
                field: "createdAt",
                headerName: "Date Created",
                minWidth: 150,
                align: "left",
                headerAlign: "left",
                renderCell: (params) => (
                    <TableStyledBox>
                        <Typography variant="body2">
                            {formatDateCustom(params.value)}
                        </Typography>
                    </TableStyledBox>
                ),
            },
            {
                flex: 1,
                field: "lastModified",
                headerName: "Last Modified",
                minWidth: 150,
                align: "left",
                headerAlign: "left",
                renderCell: (params) => (
                    <TableStyledBox>
                        <Typography variant="body2">
                            {formatRelativeDateTime(params.value)}
                        </Typography>
                    </TableStyledBox>
                ),
            },
            {
                field: "actions",
                headerName: "",
                width: 60,
                align: "center",
                headerAlign: "center",
                sortable: false,
                renderCell: (params) => (
                    <CustomButton
                        variant={"text"}
                        sx={{
                            borderRadius: "10px",
                            color: theme.palette.text.primary,
                        }}
                        onClick={(e) => handleMenuClick(e, params.row)}
                        startIcon={
                            <Tooltip title="More Actions" placement={"top"}>
                                <MoreVertIcon/>
                            </Tooltip>
                        }
                    >
                        <TableStyledMenuItem
                            sx={{borderRadius: theme.borderRadius.small, mx: 1}}
                            onClick={handleDrawerOpen}
                        >
                            View Raw Material
                        </TableStyledMenuItem>
                        <TableStyledMenuItem
                            onClick={handleOpenFormModal}
                            sx={{borderRadius: theme.borderRadius.small, mx: 1}}
                        >
                            Edit Raw Material
                        </TableStyledMenuItem>

                        <TableStyledMenuItem
                            onClick={() => setDeleteModalOpen(true)}
                            disabled={isDeleting}
                            sx={{
                                mt: 1,
                                mx: 1,
                                border: `1px solid ${theme.palette.error.main}`,
                                borderRadius: theme.borderRadius.small,
                                color: theme.palette.error.main,
                            }}
                        >
                            Delete Raw Material
                        </TableStyledMenuItem>
                    </CustomButton>
                ),
            },
        ],
        [isDeleting, handleDrawerOpen, theme],
    );

    return (
        <Box>
            <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3}}>
                <Typography variant="h4" component="h1">
                    Raw Materials
                </Typography>
                <CustomButton
                    title={"Create Raw Material"}
                    variant="contained"
                    startIcon={<AddIcon/>}
                    onClick={handleOpenCreateModal}
                />
            </Box>

            <TableSearchActions
                searchControl={searchControl}
                searchSubmit={searchSubmit}
                handleSearch={handleSearch}
                placeholder={"Search Raw Materials..."}
            />

            <Grid container spacing={2}>
                <Grid size={12}>
                    <DataGridTable data={filteredData} columns={columns} loading={isFetchingRawMaterial}/>
                </Grid>
            </Grid>

            <RawMaterialForm open={formModalOpen} onClose={handleCloseFormModal} rawMaterial={selectedRow}/>

            {selectedRow?.id && (
                <ViewRawMaterialDrawer
                    open={drawerOpen}
                    onOpen={() => setDrawerOpen(true)}
                    onClose={handleDrawerClose}
                    rawMaterialId={selectedRow?.id as string}
                />
            )}

            <CustomModal
                open={deleteModalOpen}
                onClose={handleCloseDeleteModal}
                modalStyles={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    maxWidth: {xs: "90vw", sm: 500},
                }}
            >
                <Typography variant="h6" fontWeight="600">
                    Delete Raw Material?
                </Typography>
                <Typography sx={{mt: 1, fontSize: ".8rem"}} variant={"body1"}>
                    You won&apos;t be able to revert this action.
                </Typography>

                <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{mt: 3}}>
                    <CustomButton
                        title="Yes, Delete"
                        variant="contained"
                        onClick={handleDeleteFactory}
                        disabled={isDeleting}
                        color="error"
                        sx={{width: "fit-content"}}
                    />
                    <CustomButton
                        title="Cancel"
                        onClick={handleCloseDeleteModal}
                        disabled={isDeleting}
                        sx={{width: "fit-content"}}
                    />
                </Stack>
            </CustomModal>
        </Box>
    );
};

export default RawMaterials;