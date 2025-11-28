import type {ReactNode} from "react";
import {Box, FormControl, FormHelperText, InputAdornment, TextField, type TextFieldProps} from "@mui/material";
import {type Control, Controller, type FieldValues, type Path} from "react-hook-form";

// Use generics for type-safe integration with react-hook-form
interface Props<T extends FieldValues> extends Omit<TextFieldProps, "name" | "defaultValue"> {
    name: Path<T>;
    control: Control<T>;
    label?: string;
    startIcon?: ReactNode;
    endIcon?: ReactNode;
    select?: boolean;
    children?: ReactNode;
}

const CustomTextField = <T extends FieldValues>({
                                                    name,
                                                    control,
                                                    label,
                                                    startIcon,
                                                    endIcon,
                                                    variant = "outlined",
                                                    select = false,
                                                    children,
                                                    ...rest
                                                }: Props<T>) => {
    return (
        <Controller
            name={name}
            control={control}
            render={({field, fieldState: {error}}) => (
                <FormControl fullWidth>
                    {label && (
                        <Box component="label" sx={{fontWeight: 400}}>
                            {label}
                        </Box>
                    )}
                    <TextField
                        {...field}
                        {...rest}
                        select={select}
                        error={Boolean(error)}
                        variant={variant}
                        sx={{
                            "& .MuiInputBase-input": {
                                textAlign: startIcon ? "right" : "left",
                            },
                            ...rest.sx,
                        }}
                        slotProps={{
                            ...rest.slotProps,
                            input: {
                                ...rest.slotProps?.input,
                                startAdornment: startIcon && (
                                    <InputAdornment position="start">{startIcon}</InputAdornment>
                                ),
                                endAdornment: !select && endIcon && (
                                    <InputAdornment position="end">{endIcon}</InputAdornment>
                                ),
                            },
                            select: select
                                ? {
                                    ...rest.slotProps?.select,
                                    IconComponent: () => endIcon || null,
                                }
                                : rest.slotProps?.select,
                        }}
                    >
                        {children}
                    </TextField>
                    {error && <FormHelperText sx={{color: "error.main"}}>{error.message}</FormHelperText>}
                </FormControl>
            )}
        />
    );
};

export default CustomTextField;