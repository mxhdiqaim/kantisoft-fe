import {Box, Chip, Grid, Skeleton, Typography} from "@mui/material";
import {useGetInventoryTransactionsQuery} from "@/store/slice";
import type {GridColDef} from "@mui/x-data-grid";
import {useMemo} from "react";
import TableStyledBox from "@/components/ui/data-grid-table/table-styled-box.tsx";
import DataGridTable from "@/components/ui/data-grid-table";
import {getTransactionChipColor} from "@/styles";

const InventoryTransactions = () => {
    const {data, isLoading, isError} = useGetInventoryTransactionsQuery({});

    const columns: GridColDef[] = useMemo(() => [
        {
            flex: 1,
            field: "type",
            headerName: "Transaction Type",
            minWidth: 180,
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
            field: "totalChange",
            headerName: "Value Change",
            minWidth: 150,
            align: "left",
            headerAlign: "left",
            renderCell: (params) => (
                <TableStyledBox>
                    {/*<Typography variant="body2">{params.value}</Typography>*/}
                    <Chip
                        label={params.value}
                        color={getTransactionChipColor(params.value)}
                        size="small"
                        sx={{textTransform: "capitalize"}}
                    />
                </TableStyledBox>
            ),
        },
        {
            flex: 1,
            field: "label",
            headerName: "Label",
            type: "number",
            minWidth: 120,
            align: "left",
            headerAlign: "left",
            renderCell: (params) => (
                <TableStyledBox>
                    <Typography variant="body2">{params.value}</Typography>
                </TableStyledBox>
            ),
        }
    ], []);


    if (isLoading) {
        return (
            <>
                <Skeleton variant="text" width={400} height={48}/>
                <Skeleton variant="text" width={200} height={24} sx={{mb: 3}}/>
                <Skeleton variant="rectangular" width="100%" height={500}/>
            </>
        );
    }

    if (isError) {
        console.log("error:", isError);
        return <Box>Something went wrong</Box>
    }

    const {transactions: transactionsData, timePeriod} = data;
    
    return (
        <Box>
            <Typography variant="h4" component="h1">
                Transaction History
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{mb: 3, textDecoration: "capitalize"}}>
                Time Period: {timePeriod}
            </Typography>

            <Grid container spacing={2}>
                <Grid size={12}>
                    <DataGridTable
                        data={transactionsData ?? []}
                        columns={columns}
                        loading={isLoading}
                        getRowId={() => Math.random().toString(36).substr(2, 9)}
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default InventoryTransactions;