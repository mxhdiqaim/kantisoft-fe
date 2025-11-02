import {useState} from "react";
import {Button, IconButton, InputAdornment, Paper, TextField, Typography} from "@mui/material";
import {ArrowBackIosNewOutlined, Visibility, VisibilityOff} from "@mui/icons-material";
import {Controller, useForm} from "react-hook-form";
import useNotifier from "@/hooks/useNotifier";
import {useNavigate} from "react-router-dom";
import {useUpdatePasswordMutation} from "@/store/slice";
import {getApiError} from "@/helpers/get-api-error";

interface ChangePasswordForm {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

const ChangePassword = () => {
    const notify = useNotifier();
    const navigate = useNavigate();
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [updatePassword, {isLoading, error}] = useUpdatePasswordMutation();

    const {
        handleSubmit,
        control,
        reset,
        formState: {errors, isSubmitting},
        watch,
        setError,
    } = useForm<ChangePasswordForm>({
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (values: ChangePasswordForm) => {
        if (values.newPassword !== values.confirmPassword) {
            getApiError(error, "New passwords do not match.");
            notify("New passwords do not match.", "error");
            return;
        }
        try {
            await updatePassword({oldPassword: values.currentPassword, newPassword: values.newPassword}).unwrap();
            notify("Password changed successfully!", "success");
            reset();
        } catch (error) {
            console.log(`Failed to change password:`, error);
            const defaultMessage = `Failed to change password: ${error.message}`;
            const apiError = getApiError(error, defaultMessage);

            notify(apiError.message, "error");
            setError("newPassword", {type: "manual"});
            setError("confirmPassword", {type: "manual"});
        }
    };

    return (
        <>
            <Button variant="text" onClick={() => navigate(-1)} sx={{mb: 2}}>
                <ArrowBackIosNewOutlined fontSize="small" sx={{mr: 0.5}}/>
                Go back
            </Button>
            <Paper sx={{p: 4}} elevation={0}>
                <Typography variant="h5" mb={3}>
                    Change Password
                </Typography>
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Controller
                        name="currentPassword"
                        control={control}
                        rules={{required: "Current password is required"}}
                        render={({field}) => (
                            <TextField
                                {...field}
                                label="Current Password"
                                type={showCurrent ? "text" : "password"}
                                fullWidth
                                margin="normal"
                                error={!!errors.currentPassword}
                                helperText={errors.currentPassword?.message}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowCurrent((show) => !show)} edge="end">
                                                {showCurrent ? <VisibilityOff/> : <Visibility/>}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        )}
                    />
                    <Controller
                        name="newPassword"
                        control={control}
                        rules={{
                            required: "New password is required",
                            minLength: {value: 6, message: "Password must be at least 6 characters"},
                        }}
                        render={({field}) => (
                            <TextField
                                {...field}
                                label="New Password"
                                type={showNew ? "text" : "password"}
                                fullWidth
                                margin="normal"
                                error={!!errors.newPassword}
                                helperText={errors.newPassword?.message}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowNew((show) => !show)} edge="end">
                                                {showNew ? <VisibilityOff/> : <Visibility/>}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        )}
                    />
                    <Controller
                        name="confirmPassword"
                        control={control}
                        rules={{
                            required: "Please confirm your new password",
                            validate: (value) => value === watch("newPassword") || "Passwords do not match",
                        }}
                        render={({field}) => (
                            <TextField
                                {...field}
                                label="Confirm New Password"
                                type={showConfirm ? "text" : "password"}
                                fullWidth
                                margin="normal"
                                error={!!errors.confirmPassword}
                                helperText={errors.confirmPassword?.message}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowConfirm((show) => !show)} edge="end">
                                                {showConfirm ? <VisibilityOff/> : <Visibility/>}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        )}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{mt: 2}}
                        disabled={isLoading || isSubmitting}
                    >
                        Change Password
                    </Button>
                </form>
            </Paper>
        </>
    );
};

export default ChangePassword;
