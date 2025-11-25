import {getApiError} from "@/helpers/get-api-error";
import useNotifier from "@/hooks/useNotifier";
import {useCreateStoreMutation, useGetStoreByIdQuery, useUpdateStoreMutation} from "@/store/slice";
import {createStoreSchema, type CreateStoreType, STORE_TYPES} from "@/types/store-types";
import {yupResolver} from "@hookform/resolvers/yup";
import {ArrowBackIosNewOutlined} from "@mui/icons-material";
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
import {useEffect} from "react";
import {Controller, useForm} from "react-hook-form";
import {useNavigate, useParams} from "react-router-dom";
import StoreFormLoading from "@/components/stores/loading/store-form-loading.tsx";

const StoreForm = () => {
    const {id} = useParams<{ id: string }>();
    const isEditMode = !!id;
    const theme = useTheme();
    const navigate = useNavigate();
    const notify = useNotifier();

    const {data: storeData, isLoading: isFetching} = useGetStoreByIdQuery(id!, {skip: !isEditMode});
    const [createStore, {isLoading: isCreating}] = useCreateStoreMutation();
    const [updateStore, {isLoading: isUpdating}] = useUpdateStoreMutation();

    const {
        control,
        handleSubmit,
        formState: {errors},
        reset,
    } = useForm<CreateStoreType>({
        defaultValues: {name: "", location: "", storeType: "restaurant"},

        // eslint-disable-next-line
        // @ts-ignore
        resolver: yupResolver(createStoreSchema),
    });

    useEffect(() => {
        if (isEditMode && storeData) {
            reset({
                name: storeData.name,
                location: storeData.location || "",
                storeType: storeData.storeType,
            });
        }
    }, [isEditMode, storeData, reset]);

    const onSubmit = async (formData: CreateStoreType) => {
        try {
            if (isEditMode) {
                await updateStore({id: id!, ...formData}).unwrap();
                notify("Store updated successfully!", "success");
            } else {
                await createStore(formData).unwrap();
                notify("Store created successfully!", "success");
            }
            navigate("/stores");
        } catch (error) {
            const defaultMessage = isEditMode ? "Failed to update store" : "Failed to create store";
            const apiError = getApiError(error, defaultMessage);
            notify(apiError.message, "error");
            console.error(`Error: ${apiError.message}`);
        }
    };

    if (isFetching) {
        return <StoreFormLoading/>
    }

    const isLoading = isCreating || isUpdating;

    return (
        <Box>
            <Button variant="text" onClick={() => navigate(-1)} sx={{mb: 2}}>
                <ArrowBackIosNewOutlined fontSize="small" sx={{mr: 0.5}}/>
                Go back
            </Button>
            <Typography variant="h4" sx={{mb: 3}}>
                {isEditMode ? "Edit Store" : "Create New Store"}
            </Typography>

            <Paper
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                elevation={0}
                sx={{p: 4, border: `1px solid ${theme.palette.divider}`, borderRadius: theme.borderRadius.small}}
            >
                <Grid container spacing={3}>
                    <Grid size={12}>
                        <Controller
                            name="name"
                            control={control}
                            render={({field}) => (
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
                            render={({field}) => (
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
                    <Grid size={{xs: 12, sm: 6}}>
                        <FormControl fullWidth error={!!errors.storeType}>
                            <InputLabel id="store-type-label">Store Type</InputLabel>
                            <Controller
                                name="storeType"
                                control={control}
                                render={({field}) => (
                                    <Select {...field} labelId="store-type-label" label="Store Type">
                                        {STORE_TYPES.map((type) => (
                                            <MenuItem key={type} value={type} sx={{textTransform: "capitalize"}}>
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
                            {isLoading
                                ? isEditMode
                                    ? "Updating..."
                                    : "Creating..."
                                : isEditMode
                                    ? "Update Store"
                                    : "Create Store"}
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

export default StoreForm;
