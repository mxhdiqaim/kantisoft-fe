import type {FC} from "react";
import DataDrawer from "@/components/ui/data-drawer.tsx";
import {drawerPaperProps} from "@/components/styles";
import {Box, Typography} from "@mui/material";
import type {MultipleRawMaterialInventoryResponseType} from "@/types/raw-material-types.ts";

interface Props {
    open: boolean;
    onOpen: () => void;
    onClose: () => void;
    inventoryData: MultipleRawMaterialInventoryResponseType | null;
}

const InventoryDetailsDrawer: FC<Props> = ({open, onOpen, onClose, inventoryData}) => {
    return (
        <DataDrawer
            title={"Inventory Details"}
            anchor={"right"}
            open={open}
            onOpen={onOpen}
            onClose={onClose}
            PaperProps={drawerPaperProps}
        >
            <Box sx={{width: "100%", p: 2}}>
                {inventoryData ? (
                    <>
                        <Typography variant="h6" gutterBottom>{inventoryData.rawMaterialName}</Typography>
                        <Typography>Quantity: {inventoryData.quantity}</Typography>
                        <Typography>Store: {inventoryData.storeName}</Typography>
                        <Typography>Status: {inventoryData.status}</Typography>
                    </>
                ) : (
                    <Typography>No data to display.</Typography>
                )}
            </Box>
        </DataDrawer>
    );
};

export default InventoryDetailsDrawer;
