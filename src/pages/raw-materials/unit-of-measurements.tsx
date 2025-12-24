import {useMemo} from "react";
import {Box, Grid, Typography} from "@mui/material";
import {useGetAllUnitOfMeasurementsQuery} from "@/store/slice";
import {useMemoizedArray} from "@/hooks/use-memoized-array.ts";
import TableSearchActions from "@/components/ui/data-grid-table/table-search-action.tsx";
import {useSearch} from "@/use-search.ts";
import DataGridTable from "@/components/ui/data-grid-table";
import TableStyledBox from "@/components/ui/data-grid-table/table-styled-box.tsx";
import type {GridColDef} from "@mui/x-data-grid";

const UnitOfMeasurements = () => {
    const {data, isLoading} = useGetAllUnitOfMeasurementsQuery();
    const memoizedData = useMemoizedArray(data);

    const {searchControl, searchSubmit, handleSearch, filteredData} = useSearch({
        initialData: memoizedData,
        searchKeys: ["name", "symbol", "unitOfMeasurementFamily", "isBaseUnit", "conversionFactorToBase"],
    });

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
                        <Typography variant="body2" fontWeight="500" textTransform={"capitalize"}>
                            {params.value}
                        </Typography>
                    </TableStyledBox>
                ),
            },
            {
                flex: 1,
                field: "unitOfMeasurementFamily",
                headerName: "Type of Unit",
                minWidth: 100,
                cellClassName: "capitalize-cell",
                align: "left",
                headerAlign: "left",
                renderCell: (params) => (
                    <TableStyledBox>
                        <Typography variant="body2" textTransform={"capitalize"}>{params.value}</Typography>
                    </TableStyledBox>
                ),
            },
            {
                flex: 1,
                field: "symbol",
                headerName: "Symbol",
                minWidth: 80,
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
                field: "isBaseUnit",
                headerName: "Base Unit",
                minWidth: 100,
                align: "left",
                headerAlign: "left",
                renderCell: (params) => (
                    <TableStyledBox>
                        <Typography variant="body2">{params.value === true ? "Yes" : "No"}</Typography>
                    </TableStyledBox>
                ),
            },
            {
                flex: 1,
                field: "conversionFactorToBase",
                headerName: "Conversion Factor",
                minWidth: 200,
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
                field: "calculationLogic",
                headerName: "Conversion Note",
                minWidth: 280,
                align: "left",
                headerAlign: "left",
                renderCell: (params) => (
                    <TableStyledBox>
                        <Typography variant="body2">
                            {params.value}
                        </Typography>
                    </TableStyledBox>
                ),
            }
        ],
        [],
    );

    return (
        <Box>
            <TableSearchActions
                searchControl={searchControl}
                searchSubmit={searchSubmit}
                handleSearch={handleSearch}
                placeholder="Search Measurements..."
            />
            <Grid container spacing={2}>
                <Grid size={12}>
                    <DataGridTable data={filteredData ?? []} columns={columns} loading={isLoading}/>
                </Grid>
            </Grid>
        </Box>
    );
};

export default UnitOfMeasurements;