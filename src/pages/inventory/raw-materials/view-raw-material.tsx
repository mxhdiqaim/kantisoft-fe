import {useNavigate, useParams} from "react-router-dom";
import {useGetSingleRawMaterialQuery} from "@/store/slice";
import useNotifier from "@/hooks/useNotifier.ts";
import {getApiError} from "@/helpers/get-api-error.ts";
import ApiErrorDisplay from "@/components/feedback/api-error-display.tsx";
import {Box, Divider, Grid, Typography} from "@mui/material";
import {ArrowBackIosNewOutlined, EditOutlined} from "@mui/icons-material";
import {format} from "date-fns";
import ViewRawMaterialSkeleton from "@/components/spinners/view-raw-material-skeleton.tsx";
import CustomButton from "@/components/ui/button.tsx";
import CustomCard from "@/components/customs/custom-card.tsx";
import {formatCurrency} from "@/utils";
import {relativeTime} from "@/utils/get-relative-time.ts";
import RawMaterialForm from "@/components/inventory/raw-material-form.tsx";
import {useState} from "react";

const ViewRawMaterial = () => {
    const navigate = useNavigate();
    const notify = useNotifier();
    const {id} = useParams<{ id: string }>();

    const [formModalOpen, setFormModalOpen] = useState(false);

    const {
        data: rawMaterial,
        error,
        isLoading
    } = useGetSingleRawMaterialQuery(id as string, {
        skip: !id,
    });

    const handleCloseFormModal = () => {
        setFormModalOpen(false);
    };

    const handleOpenFormModal = () => {
        setFormModalOpen(true);
    };

    if (isLoading) return <ViewRawMaterialSkeleton/>;

    if (error || !rawMaterial) {
        const apiError = getApiError(error, "Failed to load raw material data.");
        notify(apiError.message, "error");
        return <ApiErrorDisplay statusCode={apiError.type} message={apiError.message}/>;
    }

    return (
        <Box>
            <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                <CustomButton
                    title={"Go Back"}
                    variant="text"
                    startIcon={<ArrowBackIosNewOutlined fontSize="small" sx={{mr: 0.5}}/>}
                    onClick={() => navigate(-1)} sx={{mb: 2}}
                />

                <Typography variant="h4" gutterBottom>
                    Raw Material Details
                </Typography>
            </Box>
            <Grid container spacing={3}>
                <Grid size={{xs: 12, md: 4}}>
                    <CustomCard>
                        <Box sx={{textAlign: "center", pt: 1}}>
                            <Typography variant="h5">
                                {rawMaterial.name}
                            </Typography>
                            <Typography sx={{mb: 1.5}} color="text.secondary">
                                {rawMaterial.description || "No description provided."}
                            </Typography>
                        </Box>
                        <Divider/>
                        <Box sx={{pt: 1, display: "flex", flexDirection: "column", gap: 1}}>
                            <CustomButton
                                title={" Edit Raw Material"}
                                variant="contained"
                                startIcon={<EditOutlined/>}
                                onClick={handleOpenFormModal}
                            />
                            {/*// TODO: Add Deactivate and Delete functionality */}
                        </Box>
                    </CustomCard>
                </Grid>

                <Grid size={{xs: 12, md: 8}}>
                    <CustomCard>
                        <Typography variant="h5" gutterBottom>
                            Material Information
                        </Typography>
                        <Grid container spacing={2} sx={{mt: 1}}>
                            <Grid size={{xs: 12, sm: 6}}>
                                <Typography variant="body2" color="text.secondary">
                                    Unit Price
                                </Typography>
                                <Typography variant="body1" fontWeight={500}>
                                    {formatCurrency(rawMaterial.latestUnitPricePresentation)}
                                </Typography>
                            </Grid>
                            <Grid size={{xs: 12, sm: 6}}>
                                <Typography variant="body2" color="text.secondary">
                                    Modified on
                                </Typography>
                                <Typography variant="body1" fontWeight={500}>
                                    {relativeTime(new Date(rawMaterial.lastModified))}
                                </Typography>
                            </Grid>
                            <Grid size={{xs: 12, sm: 6}}>
                                <Typography variant="body2" color="text.secondary">
                                    Date Added
                                </Typography>
                                <Typography variant="body1" fontWeight={500}>
                                    {format(new Date(rawMaterial.createdAt), "MMMM dd, yyyy")}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Divider sx={{my: 2}}/>
                        <Typography variant="h5" gutterBottom>
                            Measurement Information
                        </Typography>
                        <Box
                            sx={{
                                p: 1.5,
                                mb: 1,
                                borderRadius: 1,
                                border: '1px solid',
                                borderColor: 'divider'
                            }}
                        >
                            <Typography variant="body1" fontWeight={500}>
                                {rawMaterial.unitOfMeasurement.name} ({rawMaterial.unitOfMeasurement.symbol})
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Conversion to Base: {rawMaterial.unitOfMeasurement.conversionFactorToBase}
                            </Typography>
                        </Box>
                    </CustomCard>
                </Grid>
            </Grid>

            <RawMaterialForm open={formModalOpen} onClose={handleCloseFormModal} rawMaterial={rawMaterial}/>
        </Box>
    );
};

export default ViewRawMaterial;
