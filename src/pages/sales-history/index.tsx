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
import {UserRoleEnum, UserStatusEnum} from "@/types/user-types.ts";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "@/store/slice/auth-slice.ts";

const SalesHistory = () => {
    const currentUser = useSelector(selectCurrentUser);
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

    const adminOrManager = currentUser?.status === UserStatusEnum.ACTIVE &&
        (currentUser?.role === UserRoleEnum.ADMIN || currentUser?.role === UserRoleEnum.MANAGER);


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
            <OverviewHeader
                title={"Sales"}
                timePeriod={period}
                control={control}
                getTimeTitle={getTitle}
                name={"timePeriod"}
                timeTitle={"Sales History"}
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

            {adminOrManager && (
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
            )}

            <SalesHistoryTable orders={ordersData?.orders ?? []} loading={isLoading} period={period}/>
        </Box>
    );
};

export default SalesHistory;
