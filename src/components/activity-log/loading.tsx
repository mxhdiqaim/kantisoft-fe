import {Box, Skeleton} from "@mui/material";
import CustomCard from "@/components/customs/custom-card.tsx";

type Props = {
    rows?: number;
    columns?: number;
};

const ActivityLogSkeleton = ({rows = 10, columns = 7}: Props) => (
    <Box>
        <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2}}>
            <Skeleton variant="text" width={200} height={50}/>
        </Box>

        <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2}}>
            <Skeleton variant="text" width={"100%"} height={100}/>
        </Box>
        <CustomCard>
            <Box sx={{width: "100%", overflowX: "auto"}}>
                <Box sx={{display: "flex", mb: 1, gap: 1}}>
                    {[...Array(columns)].map((_, idx) => (
                        <Skeleton
                            key={idx}
                            variant="rectangular"
                            width={1000}
                            height={32}
                            sx={{borderRadius: 1}}
                        />
                    ))}
                </Box>
                {[...Array(rows)].map((_, rowIdx) => (
                    <Box key={rowIdx} sx={{display: "flex", mb: 1, gap: 1}}>
                        {[...Array(columns)].map((_, colIdx) => (
                            <Skeleton
                                key={colIdx}
                                variant="rectangular"
                                width={1000}
                                height={28}
                                sx={{borderRadius: 1}}
                            />
                        ))}
                    </Box>
                ))}
            </Box>
        </CustomCard>
    </Box>
);
export default ActivityLogSkeleton;
