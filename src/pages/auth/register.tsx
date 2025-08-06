import {getApiError} from "@/helpers/get-api-error";
import useNotifier from "@/hooks/useNotifier";
import {useRegisterManagerAndStoreMutation} from "@/store/slice";
import {STORE_TYPES} from "@/types/store-types";
import {createUserSchemaWithoutStatusStoreIDRole, type RegisterUserType} from "@/types/user-types";
import {yupResolver} from "@hookform/resolvers/yup";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import {
    Box,
    Button,
    FormControl,
    FormHelperText,
    Grid,
    IconButton,
    InputAdornment,
    MenuItem,
    TextField,
    Typography,
    useTheme,
} from "@mui/material";
import {useState} from "react";
import {Controller, useForm} from "react-hook-form";
import {useNavigate} from "react-router-dom";

const defaultValues: RegisterUserType = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    storeName: "",
    storeType: STORE_TYPES[0],
};

const Register = () => {
    const navigate = useNavigate();
    const notify = useNotifier();
    const theme = useTheme();

    // const currentUser = useAppSelector(selectCurrentUser);

    const [registerManagerAndStore, {isLoading}] = useRegisterManagerAndStoreMutation();

    const [showPassword, setShowPassword] = useState(false);

    const {
        control,
        handleSubmit,
        formState: {errors},
    } = useForm<RegisterUserType>({
        defaultValues,
        mode: "onBlur",
        // eslint-disable-next-line
        // @ts-ignore
        resolver: yupResolver(createUserSchemaWithoutStatusStoreIDRole),
    });

    const onSubmit = async (data: RegisterUserType) => {
        try {
            // eslint-disable-next-line
            const {confirmPassword, ...rest} = data;
            await registerManagerAndStore(rest).unwrap();
            notify("Registration successful!", "success");
            navigate("/login");
        } catch (err) {
            console.log("error", err);
            const apiMessage = getApiError(err, "Registration failed. Please try again.");
            notify(apiMessage.message, "error");
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
                        width: "100%",
                        maxWidth: {xs: "100%", sm: "400px"},
                    }}
                >
                    <Box sx={{textAlign: "center", mb: 5}}>
                        <Typography variant="h5" sx={{fontWeight: 500}}>
                            Create an Account
                        </Typography>
                    </Box>
                    {/* eslint-disable-next-line */}
                    <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit as any)}>
                        <FormControl fullWidth sx={{mb: 2}}>
                            <Controller
                                name="firstName"
                                control={control}
                                render={({field}) => (
                                    <TextField {...field} label="First Name" error={!!errors.firstName}/>
                                )}
                            />
                            {errors.firstName && (
                                <FormHelperText sx={{color: "error.main"}}>{errors.firstName.message}</FormHelperText>
                            )}
                        </FormControl>
                        <FormControl fullWidth sx={{mb: 2}}>
                            <Controller
                                name="lastName"
                                control={control}
                                render={({field}) => (
                                    <TextField {...field} label="Last Name" error={!!errors.lastName}/>
                                )}
                            />
                            {errors.lastName && (
                                <FormHelperText sx={{color: "error.main"}}>{errors.lastName.message}</FormHelperText>
                            )}
                        </FormControl>
                        <FormControl fullWidth sx={{mb: 2}}>
                            <Controller
                                name="email"
                                control={control}
                                render={({field}) => (
                                    <TextField
                                        {...field}
                                        label="Email"
                                        error={!!errors.email}
                                        type="email"
                                        placeholder="example@gmail.com"
                                    />
                                )}
                            />
                            {errors.email && (
                                <FormHelperText sx={{color: "error.main"}}>{errors.email.message}</FormHelperText>
                            )}
                        </FormControl>
                        <FormControl fullWidth sx={{mb: 2}}>
                            <Controller
                                name="password"
                                control={control}
                                render={({field}) => (
                                    <TextField
                                        {...field}
                                        label="Password"
                                        error={!!errors.password}
                                        type={showPassword ? "text" : "password"}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={() => setShowPassword((show) => !show)}
                                                        edge="end"
                                                        aria-label="toggle password visibility"
                                                    >
                                                        {showPassword ? <VisibilityOff/> : <Visibility/>}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                )}
                            />
                            {errors.password && (
                                <FormHelperText sx={{color: "error.main"}}>{errors.password.message}</FormHelperText>
                            )}
                        </FormControl>
                        <FormControl fullWidth sx={{mb: 2}}>
                            <Controller
                                name="confirmPassword"
                                control={control}
                                render={({field}) => (
                                    <TextField
                                        {...field}
                                        label="Confirm Password"
                                        error={!!errors.confirmPassword}
                                        type={showPassword ? "text" : "password"}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={() => setShowPassword((show) => !show)}
                                                        edge="end"
                                                        aria-label="toggle confirm password visibility"
                                                    >
                                                        {showPassword ? <VisibilityOff/> : <Visibility/>}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                )}
                            />
                            {errors.confirmPassword && (
                                <FormHelperText sx={{color: "error.main"}}>
                                    {errors.confirmPassword.message}
                                </FormHelperText>
                            )}
                        </FormControl>
                        <FormControl fullWidth sx={{mb: 2}}>
                            <Controller
                                name="phone"
                                control={control}
                                render={({field}) => (
                                    <TextField
                                        {...field}
                                        label="Phone (optional)"
                                        error={!!errors.phone}
                                        placeholder="08012345678"
                                    />
                                )}
                            />
                            {errors.phone && (
                                <FormHelperText sx={{color: "error.main"}}>{errors.phone.message}</FormHelperText>
                            )}
                        </FormControl>
                        <FormControl fullWidth sx={{mb: 2}}>
                            <Controller
                                name="storeName"
                                control={control}
                                render={({field}) => (
                                    <TextField {...field} label="Store Name" error={!!errors.storeName}/>
                                )}
                            />
                            {errors.storeName && (
                                <FormHelperText sx={{color: "error.main"}}>{errors.storeName.message}</FormHelperText>
                            )}
                        </FormControl>
                        <FormControl fullWidth sx={{mb: 2}}>
                            <Controller
                                name="storeType"
                                control={control}
                                render={({field}) => (
                                    <TextField {...field} select label="Store Type" error={!!errors.storeType}>
                                        {STORE_TYPES.map((type) => (
                                            <MenuItem key={type} value={type}>
                                                {type.charAt(0).toUpperCase() + type.slice(1)}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                )}
                            />
                            {errors.storeType && (
                                <FormHelperText sx={{color: "error.main"}}>{errors.storeType.message}</FormHelperText>
                            )}
                        </FormControl>
                        <Box sx={{display: "flex", justifyContent: "center"}}>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={isLoading}
                                sx={{
                                    width: "100%",
                                    color: "#fff",
                                    borderRadius: theme.borderRadius.small,
                                    p: 2,
                                    mb: 2,
                                    fontWeight: 600,
                                }}
                            >
                                {isLoading ? "Registering..." : "Register"}
                            </Button>
                        </Box>
                        <Box sx={{textAlign: "center"}}>
                            <Typography variant="body1">
                                Already have an account?{" "}
                                <Button variant="text" onClick={() => navigate("/login")}>
                                    Login
                                </Button>
                            </Typography>
                        </Box>
                    </form>
                </Box>
            </Grid>
        </Grid>
    );
};

export default Register;
