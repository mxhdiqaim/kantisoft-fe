import ViewStoreLoading from "@/components/stores/loading/view-store-loading";
import { useGetStoreByIdQuery } from "@/store/slice";
import { ArrowBackIosNewOutlined, EditOutlined } from "@mui/icons-material";
import { Box, Button, Chip, Divider, Grid, Paper, Typography, useTheme } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

const ViewStore = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const theme = useTheme();

    const { data: store, isLoading, isError } = useGetStoreByIdQuery(id!, { skip: !id });

    if (isLoading) {
        return <ViewStoreLoading />;
    }

    if (isError || !store) {
        return (
            <Box sx={{ textAlign: "center", mt: 4 }}>
                <Typography variant="h6" color="error">
                    Store not found.
                </Typography>
                <Button variant="outlined" onClick={() => navigate("/stores")} sx={{ mt: 2 }}>
                    Back to Stores
                </Button>
            </Box>
        );
    }

    const storeDetails = [
        { label: "Store ID", value: store.id },
        { label: "Location", value: store.location || "N/A" },
        {
            label: "Store Type",
            value: (
                <Chip
                    label={store.storeType}
                    size="medium"
                    sx={{ textTransform: "capitalize", borderRadius: theme.borderRadius.small }}
                />
            ),
        },
        { label: "Date Created", value: new Date(store.createdAt).toLocaleString() },
        { label: "Last Updated", value: store.lastModified ? new Date(store.lastModified).toLocaleString() : "N/A" },
    ];

    return (
        <Box>
            <Button variant="text" onClick={() => navigate("/stores")} sx={{ mb: 2 }}>
                <ArrowBackIosNewOutlined fontSize="small" sx={{ mr: 0.5 }} />
                Back to Stores
            </Button>

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h4">{store.name}</Typography>
                <Button variant="contained" startIcon={<EditOutlined />} onClick={() => navigate(`/stores/${id}/edit`)}>
                    Edit
                </Button>
            </Box>

            <Paper
                elevation={0}
                sx={{
                    p: { xs: 2, md: 4 },
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: theme.borderRadius.small,
                }}
            >
                <Typography variant="h6" sx={{ mb: 2 }}>
                    Store Details
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={3}>
                    {storeDetails.map((detail) => (
                        <Grid size={{ xs: 12, sm: 6 }} key={detail.label}>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                {detail.label}
                            </Typography>
                            <Typography variant="body1" fontWeight="500">
                                {detail.value}
                            </Typography>
                        </Grid>
                    ))}
                </Grid>
            </Paper>
        </Box>
    );
};

export default ViewStore;
