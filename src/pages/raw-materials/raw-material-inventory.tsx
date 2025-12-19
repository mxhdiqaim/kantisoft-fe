import {Box, Chip, Grid, Tooltip, Typography, useTheme} from "@mui/material";
import {useGetAllRawMaterialInventoryQuery} from "@/store/slice";
import CustomButton from "@/components/ui/button.tsx";
import AddIcon from "@mui/icons-material/Add";
import RawMaterialInventoryForm from "@/components/raw-material/raw-material-inventory-form.tsx";
import {useMemo, useState} from "react";
import DataGridTable from "@/components/ui/data-grid-table";
import {useSearch} from "@/use-search.ts";
import {useMemoizedArray} from "@/hooks/use-memoized-array.ts";
import TableSearchActions from "@/components/ui/data-grid-table/table-search-action.tsx";
import type {GridColDef} from "@mui/x-data-grid";
import TableStyledBox from "@/components/ui/data-grid-table/table-styled-box.tsx";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import TableStyledMenuItem from "@/components/ui/data-grid-table/table-style-menuitem.tsx";
import {relativeTime} from "@/utils/get-relative-time.ts";
import {camelCaseToTitleCase} from "@/utils";
import {getInventoryStatusChipColor} from "@/components/ui";

const RawMaterialInventory = () => {
    const theme = useTheme();
    const {data, isLoading} = useGetAllRawMaterialInventoryQuery();

    const memoizedInventoryData = useMemoizedArray(data);

    const [formModalOpen, setFormModalOpen] = useState(false);

    const {searchControl, searchSubmit, handleSearch, filteredData} = useSearch({
        initialData: memoizedInventoryData,
        searchKeys: ["name", "symbol", "unitOfMeasurementFamily", "isBaseUnit", "conversionFactorToBase"],
    });

    const handleCloseFormModal = () => {
        setFormModalOpen(false);
    };

    const handleOpenFormModal = () => {
        setFormModalOpen(true);
    };

    const columns: GridColDef[] = useMemo(
        () => [
            {
                flex: 1,
                field: "rawMaterial",
                headerName: "Raw Material",
                minWidth: 180,
                align: "left",
                headerAlign: "left",
                renderCell: (params) => (
                    <TableStyledBox>
                        <Typography
                            variant="body2"
                            fontWeight="500"
                        >
                            {params.value.name}
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
                renderCell: (params) => (
                    <TableStyledBox>
                        <Typography variant="body2">{params.value}</Typography>
                    </TableStyledBox>
                ),
            },
            {
                flex: 1,
                field: "minStockLevel",
                headerName: "Min Stock",
                minWidth: 120,
                cellClassName: "capitalize-cell",
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
                field: "status",
                headerName: "Status",
                minWidth: 120,
                align: "left",
                headerAlign: "left",
                renderCell: (params) => (
                    <TableStyledBox>
                        <Chip
                            label={camelCaseToTitleCase(params.value)}
                            color={getInventoryStatusChipColor(params.value ?? "")}
                            size="small"
                            sx={{textTransform: "capitalize"}}
                        />
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
                        <Typography variant="body2">
                            {params.value.name}
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
                            {relativeTime(new Date(params.value))}
                        </Typography>
                    </TableStyledBox>
                ),
            },
            {
                field: "actions",
                headerName: "Actions",
                width: 100,
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
                        // onClick={(e) => handleMenuClick(e, params.row)}
                        startIcon={
                            <Tooltip title="More Actions" placement={"top"}>
                                <MoreVertIcon/>
                            </Tooltip>
                        }
                    >
                        <TableStyledMenuItem
                            // onClick={() => navigate(`/raw-materials/${params.row.id}/view`)}
                            sx={{borderRadius: theme.borderRadius.small, mx: 1}}
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
                            // onClick={() => setDeleteModalOpen(true)}
                            // disabled={isDeleting}
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
        [],
    );

    return (
        <Box>
            <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3}}>
                <Typography variant="h4" component="h1">
                    Raw Material Inventory
                </Typography>
                <CustomButton
                    title={"Create Raw Material"}
                    variant="contained"
                    startIcon={<AddIcon/>}
                    onClick={handleOpenFormModal}
                />
            </Box>

            <TableSearchActions
                searchControl={searchControl}
                searchSubmit={searchSubmit}
                handleSearch={handleSearch}
            />

            <Grid container spacing={2}>
                <Grid size={12}>
                    <DataGridTable data={filteredData} columns={columns} loading={isLoading}/>
                </Grid>
            </Grid>

            <RawMaterialInventoryForm open={formModalOpen} onClose={handleCloseFormModal}/>
        </Box>
    );
};

export default RawMaterialInventory;