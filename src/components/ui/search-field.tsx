import {type SxProps, type Theme, useTheme} from "@mui/material";
import type {Control} from "react-hook-form";
import CustomTextField from "@/components/ui/textfield.tsx";
import Icon from "@/components/ui/icon.tsx";
import SearchSvgIcon from "@/assets/icons/search.svg";
import {iconStyle} from "@/styles";

interface Props {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    control: Control<any>;
    name: string;
    placeholder?: string;
    sx?: SxProps<Theme>;
}

const SearchField = ({control, name, placeholder, sx}: Props) => {
    const theme = useTheme();

    return (
        <CustomTextField
            name={name}
            type={"text"}
            placeholder={placeholder}
            control={control}
            startIcon={<Icon src={SearchSvgIcon} alt={"Search Icon"} sx={{...iconStyle}}/>}
            sx={{
                width: {xs: "100%", md: "auto"},
                "& .MuiOutlinedInput-root": {
                    height: 40,
                    maxWidth: {xs: "100%", md: 500},
                    borderRadius: theme.borderRadius.small - 2,
                },
                "& .MuiInputBase-input": {
                    textAlign: "left",
                },
                ...sx,
            }}
        />
    );
};

export default SearchField;