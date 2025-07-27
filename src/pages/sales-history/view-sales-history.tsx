import Receipt from "@/components/sales-history/receipt";
import ViewSalesHistoryLoading from "@/components/sales-history/spinners/view-sales-history-loading";
import { useGetAllStoresQuery, useGetOrderByIdQuery } from "@/store/slice";
import { selectActiveStore, setActiveStore } from "@/store/slice/store-slice";
import { ArrowBackIosNewOutlined, LocalPrintshopOutlined } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const ViewSalesHistory = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { id } = useParams();
    const printRef = useRef<HTMLDivElement>(null);

    const {
        data: order,
        isLoading: isOrdersLoading,
        isError,
    } = useGetOrderByIdQuery(id!, {
        skip: !id,
    });

    const { data: stores, isLoading: isLoadingStores } = useGetAllStoresQuery();
    const activeStore = useSelector(selectActiveStore);

    const loading = isOrdersLoading && isLoadingStores;

    const handlePrint = () => {
        window.print();
    };

    useEffect(() => {
        if (!activeStore && stores && stores.length > 0) {
            dispatch(setActiveStore(stores[0]));
        }
    }, [activeStore, stores, dispatch]);

    if (loading) return <ViewSalesHistoryLoading />;

    if (isError || !order) {
        return <Typography>Failed to load order details.</Typography>;
    }

    return (
        <Box>
            {/* --- Action Buttons --- */}
            <Box className="no-print" sx={{ mb: 3, display: "flex", gap: 1 }}>
                <Button variant="outlined" size="small" onClick={() => navigate(-1)}>
                    <ArrowBackIosNewOutlined fontSize="small" sx={{ height: 16, mr: 0.5 }} />
                    Go Back
                </Button>
                <Button variant="contained" size="small" onClick={handlePrint}>
                    <LocalPrintshopOutlined fontSize="small" sx={{ height: 16, mr: 0.5 }} />
                    Print Receipt
                </Button>
            </Box>

            {/* --- Printable Receipt Area --- */}
            <Receipt order={order} storeData={activeStore} ref={printRef} />
        </Box>
    );
};

export default ViewSalesHistory;
