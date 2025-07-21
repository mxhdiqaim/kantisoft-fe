import CustomModal from "@/components/customs/custom-modal";
import { selectCurrentUser } from "@/store/slice/auth-slice";
import type { CartItem } from "@/types/cart-item-type";
import { createOrderSchema, type CreateOrderType } from "@/types/order-types.ts";
import { ngnFormatter } from "@/utils";
import { yupResolver } from "@hookform/resolvers/yup";
import {
    Button,
    DialogActions,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Radio,
    RadioGroup,
    TextField,
    Typography,
} from "@mui/material";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";

interface Props {
    open: boolean;
    onClose: () => void;
    onCompleteSale: (data: Omit<CreateOrderType, "amountReceived">) => void;
    cartItems: CartItem[];
    isLoading?: boolean;
}

const PaymentModal = ({ open, onClose, onCompleteSale, cartItems, isLoading }: Props) => {
    const seller = useSelector(selectCurrentUser);

    const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const {
        control,
        handleSubmit,
        reset,
        watch,
        setValue,
        setError,
        clearErrors,
        formState: { errors, isValid },
    } = useForm<CreateOrderType>({
        mode: "onChange",
        resolver: yupResolver(createOrderSchema),
        defaultValues: {
            sellerId: seller?.id || "",
            paymentMethod: "cash",
            orderStatus: "completed",
            items: [],
            amountReceived: 0,
        },
    });

    const paymentMethod = watch("paymentMethod");
    const amountReceived = watch("amountReceived", 0);

    const change = amountReceived - total;

    const isCashPaymentInsufficient = paymentMethod === "cash" && amountReceived < total;

    const onSubmit = (data: CreateOrderType) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { amountReceived, ...orderData } = data;
        onCompleteSale(orderData);
    };

    useEffect(() => {
        if (open) {
            const items = cartItems.map((item) => ({
                menuItemId: item.id,
                quantity: item.quantity,
            }));

            reset({
                sellerId: seller?.id || "",
                paymentMethod: "cash",
                orderStatus: "completed",
                items: items,
                amountReceived: 0,
            });
        }
    }, [open, cartItems, seller?.id, reset]);

    useEffect(() => {
        if (paymentMethod === "cash") {
            if (amountReceived < total) {
                // If cash is insufficient, manually set an error
                setError("amountReceived", {
                    type: "manual",
                    message: "Amount received must be at least the total.",
                });
            } else {
                // If cash is sufficient, clear the error
                clearErrors("amountReceived");
            }
        } else {
            // For other payment methods, ensure the error is cleared
            clearErrors("amountReceived");
        }
    }, [amountReceived, paymentMethod, total, setError, clearErrors]);

    useEffect(() => {
        if (paymentMethod !== "cash") {
            // If payment is not cash, set amountReceived to the total
            setValue("amountReceived", total, { shouldValidate: true });
        } else {
            // If switching back to cash, reset amountReceived
            setValue("amountReceived", 0, { shouldValidate: true });
        }
    }, [paymentMethod, total, setValue]);

    return (
        <CustomModal
            open={open}
            onClose={onClose}
            title={"Payment"}
            description={`Total Amount: ${ngnFormatter.format(total)}`}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <FormControl component="fieldset" error={!!errors.paymentMethod}>
                    <Controller
                        name="paymentMethod"
                        control={control}
                        render={({ field }) => (
                            <RadioGroup {...field} row>
                                <FormControlLabel value="cash" control={<Radio />} label="Cash" />
                                <FormControlLabel value="card" control={<Radio />} label="Card" />
                                <FormControlLabel value="transfer" control={<Radio />} label="Transfer" />
                            </RadioGroup>
                        )}
                    />
                    {errors.paymentMethod && <FormHelperText>{errors.paymentMethod.message}</FormHelperText>}
                    {paymentMethod === "cash" && (
                        <>
                            <Controller
                                name="amountReceived"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Amount Received"
                                        type="number"
                                        fullWidth
                                        margin="normal"
                                        error={!!errors.amountReceived}
                                        helperText={errors.amountReceived?.message}
                                    />
                                )}
                            />
                            <Typography sx={{ mt: 1 }}>
                                Change: {change > 0 ? ngnFormatter.format(change) : "NGN 0.00"}
                            </Typography>
                        </>
                    )}
                </FormControl>
                <DialogActions sx={{ mt: 2, px: 0 }}>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={!isValid || isCashPaymentInsufficient || isLoading}
                    >
                        {isLoading ? "Processing..." : "Complete Order"}
                    </Button>
                </DialogActions>
            </form>
        </CustomModal>
    );
};

export default PaymentModal;
