import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

interface Props {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    storeName: string;
    isLoading?: boolean;
}

const StoreDeleteConfirmation = ({ open, onClose, onConfirm, storeName, isLoading }: Props) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Are you sure you want to delete the store <q>{storeName}</q>? This action cannot be undone.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={isLoading}>
                    Cancel
                </Button>
                <Button onClick={onConfirm} color="error" variant="contained" disabled={isLoading}>
                    {isLoading ? "Deleting..." : "Delete"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default StoreDeleteConfirmation;
