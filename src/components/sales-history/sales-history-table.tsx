import useNotifier from "@/hooks/useNotifier.ts";
import {useAppSelector} from "@/store";
import {selectCurrentUser} from "@/store/slice/auth-slice";
import type {OrderType} from "@/types/order-types";
import {UserRoleEnum} from "@/types/user-types";
import {ngnFormatter} from "@/utils";
import {relativeTime} from "@/utils/get-relative-time";
import {EditOutlined, MoreVert, PrintOutlined, VisibilityOutlined,} from "@mui/icons-material";
import {Box, Grid, Tooltip, Typography, useTheme} from "@mui/material";
import {type GridColDef} from "@mui/x-data-grid";
import {type MouseEvent, useEffect, useMemo, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useReactToPrint} from "react-to-print";
import TableStyledBox from "../ui/data-grid-table/table-styled-box.tsx";
import Receipt from "./receipt";
import {useGetAllStoresQuery} from "@/store/slice";
import {useDispatch, useSelector} from "react-redux";
import {selectActiveStore, setActiveStore} from "@/store/slice/store-slice";
import DataGridTable from "@/components/ui/data-grid-table";
import TableSearchActions from "@/components/ui/data-grid-table/table-search-action.tsx";
import {useSearch} from "@/use-search.ts";
import {exportToCsv, exportToXlsx, getExportFormattedData} from "@/utils/export-data-utils";
import CustomButton from "@/components/ui/button.tsx";
import TableStyledMenuItem from "@/components/ui/data-grid-table/table-style-menuitem.tsx";

export interface Props {
    orders: OrderType[];
    loading: boolean;
    period: string;
}

const SalesHistoryTable = ({orders, loading: isLoadingOrders, period}: Props) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const notify = useNotifier();
    const dispatch = useDispatch();
    const currentUser = useAppSelector(selectCurrentUser);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

    const memoizedOrders = useMemo(() => orders ?? [], [orders]);

    const {searchControl, searchSubmit, handleSearch, filteredData} = useSearch({
        initialData: memoizedOrders,
        searchKeys: ["reference", "id"],
    });

    const [orderToPrint, setOrderToPrint] = useState<OrderType | null>(null);
    const componentRef = useRef<HTMLDivElement>(null);

    const {data: stores, isLoading: isLoadingStores} = useGetAllStoresQuery();
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
        // For thermal printers, adjust the page style; the Receipt component's internal CSS handles this
        pageStyle: `
            @page { size: 80mm auto; margin: 0; padding: 0; }
            body { margin: 0; padding: 0; overflow: hidden; } /* Hide scrollbars during print preview */
        `,
    });

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

    const prepareExportData = () => {
        return getExportFormattedData(
            filteredData, // Your data source
            columns,      // Your column definitions
            salesHistoryFieldFormatters // Your specific formatters
        );
    };

    const handleExportCsv = () => {
        const dataToExport = prepareExportData();

        if (dataToExport.length === 0) {
            notify("No data to export.", "error");
            return;
        }

        const filename = `sales_history_${period.toLowerCase().replace(" ", "_")}.csv`;
        exportToCsv(dataToExport, filename); // Uses generic utility
    };

    // Export to XLSX function
    const handleExportXlsx = () => {
        const dataToExport = prepareExportData();

        if (dataToExport.length === 0) {
            notify("No data to export.", "error");
            return;
        }

        const filename = `sales_history_${period.toLowerCase().replace(" ", "_")}.xlsx`;
        exportToXlsx(dataToExport, filename, "Sales History", columns); // Uses generic utility
    };

    const columns: GridColDef[] = useMemo(
        () => [
            {
                flex: 1,
                field: "reference",
                headerName: "Order Reference",
                width: 200,
                align: "left",
                headerAlign: "left",
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
                align: "left",
                headerAlign: "left",
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
                align: "left",
                headerAlign: "left",
                width: 150,
                renderCell: (params) => (
                    <TableStyledBox>
                        <Typography variant="body2">{relativeTime(new Date(params.value))}</Typography>
                    </TableStyledBox>
                ),
            },
            {
                flex: 1,
                field: "totalAmount",
                headerName: "Total Amount",
                type: "number",
                width: 180,
                align: "left",
                headerAlign: "left",
                renderCell: (params) => (
                    <TableStyledBox>
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
                align: "left",
                headerAlign: "left",
                // cellClassName: "capitalize-cell",
                renderCell: (params) => (
                    <TableStyledBox>
                        <Typography>
                            {params.value.charAt(0).toUpperCase() + params.value.slice(1)}
                        </Typography>
                    </TableStyledBox>
                )
            },
            {
                flex: 1,
                field: "orderStatus",
                headerName: "Status",
                width: 150,
                align: "left",
                headerAlign: "left",
                renderCell: (params) => (
                    <TableStyledBox>
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

                    const handleView = () => {
                        navigate(`/pos-sale/sales/${params.row.id}/view`);
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
                        <CustomButton
                            variant={"text"}
                            sx={{
                                borderRadius: "10px",
                                color: theme.palette.text.primary,
                            }}
                            onClick={(e) => handleMenuClick(e, params.row.id)}
                            startIcon={
                                <Tooltip title="More Actions" placement={"top"}>
                                    <MoreVert/>
                                </Tooltip>
                            }
                        >
                            <TableStyledMenuItem onClick={handleView}>
                                <VisibilityOutlined sx={{mr: 1}}/>
                                View
                            </TableStyledMenuItem>
                            {canEdit && (
                                <TableStyledMenuItem onClick={handleEdit}>
                                    <EditOutlined sx={{mr: 1}}/>
                                    Edit
                                </TableStyledMenuItem>
                            )}
                            <TableStyledMenuItem onClick={handlePrintReceipt}>
                                <PrintOutlined sx={{mr: 1}}/>
                                Print
                            </TableStyledMenuItem>
                        </CustomButton>
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
            <div style={{display: "none"}}>
                {orderToPrint && (
                    <div ref={componentRef}>
                        <Receipt order={orderToPrint} storeData={activeStore}/>
                    </div>
                )}
            </div>

            <TableSearchActions
                searchControl={searchControl}
                searchSubmit={searchSubmit}
                handleSearch={handleSearch}
                onExportCsv={handleExportCsv}
                onExportXlsx={handleExportXlsx}
            />
            <Grid container spacing={2} sx={{mt: 2}}>
                <Grid size={12}>
                    <DataGridTable data={filteredData ?? []} columns={columns} loading={loading}/>
                </Grid>
            </Grid>
        </Box>
    );
};

export default SalesHistoryTable;
