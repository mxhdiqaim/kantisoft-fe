import {type FC, useState} from "react";
import {Box, Button, FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import type {UserType} from "@/types/user-types.ts";
import type {StoreType} from "@/types/store-types.ts";
import CustomModal from "@/components/customs/custom-modal.tsx";

interface Props {
    open: boolean;
    onClose: () => void;
    user: UserType | null;
    stores: StoreType[];
    onConfirm: (userId: string, newStoreId: string) => void;
    isLoading: boolean;
}

const ChangeStoreDialog: FC<Props> = ({open, onClose, user, stores, onConfirm, isLoading}) => {
    const [newStoreId, setNewStoreId] = useState("");

    if (!user) return null;

    const handleConfirm = () => {
        onConfirm(user.id, newStoreId);
    };

    const title = `Change Store for ${user.firstName} ${user.lastName}`;

    return (
        <CustomModal open={open} onClose={onClose} title={title} modalStyles={{width: {xs: "90vw", md: 600}}}>
            <FormControl fullWidth sx={{mt: 2}}>
                <InputLabel id="store-select-label">New Store</InputLabel>
                <Select
                    labelId="store-select-label"
                    value={newStoreId}
                    label="New Store"
                    onChange={(e) => setNewStoreId(e.target.value)}
                >
                    {stores.map((store) => (
                        <MenuItem key={store.id} value={store.id}>
                            {store.name} ({store.storeParentId === null ? 'Main' : 'Branch'})
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Box sx={{display: 'flex', justifyContent: 'flex-end', mt: 3}}>
                <Button onClick={onClose} sx={{mr: 1}}>Cancel</Button>
                <Button onClick={handleConfirm} variant="contained" disabled={!newStoreId || isLoading}>
                    {isLoading ? "Changing..." : "Confirm"}
                </Button>
            </Box>
        </CustomModal>
    );
};

export default ChangeStoreDialog;
