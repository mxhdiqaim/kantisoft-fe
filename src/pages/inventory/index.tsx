import {useGetAllInventoryQuery, useMarkAsDiscontinuedMutation} from "@/store/slice";
import type {InventoryType} from "@/types/inventory-types.ts";
import {Box, Button, Chip, Grid, MenuItem, Skeleton, Tooltip, Typography, useTheme} from "@mui/material";
import type {GridColDef, GridRenderCellParams} from "@mui/x-data-grid";
import {type MouseEvent, useMemo, useState} from "react";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DataGridTable from "@/components/ui/data-grid-table";
import {format} from "date-fns";
import TableStyledBox from "@/components/ui/data-grid-table/table-styled-box.tsx";
import CreateInventoryRecord from "@/components/inventory/create-inventory-record.tsx";
import {useTranslation} from "react-i18next";
import CustomButton from "@/components/ui/button.tsx";
import useNotifier from "@/hooks/useNotifier.ts";
import {getApiError} from "@/helpers/get-api-error.ts";
import AdjustStock from "@/components/inventory/adjust-stock.tsx";
import {getStatusChipColor} from "@/styles";
import {useNavigate} from "react-router-dom";
import {useSearch} from "@/use-search.ts";
import TableSearchActions from "@/components/ui/data-grid-table/table-search-action.tsx";

const InventoryScreen = () => {
    const {t} = useTranslation();
    const theme = useTheme();
    const notify = useNotifier();
    const navigate = useNavigate();
    const {data: inventoryData, isLoading, isError, error} = useGetAllInventoryQuery();
    const [markAsDiscontinued, {isLoading: isDiscontinuing}] = useMarkAsDiscontinuedMutation();

    const memoizedInventories = useMemo(() => inventoryData || [], [inventoryData]);

    const {searchControl, searchSubmit, handleSearch, filteredData} = useSearch({
        initialData: memoizedInventories,
        searchKeys: ["menuItem.name", "menuItem.itemCode"],
    });

    const [formModalOpen, setFormModalOpen] = useState(false);
    const [adjustStockModalOpen, setAdjustStockModalOpen] = useState(false);

    const [selectedRow, setSelectedRow] = useState<InventoryType | null>(null);

    const handleMenuClick = (_event: MouseEvent<HTMLElement>, row: InventoryType) => {
        setSelectedRow(row);
    };

    const handleOpenFormModal = () => {
        setFormModalOpen(true);
    };

    const handleCloseFormModal = () => {
        setFormModalOpen(false);
    };

    const handleOpenAdjustStockModal = () => {
        setAdjustStockModalOpen(true);
    };

    const handleCloseAdjustStockModal = () => {
        setAdjustStockModalOpen(false);
        handleMenuClose();
    };

    const handleMenuClose = () => {
        setSelectedRow(null);
    };

    const handleDiscontinue = async () => {
        if (!selectedRow) return;

        try {
            await markAsDiscontinued(selectedRow.menuItemId).unwrap();
            notify("Item has been discontinued.", "success");
        } catch (err) {
            const defaultMessage = "Failed to discontinue item.";
            const apiError = getApiError(err, defaultMessage);
            notify(apiError.message, "error");
        }
    };

    const columns: GridColDef<InventoryType>[] = useMemo(() => [
        {
            flex: 1,
            field: "menuItem",
            headerName: `${t('menuItem')}`,
            minWidth: 150,
            align: "left",
            headerAlign: "left",
            // valueGetter: (params) => params.row.menuItem?.name ?? "",
            renderCell: (params) => (
                <TableStyledBox
                    sx={{cursor: 'pointer', ":hover": {textDecoration: "underline"}}}
                    onClick={() => navigate(`/inventory/${params.row.menuItemId}/transactions`)}
                >
                    <Typography variant="body2">{params.value.name}</Typography>
                </TableStyledBox>
            ),
        },
        {
            flex: 1,
            field: "itemCode",
            headerName: "SKU",
            width: 120,
            align: "left",
            headerAlign: "left",
            // valueGetter: (params) => params.row.menuItem?.itemCode ?? "",
            renderCell: (params) => (
                <TableStyledBox>
                    <Typography variant="body2">{params.value}</Typography>
                </TableStyledBox>
            ),
        },
        {
            flex: 1,
            field: "quantity",
            headerName: "Quantity",
            type: "number",
            width: 120,
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
            headerName: "Min Level",
            type: "number",
            width: 120,
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
            width: 150,
            align: "left",
            headerAlign: "left",
            renderCell: (params: GridRenderCellParams<InventoryType, string>) => (
                <TableStyledBox>
                    <Chip
                        label={params.value}
                        color={getStatusChipColor(params.value ?? "")}
                        size="small"
                        sx={{textTransform: "capitalize"}}
                    />
                </TableStyledBox>
            ),
        },
        {
            flex: 1,
            field: "lastCountDate",
            headerName: "Last Counted",
            width: 180,
            align: "left",
            headerAlign: "left",
            renderCell: (params) => (
                <TableStyledBox>
                    <Typography variant="body2">{format(new Date(params.value), "MMM dd, yyyy, h:mm a")}</Typography>
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
                    onClick={(e) => handleMenuClick(e, params.row)}
                    startIcon={
                        <Tooltip title="More Actions" placement={"top"}>
                            <MoreVertIcon/>
                        </Tooltip>
                    }
                >
                    <MenuItem onClick={handleMenuClose}>View Details</MenuItem>
                    <MenuItem onClick={handleOpenAdjustStockModal}>Adjust Stock</MenuItem>
                    <MenuItem onClick={handleMenuClose}>Edit</MenuItem>
                    <MenuItem onClick={handleDiscontinue}
                              disabled={isDiscontinuing || params.row.status === "discontinued"}
                              sx={{color: theme.palette.error.main}}>
                        Discontinue
                    </MenuItem>
                </CustomButton>
            ),
        },
    ], [selectedRow, isDiscontinuing])

    if (isLoading) {
        return (
            <>
                <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3}}>
                    <Skeleton variant="text" width={250} height={48}/>
                    <Skeleton variant="rectangular" width={140} height={40} sx={{borderRadius: 2}}/>
                </Box>
                <Grid container spacing={2}>
                    <Grid size={12}>
                        <Skeleton variant="rectangular" width="100%" height={500} sx={{borderRadius: 1}}/>
                    </Grid>
                </Grid>
            </>
        );
    }

    if (isError) {
        return <Typography color="error">Error loading inventory: {JSON.stringify(error)}</Typography>;
    }

    return (
        <>
            <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3}}>
                <Typography variant="h4" component="h1">
                    Inventory Management
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon/>}
                    onClick={handleOpenFormModal}
                >
                    Add Record
                </Button>
            </Box>
            <TableSearchActions
                searchControl={searchControl}
                searchSubmit={searchSubmit}
                handleSearch={handleSearch}
            />

            <Grid container spacing={2}>
                <Grid size={12}>
                    <DataGridTable data={filteredData ?? []} columns={columns} loading={isLoading}/>
                </Grid>
            </Grid>
            <CreateInventoryRecord open={formModalOpen} onClose={handleCloseFormModal}/>
            <AdjustStock open={adjustStockModalOpen} onClose={handleCloseAdjustStockModal} inventoryItem={selectedRow}/>
        </>
    );
};

export default InventoryScreen;
