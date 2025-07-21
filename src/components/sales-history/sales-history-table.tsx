import { Box, IconButton, InputAdornment, Menu, MenuItem, TextField, Tooltip, Typography } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { EditOutlined, MoreVert, PrintOutlined, VisibilityOutlined, Search as SearchIcon } from "@mui/icons-material";
import CustomNoRowsOverlay from "@/components/customs/custom-no-rows-overlay";
import { useTheme } from "@mui/material";
import { useMemo, useState, type MouseEvent } from "react";
import { relativeTime } from "@/utils/get-relative-time";
import type { OrderType } from "@/types/order-types";
import { ngnFormatter } from "@/utils";
import { useNavigate } from "react-router-dom";
import TableStyledBox from "../ui/table-styled-box";

export interface Props {
    orders: OrderType[];
    loading: boolean;
    period: string;
}

const SalesHistoryTable = ({ orders, loading, period }: Props) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
    const [searchText, setSearchText] = useState("");

    const filteredOrders = useMemo(() => {
        if (!searchText) {
            return orders;
        }
        return orders.filter((order) => (order.reference || order.id).toLowerCase().includes(searchText.toLowerCase()));
    }, [orders, searchText]);

    const handleMenuClick = (event: MouseEvent<HTMLElement>, rowId: string) => {
        console.log(`Clicked row: ${rowId}`);
        setAnchorEl(event.currentTarget);
        setSelectedRowId(rowId);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedRowId(null);
    };

    const columns: GridColDef[] = useMemo(
        () => [
            {
                flex: 1,
                field: "reference",
                headerName: "Order Reference",
                width: 200,
                cellClassName: "capitalize-cell",
                renderCell: (params) => (
                    <TableStyledBox>
                        <Typography variant="body2">{params.value || params.row.id}</Typography>
                    </TableStyledBox>
                ),
            },
            {
                flex: 1,
                field: "seller",
                headerName: "Seller Name",
                width: 200,
                renderCell: (params) => (
                    <TableStyledBox>
                        <Typography variant="body2">
                            {params.value.firstName} {params.value.lastName}
                        </Typography>
                    </TableStyledBox>
                ),
            },
            {
                flex: 1,
                field: "orderDate",
                headerName: "Time",
                align: "center",
                headerAlign: "center",
                width: 150,
                renderCell: (params) => (
                    <TableStyledBox sx={{ alignItems: "center", justifyContent: "center" }}>
                        <Typography variant="body2">{relativeTime(new Date(), new Date(params.value))}</Typography>
                    </TableStyledBox>
                ),
            },
            {
                flex: 1,
                field: "totalAmount",
                headerName: "Total Amount",
                type: "number",
                width: 180,
                align: "center",
                headerAlign: "center",
                renderCell: (params) => (
                    <TableStyledBox sx={{ alignItems: "center", justifyContent: "center" }}>
                        <Typography variant="body2" fontWeight="medium">
                            {ngnFormatter.format(params.value)}{" "}
                        </Typography>
                    </TableStyledBox>
                ),
            },
            {
                flex: 1,
                field: "paymentMethod",
                headerName: "Payment Method",
                width: 180,
                align: "center",
                headerAlign: "center",
                cellClassName: "capitalize-cell",
            },
            {
                flex: 1,
                field: "orderStatus",
                headerName: "Status",
                width: 150,
                align: "center",
                headerAlign: "center",
                renderCell: (params) => (
                    <TableStyledBox sx={{ alignItems: "center", justifyContent: "center" }}>
                        <Typography
                            variant="body2"
                            className="capitalize"
                            sx={{
                                color:
                                    theme.palette.mode === "dark"
                                        ? theme.palette.text.primary
                                        : theme.palette.primary.contrastText,
                                padding: "4px 8px",
                                borderRadius: "4px",
                                fontWeight: "500",
                                textTransform: "capitalize",
                                backgroundColor:
                                    params.value === "completed"
                                        ? theme.palette.success.light
                                        : params.value === "pending"
                                          ? theme.palette.warning.light
                                          : theme.palette.error.light,
                            }}
                        >
                            {params.value}
                        </Typography>
                    </TableStyledBox>
                ),
            },
            {
                field: "actions",
                headerName: "Actions",
                type: "actions",
                width: 100,
                align: "center",
                headerAlign: "center",
                renderCell: (params) => {
                    const isOpen = Boolean(anchorEl) && selectedRowId === params.row.id;

                    const handleView = () => {
                        console.log(`View order: ${params.row.id}`);
                        navigate(`/sales-history/${params.row.id}/view`);
                        handleMenuClose();
                    };
                    const handleEdit = () => {
                        console.log(`Edit order: ${params.row.id}`);
                        handleMenuClose();
                    };
                    const handlePrint = () => {
                        console.log(`Print receipt for order: ${params.row.id}`);
                        handleMenuClose();
                    };

                    return (
                        <>
                            <Tooltip title="More Actions">
                                <IconButton onClick={(e) => handleMenuClick(e, params.row.id)}>
                                    <MoreVert />
                                </IconButton>
                            </Tooltip>
                            <Menu anchorEl={anchorEl} open={isOpen} onClose={handleMenuClose}>
                                <MenuItem onClick={handleView}>
                                    <VisibilityOutlined sx={{ mr: 1 }} />
                                    View
                                </MenuItem>
                                <MenuItem onClick={handleEdit}>
                                    <EditOutlined sx={{ mr: 1 }} />
                                    Edit
                                </MenuItem>
                                <MenuItem onClick={handlePrint}>
                                    <PrintOutlined sx={{ mr: 1 }} />
                                    Print
                                </MenuItem>
                            </Menu>
                        </>
                    );
                },
            },
        ],
        [theme, anchorEl, selectedRowId],
    );

    return (
        <Box>
            <Box sx={{ p: 2, display: "flex", justifyContent: "flex-start" }}>
                <TextField
                    variant="outlined"
                    size="small"
                    placeholder="Search by reference..."
                    value={searchText}
                    fullWidth
                    onChange={(e) => setSearchText(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>
            <DataGrid
                rows={filteredOrders}
                columns={columns}
                loading={loading}
                slots={{
                    noRowsOverlay: CustomNoRowsOverlay,
                }}
                slotProps={{
                    loadingOverlay: {
                        variant: "skeleton",
                        noRowsVariant: "skeleton",
                    },
                    noRowsOverlay: {
                        period: period ? `No sales yet for this ${period}.` : "No sales yet.",
                    },
                }}
                initialState={{
                    pagination: {
                        paginationModel: { pageSize: 10 },
                    },
                }}
                disableColumnResize
                pageSizeOptions={[10, 25, 50]}
                disableRowSelectionOnClick
                sx={{
                    border: "none",
                    "& .MuiDataGrid-columnHeaderTitle": {
                        fontWeight: 600,
                    },
                }}
            />
        </Box>
    );
};

export default SalesHistoryTable;
