import {type FC, useEffect} from "react";
import {Box, FormControl, Grid, InputAdornment, MenuItem, Stack} from "@mui/material";
import DataDrawer from "@/components/ui/data-drawer.tsx";
import {drawerPaperProps} from "@/components/styles";
import {useGetAllUnitOfMeasurementsQuery, useStockInRawMaterialInventoryMutation} from "@/store/slice";
import {getApiError} from "@/helpers/get-api-error.ts";
import useNotifier from "@/hooks/useNotifier.ts";
import {StyledTextField} from "@/components/ui";
import CustomButton from "@/components/ui/button.tsx";
import {Controller, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {
    RAW_MATERIAL_TRANSACTION_SOURCE,
    stockInRawMaterialSchema,
    type StockInRawMaterialType,
} from "@/types/raw-material-types.ts";
import CustomCard from "@/components/customs/custom-card.tsx";
import {camelCaseToTitleCase} from "@/utils";

import Icon from "@/components/ui/icon.tsx";
import ArrowDownIconSvg from "@/assets/icons/arrow-down.svg";

interface Props {
    open: boolean;
    onOpen: () => void;
    onClose: () => void;
    rawMaterialId: string;
}

const RawMaterialStockInDrawer: FC<Props> = ({open, onOpen, onClose, rawMaterialId}) => {
    const notify = useNotifier();

    const {data: measurementUnit, isLoading: isMeasurementLoading} = useGetAllUnitOfMeasurementsQuery();

    const [stockInRawMaterialInventory, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useStockInRawMaterialInventoryMutation();

    const {
        control,
        handleSubmit,
        reset,
        formState: {errors},
    } = useForm({
        defaultValues: {},
        resolver: yupResolver(stockInRawMaterialSchema),
    });

    useEffect(() => {
        if (isSuccess) {
            notify("Stock in Successfully!", "success");
            onClose();
            reset();
        }
        if (isError) {
            const defaultMessage = `Failed to stock in. Please try again.`;
            const apiError = getApiError(error, defaultMessage);
            notify(apiError.message, "error");
        }
    }, [isSuccess, isError, error, notify, onClose, reset]);

    const onSubmit = (data: StockInRawMaterialType) => {
        stockInRawMaterialInventory({...data, id: rawMaterialId});
    };

    return (
        <DataDrawer
            title={"Stock In"}
            anchor={"right"}
            open={open}
            onOpen={onOpen}
            onClose={onClose}
            PaperProps={drawerPaperProps}
        >
            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                <CustomCard>
                    <Grid container spacing={2}>
                        <Grid size={12}>
                            <Controller
                                name="source"
                                control={control}
                                render={({field}) => (
                                    <FormControl fullWidth>
                                        <StyledTextField
                                            {...field}
                                            select
                                            label="Source"
                                            error={Boolean(errors.source)}
                                            helperText={errors.source?.message}
                                            SelectProps={{
                                                IconComponent: () => null,
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <Icon
                                                            src={ArrowDownIconSvg}
                                                            alt={"Dropdown Arrow"}
                                                            sx={{width: 15, height: 15}}
                                                        />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        >
                                            <MenuItem value={""} disabled>
                                                Select Source
                                            </MenuItem>
                                            {RAW_MATERIAL_TRANSACTION_SOURCE.map((source) => (
                                                <MenuItem key={source} value={source}
                                                          sx={{textTransform: "capitalize"}}>
                                                    {camelCaseToTitleCase(source)}
                                                </MenuItem>
                                            ))}
                                        </StyledTextField>
                                    </FormControl>
                                )}
                            />
                        </Grid>
                        <Grid size={{xs: 12, md: 6}}>
                            <Controller
                                name="unitOfMeasurementId"
                                control={control}
                                render={({field}) => (
                                    <FormControl fullWidth>
                                        <StyledTextField
                                            {...field}
                                            select
                                            label="Unit Of Measurement"
                                            disabled={isMeasurementLoading}
                                            SelectProps={{
                                                IconComponent: () => null,
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <Icon
                                                            src={ArrowDownIconSvg}
                                                            alt={"Dropdown Arrow"}
                                                            sx={{width: 15, height: 15}}
                                                        />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            error={Boolean(errors.unitOfMeasurementId)}
                                            helperText={errors.unitOfMeasurementId?.message}
                                        >
                                            <MenuItem value={""} disabled>
                                                Select Measurement Unit
                                            </MenuItem>
                                            {measurementUnit.map((measurement) => (
                                                <MenuItem key={measurement.id} value={measurement.id}
                                                          sx={{textTransform: "capitalize"}}>
                                                    {measurement.name}
                                                </MenuItem>
                                            ))}
                                        </StyledTextField>
                                    </FormControl>
                                )}
                            />
                        </Grid>
                        <Grid size={{sm: 12, md: 6}}>
                            <Controller
                                name="quantityPresentation"
                                control={control}
                                render={({field}) => (
                                    <FormControl fullWidth>
                                        <StyledTextField
                                            {...field}
                                            label="Quantity"
                                            type="number"
                                            error={Boolean(errors.quantityPresentation)}
                                            helperText={errors.quantityPresentation?.message}
                                        />
                                    </FormControl>
                                )}
                            />
                        </Grid>
                        <Grid size={{sm: 12, md: 6}}>
                            <Controller
                                name="documentRefId"
                                control={control}
                                render={({field}) => (
                                    <FormControl fullWidth>
                                        <StyledTextField
                                            {...field}
                                            label="Reference"
                                            disabled
                                            error={Boolean(errors.documentRefId)}
                                            helperText={errors.documentRefId?.message}
                                        />
                                    </FormControl>
                                )}
                            />
                        </Grid>
                        <Grid size={12}>
                            <Controller
                                name="notes"
                                control={control}
                                render={({field}) => (
                                    <FormControl fullWidth>
                                        <StyledTextField
                                            {...field}
                                            label="Notes"
                                            error={Boolean(errors.notes)}
                                            helperText={errors.notes?.message}
                                        />
                                    </FormControl>
                                )}
                            />
                        </Grid>
                    </Grid>
                </CustomCard>
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
                            title={"Stock In"}
                            variant="contained"
                            type="submit"
                            disabled={isLoading}
                            sx={{width: "100%"}}
                        />
                    </Stack>
                </Grid>
            </Box>
        </DataDrawer>
    );
};

export default RawMaterialStockInDrawer;