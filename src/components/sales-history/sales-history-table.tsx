import CustomNoRowsOverlay from "@/components/customs/custom-no-rows-overlay";
import useNotifier from "@/hooks/useNotifier.ts";
import { useAppSelector } from "@/store";
import { selectCurrentUser } from "@/store/slice/auth-slice";
import type { OrderType } from "@/types/order-types";
import { UserRoleEnum } from "@/types/user-types";
import { ngnFormatter } from "@/utils";
import { relativeTime } from "@/utils/get-relative-time";
import { getExportFormattedData } from "@/utils/table-export-utils";
import {
    EditOutlined,
    FileDownloadOutlined,
    MoreVert,
    PrintOutlined,
    Search as SearchIcon,
    VisibilityOutlined,
} from "@mui/icons-material";
import {
    Box,
    Button,
    IconButton,
    InputAdornment,
    Menu,
    MenuItem,
    TextField,
    Tooltip,
    Typography,
    useTheme,
} from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { saveAs } from "file-saver";
import { type MouseEvent, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";

import * as XLSX from "xlsx";
import TableStyledBox from "../ui/table-styled-box";
import Receipt from "./receipt";
import { useGetAllStoresQuery } from "@/store/slice";
import { useDispatch, useSelector } from "react-redux";
import { selectActiveStore, setActiveStore } from "@/store/slice/store-slice";

export interface Props {
    orders: OrderType[];
    loading: boolean;
    period: string;
}

const SalesHistoryTable = ({ orders, loading: isLoadingOrders, period }: Props) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const notify = useNotifier();
    const dispatch = useDispatch();
    const currentUser = useAppSelector(selectCurrentUser);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
    const [searchText, setSearchText] = useState("");

    const [exportAnchorEl, setExportAnchorEl] = useState<null | HTMLElement>(null);
    const isExportMenuOpen = Boolean(exportAnchorEl);

    const [orderToPrint, setOrderToPrint] = useState<OrderType | null>(null);
    const componentRef = useRef<HTMLDivElement>(null);

    const { data: stores, isLoading: isLoadingStores } = useGetAllStoresQuery();
    const activeStore = useSelector(selectActiveStore);

    const loading = isLoadingOrders || isLoadingStores;

    // Print hook
    const handleReactToPrint = useReactToPrint({
        contentRef: componentRef, // Specifies the component to print
        documentTitle: `Receipt-${orderToPrint?.reference || orderToPrint?.id}`,
        onAfterPrint: () => {
            setOrderToPrint(null);
            handleMenuClose();
        },
        // For thermal printers, adjust the page style, the Receipt component's internal CSS handles this
        pageStyle: `
            @page { size: 80mm auto; margin: 0; padding: 0; }
            body { margin: 0; padding: 0; overflow: hidden; } /* Hide scrollbars during print preview */
        `,
    });

    const filteredOrders = useMemo(() => {
        if (!searchText) return orders;

        return orders.filter((order) => (order.reference || order.id).toLowerCase().includes(searchText.toLowerCase()));
    }, [orders, searchText]);

    const handleMenuClick = (event: MouseEvent<HTMLElement>, rowId: string) => {
        setAnchorEl(event.currentTarget);
        setSelectedRowId(rowId);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedRowId(null);
    };

    // Define custom formatters for SalesHistoryTable
    const salesHistoryFieldFormatters = useMemo(
        () => ({
            reference: (row: OrderType) => row.reference || row.id,
            seller: (row: OrderType) => `${row.seller.firstName} ${row.seller.lastName}`,
            orderDate: (row: OrderType) => new Date(row.orderDate).toLocaleString(),
            totalAmount: (row: OrderType) => row.totalAmount, // Keep as number for export calculations
            paymentMethod: (row: OrderType) => row.paymentMethod,
            orderStatus: (row: OrderType) => row.orderStatus,
        }),
        [],
    );

    // Export to CSV function
    const handleExportCsv = () => {
        // Use the generic utility function with specific formatters
        const dataToExport = getExportFormattedData(filteredOrders, columns, salesHistoryFieldFormatters);

        if (dataToExport.length === 0) {
            notify("No data to export.", "error");
            // alert('No data to export.');
            setExportAnchorEl(null);
            return;
        }

        const header = Object.keys(dataToExport[0]);
        const csvContent = [
            header.join(","),
            ...dataToExport.map((row) =>
                header.map((key) => `"${String(row[key] || "").replace(/"/g, '""')}"`).join(","),
            ),
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        saveAs(blob, `sales_history_${period.toLowerCase().replace(" ", "_")}.csv`);
        setExportAnchorEl(null);
    };

    // Export to XLSX function
    const handleExportXlsx = () => {
        // Use the generic utility function with specific formatters
        const dataToExport = getExportFormattedData(filteredOrders, columns, salesHistoryFieldFormatters);

        if (dataToExport.length === 0) {
            notify("No data to export.", "error");
            // alert('No data to export.');
            setExportAnchorEl(null);
            return;
        }

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sales History");

        const colWidths = columns
            .filter((col) => col.field !== "actions" && col.headerName)
            .map((col) => ({ wch: (col.headerName?.toString().length || 15) + 5 }));

        worksheet["!cols"] = colWidths;

        XLSX.writeFile(workbook, `sales_history_${period.toLowerCase().replace(" ", "_")}.xlsx`);
        setExportAnchorEl(null);
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
                        navigate(`/sales-history/${params.row.id}/view`);
                        handleMenuClose();
                    };
                    const handleEdit = () => {
                        console.log(`Edit order: ${params.row.id}`);
                        handleMenuClose();
                    };

                    const handlePrintReceipt = () => {
                        const orderToFind = orders.find((order) => order.id === params.row.id);
                        if (orderToFind) {
                            setOrderToPrint(orderToFind);
                        } else {
                            notify("Order data not found for printing.", "error");
                            handleMenuClose();
                        }
                    };

                    const isGuest = currentUser?.role === UserRoleEnum.GUEST;
                    const isPending = params.row.orderStatus === "pending";
                    const canEdit = !isGuest && isPending;

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
                                {canEdit && (
                                    <MenuItem onClick={handleEdit}>
                                        <EditOutlined sx={{ mr: 1 }} />
                                        Edit
                                    </MenuItem>
                                )}
                                <MenuItem onClick={handlePrintReceipt}>
                                    <PrintOutlined sx={{ mr: 1 }} />
                                    Print
                                </MenuItem>
                            </Menu>
                        </>
                    );
                },
            },
        ],
        [theme, anchorEl, selectedRowId, currentUser, orders, navigate, notify],
    );

    useEffect(() => {
        if (!activeStore && stores && stores.length > 0) {
            dispatch(setActiveStore(stores[0]));
        }
    }, [activeStore, stores, dispatch]);

    useEffect(() => {
        if (orderToPrint) {
            handleReactToPrint();
        }
    }, [orderToPrint, handleReactToPrint]);

    return (
        <Box>
            <div style={{ display: "none" }}>
                {orderToPrint && (
                    <div ref={componentRef}>
                        <Receipt order={orderToPrint} storeData={activeStore} />
                    </div>
                )}
            </div>
            <Box sx={{ p: 2, display: "flex", justifyContent: "flex-start" }}>
                <TextField
                    variant="outlined"
                    size="small"
                    placeholder="Search by reference..."
                    value={searchText}
                    fullWidth
                    sx={{ height: 45 }}
                    onChange={(e) => setSearchText(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
                {/* Export Button and Menu */}
                <Button
                    variant="contained"
                    size="small"
                    startIcon={<FileDownloadOutlined />}
                    onClick={(event) => setExportAnchorEl(event.currentTarget)}
                    sx={{ ml: 2, height: 45, minWidth: 200 }}
                >
                    Export
                </Button>
                <Menu anchorEl={exportAnchorEl} open={isExportMenuOpen} onClose={() => setExportAnchorEl(null)}>
                    <MenuItem onClick={handleExportCsv}>Export as CSV</MenuItem>
                    <MenuItem onClick={handleExportXlsx}>Export as XLSX</MenuItem>
                </Menu>
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
