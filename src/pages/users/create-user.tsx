import { getApiError } from "@/helpers/get-api-error";
import useNotifier from "@/hooks/useNotifier";
import { useCreateUserMutation } from "@/store/slice";
import { createUserType, type CreateUserType, USER_ROLES } from "@/types/user-types";
import { yupResolver } from "@hookform/resolvers/yup";
import { ArrowBackIosNewOutlined, Visibility, VisibilityOff } from "@mui/icons-material";
import {
    Box,
    Button,
    FormControl,
    FormHelperText,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography,
    useTheme,
} from "@mui/material";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const defaultValues: CreateUserType = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    role: "manager",
    status: "active",
};

const CreateUser = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const notify = useNotifier();
    const [createUser, { isLoading }] = useCreateUserMutation();
    const [showPassword, setShowPassword] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues,
        mode: "onChange",
        // eslint-disable-next-line
        // @ts-ignore
        resolver: yupResolver(createUserType),
    });

    const onSubmit = async (data: CreateUserType) => {
        try {
            await createUser(data).unwrap();
            notify("User created successfully!", "success");
            navigate("/users");
        } catch (error) {
            const defaultMessage = "Failed to create user.";
            const apiError = getApiError(error, defaultMessage);
            notify(apiError.message, "error");
        }
    };

    return (
        <Box>
            <Button variant="text" onClick={() => navigate(-1)} sx={{ mb: 2 }}>
                <ArrowBackIosNewOutlined fontSize="small" sx={{ mr: 0.5 }} />
                Back to Users
            </Button>
            <Typography variant="h4" sx={{ mb: 3 }}>
                Create New User
            </Typography>

            <Paper
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                elevation={0}
                sx={{
                    p: { xs: 2, md: 4 },
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: theme.borderRadius.small,
                }}
            >
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Controller
                            name="firstName"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    label="First Name"
                                    error={!!errors.firstName}
                                    helperText={errors.firstName?.message}
                                />
                            )}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Controller
                            name="lastName"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    label="Last Name"
                                    error={!!errors.lastName}
                                    helperText={errors.lastName?.message}
                                />
                            )}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Controller
                            name="email"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    label="Email Address"
                                    type="email"
                                    error={!!errors.email}
                                    helperText={errors.email?.message}
                                />
                            )}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Controller
                            name="phone"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    label="Phone Number (Optional)"
                                    error={!!errors.phone}
                                    helperText={errors.phone?.message}
                                />
                            )}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Controller
                            name="password"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    label="Password"
                                    type={showPassword ? "text" : "password"}
                                    error={!!errors.password}
                                    helperText={errors.password?.message}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            )}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Controller
                            name="confirmPassword"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    label="Confirm Password"
                                    type={showPassword ? "text" : "password"}
                                    error={!!errors.confirmPassword}
                                    helperText={errors.confirmPassword?.message}
                                />
                            )}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth error={!!errors.role}>
                            <InputLabel id="role-select-label">Role</InputLabel>
                            <Controller
                                name="role"
                                control={control}
                                render={({ field }) => (
                                    <Select {...field} labelId="role-select-label" label="Role">
                                        {USER_ROLES.map((role) => (
                                            <MenuItem key={role} value={role} sx={{ textTransform: "capitalize" }}>
                                                {role}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                )}
                            />
                            {errors.role && <FormHelperText>{errors.role.message}</FormHelperText>}
                        </FormControl>
                    </Grid>
                    <Grid size={12}>
                        <Button variant="contained" type="submit" disabled={isLoading}>
                            {isLoading ? "Creating User..." : "Create User"}
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

export default CreateUser;
