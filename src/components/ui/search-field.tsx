import {FormControl, type SxProps, type TextFieldProps, type Theme} from "@mui/material";
import {type Control, Controller, type FieldValues} from "react-hook-form";
import {StyledTextField} from "@/components/ui/index.tsx";

interface Props<T extends FieldValues> extends Omit<TextFieldProps, "name" | "defaultValue"> {
    control: Control<T>;
    name: string;
    placeholder?: string;
    sx?: SxProps<Theme>;
}

const SearchField = <T extends FieldValues>({control, name, placeholder}: Props<T>) => {

    return (
        <Controller
            name={name}
            control={control}
            render={({field}) => (
                <FormControl fullWidth>
                    <StyledTextField
                        {...field}
                        placeholder={placeholder}
                    />
                </FormControl>
            )}
        />
    );
};

export default SearchField;