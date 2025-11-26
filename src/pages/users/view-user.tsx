import ApiErrorDisplay from "@/components/feedback/api-error-display";
import ViewUserSkeleton from "@/components/users/loading/view-user-skeleton";
import {getApiError} from "@/helpers/get-api-error";
import useNotifier from "@/hooks/useNotifier";
import {useAppSelector} from "@/store";
import {useDeleteUserMutation, useGetUserByIdQuery, useUpdateUserMutation} from "@/store/slice";
import {selectCurrentUser} from "@/store/slice/auth-slice";
import {roleHierarchy, type UserRoleType, type UserStatus, type UserType} from "@/types/user-types";
import {ArrowBackIosNewOutlined, BlockOutlined, DeleteOutline, EditOutlined} from "@mui/icons-material";
import {Avatar, Box, Button, Card, CardContent, Chip, Divider, Grid, Typography} from "@mui/material";
import {format} from "date-fns";
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";

const getRoleChipColor = (role: UserRoleType) => {
    const colors: Record<UserRoleType, "secondary" | "primary" | "info" | "default"> = {
        manager: "secondary",
        admin: "primary",
        user: "info",
        guest: "default",
    };
    return colors[role] || "default";
};

const getStatusChipColor = (status: UserStatus) => {
    const colors: Record<UserStatus, "success" | "warning" | "error"> = {
        active: "success",
        inactive: "warning",
        banned: "error",
        deleted: "error",
    };
    return colors[status] || "default";
};

