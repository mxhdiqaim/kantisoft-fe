import {Box, Grid, Typography} from "@mui/material";
import {useGetAllRawMaterialsQuery} from "@/store/slice";
import TableSearchActions from "@/components/ui/data-grid-table/table-search-action.tsx";
import {useSearch} from "@/use-search.ts";
import {useMemoizedArray} from "@/hooks/use-memoized-array.ts";
import DataGridTable from "@/components/ui/data-grid-table";
import type {GridColDef} from "@mui/x-data-grid";
import {useMemo, useState} from "react";
import TableStyledBox from "@/components/ui/data-grid-table/table-styled-box.tsx";
import {formatCurrency} from "@/utils";
import {relativeTime} from "@/utils/get-relative-time.ts";
import CreateRawMaterial from "@/components/inventory/create-raw-material.tsx";
import CustomButton from "@/components/ui/button.tsx";
import AddIcon from "@mui/icons-material/Add";

const RawMaterials = () => {
    const [formModalOpen, setFormModalOpen] = useState(false);
    const {data, isLoading} = useGetAllRawMaterialsQuery();

    const memoizedData = useMemoizedArray(data);

    const {searchControl, searchSubmit, handleSearch, filteredData} = useSearch({
        initialData: memoizedData,
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
                field: "name",
                headerName: "Name",
                minWidth: 150,
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
                minWidth: 200,
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
                headerName: "Unit Price",
                minWidth: 180,
                cellClassName: "capitalize-cell",
                align: "left",
                headerAlign: "left",
                renderCell: (params) => (
                    <TableStyledBox>
                        <Typography variant="body2">{formatCurrency(params.value)}</Typography>
                    </TableStyledBox>
                ),
            },
            // {
            //     flex: 1,
            //     field: "latestUnitPriceBase",
            //     headerName: "Unit Price (Base)",
            //     minWidth: 180,
            //     align: "left",
            //     headerAlign: "left",
            //     renderCell: (params) => (
            //         <TableStyledBox>
            //             <Typography variant="body2">{formatCurrency(params.value)}</Typography>
            //         </TableStyledBox>
            //     ),
            // },
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
                            {relativeTime(new Date(params.value))}
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
        ],
        [],
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

            <CreateRawMaterial open={formModalOpen} onClose={handleCloseFormModal}/>
        </Box>
    );
};

export default RawMaterials;