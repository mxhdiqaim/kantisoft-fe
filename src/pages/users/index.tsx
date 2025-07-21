import UsersPageLoading from "@/components/users/loading";
import UsersTable from "@/components/users/users-table";
import { useGetAllUsersQuery } from "@/store/slice";
import { AddOutlined } from "@mui/icons-material";
import { Box, Button, Paper, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";

const UsersPage = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { data: users, isLoading, isError } = useGetAllUsersQuery();

    if (isLoading) {
        return <UsersPageLoading />;
    }

    if (isError) {
        return (
            <Typography color="error" align="center" sx={{ mt: 4 }}>
                Failed to load users. Please try again later.
            </Typography>
        );
    }

    return (
        <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h4">User Management</Typography>
                <Button variant="contained" startIcon={<AddOutlined />} onClick={() => navigate("/users/new")}>
                    New User
                </Button>
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
