import type {FC} from "react";
import {useEffect} from "react";
import {Box, FormControl, Grid, InputAdornment, MenuItem,} from "@mui/material";
import CustomModal from "@/components/customs/custom-modal.tsx";
import {Controller, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {
    useCreateRawMaterialMutation,
    useGetAllUnitOfMeasurementsQuery,
    useUpdateRawMaterialMutation
} from "@/store/slice";
import useNotifier from "@/hooks/useNotifier.ts";
import {getApiError} from "@/helpers/get-api-error.ts";
import CustomButton from "@/components/ui/button.tsx";
import {createRawMaterialSchema, type CreateRawMaterialType, type RawMaterialType} from "@/types/raw-material-types.ts";
import {StyledTextField} from "@/components/ui";
import {useMemoizedArray} from "@/hooks/use-memoized-array.ts";

import Icon from "@/components/ui/icon.tsx";
import ArrowDownIconSvg from "@/assets/icons/arrow-down.svg";

interface Props {
    open: boolean;
    onClose: () => void;
    rawMaterial?: RawMaterialType | null;
}

const RawMaterialForm: FC<Props> = ({open, onClose, rawMaterial}) => {
    const notify = useNotifier();
    const isEditMode = !!rawMaterial;

    const {data: measurementUnit, isLoading: isMeasurementLoading} = useGetAllUnitOfMeasurementsQuery(undefined, {
        skip: !open,
    });

    const memoizedMeasurement = useMemoizedArray(measurementUnit);

    const [createRawMaterial, {
        isLoading: isCreating,
        isSuccess: isCreateSuccess,
        reset: resetCreateMutation
    }] = useCreateRawMaterialMutation();
    const [updateRawMaterial, {
        isLoading: isUpdating,
        isSuccess: isUpdateSuccess,
        reset: resetUpdateMutation
    }] = useUpdateRawMaterialMutation();

    const {
        control,
        handleSubmit,
        reset: resetForm,
        formState: {errors},
    } = useForm({
        defaultValues: {
            name: "",
            description: "",
            unitOfMeasurementId: "",
            latestUnitPricePresentation: 0,
        },
        resolver: yupResolver(createRawMaterialSchema),
    });

    const handleClose = () => {
        onClose();
        resetCreateMutation();
        resetUpdateMutation();
    };

    useEffect(() => {
        if (isCreateSuccess || isUpdateSuccess) {
            handleClose();
        }
    }, [isCreateSuccess, isUpdateSuccess]);

    useEffect(() => {
        if (rawMaterial && open) {
            resetForm({
                name: rawMaterial.name,
                description: rawMaterial.description,
                unitOfMeasurementId: rawMaterial.unitOfMeasurementId,
                latestUnitPricePresentation: rawMaterial.latestUnitPricePresentation,
            });
        } else if (!open) {
            resetForm({
                name: "",
                description: "",
                unitOfMeasurementId: "",
                latestUnitPricePresentation: 0,
            });
        }
    }, [rawMaterial, open, resetForm]);

    const onSubmit = async (data: CreateRawMaterialType) => {

        try {
            if (isEditMode && rawMaterial) {
                await updateRawMaterial({id: rawMaterial.id, ...data}).unwrap();
                notify("Raw Material Updated Successfully!", "success");
            } else {
                await createRawMaterial(data).unwrap();
                notify("Raw Material Added Successfully!", "success");
            }
        } catch (error) {
            const defaultMessage = `Failed to ${isEditMode ? 'update' : 'create'} Raw Material. Please try again.`;
            const apiError = getApiError(error, defaultMessage);
            notify(apiError.message, "error");
        }
    };

    const isLoading = isCreating || isUpdating;

    return (
        <CustomModal
            open={open}
            onClose={onClose}
            title={isEditMode ? "Update Raw Material" : "Create Raw Material"}
        >
            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{mt: 3}}>
                <Grid container spacing={3}>
                    <Grid size={12}>
                        <Controller
                            name="name"
                            control={control}
                            render={({field}) => (
                                <FormControl fullWidth>
                                    <StyledTextField
                                        {...field}
                                        label="Name"
                                        error={Boolean(errors.name)}
                                        helperText={errors.name?.message}
                                    />
                                </FormControl>
                            )}
                        />
                    </Grid>
                    <Grid size={{xs: 12, sm: 6}}>
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
                                        {memoizedMeasurement.map((measurement) => (
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
                    <Grid size={{xs: 12, sm: 6}}>
                        <Controller
                            name="latestUnitPricePresentation"
                            control={control}
                            render={({field}) => (
                                <FormControl fullWidth>
                                    <StyledTextField
                                        {...field}
                                        label="Unit Price"
                                        type="number"
                                        error={Boolean(errors.latestUnitPricePresentation)}
                                        helperText={errors.latestUnitPricePresentation?.message}
                                    />
                                </FormControl>
                            )}
                        />
                    </Grid>
                    <Grid size={12}>
                        <Controller
                            name="description"
                            control={control}
                            render={({field}) => (
                                <FormControl fullWidth>
                                    <StyledTextField
                                        {...field}
                                        label="Description"
                                        error={Boolean(errors.description)}
                                        helperText={errors.description?.message}
                                    />
                                </FormControl>
                            )}
                        />
                    </Grid>
                </Grid>
                <Box sx={{display: "flex", justifyContent: "flex-end", gap: 2, mt: 2}}>
                    <CustomButton title={"Close"} onClick={onClose}/>
                    <CustomButton
                        title={isLoading ? (isEditMode ? "Updating..." : "Creating...") : (isEditMode ? "Update Record" : "Create Record")}
                        type="submit"
                        variant={"contained"}
                        disabled={isLoading}
                    />
                </Box>
            </Box>
        </CustomModal>
    );
};

export default RawMaterialForm;
