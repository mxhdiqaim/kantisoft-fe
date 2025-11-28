import type {BaseSyntheticEvent} from "react";
import {Box, Grid, type SxProps, type Theme, useTheme} from "@mui/material";
import CustomButton from "@/components/ui/button.tsx";
import SearchField from "@/components/ui/search-field.tsx";
import type {Control} from "react-hook-form";

interface Props {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    searchSubmit: (data: any) => (e?: BaseSyntheticEvent) => Promise<void>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handleSearch: (data: any) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    searchControl: Control<any>;
    statusFilterOptions?: string[];
    selectedStatus?: string;
    onStatusChange?: (newStatus: string) => void;
    showFilterButton?: boolean;
    showColumnsButton?: boolean;
}

const TableSearchActions = ({
                                searchSubmit,
                                handleSearch,
                                searchControl,
                                statusFilterOptions,
                                selectedStatus,
                                onStatusChange,
                            }: Props) => {
    const theme = useTheme();

    const filterButtonStyle: SxProps<Theme> = {
        fontWeight: 400,
        height: 30,
        borderRadius: theme.borderRadius.medium,
        fontSize: "1rem",
        width: {xs: "100%", md: "auto"},
    };

    return (
        <Grid container spacing={2} alignItems={"center"} sx={{my: 2}}>
            <Grid size={{xs: 12, md: 9}}>
                <Box sx={{display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap"}}>
                    <Box
                        component="form"
                        autoComplete="on"
                        onSubmit={searchSubmit(handleSearch)}
                        sx={{maxWidth: {xs: "100%", md: 400}, flexGrow: 1}}
                    >
                        <SearchField
                            name={"search"}
                            placeholder={"Search..."}
                            control={searchControl}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    height: 35,
                                    borderRadius: theme.borderRadius.small,
                                },
                                width: "100%",
                            }}
                        />
                    </Box>
                    {statusFilterOptions && onStatusChange && (
                        <Box
                            sx={{
                                display: "flex",
                                gap: 0.5,
                                border: `1px solid ${theme.palette.divider}`,
                                borderRadius: "20px",
                                p: 0.5,
                                width: {xs: "100%", md: "auto"},
                            }}
                        >
                            {statusFilterOptions.map((status) => (
                                <CustomButton
                                    key={status}
                                    title={status}
                                    onClick={() => onStatusChange(status)}
                                    variant={selectedStatus === status ? "contained" : "text"}
                                    sx={{
                                        // borderRadius: "20px",
                                        textTransform: "capitalize",
                                        boxShadow: selectedStatus === status ? "inherit" : "none",
                                        background: selectedStatus === status ? "#EEE5FF" : "inherit",
                                        color: selectedStatus === status ? "#6834D1" : "inherit",
                                        "&:hover": {
                                            boxShadow: "none",
                                        },

                                        ...filterButtonStyle,
                                    }}
                                />
                            ))}
                        </Box>
                    )}
                </Box>
            </Grid>
        </Grid>
    );
};

export default TableSearchActions;