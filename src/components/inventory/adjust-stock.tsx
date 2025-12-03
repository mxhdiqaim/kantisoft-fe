import type {FC} from "react";
import {useEffect} from "react";
import {Box, FormControl, Grid, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import CustomModal from "@/components/customs/custom-modal.tsx";
import {Controller, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {
    adjustStockSchema,
    type AdjustStockType,
    type InventoryType,
    TRANSACTION_TYPE,
    TransactionTypeEnum
} from "@/types/inventory-types.ts";
import {useAdjustStockMutation} from "@/store/slice";
import useNotifier from "@/hooks/useNotifier.ts";
import {getApiError} from "@/helpers/get-api-error.ts";
import CustomButton from "@/components/ui/button.tsx";

interface Props {
    open: boolean;
    onClose: () => void;
    inventoryItem: InventoryType | null;
}

const AdjustStock: FC<Props> = ({open, onClose, inventoryItem}) => {
    const notify = useNotifier();
    const [adjustStock, {isLoading, isSuccess}] = useAdjustStockMutation();

    const {
        control,
        handleSubmit,
        reset,
        formState: {errors},
    } = useForm({
        defaultValues: {
            menuItemId: inventoryItem?.menuItemId ?? "",
            quantityAdjustment: 0,
            transactionType: TransactionTypeEnum.ADJUSTMENT_IN,
            notes: "",
        },

        resolver: yupResolver(adjustStockSchema),
    });

    useEffect(() => {
        if (inventoryItem) {
            reset({
                menuItemId: inventoryItem.menuItemId,
                quantityAdjustment: 0,
                transactionType: TransactionTypeEnum.ADJUSTMENT_IN,
                notes: "",
            });
        }
    }, [inventoryItem, reset]);

    useEffect(() => {
        if (isSuccess) {
            reset();
            onClose();
        }
    }, [isSuccess, onClose, reset]);

    const onSubmit = async (data: AdjustStockType) => {
        if (!inventoryItem) return;
        try {
            await adjustStock(data).unwrap();
            notify("Stock adjusted successfully!", "success");
        } catch (error) {
            const defaultMessage = `Failed to adjust stock. Please try again.`;
            const apiError = getApiError(error, defaultMessage);
            notify(apiError.message, "error");
        }
    };

    return (
        <CustomModal
            open={open}
            onClose={onClose}
            title={`Adjust Stock for ${inventoryItem?.menuItem?.name ?? 'Item'}`}
        >
            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{mt: 3}}>
                <Grid container spacing={3}>
                    <Grid size={{xs: 12, sm: 6}}>
                        <Controller
                            name="transactionType"
                            control={control}
                            render={({field}) => (
                                <FormControl fullWidth error={!!errors.transactionType}>
                                    <InputLabel>Transaction Type</InputLabel>
                                    <Select {...field} label="Transaction Type" sx={{textTransform: "capitalize"}}>
                                        {TRANSACTION_TYPE.map((type) => (
                                            <MenuItem key={type} value={type} sx={{textTransform: "capitalize"}}>
                                                {type.replace(/([A-Z])/g, ' $1').trim()}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            )}
                        />
                    </Grid>
                    <Grid size={{xs: 12, sm: 6}}>
                        <Controller
                            name="quantityAdjustment"
                            control={control}
                            render={({field}) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    label="Quantity Adjustment"
                                    type="number"
                                    error={!!errors.quantityAdjustment}
                                    helperText={errors.quantityAdjustment?.message}
                                />
                            )}
                        />
                    </Grid>
                    <Grid size={12}>
                        <Controller
                            name="notes"
                            control={control}
                            render={({field}) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    label="Notes (Optional)"
                                    multiline
                                    rows={3}
                                    error={!!errors.notes}
                                    helperText={errors.notes?.message}
                                />
                            )}
                        />
                    </Grid>
                </Grid>
                <Box sx={{display: "flex", justifyContent: "flex-end", gap: 2, mt: 4}}>
                    <CustomButton title={"Cancel"} onClick={onClose} variant="outlined"/>
                    <CustomButton
                        type="submit"
                        variant="contained"
                        disabled={isLoading}
                        title={isLoading ? "Adjusting..." : "Adjust Stock"}
                    />
                </Box>
            </Box>
        </CustomModal>
    );
};

export default AdjustStock;
