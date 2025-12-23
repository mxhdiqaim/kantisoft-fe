import {Box, Chip, Grid, Skeleton, Typography} from "@mui/material";
import {useGetInventoryTransactionsQuery} from "@/store/slice";
import type {GridColDef} from "@mui/x-data-grid";
import {useEffect, useMemo, useState} from "react";
import TableStyledBox from "@/components/ui/data-grid-table/table-styled-box.tsx";
import DataGridTable from "@/components/ui/data-grid-table";
import OverviewHeader from "@/components/ui/custom-header.tsx";
import {camelCaseToTitleCase, getTitle} from "@/utils";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {filterSchema, type TimePeriod} from "@/types";
import {relativeTime} from "@/utils/get-relative-time.ts";
import {getTransactionChipColor, getTransactionTypeChipColor} from "@/components/ui";
import {useMemoizedArray} from "@/hooks/use-memoized-array.ts";
import {useSearch} from "@/use-search.ts";
import TableSearchActions from "@/components/ui/data-grid-table/table-search-action.tsx";

const InventoryTransactions = () => {
    const {control, watch} = useForm<{ timePeriod: TimePeriod }>({
        mode: "onChange",
        resolver: yupResolver(filterSchema),
        defaultValues: {
            timePeriod: "today",
        },
    });

    const period = watch("timePeriod");

    const {data, isLoading, isError, fulfilledTimeStamp} = useGetInventoryTransactionsQuery({timePeriod: period});

    const memoizedData = useMemoizedArray(data?.transactions || []);

    const {searchControl, searchSubmit, handleSearch, filteredData} = useSearch({
        initialData: memoizedData,
        searchKeys: ["type", "label"],
    });

    const [lastFetched, setLastFetched] = useState<Date | null>(null);

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
                    <Chip
                        label={camelCaseToTitleCase(params.value)}
                        color={getTransactionTypeChipColor(params.value)}
                        size="small"
                        sx={{textTransform: "capitalize"}}
                    />
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

    useEffect(() => {
        if (fulfilledTimeStamp) {
            setLastFetched(new Date(fulfilledTimeStamp));
        }
    }, [fulfilledTimeStamp]);

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

    return (
        <Box>
            <OverviewHeader
                title={"Inventory Transactions"}
                timePeriod={data.timePeriod as TimePeriod}
                control={control}
                getTimeTitle={getTitle}
                timeTitle={"Transactions"}
            />
            <Box sx={{display: "flex", justifyContent: "flex-end"}}>
                <Typography
                    variant="h6"
                    component="span"
                    color="text.secondary"
                    align="right"
                    mb={1}
                    sx={{
                        fontWeight: 400,
                        textAlign: "right",
                    }}
                >
                    {lastFetched ? `Last updated ${relativeTime(lastFetched)}` : "Fetching data..."}
                </Typography>
            </Box>

            <TableSearchActions
                searchControl={searchControl}
                searchSubmit={searchSubmit}
                handleSearch={handleSearch}
            />

            <Grid container spacing={2}>
                <Grid size={12}>
                    <DataGridTable data={filteredData} columns={columns} loading={isLoading}
                                   getRowId={() => Math.random().toString(36).substr(2, 9)}/>
                </Grid>
            </Grid>
        </Box>
    );
};

export default InventoryTransactions;