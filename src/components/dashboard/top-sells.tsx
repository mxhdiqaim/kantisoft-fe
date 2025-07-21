import { useGetTopSellsQuery } from "@/store/slice";
import type { Period } from "@/types/order-types";
import { ngnFormatter } from "@/utils";
import {
    Box,
    Card,
    CardHeader,
    LinearProgress,
    List,
    ListItem,
    ListItemText,
    Skeleton,
    Typography,
    useTheme,
} from "@mui/material";

interface Props {
    period: Period;
}

const TopSells = ({ period }: Props) => {
    const theme = useTheme();
    const { data: topSells, isLoading } = useGetTopSellsQuery({
        period,
        limit: 5,
        orderBy: "revenue",
    });

    if (isLoading) {
        return <Skeleton variant="rectangular" height={300} sx={{ borderRadius: theme.borderRadius.small }} />;
    }

    const maxRevenue = Math.max(...(topSells?.map((item) => parseFloat(item.totalRevenueGenerated)) || [0]));

    return (
        <Card sx={{ boxShadow: theme.customShadows.card, borderRadius: theme.borderRadius.small, height: "100%" }}>
            <CardHeader title="Top Selling Products" subheader={`By revenue for this ${period}`} />
            <Box sx={{ px: 2, mt: -2 }}>
                <List disablePadding>
                    {topSells?.map((item, index) => {
                        const revenue = parseFloat(item.totalRevenueGenerated);
                        const progressValue = maxRevenue > 0 ? (revenue / maxRevenue) * 100 : 0;

                        return (
                            <ListItem key={item.itemId} disableGutters divider={index < topSells?.length - 1}>
                                <ListItemText
                                    primary={
                                        <Typography variant="subtitle1" component="p" noWrap>
                                            {item.itemName}
                                        </Typography>
                                    }
                                    secondary={
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                {`Sold: ${item.totalQuantitySold}`}
                                            </Typography>
                                            <Typography variant="body2" color="text.primary" fontWeight="bold">
                                                {ngnFormatter.format(revenue)}
                                            </Typography>
                                        </Box>
                                    }
                                />
                                <Box sx={{ width: "40%", ml: 2 }}>
                                    <LinearProgress
                                        variant="determinate"
                                        value={progressValue}
                                        sx={{
                                            height: 8,
                                            borderRadius: 5,
                                            backgroundColor: theme.palette.grey[300],
                                        }}
                                    />
                                </Box>
                            </ListItem>
                        );
                    })}
                </List>
            </Box>
        </Card>
    );
};

export default TopSells;
