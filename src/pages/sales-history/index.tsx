import Spinner from "@/components/sales-history/spinners";
import SalesHistoryOverviewCard from "@/components/sales-history/sales-history-overview-card";
import SalesHistoryTable from "@/components/sales-history/sales-history-table";
import {useGetOrdersByPeriodQuery} from "@/store/slice";
import {filterSchema, type TimePeriod} from "@/types";
import {getTitle, ngnFormatter} from "@/utils";
import {relativeTime} from "@/utils/get-relative-time";
import {yupResolver} from "@hookform/resolvers/yup";
import {DinnerDiningOutlined, DomainVerificationOutlined, MonetizationOn, Person2Outlined} from "@mui/icons-material";
import {Box, Grid, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import OverviewHeader from "@/components/ui/custom-header.tsx";
import ExportCard from "@/components/customs/export-card.tsx";
import {getExportFormattedData} from "@/utils/table-export-utils.ts";
import useNotifier from "@/hooks/useNotifier.ts";
import {saveAs} from "file-saver";

const SalesHistory = () => {
    const notify = useNotifier();
    const {control, watch} = useForm<{ timePeriod: TimePeriod }>({
        mode: "onChange",
        resolver: yupResolver(filterSchema),
        defaultValues: {
            timePeriod: "today",
        },
    });

    const period = watch("timePeriod");

    const {data: ordersData, isLoading, isError, fulfilledTimeStamp} = useGetOrdersByPeriodQuery(period);

    const [lastFetched, setLastFetched] = useState<Date | null>(null);

    // Export to CSV function
    const handleExportCsv = () => {
        // Use the generic utility function with specific formatters
        const dataToExport = getExportFormattedData(filteredOrders, columns, salesHistoryFieldFormatters);

        if (dataToExport.length === 0) {
            notify("No data to export.", "error");
            return;
        }

        const header = Object.keys(dataToExport[0]);
        const csvContent = [
            header.join(","),
            ...dataToExport.map((row) =>
                header.map((key) => `"${String(row[key] || "").replace(/"/g, '""')}"`).join(","),
            ),
        ].join("\n");

        const blob = new Blob([csvContent], {type: "text/csv;charset=utf-8;"});
        saveAs(blob, `sales_history_${period.toLowerCase().replace(" ", "_")}.csv`);
    };

    useEffect(() => {
        if (fulfilledTimeStamp) {
            setLastFetched(new Date(fulfilledTimeStamp));
        }
    }, [fulfilledTimeStamp]);

    if (isLoading) return <Spinner/>;

    if (isError) {
        return (
            <Typography color="error" align="center" sx={{mt: 4}}>
                Failed to load sales history. Please try again later.
            </Typography>
        );
    }

    return (
        <Box sx={{mx: "auto"}}>
            <OverviewHeader title={"Sales"} timePeriod={period} control={control} getTimeTitle={getTitle}/>
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
                    {lastFetched ? `Last updated ${relativeTime(new Date(), lastFetched)}` : "Fetching data..."}
                </Typography>
            </Box>

            <Grid container spacing={3} mb={3}>
                <Grid size={{xs: 12, sm: 6, md: 3}}>
                    <SalesHistoryOverviewCard
                        title="Total Sales Balance"
                        color="success"
                        icon={<MonetizationOn/>}
                        value={ngnFormatter.format(Number(ordersData?.totalRevenue ?? 0))}
                        isLoading={isLoading}
                    />
                </Grid>
                <Grid size={{xs: 12, sm: 6, md: 3}}>
                    <SalesHistoryOverviewCard
                        title="Most Ordered Item"
                        color="warning"
                        icon={<DinnerDiningOutlined/>}
                        value={ordersData?.mostOrderedItem?.name || "N/A"}
                        subValue={ordersData?.mostOrderedItem ? `(${ordersData.mostOrderedItem.quantity} sold)` : ""}
                        isLoading={isLoading}
                    />
                </Grid>
                <Grid size={{xs: 12, sm: 6, md: 3}}>
                    <SalesHistoryOverviewCard
                        title="Top Seller"
                        color="secondary"
                        icon={<Person2Outlined/>}
                        value={ordersData?.topSeller?.name || "N/A"}
                        isLoading={isLoading}
                    />
                </Grid>
                <Grid size={{xs: 12, sm: 6, md: 3}}>
                    <SalesHistoryOverviewCard
                        title="Total Orders"
                        color="info"
                        icon={<DomainVerificationOutlined/>}
                        value={ordersData?.totalOrders ?? 0}
                        isLoading={isLoading}
                    />
                </Grid>
            </Grid>
            <ExportCard
                onExportCsv={handleExportCsv}
                onExportXlsx={handleExportXlsx}
            />
            <SalesHistoryTable orders={ordersData?.orders ?? []} loading={isLoading} period={period}/>
        </Box>
    );
};

export default SalesHistory;
