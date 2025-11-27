import {useGetAllInventoryQuery} from "@/store/slice";
import type {InventoryType} from "@/types/inventory-types.ts";
import {
    Box,
    Button,
    Chip,
    CircularProgress,
    Grid,
    IconButton,
    Menu,
    MenuItem,
    Typography,
    useTheme
} from "@mui/material";
import type {GridColDef, GridRenderCellParams} from "@mui/x-data-grid";
import {useState} from "react";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DataGridTable from "@/components/ui/data-grid-table";
import {format} from "date-fns";
import TableStyledBox from "@/components/ui/table-styled-box.tsx";

const InventoryScreen = () => {
    const theme = useTheme();
    const {data: inventoryData, isLoading, isError, error} = useGetAllInventoryQuery();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedRow, setSelectedRow] = useState<InventoryType | null>(null);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, row: InventoryType) => {
        setAnchorEl(event.currentTarget);
        setSelectedRow(row);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedRow(null);
    };

    const getStatusChipColor = (status: string) => {
        switch (status) {
            case "inStock":
                return "success";
            case "lowStock":
                return "warning";
            case "outOfStock":
                return "error";
            case "discontinued":
                return "default";
            default:
                return "default";
        }
    };

    const columns: GridColDef[] = [
        {
            flex: 1,
            field: "menuItemName",
            headerName: "Menu Item",
            minWidth: 150,
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
            field: "itemCode",
            headerName: "Item Code",
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
            field: "quantity",
            headerName: "On Hand",
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
                <Chip
                    label={params.value}
                    color={getStatusChipColor(params.value || "")}
                    size="small"
                    sx={{textTransform: "capitalize"}}
                />
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
                <IconButton
                    aria-label="actions"
                    onClick={(event) => handleMenuOpen(event, params.row)}
                >
                    <MoreVertIcon/>
                </IconButton>
            ),
        },
    ];

    if (isLoading) {
        return <Box sx={{display: "flex", justifyContent: "center", mt: 4}}><CircularProgress/></Box>;
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
                    // onClick={() => handleOpenAddModal()}
                >
                    Add Record
                </Button>
            </Box>

            <Grid container spacing={2}>
                <Grid size={12}>
                    <DataGridTable
                        data={inventoryData || []}
                        columns={columns}
                        loading={isLoading}
                    />
                </Grid>
            </Grid>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleMenuClose}>View Details</MenuItem>
                <MenuItem onClick={handleMenuClose}>Adjust Stock</MenuItem>
                <MenuItem onClick={handleMenuClose}>Edit</MenuItem>
                <MenuItem onClick={handleMenuClose} sx={{color: theme.palette.error.main}}>
                    Discontinue
                </MenuItem>
            </Menu>
        </>
    );
};

export default InventoryScreen;
