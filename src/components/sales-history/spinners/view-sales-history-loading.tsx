import {
    Box,
    Grid,
    Paper,
    Skeleton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    useTheme,
} from "@mui/material";

const ViewSalesHistoryLoading = () => {
    const theme = useTheme();
    return (
        <Box>
            {/* --- Action Buttons Skeleton --- */}
            <Box sx={{ mb: 3, display: "flex", gap: 1 }}>
                <Skeleton variant="rectangular" width={100} height={32} />
                <Skeleton variant="rectangular" width={120} height={32} />
            </Box>

            {/* --- Receipt Skeleton --- */}
            <Paper
                elevation={0}
                sx={{
                    p: { xs: 2, md: 4 },
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: theme.borderRadius.medium,
                }}
            >
                {/* Header */}
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3 }}>
                    <Box>
                        <Skeleton variant="text" width={150} height={40} />
                        <Skeleton variant="text" width={200} />
                    </Box>
                    <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: "16px" }} />
                </Box>

                <Skeleton variant="rectangular" height={1} sx={{ mb: 3 }} />

                {/* Details Grid */}
                <Grid container spacing={2} sx={{ mb: 4 }}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Skeleton variant="text" width="50%" />
                        <Skeleton variant="text" width="80%" height={24} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Skeleton variant="text" width="50%" />
                        <Skeleton variant="text" width="80%" height={24} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Skeleton variant="text" width="50%" />
                        <Skeleton variant="text" width="80%" height={24} />
                    </Grid>
                </Grid>

                {/* Table */}
                <Skeleton variant="text" width={120} height={32} sx={{ mb: 2 }} />
                <TableContainer>
                    <Table size="medium">
                        <TableHead>
                            <TableRow>
                                {Array.from(new Array(5)).map((_, index) => (
                                    <TableCell key={index}>
                                        <Skeleton variant="text" />
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Array.from(new Array(3)).map((_, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <Skeleton variant="text" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton variant="text" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton variant="text" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton variant="text" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton variant="text" />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Skeleton variant="rectangular" height={1} sx={{ my: 3 }} />

                {/* Total */}
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Box sx={{ textAlign: "right", width: 150 }}>
                        <Skeleton variant="text" />
                        <Skeleton variant="text" height={36} />
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
};

export default ViewSalesHistoryLoading;
