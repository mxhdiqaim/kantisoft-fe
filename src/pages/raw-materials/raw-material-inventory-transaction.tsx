import {
    Box,
    Chip,
    FormControl,
    Grid,
    InputAdornment,
    MenuItem,
    Skeleton,
    Tooltip,
    Typography,
    useTheme
} from "@mui/material";
import {useGetAllRawMaterialsQuery, useGetRawMaterialInventoryTransactionsQuery} from "@/store/slice";
import type {GridColDef} from "@mui/x-data-grid";
import {type MouseEvent, useEffect, useMemo, useState} from "react";
import TableStyledBox from "@/components/ui/data-grid-table/table-styled-box.tsx";
import {camelCaseToTitleCase, getTitle} from "@/utils";
import {getTransactionTypeChipColor, StyledTextField} from "@/components/ui";
import {formatDateCustom, relativeTime} from "@/utils/get-relative-time.ts";
import CustomButton from "@/components/ui/button.tsx";
import TableStyledMenuItem from "@/components/ui/data-grid-table/table-style-menuitem.tsx";
import DataGridTable from "@/components/ui/data-grid-table";
import {Controller, useForm} from "react-hook-form";
import {type TimePeriod} from "@/types";
import {yupResolver} from "@hookform/resolvers/yup";
import OverviewHeader from "@/components/ui/custom-header.tsx";
import {useMemoizedArray} from "@/hooks/use-memoized-array.ts";
import {useSearch} from "@/use-search.ts";
import TableSearchActions from "@/components/ui/data-grid-table/table-search-action.tsx";
import {
    fetchRawMaterialAndFilterByPeriod,
    type RawMaterialInventoryTransaction as SingleRawMaterialInventoryTransaction
} from "@/types/raw-material-types.ts";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import Icon from "@/components/ui/icon.tsx";
import ArrowDownIconSvg from "@/assets/icons/arrow-down.svg";
import CustomCard from "@/components/customs/custom-card.tsx";

const RawMaterialInventoryTransaction = () => {
    const theme = useTheme();

    const {
        control,
        watch,
        formState: {errors},
    } = useForm({
        mode: "onChange",
        defaultValues: {
            timePeriod: "today",
            rawMaterialId: "",
        },

        resolver: yupResolver(fetchRawMaterialAndFilterByPeriod),
    });

    const period = watch("timePeriod");
    const rawMaterialId = watch("rawMaterialId");

    const {
        data,
        isLoading,
        isError,
        fulfilledTimeStamp
    } = useGetRawMaterialInventoryTransactionsQuery({timePeriod: period, rawMaterialId});

    const {data: rawMaterialData, isLoading: isFetchingRawMaterial} = useGetAllRawMaterialsQuery(undefined, {
        skip: !open,
    });

    const memoizedRawMaterial = useMemoizedArray(rawMaterialData);

    const [lastFetched, setLastFetched] = useState<Date | null>(null);
    const [selectedRow, setSelectedRow] = useState<SingleRawMaterialInventoryTransaction | null>(null);

    console.log("selectedRow:", selectedRow);

    const memoizedData = useMemoizedArray(data?.transactions || []);

    const {searchControl, searchSubmit, handleSearch, filteredData} = useSearch({
        initialData: memoizedData,
        searchKeys: ["reference", "source", "type", "notes"],
    });

    const handleMenuClick = (_event: MouseEvent<HTMLElement>, row: SingleRawMaterialInventoryTransaction) => {
        setSelectedRow(row);
    };

    const columns: GridColDef[] = useMemo(() => [
        {
            flex: 1,
            field: "reference",
            headerName: "Reference",
            minWidth: 250,
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
            field: "notes",
            headerName: "Notes",
            minWidth: 220,
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
            field: "type",
            headerName: "Type",
            minWidth: 120,
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
            field: "quantity",
            headerName: "Quantity",
            type: "number",
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
            field: "source",
            headerName: "Source",
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
            field: "rawMaterial",
            headerName: "Raw Material",
            minWidth: 120,
            align: "left",
            headerAlign: "left",
            renderCell: (params) => (
                <TableStyledBox>
                    <Typography variant="body2">{params.value.name}</Typography>
                </TableStyledBox>
            ),
        },
        {
            flex: 1,
            field: "createdAt",
            headerName: "Created",
            minWidth: 120,
            align: "left",
            headerAlign: "left",
            renderCell: (params) => (
                <TableStyledBox>
                    <Typography variant="body2">{formatDateCustom(params.value)}</Typography>
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
                        // onClick={handleOpenAdjustStockModal}
                    >
                        Adjust Stock
                    </TableStyledMenuItem>
                </CustomButton>
            ),
        },
    ], [theme]);

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

    if (isError || !data) {
        console.log("error:", isError);
        return <Box>Something went wrong</Box>
    }

    return (
        <Box>
            <OverviewHeader
                title={"Transaction"}
                timePeriod={data.timePeriod as TimePeriod}
                control={control} getTimeTitle={getTitle}
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
            <Grid container spacing={2}>
                <Grid size={{xs: 12, md: 8}}>
                    <TableSearchActions
                        searchControl={searchControl}
                        searchSubmit={searchSubmit}
                        handleSearch={handleSearch}
                    />
                </Grid>
                <Grid size={{xs: 12, md: 4}}>
                    <CustomCard>
                        <Controller
                            name="rawMaterialId"
                            control={control}
                            render={({field}) => (
                                <FormControl fullWidth>
                                    <StyledTextField
                                        {...field}
                                        select
                                        label="Raw Material"
                                        placeholder="Select Raw Material"
                                        disabled={isFetchingRawMaterial}
                                        SelectProps={{
                                            IconComponent: () => null,
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <Icon
                                                        src={ArrowDownIconSvg}
                                                        alt={"Dropdown Arrow"}
                                                        sx={{width: 15, height: 15}}
                                                    />
                                                </InputAdornment>
                                            ),
                                        }}
                                        error={Boolean(errors.rawMaterialId)}
                                        helperText={errors.rawMaterialId?.message}
                                    >
                                        <MenuItem value={""} disabled>
                                            Select Raw Material
                                        </MenuItem>
                                        {memoizedRawMaterial?.map((rawMaterial) => (
                                            <MenuItem key={rawMaterial.id} value={rawMaterial.id}
                                                      sx={{textTransform: "capitalize"}}>
                                                {rawMaterial.name}
                                            </MenuItem>
                                        ))}
                                    </StyledTextField>
                                </FormControl>
                            )}
                        />
                    </CustomCard>
                </Grid>
            </Grid>


            <Grid container spacing={2}>
                <Grid size={12}>
                    <DataGridTable data={filteredData} columns={columns} loading={isLoading}/>
                </Grid>
            </Grid>
        </Box>
    );
};

export default RawMaterialInventoryTransaction;
