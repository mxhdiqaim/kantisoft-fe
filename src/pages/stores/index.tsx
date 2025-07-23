import StoresPageLoading from "@/components/stores/loading";
import { useGetAllStoresQuery } from "@/store/slice";
import { AddOutlined } from "@mui/icons-material";
import { Box, Button, Paper, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import StoresTable from "@/components/stores/stores-table";
import { useTranslation } from "react-i18next";

const StoresPage = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const { data: storesData, isLoading, isError } = useGetAllStoresQuery();

    if (isLoading) return <StoresPageLoading />;

    if (isError) {
        return (
            <Typography color="error" align="center" sx={{ mt: 4 }}>
                Failed to load stores. Please try again later.
            </Typography>
        );
    }

    return (
        <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h4">{t("store")} Management</Typography>
                <Button variant="contained" startIcon={<AddOutlined />} onClick={() => navigate("/stores/new")}>
                    New {t("store")}
                </Button>
            </Box>
            <Paper
                elevation={0}
                sx={{
                    border: `1px solid ${theme.palette.divider}`,
                    height: "70vh",
                    width: "100%",
                }}
            >
                <StoresTable data={storesData ?? []} loading={isLoading} />
            </Paper>
        </Box>
    );
};

export default StoresPage;
