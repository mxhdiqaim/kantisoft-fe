import {type FC, useState} from "react";
import {Box, Chip, Divider, Grid, Stack, Typography} from "@mui/material";
import DataDrawer from "@/components/ui/data-drawer.tsx";
import {drawerPaperProps} from "@/components/styles";
import {useGetRawMaterialInventoryStockQuery} from "@/store/slice";
import {getApiError} from "@/helpers/get-api-error.ts";
import ApiErrorDisplay from "@/components/feedback/api-error-display.tsx";
import useNotifier from "@/hooks/useNotifier.ts";
import ViewRawMaterialSkeleton from "@/components/spinners/view-raw-material-skeleton.tsx";
import CustomCard from "@/components/customs/custom-card.tsx";
import {camelCaseToTitleCase, formatCurrency} from "@/utils";
import {getInventoryStatusChipColor} from "@/components/ui";
import {formatDateCustom, formatRelativeDateTime} from "@/utils/get-relative-time.ts";
import CustomButton from "@/components/ui/button.tsx";
import {EditOutlined} from "@mui/icons-material";
import RawMaterialInventoryForm from "@/components/raw-material/raw-material-inventory-form.tsx";

interface Props {
    open: boolean;
    onOpen: () => void;
    onClose: () => void;
    rawMaterialId: string;
}

const InventoryDetailsDrawer: FC<Props> = ({open, onOpen, onClose, rawMaterialId}) => {
    const notify = useNotifier();

    const [formModalOpen, setFormModalOpen] = useState(false);

    const {data, isLoading, error} = useGetRawMaterialInventoryStockQuery(rawMaterialId, {
        skip: !rawMaterialId,
    });

    const handleCloseFormModal = () => {
        setFormModalOpen(false);
    };

    const handleOpenFormModal = () => {
        setFormModalOpen(true);
    };

    if (error) {
        const apiError = getApiError(error, "Failed to load raw material data.");
        notify(apiError.message, "error");
        return <ApiErrorDisplay statusCode={apiError.type} message={apiError.message}/>;
    }

    return (
        <DataDrawer
            title={"Inventory Details"}
            anchor={"right"}
            open={open}
            onOpen={onOpen}
            onClose={onClose}
            PaperProps={drawerPaperProps}
        >
            {isLoading ? <ViewRawMaterialSkeleton/> :
                (
                    <Grid container spacing={3}>
                        <Grid size={12}>
                            <CustomCard>
                                <Typography variant="h6" gutterBottom>
                                    Basic Information
                                </Typography>
                                <Grid container spacing={2} sx={{mt: 1}}>
                                    <Grid size={{xs: 12, sm: 6}}>
                                        <Typography variant="body2" color="text.secondary">
                                            Name
                                        </Typography>
                                        <Typography variant="body1" fontWeight={500}>
                                            {data.rawMaterialName}
                                        </Typography>
                                    </Grid>
                                    <Grid size={{xs: 12, sm: 6}}>
                                        <Typography variant="body2" color="text.secondary">
                                            Quantity
                                        </Typography>
                                        <Typography variant="body1" fontWeight={500}>
                                            {data.quantity}
                                        </Typography>
                                    </Grid>
                                    <Grid size={{xs: 12, sm: 6}}>
                                        <Typography variant="body2" color="text.secondary">
                                            Status
                                        </Typography>
                                        <Typography variant="body1" fontWeight={500}>
                                            <Chip
                                                label={camelCaseToTitleCase(data.status)}
                                                color={getInventoryStatusChipColor(data.status ?? "")}
                                                size="small"
                                                sx={{textTransform: "capitalize"}}
                                            />
                                        </Typography>
                                    </Grid>
                                    <Grid size={{xs: 12, sm: 6}}>
                                        <Typography variant="body2" color="text.secondary">
                                            Minimum Stock
                                        </Typography>
                                        <Typography variant="body1" fontWeight={500}>
                                            {data.minStockLevel}
                                        </Typography>
                                    </Grid>
                                    <Grid size={{xs: 12, sm: 6}}>
                                        <Typography variant="body2" color="text.secondary">
                                            Price per unit
                                        </Typography>
                                        <Typography variant="body1" fontWeight={500}>
                                            {formatCurrency(data.latestUnitPrice)}
                                        </Typography>
                                    </Grid>
                                    <Grid size={{xs: 12, sm: 6}}>
                                        <Typography variant="body2" color="text.secondary">
                                            Modified on
                                        </Typography>
                                        <Typography variant="body1" fontWeight={500}>
                                            {formatRelativeDateTime(data.lastModified)}
                                        </Typography>
                                    </Grid>
                                    <Grid size={{xs: 12, sm: 6}}>
                                        <Typography variant="body2" color="text.secondary">
                                            Date Added
                                        </Typography>
                                        <Typography variant="body1" fontWeight={500}>
                                            {formatDateCustom(data.createdAt)}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Divider sx={{my: 2}}/>
                                <Typography variant="h6" gutterBottom>
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
                                        {data.unitOfMeasurement.name} ({data.unitOfMeasurement.symbol})
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Conversion to Base: {data.unitOfMeasurement.conversionFactorToBase}
                                    </Typography>
                                </Box>
                            </CustomCard>
                        </Grid>
                        <Grid size={12}>
                            <Stack
                                direction={{xs: "column", sm: "row"}}
                                spacing={2}
                                position={"absolute"}
                                bottom={0}
                                left={0}
                                right={0}
                                p={2}
                            >
                                <CustomButton
                                    title={"Edit Inventory"}
                                    variant="contained"
                                    startIcon={<EditOutlined/>}
                                    onClick={handleOpenFormModal}
                                    disabled={isLoading}
                                    sx={{width: "100%"}}
                                />
                                {/*// TODO: Add Deactivate and Delete functionality */}
                            </Stack>
                        </Grid>
                    </Grid>
                )}

            <RawMaterialInventoryForm
                open={formModalOpen}
                onClose={handleCloseFormModal}
                rawMaterialInventory={data}
            />
        </DataDrawer>
    );
};

export default InventoryDetailsDrawer;
