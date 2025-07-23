import { getApiError } from "@/helpers/get-api-error";
import useNotifier from "@/hooks/useNotifier";
import { useCreateStoreMutation } from "@/store/slice";
import { createStoreSchema, type CreateStoreType, STORE_TYPES } from "@/types/store-types";
import { yupResolver } from "@hookform/resolvers/yup";
import { ArrowBackIosNewOutlined } from "@mui/icons-material";
import {
    Box,
    Button,
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography,
    useTheme,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const StoreForm = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const notify = useNotifier();
    const [createStore, { isLoading }] = useCreateStoreMutation();

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: { name: "", location: "", storeType: "restaurant" },
        resolver: yupResolver(createStoreSchema),
    });

    const onSubmit = async (data: CreateStoreType) => {
        try {
            await createStore(data).unwrap();
            notify("Store created successfully!", "success");
            navigate("/stores");
        } catch (error) {
            const defaultMessage = "Failed to create store";
            const apiError = getApiError(error, defaultMessage);
            notify(apiError.message, "error");

            console.log(`Error creating store: ${apiError.message}`);
        }
    };

    return (
        <Box>
            <Button variant="text" onClick={() => navigate(-1)} sx={{ mb: 2 }}>
                <ArrowBackIosNewOutlined fontSize="small" sx={{ mr: 0.5 }} />
                Go back
            </Button>
            <Typography variant="h4" sx={{ mb: 3 }}>
                Create New Store
            </Typography>

            <Paper
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                elevation={0}
                sx={{ p: 4, border: `1px solid ${theme.palette.divider}`, borderRadius: theme.borderRadius.small }}
            >
                <Grid container spacing={3}>
                    <Grid size={12}>
                        <Controller
                            name="name"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    label="Store Name"
                                    error={!!errors.name}
                                    helperText={errors.name?.message}
                                />
                            )}
                        />
                    </Grid>
                    <Grid size={12}>
                        <Controller
                            name="location"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    label="Location (Optional)"
                                    error={!!errors.location}
                                    helperText={errors.location?.message}
                                />
                            )}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth error={!!errors.storeType}>
                            <InputLabel id="store-type-label">Store Type</InputLabel>
                            <Controller
                                name="storeType"
                                control={control}
                                render={({ field }) => (
                                    <Select {...field} labelId="store-type-label" label="Store Type">
                                        {STORE_TYPES.map((type) => (
                                            <MenuItem key={type} value={type} sx={{ textTransform: "capitalize" }}>
                                                {type}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                )}
                            />
                            {errors.storeType && <FormHelperText>{errors.storeType.message}</FormHelperText>}
                        </FormControl>
                    </Grid>
                    <Grid size={12}>
                        <Button variant="contained" type="submit" disabled={isLoading}>
                            {isLoading ? "Creating..." : "Create Store"}
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

export default StoreForm;
