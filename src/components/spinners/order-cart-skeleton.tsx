import { Box, Paper, Skeleton, Typography } from "@mui/material";

const OrderCartSkeleton = () => {
    return (
        <Paper sx={{ p: 2, height: "100%" }}>
            <Typography variant="h2" gutterBottom>
                <Skeleton width="50%" />
            </Typography>
            <Box>
                {Array.from(new Array(3)).map((_, index) => (
                    <Box
                        key={index}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            mb: 2,
                        }}
                    >
                        <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="h4">
                                <Skeleton variant="text" width="30%" />
                            </Typography>
                            <Skeleton variant="text" width={"70%"} />
                        </Box>

                        <Skeleton
                            variant="rectangular"
                            width={100}
                            height={40}
                            sx={{ borderRadius: 1 }}
                        />
                    </Box>
                ))}
            </Box>
            <Typography variant="h1">
                <Skeleton width="50%" />
            </Typography>
            <Skeleton variant="rectangular" height={40} sx={{ mt: "auto" }} />
        </Paper>
    );
};

export default OrderCartSkeleton;
