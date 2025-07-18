import CustomModal from "@/components/customs/custom-modal";
import { getApiError } from "@/helpers/get-api-error";
import useNotifier from "@/hooks/useNotifier";
import {
    useCreateMenuItemMutation,
    useUpdateMenuItemMutation,
} from "@/store/slice";
import {
    type AddMenuItemType,
    createMenuItemSchema,
    type EditMenuItemType,
    type MenuItemType,
} from "@/types/menu-item-type";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

interface Props {
    open: boolean;
    onClose: () => void;
    menuItemToEdit?: MenuItemType | null;
}

const defaultValues: AddMenuItemType = {
    name: "",
    price: 0,
    isAvailable: true,
    itemCode: undefined,
};

const MenuItemFormModal = ({ open, onClose, menuItemToEdit }: Props) => {
    const notify = useNotifier();
    const [createMenuItem, { isLoading: isCreating }] =
        useCreateMenuItemMutation();
    const [updateMenuItem, { isLoading: isUpdating }] =
        useUpdateMenuItemMutation();

    const isEditMode = !!menuItemToEdit;
    const isLoading = isCreating || isUpdating;

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues,
        mode: "onBlur",
        // eslint-disable-next-line
        // @ts-ignore
        resolver: yupResolver(createMenuItemSchema),
    });

    const onSubmit = async (data: AddMenuItemType | EditMenuItemType) => {
        try {
            const payload = { ...data, itemCode: data.itemCode || undefined };
            if (isEditMode && menuItemToEdit) {
                await updateMenuItem({
                    id: menuItemToEdit.id,
                    ...(payload as EditMenuItemType),
                }).unwrap();
                notify("Menu item updated successfully!", "success");
            } else {
                await createMenuItem(payload as AddMenuItemType).unwrap();
                notify("Menu item added successfully!", "success");
            }
            onClose();
        } catch (error) {
            const defaultMessage = `Failed to ${isEditMode ? "update" : "add"} menu item.`;
            const apiError = getApiError(error, defaultMessage);

            notify(apiError.message, "error");
            console.log(
                `Failed to ${isEditMode ? "update" : "create"} menu item:`,
                error,
            );
        }
    };

    useEffect(() => {
        if (open) {
            if (isEditMode) {
                reset(menuItemToEdit);
            } else {
                reset(defaultValues);
            }
        }
    }, [open, isEditMode, menuItemToEdit, reset]);

    return (
        <CustomModal open={open} onClose={onClose}>
            <Box>
                <Typography variant="h6" sx={{ mb: 2 }}>
                    {isEditMode ? "Edit Menu Item" : "Add Menu Item"}
                </Typography>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={2}>
                        <Grid size={12}>
                            <Controller
                                name="name"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        label="Name"
                                        error={!!errors.name}
                                        helperText={errors.name?.message}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid size={12}>
                            <Controller
                                name="price"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        label="Price"
                                        type="number"
                                        error={!!errors.price}
                                        helperText={errors.price?.message}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            field.onChange(
                                                value === ""
                                                    ? ""
                                                    : Number(value),
                                            );
                                        }}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid size={12}>
                            <Controller
                                name="itemCode"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        label="Item Code (Optional)"
                                        type="number"
                                        error={!!errors.itemCode}
                                        helperText={errors.itemCode?.message}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            field.onChange(
                                                value === ""
                                                    ? undefined
                                                    : Number(value),
                                            );
                                        }}
                                    />
                                )}
                            />
                        </Grid>
                    </Grid>
                    <Button
                        sx={{ mt: 2 }}
                        variant="contained"
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading
                            ? isEditMode
                                ? "Saving..."
                                : "Adding..."
                            : isEditMode
                              ? "Save Changes"
                              : "Add Menu"}
                    </Button>
                </form>
            </Box>
        </CustomModal>
    );
};

export default MenuItemFormModal;
