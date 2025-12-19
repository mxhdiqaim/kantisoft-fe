import {type FC, useEffect} from "react";
import {Box, FormControl, Grid, InputAdornment, MenuItem} from "@mui/material";
import CustomModal from "@/components/customs/custom-modal.tsx";
import {Controller, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {createRawMaterialInventorySchema, type CreateRawMaterialInventoryType,} from "@/types/raw-material-types.ts";
import {StyledTextField} from "@/components/ui";
import Icon from "@/components/ui/icon.tsx";
import {useCreateRawMaterialInventoryMutation, useGetAllRawMaterialsQuery} from "@/store/slice";
import CustomButton from "@/components/ui/button.tsx";
import useNotifier from "@/hooks/useNotifier.ts";
import {getApiError} from "@/helpers/get-api-error.ts";
import ArrowDownIconSvg from "@/assets/icons/arrow-down.svg";

interface Props {
    open: boolean;
    onClose: () => void;
    // rawMaterial?: RawMaterialType | null;
}

const RawMaterialInventoryForm: FC<Props> = ({open, onClose}) => {
    const notify = useNotifier();
    const {data: rawMaterialData, isLoading: isFetchingRawMaterial} = useGetAllRawMaterialsQuery();
    const [createRawMaterialInventory, {
        isLoading: isCreating,
        isSuccess: isCreateSuccess
    }] = useCreateRawMaterialInventoryMutation();

    const {
        control,
        handleSubmit,
        reset,
        formState: {errors},
    } = useForm({
        defaultValues: {},
        resolver: yupResolver(createRawMaterialInventorySchema),
    });

    useEffect(() => {
        if (isCreateSuccess) {
            reset();
            onClose();
        }
    }, [isCreateSuccess, onClose, reset]);

    const onSubmit = async (data: CreateRawMaterialInventoryType) => {
        try {
            await createRawMaterialInventory(data).unwrap();
            notify("Raw Material Added Successfully!", "success");
        } catch (error) {
            const defaultMessage = `Failed to update Inventory. Please try again.`;
            const apiError = getApiError(error, defaultMessage);
            notify(apiError.message, "error");
        }
    };

    return (
        <CustomModal
            open={open}
            onClose={onClose}
            title="Create Raw Material Inventory"
        >
            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{mt: 3}}>
                <Grid container spacing={2}>
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
                                            Select Measurement Unit
                                        </MenuItem>
                                        {rawMaterialData.map((rawMaterial) => (
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
                    <Grid size={{xs: 12, sm: 6}}>
                        <Controller
                            name="quantity"
                            control={control}
                            render={({field}) => (
                                <FormControl fullWidth>
                                    <StyledTextField
                                        {...field}
                                        label="Quantity"
                                        error={Boolean(errors.quantity)}
                                        helperText={errors.quantity?.message}
                                    />
                                </FormControl>
                            )}
                        />
                    </Grid>
                    <Grid size={{xs: 12, sm: 6}}>
                        <Controller
                            name="minStockLevel"
                            control={control}
                            render={({field}) => (
                                <FormControl fullWidth>
                                    <StyledTextField
                                        {...field}
                                        label="Minimum Stock Level"
                                        error={Boolean(errors.minStockLevel)}
                                        helperText={errors.minStockLevel?.message}
                                    />
                                </FormControl>
                            )}
                        />
                    </Grid>
                </Grid>
                <Box sx={{display: "flex", justifyContent: "flex-end", gap: 2, mt: 2}}>
                    <CustomButton title={"Close"} onClick={onClose}/>
                    <CustomButton
                        title={isCreating ? "Creating..." : "Create Inventory"}
                        type="submit"
                        variant={"contained"}
                        disabled={isCreating}
                    />
                </Box>
            </Box>
        </CustomModal>
    );
};

export default RawMaterialInventoryForm;