// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { getApiError } from "@/helpers/get-api-error";
import useNotifier from "@/hooks/useNotifier";
import { useCreateUserMutation, useGetAllStoresQuery, useUpdateUserMutation } from "@/store/slice";
import { selectCurrentUser } from "@/store/slice/auth-slice";
import type { StoreType } from "@/types/store-types";
import {
    createUserSchema,
    type CreateUserType,
    updateUserSchema,
    type UpdateUserType,
    USER_ROLES,
    UserRoleEnum,
    type UserType,
} from "@/types/user-types";
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
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

interface Props {
    userToEdit?: UserType;
}

const UserForm = ({ userToEdit }: Props) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const notify = useNotifier();
    const currentUser = useSelector(selectCurrentUser);
    const [showPassword, setShowPassword] = useState(false);

    const isEditMode = Boolean(userToEdit);

    const { data: stores, isLoading: isLoadingStores } = useGetAllStoresQuery();

    const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
    const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
    const isLoading = isCreating || isUpdating;

    const defaultValues = useMemo(
        () => ({
            firstName: userToEdit?.firstName || "",
            lastName: userToEdit?.lastName || "",
            email: userToEdit?.email || "",
            phone: userToEdit?.phone || "",
            role: userToEdit?.role || UserRoleEnum.USER,
            storeId: userToEdit?.storeId || currentUser?.storeId || "",
            password: "",
            confirmPassword: "",
        }),
        [userToEdit, currentUser],
    );

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues,
        mode: "onChange",
        resolver: yupResolver(isEditMode ? updateUserSchema : createUserSchema),
    });

    const onSubmit = async (data: CreateUserType | UpdateUserType) => {
        console.log("first");
        try {
            if (isEditMode && userToEdit) {
                // If password is not being changed, don't send it in the payload
                const payload = { ...data };
                if (!payload.password) {
                    delete payload.password;
                }
                await updateUser({ id: userToEdit.id, ...payload }).unwrap();
                notify("User updated successfully!", "success");
            } else {
                await createUser(data as CreateUserType).unwrap();
                notify("User created successfully!", "success");
            }
            navigate("/users");
        } catch (error) {
            const defaultMessage = `Failed to ${isEditMode ? "update" : "create"} user.`;
            const apiError = getApiError(error, defaultMessage);
            notify(apiError.message, "error");
        }
    };

    const availableRoles =
        currentUser?.role === UserRoleEnum.ADMIN
            ? USER_ROLES.filter((role) => role !== UserRoleEnum.ADMIN && role !== UserRoleEnum.MANAGER)
            : USER_ROLES;

    return (
        <Box>
            <Button variant="text" onClick={() => navigate(-1)} sx={{ mb: 2 }}>
                <ArrowBackIosNewOutlined fontSize="small" sx={{ mr: 0.5 }} />
                Go back
            </Button>
            <Typography variant="h4" sx={{ mb: 3 }}>
                {isEditMode ? "Edit User" : "Create New User"}
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
                                    label={isEditMode ? "New Password (Optional)" : "Password"}
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
                                        {availableRoles.map((role) => (
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
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth error={!!errors.storeId}>
                            <InputLabel id="store-select-label">Assigned Store</InputLabel>
                            <Controller
                                name="storeId"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        labelId="store-select-label"
                                        label="Assigned Store"
                                        disabled={isLoadingStores}
                                    >
                                        {stores?.map((store: StoreType) => (
                                            <MenuItem key={store.id} value={store.id}>
                                                {store.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                )}
                            />
                            {errors.storeId && <FormHelperText>{errors.storeId.message}</FormHelperText>}
                        </FormControl>
                    </Grid>
                    <Grid size={12}>
                        <Button variant="contained" type="submit" disabled={isLoading}>
                            {isLoading ? "Saving..." : isEditMode ? "Save Changes" : "Create User"}
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

export default UserForm;
