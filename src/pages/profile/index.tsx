import {useAppSelector} from "@/store";
import {selectCurrentUser} from "@/store/slice/auth-slice";
import {Avatar, Box, Button, Card, CardContent, Chip, Divider, Grid, Typography} from "@mui/material";
import {
    ArrowBackIosNewOutlined,
    EditOutlined,
    EmailOutlined,
    PhoneOutlined,
    StorefrontOutlined,
} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";
import {getRoleChipColor} from "@/utils";
import {useGetUserByIdQuery} from "@/store/slice";
import ViewUserSkeleton from "@/components/profile/loading";
import ApiErrorDisplay from "@/components/feedback/api-error-display";
import {getApiError} from "@/helpers/get-api-error";
import {selectActiveStore} from "@/store/slice/store-slice";
import {useSelector} from "react-redux";

const ProfilePage = () => {
    const navigate = useNavigate();
    const loggedInUser = useAppSelector(selectCurrentUser);

    const activeStore = useSelector(selectActiveStore);

    // Fetch the latest user data to ensure it's up to date
    const {
        data: user,
        isLoading,
        isError,
        error,
    } = useGetUserByIdQuery(loggedInUser?.id as string, {
        skip: !loggedInUser, // Skip query if user is not logged in
    });

    if (isLoading) {
        return <ViewUserSkeleton/>;
    }

    if (isError || !user) {
        const apiError = getApiError(error, "Failed to load your profile.");
        return <ApiErrorDisplay statusCode={apiError.type} message={apiError.message}/>;
    }

    return (
        <Box>
            <Button variant="text" onClick={() => navigate(-1)} sx={{mb: 2}}>
                <ArrowBackIosNewOutlined fontSize="small" sx={{mr: 0.5}}/>
                Go back
            </Button>
            <Typography variant="h4" gutterBottom>
                My Profile
            </Typography>
            <Grid container spacing={3}>
                {/* Left Column: Profile Card */}
                <Grid size={{xs: 12, md: 4}}>
                    <Card>
                        <CardContent sx={{textAlign: "center", p: 3}}>
                            <Avatar
                                sx={{
                                    width: 120,
                                    height: 120,
                                    margin: "auto",
                                    mb: 2,
                                    backgroundColor: "primary.main",
                                    fontSize: "3rem",
                                }}
                            >
                                {user.firstName.charAt(0).toUpperCase()}
                            </Avatar>
                            <Typography variant="h5" gutterBottom>
                                {user.firstName} {user.lastName}
                            </Typography>
                            <Chip
                                label={user.role}
                                color={getRoleChipColor(user.role)}
                                size="medium"
                                sx={{textTransform: "capitalize", fontWeight: "bold"}}
                            />
                        </CardContent>
                        <Divider/>
                        <Box sx={{p: 2}}>
                            <Button
                                fullWidth
                                variant="contained"
                                startIcon={<EditOutlined/>}
                                onClick={() => navigate(`/users/${user.id}/edit`)}
                            >
                                Edit Profile
                            </Button>
                        </Box>
                        <Box sx={{px: 2, pb: 2}}>
                            <Button
                                fullWidth
                                variant="outlined"
                                startIcon={<EditOutlined/>}
                                onClick={() => navigate(`/users/change-password`)}
                            >
                                Change Password
                            </Button>
                        </Box>
                    </Card>
                </Grid>

                {/* Right Column: Details Card */}
                <Grid size={{xs: 12, md: 8}}>
                    <Card>
                        <CardContent sx={{p: 3}}>
                            <Typography variant="h6" gutterBottom>
                                Profile Details
                            </Typography>
                            <Divider sx={{mb: 3}}/>
                            <Grid container spacing={3}>
                                <Grid size={{xs: 12, sm: 6}}>
                                    <Box display="flex" alignItems="center">
                                        <EmailOutlined color="action" sx={{mr: 1.5}}/>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">
                                                Email
                                            </Typography>
                                            <Typography fontWeight="medium">{user.email}</Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid size={{xs: 12, sm: 6}}>
                                    <Box display="flex" alignItems="center">
                                        <PhoneOutlined color="action" sx={{mr: 1.5}}/>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">
                                                Phone
                                            </Typography>
                                            <Typography fontWeight="medium">{user.phone || "Not provided"}</Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid size={{xs: 12, sm: 6}}>
                                    <Box display="flex" alignItems="center">
                                        <StorefrontOutlined color="action" sx={{mr: 1.5}}/>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">
                                                Store
                                            </Typography>
                                            <Typography fontWeight="medium">{activeStore?.name || "N/A"}</Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ProfilePage;
