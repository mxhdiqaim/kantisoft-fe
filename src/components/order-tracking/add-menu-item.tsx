import CustomModal from "@/components/customs/custom-modal";
import useNotifier from "@/hooks/useNotifier";
import { useCreateMenuItemMutation } from "@/store/app/slice";
import {
    type AddMenuItemType,
    createMenuItemSchema,
} from "@/types/menu-item-type";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

interface Props {
    open: boolean;
    onClose: () => void;
}

const defaultValues: AddMenuItemType = {
    name: "",
    price: 0,
    isAvailable: true,
};

const AddMenuItemModal = ({ open, onClose }: Props) => {
    const notify = useNotifier();
    const [createMenuItem, { isLoading }] = useCreateMenuItemMutation();

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues,
        mode: "onBlur",
        resolver: yupResolver(createMenuItemSchema),
    });

    const onSubmit = async (data: AddMenuItemType) => {
        try {
            await createMenuItem(data).unwrap();
            notify("Menu item added successfully!", "success");
            reset(); // Clear the form
            onClose(); // Close the modal
        } catch (error) {
            notify("Failed to add menu item.", "error");
            console.error("Failed to create menu item:", error);
        }
    };

    useEffect(() => {
        if (open) {
            reset(defaultValues);
        }
    }, [open, reset]);

    return (
        <CustomModal open={open} onClose={onClose}>
            <Box>
                <Typography variant="h6" sx={{ mb: 2 }}>
                    Add Menu
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
                    </Grid>
                    <Button
                        sx={{ mt: 2 }}
                        variant="contained"
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? "Adding Menu..." : "Add Menu"}
                    </Button>
                </form>
            </Box>
        </CustomModal>
    );
};

export default AddMenuItemModal;
