import ApiErrorDisplay from "@/components/feedback/api-error-display";
import UsersPageLoading from "@/components/users/loading";
import UsersTable from "@/components/users/users-table";
import { getApiError } from "@/helpers/get-api-error";
import useNotifier from "@/hooks/useNotifier";
import { useAppSelector } from "@/store";
import { useGetAllUsersQuery } from "@/store/slice";
import { selectCurrentUser } from "@/store/slice/auth-slice";
import { AddOutlined } from "@mui/icons-material";
import { Box, Button, Paper, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";

const UsersPage = () => {
    const notify = useNotifier();
    const theme = useTheme();
    const navigate = useNavigate();
    const currentUser = useAppSelector(selectCurrentUser);
    const { data: users, isLoading, isError, error } = useGetAllUsersQuery();

    if (isLoading) {
        return <UsersPageLoading />;
    }

    if (isError) {
        const apiError = getApiError(error, "Failed to load users. Please try again later.");
        notify(apiError.message, "error");
        return <ApiErrorDisplay statusCode={apiError.type} message={apiError.message} />;
    }

    return (
        <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h4">User Management</Typography>
                {currentUser && (currentUser.role === "manager" || currentUser.role === "admin") && (
                    <Button variant="contained" startIcon={<AddOutlined />} onClick={() => navigate("/users/create")}>
                        New User
                    </Button>
                )}
            </Box>
            <Paper
                elevation={0}
                sx={{
                    border: `1px solid ${theme.palette.divider}`,
                    height: "70vh",
                    width: "100%",
                    "& .capitalize-cell": {
                        textTransform: "capitalize",
                    },
                }}
            >
                <UsersTable users={users ?? []} loading={isLoading} />
            </Paper>
        </Box>
    );
};

export default UsersPage;
