import {Box, Chip, Grid, Tooltip, Typography, useTheme} from "@mui/material";
import {useGetAllRawMaterialInventoryQuery} from "@/store/slice";
import CustomButton from "@/components/ui/button.tsx";
import AddIcon from "@mui/icons-material/Add";
import RawMaterialInventoryForm from "@/components/raw-material/raw-material-inventory-form.tsx";
import {type MouseEvent, useCallback, useMemo, useState} from "react";
import DataGridTable from "@/components/ui/data-grid-table";
import {useSearch} from "@/use-search.ts";
import {useMemoizedArray} from "@/hooks/use-memoized-array.ts";
import TableSearchActions from "@/components/ui/data-grid-table/table-search-action.tsx";
import type {GridColDef} from "@mui/x-data-grid";
import TableStyledBox from "@/components/ui/data-grid-table/table-styled-box.tsx";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import TableStyledMenuItem from "@/components/ui/data-grid-table/table-style-menuitem.tsx";
import {formatRelativeDateTime} from "@/utils/get-relative-time.ts";
import {camelCaseToTitleCase} from "@/utils";
import {getInventoryStatusChipColor} from "@/components/ui";
import type {MultipleRawMaterialInventoryResponseType} from "@/types/raw-material-types.ts";
import InventoryDetailsDrawer from "@/components/raw-material/inventory-details-drawer.tsx";
import RawMaterialStockInDrawer from "@/components/raw-material/raw-material-stock-in-drawer.tsx";

const RawMaterialInventory = () => {
    const theme = useTheme();
    const {data, isLoading} = useGetAllRawMaterialInventoryQuery();

    const memoizedInventoryData = useMemoizedArray(data);

    const [formModalOpen, setFormModalOpen] = useState(false);
    const [openInventoryDetailDrawer, setOpenInventoryDetailDrawer] = useState(false);
    const [openStockInDrawer, setOpenStockInDrawer] = useState(false);
    const [selectedRow, setSelectedRow] = useState<MultipleRawMaterialInventoryResponseType | null>(null);

    const {searchControl, searchSubmit, handleSearch, filteredData} = useSearch({
        initialData: memoizedInventoryData,
        searchKeys: ["rawMaterialName", "status", "latestUnitPrice", "storeName"],
    });

    const handleMenuClick = (_event: MouseEvent<HTMLElement>, row: MultipleRawMaterialInventoryResponseType) => {
        setSelectedRow(row);
    };

    const handleCloseFormModal = () => {
        setFormModalOpen(false);
        setSelectedRow(null)
    };

    const handleOpenFormModal = () => {
        setFormModalOpen(true);
    };

    const handleInventoryDrawerOpen = useCallback(() => {
        setOpenInventoryDetailDrawer(true);
    }, []);

    const handleInventoryDrawerClose = useCallback(() => {
        setOpenInventoryDetailDrawer(false);
    }, []);

    const handleStockInDrawerOpen = useCallback(() => {
        setOpenStockInDrawer(true);
    }, []);

    const handleStockInDrawerClose = useCallback(() => {
        setOpenStockInDrawer(false);
    }, []);

    const columns: GridColDef[] = useMemo(
        () => [
            {
                flex: 1,
                field: "rawMaterialName",
                headerName: "Raw Material",
                minWidth: 180,
                align: "left",
                headerAlign: "left",
                renderCell: (params) => (
                    <TableStyledBox>
                        <Typography variant="body2" fontWeight="500">
                            {params.value}
                        </Typography>
                    </TableStyledBox>
                ),
            },
            {
                flex: 1,
                field: "quantity",
                headerName: "Quantity",
                minWidth: 100,
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
                field: "storeName",
                headerName: "Store",
                minWidth: 150,
                align: "left",
                headerAlign: "left",
                renderCell: (params) => (
                    <TableStyledBox>
                        <Typography variant="body2">
                            {params.value}
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
                            onClick={handleInventoryDrawerOpen}
                            sx={{borderRadius: theme.borderRadius.small, mx: 1}}
                        >
                            View Inventory
                        </TableStyledMenuItem>
                        <TableStyledMenuItem
                            onClick={handleOpenFormModal}
                            sx={{borderRadius: theme.borderRadius.small, mx: 1}}
                        >
                            Edit Raw Material
                        </TableStyledMenuItem>
                        <TableStyledMenuItem
                            onClick={handleStockInDrawerOpen}
                            sx={{borderRadius: theme.borderRadius.small, mx: 1}}
                        >
                            Stock In
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
                    Raw Material Stock
                </Typography>
                <CustomButton
                    title={"Add Inventory"}
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

            {selectedRow?.rawMaterialId && (
                <InventoryDetailsDrawer
                    open={openInventoryDetailDrawer}
                    onOpen={() => setOpenInventoryDetailDrawer(true)}
                    onClose={handleInventoryDrawerClose}
                    rawMaterialId={selectedRow?.rawMaterialId as string}
                />
            )}

            {selectedRow?.rawMaterialId && (
                <RawMaterialStockInDrawer
                    open={openStockInDrawer}
                    onOpen={() => setOpenStockInDrawer(true)}
                    onClose={handleStockInDrawerClose}
                    rawMaterialId={selectedRow?.rawMaterialId as string}
                />
            )}

            <RawMaterialInventoryForm
                open={formModalOpen}
                onClose={handleCloseFormModal}
                rawMaterialInventory={selectedRow}
            />
        </Box>
    );
};

export default RawMaterialInventory;