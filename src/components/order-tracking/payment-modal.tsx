import CustomModal from '@/components/customs/custom-modal.tsx';
import { type CartItem } from '@/types/menu-cart-type';
import {
    Box,
    Button,
    DialogActions,
    FormControlLabel,
    Radio,
    RadioGroup,
    TextField,
    Typography,
} from '@mui/material';
import { useState } from 'react';

interface Props {
    open: boolean;
    onClose: () => void;
    onCompleteSale: (paymentMethod: string, amountReceived?: number) => void;
    cartItems: CartItem[];
}

const PaymentDialog = ({ open, onClose, onCompleteSale, cartItems }: Props) => {
    const [paymentMethod, setPaymentMethod] = useState('Card');
    const [amountReceived, setAmountReceived] = useState(0);

    const total = cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0,
    );

    const handleCompleteSale = () => {
        onCompleteSale(paymentMethod, amountReceived);
    };

    const change = amountReceived - total;

    return (
        <CustomModal
            open={open}
            onClose={onClose}
            title={'Payment'}
            description={`Total Amount: ${total.toFixed(2)}`}
        >
            <Box>
                <RadioGroup
                    row
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                >
                    <FormControlLabel
                        value="Card"
                        control={<Radio />}
                        label="Card"
                    />
                    <FormControlLabel
                        value="Cash"
                        control={<Radio />}
                        label="Cash"
                    />
                    <FormControlLabel
                        value="Transfer"
                        control={<Radio />}
                        label="Transfer"
                    />
                </RadioGroup>
                {paymentMethod === 'Cash' && (
                    <Box sx={{ mt: 2 }}>
                        <TextField
                            label="Amount Received"
                            type="number"
                            fullWidth
                            value={amountReceived}
                            onChange={(e) =>
                                setAmountReceived(Number(e.target.value))
                            }
                        />
                        {amountReceived > 0 && (
                            <Typography sx={{ mt: 1 }}>
                                Change: $
                                {change > 0 ? change.toFixed(2) : '0.00'}
                            </Typography>
                        )}
                    </Box>
                )}
            </Box>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    onClick={handleCompleteSale}
                    variant="contained"
                    color="primary"
                >
                    Complete Sale
                </Button>
            </DialogActions>
        </CustomModal>
    );
};

export default PaymentDialog;
