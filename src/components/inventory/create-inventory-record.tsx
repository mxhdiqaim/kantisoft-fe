import type {FC} from "react";
import {useEffect} from "react";
import {Box, FormControl, Grid, InputAdornment, MenuItem, TextField,} from "@mui/material";
import CustomModal from "@/components/customs/custom-modal.tsx";
import {Controller, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {createInventorySchema, type CreateInventoryType} from "@/types/inventory-types.ts";
import {useCreateInventoryRecordMutation, useGetMenuItemsQuery} from "@/store/slice";
import useNotifier from "@/hooks/useNotifier.ts";
import {getApiError} from "@/helpers/get-api-error.ts";
import CustomButton from "@/components/ui/button.tsx";
import {StyledTextField} from "@/components/ui";
import Icon from "@/components/ui/icon.tsx";
import ArrowDownIconSvg from "@/assets/icons/arrow-down.svg";

interface Props {
    open: boolean;
    onClose: () => void;
}

const CreateInventoryRecord: FC<Props> = ({open, onClose}) => {
    const notify = useNotifier();
    const {data: menuItemsData, isLoading: isLoadingMenuItems} = useGetMenuItemsQuery({});
    const [createInventory, {isLoading, isSuccess, reset: resetMutation}] = useCreateInventoryRecordMutation();

    const {
        control,
        handleSubmit,
        reset: resetForm,
        formState: {errors},
    } = useForm({
        resolver: yupResolver(createInventorySchema),
        defaultValues: {
            menuItemId: "",
            quantity: 0,
            minStockLevel: 0,
        },
    });

    const handleClose = () => {
        onClose();
        resetForm();
        resetMutation();
    }

    useEffect(() => {
        if (isSuccess) {
            handleClose();
        }
    }, [isSuccess])

    const onSubmit = async (data: CreateInventoryType) => {
        try {
            await createInventory(data).unwrap();
            notify("Inventory Record Added Successfully!", "success");
        } catch (error) {
            const defaultMessage = `Failed to create inventory record. Please try again.`;
            const apiError = getApiError(error, defaultMessage);

            notify(apiError.message, "error");
        }
    };

    return (
        <CustomModal
            open={open}
            onClose={onClose}
            title="Create Inventory Record"
        >
            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{mt: 3}}>
                <Grid container spacing={3}>
                    <Grid size={12}>
                        <Controller
                            name="menuItemId"
                            control={control}
                            render={({field}) => (
                                <FormControl fullWidth>
                                    <StyledTextField
                                        {...field}
                                        select
                                        label="Select Menu Item"
                                        disabled={isLoadingMenuItems}
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
                                        error={Boolean(errors.menuItemId)}
                                        helperText={errors.menuItemId?.message}
                                    >
                                        <MenuItem value={""} disabled>
                                            Select Menu Item
                                        </MenuItem>
                                        {menuItemsData?.map((menuItem) => (
                                            <MenuItem key={menuItem.id} value={menuItem.id}
                                                      sx={{textTransform: "capitalize"}}>
                                                {menuItem.name}
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
                                <TextField
                                    {...field}
                                    fullWidth
                                    label="Initial Quantity"
                                    type="number"
                                    error={!!errors.quantity}
                                    helperText={errors.quantity?.message}
                                />
                            )}
                        />
                    </Grid>
                    <Grid size={{xs: 12, sm: 6}}>
                        <Controller
                            name="minStockLevel"
                            control={control}
                            render={({field}) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    label="Minimum Stock Level"
                                    type="number"
                                    error={!!errors.minStockLevel}
                                    helperText={errors.minStockLevel?.message}
                                />
                            )}
                        />
                    </Grid>
                </Grid>
                <Box sx={{display: "flex", justifyContent: "flex-end", gap: 2, mt: 2}}>
                    <CustomButton title={"Close"} onClick={onClose}/>
                    <CustomButton
                        title={isLoading ? "Creating..." : "Create Record"}
                        type="submit"
                        variant={"contained"}
                        disabled={isLoading}
                    />
                </Box>
            </Box>
        </CustomModal>
    );
};

export default CreateInventoryRecord;
