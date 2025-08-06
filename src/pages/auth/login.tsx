import {getApiError} from "@/helpers/get-api-error";
import useNotifier from "@/hooks/useNotifier";
import {useLoginMutation} from "@/store/slice";
import {loginUserType, type LoginUserType} from "@/types/user-types";
import {yupResolver} from "@hookform/resolvers/yup";
import {
    Box,
    Button,
    FormControl,
    FormHelperText,
    Grid,
    Link as MuiLink,
    TextField,
    Typography,
    useTheme
} from "@mui/material";

import {Controller, useForm} from "react-hook-form";
import {Link, useLocation, useNavigate} from "react-router-dom";

const defaultValues = {
    password: "",
    email: "",
};

const Login = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const notify = useNotifier();
    const [login, {isLoading: loading}] = useLoginMutation();

    // Get the path the user was trying to access before being redirected
    const from = location.state?.from?.pathname || "/";

    const {
        control,
        setError,
        handleSubmit,
        formState: {errors},
    } = useForm({
        defaultValues,
        mode: "onBlur",
        resolver: yupResolver(loginUserType),
    });

    const onSubmit = async (data: LoginUserType) => {
        try {
            // The login mutation returns a promise.
            // .unwrap() will throw an error on failure, which is caught by the catch block.
            await login(data).unwrap();

            // On successful login, navigate to the intended page or a default.
            navigate(from, {replace: true});
        } catch (err) {
            // 2. Use the getApiError helper for clean, consistent error parsing
            const defaultMessage = "Invalid email or password.";
            const apiError = getApiError(err, defaultMessage);

            notify(apiError.message, "error");

            setError("email", {type: "manual"});
            setError("password", {type: "manual"});
        }
    };

    return (
        <Grid container spacing={2}>
            <Grid
                size={12}
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "100vh",
                    m: {xs: 3, md: 0},
                }}
            >
                <Box
                    sx={{
                        width: "100%", // Ensure box takes up grid item width
                        maxWidth: {
                            xs: "100%",
                            sm: "400px", // Set a m ax-width for better layout on larger screens
                        },
                    }}
                >
                    <Box sx={{textAlign: "center", mb: 5}}>
                        <Typography variant={"h5"} sx={{fontWeight: 500}}>
                            Welcome Back! Login to your account
                        </Typography>
                    </Box>
                    <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                        <FormControl fullWidth>
                            <Controller
                                name="email"
                                control={control}
                                rules={{required: true}}
                                render={({field: {value, onChange, onBlur}}) => (
                                    <TextField
                                        autoFocus
                                        label="Email"
                                        value={value}
                                        onBlur={onBlur}
                                        onChange={onChange}
                                        error={Boolean(errors.email)}
                                        placeholder="example@gmail.com"
                                        sx={{borderRadius: theme.borderRadius.small}}
                                    />
                                )}
                            />
                            {errors.email && (
                                <FormHelperText sx={{color: "error.main"}}>{errors.email.message}</FormHelperText>
                            )}
                        </FormControl>
                        <FormControl fullWidth sx={{mt: 3}}>
                            <Controller
                                name="password"
                                control={control}
                                rules={{required: true}}
                                render={({field: {value, onChange, onBlur}}) => (
                                    <TextField
                                        value={value}
                                        onBlur={onBlur}
                                        label="Password"
                                        onChange={onChange}
                                        id="auth-login-v2-password"
                                        error={Boolean(errors.password)}
                                        type={"password"}
                                        sx={{borderRadius: theme.borderRadius.small}}
                                    />
                                )}
                            />
                            {errors.password && (
                                <FormHelperText sx={{color: "error.main"}} id="">
                                    {errors.password.message}
                                </FormHelperText>
                            )}
                        </FormControl>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                                my: 3,
                            }}
                        >
                            <MuiLink component={Link} to="/forget-password" sx={{textDecoration: "none"}}>
                                Forgot Password?
                            </MuiLink>
                        </Box>
                        <Box sx={{display: "flex", justifyContent: "center", mt: 3}}>
                            <Button
                                type="submit"
                                variant="contained"
                                sx={{
                                    width: "100%", // Make the button full width
                                    color: "#fff",
                                    borderRadius: theme.borderRadius.small,
                                    p: 2,
                                    mb: 2,
                                }}
                                disabled={loading}
                            >
                                {loading ? "Logging in..." : "Login"}
                            </Button>
                        </Box>
                        <Box sx={{textAlign: "center", mt: 2}}>
                            <Typography variant="body1">
                                Don&apos;t have an account?{" "}
                                <Button variant="text" onClick={() => navigate("/register")}>
                                    Register
                                </Button>
                            </Typography>
                        </Box>
                    </form>
                </Box>
            </Grid>
        </Grid>
    );
};

export default Login;
