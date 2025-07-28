import { Box, Paper, Skeleton } from "@mui/material";

type Props = {
    rows?: number;
    columns?: number;
};

const ActivityLogSkeleton = ({ rows = 10, columns = 7 }: Props) => (
    <Box sx={{ p: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Skeleton variant="text" width={200} height={50} />
        </Box>
        <Paper>
            <Box sx={{ width: "100%", overflowX: "auto" }}>
                <Box sx={{ display: "flex", mb: 1 }}>
                    {[...Array(columns)].map((_, idx) => (
                        <Skeleton
                            key={idx}
                            variant="rectangular"
                            width={idx <= 3 ? 900 * idx : 200 * (idx + idx)}
                            height={32}
                            sx={{ mr: 2, borderRadius: 1 }}
                        />
                    ))}
                </Box>
                {[...Array(rows)].map((_, rowIdx) => (
                    <Box key={rowIdx} sx={{ display: "flex", mb: 1 }}>
                        {[...Array(columns)].map((_, colIdx) => (
                            <Skeleton
                                key={colIdx}
                                variant="rectangular"
                                width={colIdx <= 3 ? 900 * colIdx : 200 * (colIdx + colIdx)}
                                height={28}
                                sx={{ mr: 2, borderRadius: 1 }}
                            />
                        ))}
                    </Box>
                ))}
            </Box>
        </Paper>
    </Box>
);
export default ActivityLogSkeleton;
