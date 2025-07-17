import { Skeleton } from "@mui/material";
import CustomCard from "../customs/custom-card";

const MenuItemSkeleton = () => {
    return (
        <CustomCard>
            <Skeleton variant="text" sx={{ fontSize: "2.5rem" }} width="75%" />
            <Skeleton variant="text" sx={{ fontSize: "1rem" }} width="50%" />
            <Skeleton variant="text" sx={{ fontSize: "2.7rem" }} width="50%" />
        </CustomCard>
    );
};

export default MenuItemSkeleton;
