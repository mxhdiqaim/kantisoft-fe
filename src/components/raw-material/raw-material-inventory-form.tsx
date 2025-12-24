import {type FC, useEffect} from "react";
import {Box, FormControl, Grid, InputAdornment, MenuItem} from "@mui/material";
import CustomModal from "@/components/customs/custom-modal.tsx";
import {Controller, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {
    createRawMaterialInventorySchema,
    type CreateRawMaterialInventoryType,
    type SingleRawMaterialInventoryType,
    type UpdateRawMaterialInventoryType,
} from "@/types/raw-material-types.ts";
import {StyledTextField} from "@/components/ui";
import Icon from "@/components/ui/icon.tsx";
import {
    useCreateRawMaterialInventoryMutation,
    useGetAllRawMaterialsQuery,
    useUpdateRawMaterialInventoryMutation
} from "@/store/slice";
import CustomButton from "@/components/ui/button.tsx";
import useNotifier from "@/hooks/useNotifier.ts";
import {getApiError} from "@/helpers/get-api-error.ts";
import ArrowDownIconSvg from "@/assets/icons/arrow-down.svg";
import {useMemoizedArray} from "@/hooks/use-memoized-array.ts";

interface Props {
    open: boolean;
    onClose: () => void;
    rawMaterialInventory?: SingleRawMaterialInventoryType | null;
}

const RawMaterialInventoryForm: FC<Props> = ({open, onClose, rawMaterialInventory}) => {
    const notify = useNotifier();
    const isEditMode = !!rawMaterialInventory;

    const {data: rawMaterialData, isLoading: isFetchingRawMaterial} = useGetAllRawMaterialsQuery(undefined, {
        skip: !open,
    });

    const memoizedRawMaterial = useMemoizedArray(rawMaterialData);

    const [createRawMaterialInventory, {
        isLoading: isCreating,
        isSuccess: isCreateSuccess,
        reset: resetCreateMutation
    }] = useCreateRawMaterialInventoryMutation();

    const [updateRawMaterialInventory, {
        isLoading: isUpdating,
        isSuccess: isUpdateSuccess,
        reset: resetUpdateMutation
    }] = useUpdateRawMaterialInventoryMutation();

    const {
        control,
        handleSubmit,
        reset: resetForm,
        formState: {errors},
    } = useForm({
        defaultValues: {
            rawMaterialId: "",
            quantity: 0,
            minStockLevel: 0,
        },
        resolver: yupResolver(createRawMaterialInventorySchema),
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
        if (rawMaterialInventory && open) {
            resetForm({
                rawMaterialId: rawMaterialInventory.rawMaterialId,
                minStockLevel: rawMaterialInventory.minStockLevel,
                quantity: rawMaterialInventory.quantity,
            });
        } else if (!open) {
            resetForm({
                rawMaterialId: "",
                quantity: 0,
                minStockLevel: 0,
            });
        }
    }, [rawMaterialInventory, open, resetForm]);

    const onSubmit = async (data: CreateRawMaterialInventoryType | UpdateRawMaterialInventoryType) => {
        try {
            if (isEditMode && rawMaterialInventory) {
                const payload = {
                    id: rawMaterialInventory.id,
                    minStockLevel: data.minStockLevel,
                }
                await updateRawMaterialInventory(payload as UpdateRawMaterialInventoryType).unwrap();
                notify("Raw Material Inventory Updated Successfully!", "success");
            } else {
                await createRawMaterialInventory(data as CreateRawMaterialInventoryType).unwrap();
                notify("Raw Material Inventory Added Successfully!", "success");
            }
        } catch (error) {
            const defaultMessage = `Failed to update Inventory. Please try again.`;
            const apiError = getApiError(error, defaultMessage);
            notify(apiError.message, "error");
        }
    };

    const isLoading = isCreating || isUpdating;

    return (
        <CustomModal
            open={open}
            onClose={onClose}
            title={isEditMode ? "Update Raw Material Inventory" : "Create Raw Material Inventory"}
        >
            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{mt: 3}}>
                <Grid container spacing={2}>
                    {!isEditMode && (
                        <Grid size={12}>
                            <Controller
                                name="rawMaterialId"
                                control={control}
                                render={({field}) => (
                                    <FormControl fullWidth>
                                        <StyledTextField
                                            {...field}
                                            select
                                            label="Raw Material"
                                            placeholder="Select Raw Material"
                                            disabled={isFetchingRawMaterial}
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
                                            error={Boolean(errors.rawMaterialId)}
                                            helperText={errors.rawMaterialId?.message}
                                        >
                                            <MenuItem value={""} disabled>
                                                Select Raw Material
                                            </MenuItem>
                                            {memoizedRawMaterial?.map((rawMaterial) => (
                                                <MenuItem key={rawMaterial.id} value={rawMaterial.id}
                                                          sx={{textTransform: "capitalize"}}>
                                                    {rawMaterial.name}
                                                </MenuItem>
                                            ))}
                                        </StyledTextField>
                                    </FormControl>
                                )}
                            />
                        </Grid>
                    )}
                    {!isEditMode && (
                        <Grid size={{sm: 12, md: 6}}>
                            <Controller
                                name="quantity"
                                control={control}
                                render={({field}) => (
                                    <FormControl fullWidth>
                                        <StyledTextField
                                            {...field}
                                            label="Quantity"
                                            type="number"
                                            error={Boolean(errors.quantity)}
                                            helperText={errors.quantity?.message}
                                        />
                                    </FormControl>
                                )}
                            />
                        </Grid>
                    )}
                    <Grid size={isEditMode ? 12 : {sm: 12, md: 6}}>
                        <Controller
                            name="minStockLevel"
                            control={control}
                            render={({field}) => (
                                <FormControl fullWidth>
                                    <StyledTextField
                                        {...field}
                                        label="Minimum Stock Level"
                                        type="number"
                                        error={Boolean(errors.minStockLevel)}
                                        helperText={errors.minStockLevel?.message}
                                    />
                                </FormControl>
                            )}
                        />
                    </Grid>
                </Grid>
                <Box sx={{display: "flex", justifyContent: "flex-end", gap: 2, mt: 2}}>
                    <CustomButton title={"Close"} onClick={onClose} variant="outlined"/>
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

export default RawMaterialInventoryForm;
