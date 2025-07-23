import { useGetUserByIdQuery } from "@/store/slice";
import { Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import UserForm from "./user-form";
import UserFormSkeleton from "@/components/users/loading/user-form-skeleton";

const EditUser = () => {
    const { id } = useParams<{ id: string }>();

    const {
        data: user,
        isLoading,
        isError,
    } = useGetUserByIdQuery(id as string, {
        skip: !id,
    });

    if (isLoading) return <UserFormSkeleton />;

    if (isError || !user) {
        return <Typography color="error">Failed to load user data for editing.</Typography>;
    }

    // Render the UserForm and pass the fetched user data to it
    return <UserForm userToEdit={user} />;
};

export default EditUser;