const getInitials = (firstName: string, lastName: string) => `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase();

const ViewUser = () => {
    const currentUser = useAppSelector(selectCurrentUser);
    const navigate = useNavigate();
    const notify = useNotifier();
    const {id} = useParams<{ id: string }>();
    const [deleteTimer, setDeleteTimer] = useState<NodeJS.Timeout | null>(null);

    const {
        data: user,
        error,
        isLoading,
    } = useGetUserByIdQuery(id as string, {
        skip: !id,
    });
    const [deleteUser, {isLoading: isDeleting}] = useDeleteUserMutation();
    const [updateUser, {isLoading: isUpdatingStatus}] = useUpdateUserMutation();

    const isSelf = currentUser?.id === (user as UserType)?.id;
    // const canPerformAction = currentUser && roleHierarchy[currentUser.role] > roleHierarchy[(user as UserType).role];

    const handleStatusChange = async () => {
        if (!user) return;
        const newStatus = user.status === "active" ? "inactive" : "active";
        try {
            await updateUser({id: user.id, status: newStatus}).unwrap();
            notify(`User has been ${newStatus}.`, "success");
        } catch (err) {
            const apiError = getApiError(err, "Failed to update user status.");
            notify(apiError.message, "error");
        }
    };

    const handleDelete = async () => {
        if (!user) return;
        notify("User will be deleted in 5 seconds.", "info");

        const timer = setTimeout(async () => {
            try {
                await deleteUser(user.id).unwrap();
                notify("User deleted successfully", "success");
                navigate("/users");
            } catch (err) {
                const apiError = getApiError(err, "Failed to delete user.");
                notify(apiError.message, "error");
            }
        }, 5000);

        setDeleteTimer(timer);
    };

    const handleUndoDelete = () => {
        if (deleteTimer) {
            clearTimeout(deleteTimer);
            setDeleteTimer(null);
            notify("Deletion cancelled.", "success");
        }
    };

    useEffect(() => {
        return () => {
            if (deleteTimer) clearTimeout(deleteTimer);
        };
    }, [deleteTimer]);

    if (isLoading) return <ViewUserSkeleton/>;

    if (error || !user) {
        const apiError = getApiError(error, "Failed to load user data for editing.");
        notify(apiError.message, "error");
        return <ApiErrorDisplay statusCode={apiError.type} message={apiError.message}/>;
    }

    return (
        <Box>
            <Button variant="text" onClick={() => navigate(-1)} sx={{mb: 2}}>
                <ArrowBackIosNewOutlined fontSize="small" sx={{mr: 0.5}}/>
                Go back
            </Button>
            <Typography variant="h4" gutterBottom>
                User Details
            </Typography>
            <Grid container spacing={3}>
                {/* User Profile Card */}
                <Grid size={{xs: 12, md: 4}}>
                    <Card>
                        <CardContent sx={{textAlign: "center", p: 3}}>
                            <Avatar
                                sx={{
                                    width: 120,
                                    height: 120,
                                    margin: "auto",
                                    mb: 2,
                                    bgcolor: "primary.main",
                                    fontSize: "3rem",
                                }}
                            >
                                {getInitials(user.firstName, user.lastName)}
                            </Avatar>
                            <Typography variant="h5">
                                {user.firstName} {user.lastName}
                            </Typography>
                            <Typography sx={{mb: 1.5}} color="text.secondary">
                                {user.email}
                            </Typography>
                            <Chip
                                label={user.role}
                                color={getRoleChipColor(user.role)}
                                size="medium"
                                sx={{textTransform: "capitalize"}}
                            />
                        </CardContent>
                        <Divider/>
                        <Box sx={{p: 2, display: "flex", flexDirection: "column", gap: 1}}>
                            {isSelf && (
                                <Button
                                    variant="contained"
                                    startIcon={<EditOutlined/>}
                                    onClick={() => navigate(`/users/${user.id}/edit`)}
                                >
                                    Edit Profile
                                </Button>
                            )}
                            {currentUser &&
                                roleHierarchy[currentUser.role] <
                                roleHierarchy[(user as UserType).role as UserRoleType] && (
                                    <>
                                        {deleteTimer ? (
                                                // If the delete timer is active, show the "Undo" button
                                                <Button variant="outlined" color="secondary" onClick={handleUndoDelete}>
                                                    Undo Delete
                                                </Button>
                                            ) :
                                            user.status === "deleted" ? (
                                                <>
                                                    <Typography color="error" align="center">
                                                        User has been deleted.
                                                    </Typography>
                                                    <Button
                                                        variant="outlined"
                                                        onClick={handleStatusChange}
                                                        disabled={isUpdatingStatus}
                                                        color="success"
                                                    >
                                                        Recover Account
                                                    </Button>
                                                </>
                                            ) : (
                                                <>
                                                    <Button
                                                        variant="outlined"
                                                        color={user.status === "active" ? "warning" : "success"}
                                                        startIcon={<BlockOutlined/>}
                                                        onClick={handleStatusChange}
                                                        disabled={isUpdatingStatus}
                                                    >
                                                        {isUpdatingStatus
                                                            ? "Updating..."
                                                            : user.status === "active"
                                                                ? "Deactivate"
                                                                : "Activate"}
                                                    </Button>
                                                    <Button
                                                        variant="outlined"
                                                        color="error"
                                                        startIcon={<DeleteOutline/>}
                                                        onClick={handleDelete}
                                                        disabled={isDeleting}
                                                    >
                                                        {isDeleting ? "Deleting..." : "Delete"}
                                                    </Button>
                                                </>
                                            )}
                                    </>
                                )}
                        </Box>
                    </Card>
                </Grid>

                {/* User Information Details */}
                <Grid size={{xs: 12, md: 8}}>
                    <Card>
                        <CardContent sx={{p: 3}}>
                            <Typography variant="h6" gutterBottom>
                                Personal Information
                            </Typography>
                            <Grid container spacing={2} sx={{mt: 1}}>
                                <Grid size={{xs: 12, sm: 6}}>
                                    <Typography variant="body2" color="text.secondary">
                                        Full Name
                                    </Typography>
                                    <Typography variant="body1" fontWeight={500}>
                                        {user.firstName} {user.lastName}
                                    </Typography>
                                </Grid>
                                <Grid size={{xs: 12, sm: 6}}>
                                    <Typography variant="body2" color="text.secondary">
                                        Email Address
                                    </Typography>
                                    <Typography variant="body1" fontWeight={500}>
                                        {user.email}
                                    </Typography>
                                </Grid>
                                <Grid size={{xs: 12, sm: 6}}>
                                    <Typography variant="body2" color="text.secondary">
                                        Phone Number
                                    </Typography>
                                    <Typography variant="body1" fontWeight={500}>
                                        {user.phone || "N/A"}
                                    </Typography>
                                </Grid>
                                <Grid size={{xs: 12, sm: 6}}>
                                    <Typography variant="body2" color="text.secondary">
                                        Status
                                    </Typography>
                                    <Chip
                                        label={user.status}
                                        color={getStatusChipColor(user.status)}
                                        size="medium"
                                        sx={{textTransform: "capitalize"}}
                                    />
                                </Grid>
                                <Grid size={{xs: 12, sm: 6}}>
                                    <Typography variant="body2" color="text.secondary">
                                        Role
                                    </Typography>
                                    <Typography variant="body1" fontWeight={500} sx={{textTransform: "capitalize"}}>
                                        {user.role}
                                    </Typography>
                                </Grid>
                                <Grid size={{xs: 12, sm: 6}}>
                                    <Typography variant="body2" color="text.secondary">
                                        Date Joined
                                    </Typography>
                                    <Typography variant="body1" fontWeight={500}>
                                        {format(new Date(user.createdAt), "MMMM dd, yyyy")}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ViewUser;
