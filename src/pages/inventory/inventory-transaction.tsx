import {useMemo} from "react";
import {useParams} from "react-router-dom";
import {Box, Chip, Grid, Skeleton, Typography} from "@mui/material";
import {useGetAllInventoryQuery, useGetTransactionsByMenuItemQuery} from "@/store/slice";
import DataGridTable from "@/components/ui/data-grid-table";
import type {GridColDef} from "@mui/x-data-grid";
import TableStyledBox from "@/components/ui/data-grid-table/table-styled-box.tsx";
import {getTransactionChipColor} from "@/styles";
import {relativeTime} from "@/utils/get-relative-time.ts";

const InventoryTransaction = () => {
    const {id: menuItemId} = useParams<{ id: string }>();

    const {
        data: transactions,
        isLoading: isLoadingTransactions,
        isError: isErrorTransactions,
        error: transactionsError,
    } = useGetTransactionsByMenuItemQuery({menuItemId: menuItemId!}, {skip: !menuItemId});

    const {data: inventoryData, isLoading: isLoadingInventory} = useGetAllInventoryQuery();

    const inventoryItem = useMemo(() => {
        return inventoryData?.find(item => item.menuItemId === menuItemId);
    }, [inventoryData, menuItemId]);

    const columns: GridColDef[] = useMemo(() => [
        {
            flex: 1,
            field: "transactionDate",
            headerName: "Date",
            minWidth: 180,
            align: "left",
            headerAlign: "left",
            renderCell: (params) => (
                <TableStyledBox>
                    <Typography variant="body2">{relativeTime(new Date(), new Date(params.value))}</Typography>
                </TableStyledBox>
            ),
        },
        {
            flex: 1,
            field: "transactionType",
            headerName: "Transaction Type",
            minWidth: 150,
            align: "left",
            headerAlign: "left",
            renderCell: (params) => (
                <TableStyledBox>
                    <Chip
                        label={params.value.replace(/([A-Z])/g, ' $1').trim()}
                        color={getTransactionChipColor(params.value)}
                        size="small"
                        sx={{textTransform: "capitalize"}}
                    />
                </TableStyledBox>
            ),
        },
        {
            flex: 1,
            field: "quantityChange",
            headerName: "Quantity Change",
            type: "number",
            minWidth: 120,
            align: "left",
            headerAlign: "left",
            renderCell: (params) => (
                <TableStyledBox>
                    <Typography variant="body2"
                                color={params.value > 0 ? 'success.main' : 'error.main'}>{params.value}</Typography>
                </TableStyledBox>
            ),
        },
        {
            flex: 1,
            field: "newQuantity",
            headerName: "New Quantity",
            type: "number",
            minWidth: 120,
            align: "left",
            headerAlign: "left",
            renderCell: (params) => <TableStyledBox>
                <Typography variant="body2">{params.value}</Typography>
            </TableStyledBox>,
        },
        {
            flex: 1,
            field: "user",
            headerName: "User",
            minWidth: 150,
            // valueGetter: (params) => params.row.user?.fullName || 'System',
            align: "left",
            headerAlign: "left",
            renderCell: (params) => <TableStyledBox>
                <Typography variant="body2">{params.value}</Typography>
            </TableStyledBox>,
        },
        {
            field: "notes",
            headerName: "Notes",
            flex: 2,
            minWidth: 200,
            align: "left",
            headerAlign: "left",
            renderCell: (params) => <TableStyledBox>
                <Typography variant="body2">{params.value || 'N/A'}</Typography>
            </TableStyledBox>,
        },
    ], []);

    if (isLoadingTransactions || isLoadingInventory) {
        return (
            <>
                <Skeleton variant="text" width={400} height={48}/>
                <Skeleton variant="text" width={200} height={24} sx={{mb: 3}}/>
                <Skeleton variant="rectangular" width="100%" height={500}/>
            </>
        );
    }

    if (!menuItemId) {
        return <Typography color="error">Menu Item ID is missing.</Typography>;
    }

    if (isErrorTransactions) {
        return <Typography color="error">Error loading transactions: {JSON.stringify(transactionsError)}</Typography>;
    }

    return (
        <Box>
            <Typography variant="h4" component="h1">
                Transaction History
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{mb: 3}}>
                {inventoryItem?.menuItem.name} (SKU: {inventoryItem?.menuItem.itemCode})
            </Typography>

            <Grid container spacing={2}>
                <Grid size={12}>
                    <DataGridTable
                        data={transactions || []}
                        columns={columns}
                        loading={isLoadingTransactions}
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default InventoryTransaction;
