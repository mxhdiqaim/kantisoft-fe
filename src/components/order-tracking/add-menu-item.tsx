import CustomModal from "@/components/customs/custom-modal";
import type { AppDispatch, RootState } from "@/store";
import { createMenuItems } from "@/store/app/menu-items";
import {
    type AddMenuItemType,
    createMenuItemSchema,
} from "@/types/menu-item-type";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

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
    const dispatch = useDispatch<AppDispatch>();
    const { loading } = useSelector((state: RootState) => state.menuItem);

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
        const result = await dispatch(createMenuItems(data));
        if (createMenuItems.fulfilled.match(result)) {
            onClose();
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
                        disabled={loading}
                    >
                        {loading ? "Adding Menu..." : "Add Menu"}
                    </Button>
                </form>
            </Box>
        </CustomModal>
    );
};

export default AddMenuItemModal;
