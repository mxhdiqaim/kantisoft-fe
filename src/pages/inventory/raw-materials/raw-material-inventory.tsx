import {Box, Typography} from "@mui/material";
import {useGetAllRawMaterialInventoryQuery} from "@/store/slice";
import CustomButton from "@/components/ui/button.tsx";
import AddIcon from "@mui/icons-material/Add";

const RawMaterialInventory = () => {
    const {data, isLoading} = useGetAllRawMaterialInventoryQuery();

    console.log(isLoading);
    console.log(data);

    return (
        <Box>
            <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3}}>
                <Typography variant="h4" component="h1">
                    Raw Material Inventory
                </Typography>
                <CustomButton
                    title={"Create Raw Material"}
                    variant="contained"
                    startIcon={<AddIcon/>}
                    // onClick={handleOpenFormModal}
                />
            </Box>
        </Box>
    );
};

export default RawMaterialInventory;