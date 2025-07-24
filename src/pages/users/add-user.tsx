import UserForm from "../../components/users/user-form";
// import { useCreateUserMutation, useGetUserByIdQuery } from "@/store/slice";
// import { useParams } from "react-router-dom";
// import UserFormSkeleton from "@/components/users/loading/user-form-skeleton";
// import { getApiError } from "@/helpers/get-api-error";
// import ApiErrorDisplay from "@/components/feedback/api-error-display";

const AddUser = () => {
    // const { id } = useParams<{ id: string }>();

    // const {
    //     data: user,
    //     isLoading,
    //     isError,
    //     error,
    // } = useCreateUserMutation(id as string, {
    //     skip: !id,
    // });

    // if (isLoading) return <UserFormSkeleton />;

    // if (isError || !user) {
    //     // Use the helper to get the specific error details from the API
    //     const apiError = getApiError(error, "Failed to load user data for editing.");
    //     // Render the new, reusable error component with the details
    //     return <ApiErrorDisplay statusCode={apiError.type} message={apiError.message} />;
    // }

    // Render the UserForm and pass the fetched user data to it
    // return <h1>Add New User</h1>;
    return <UserForm />;
};

export default AddUser;
