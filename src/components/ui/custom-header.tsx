import {type Control, Controller, type FieldValues, type Path} from "react-hook-form";
import {Box, FormControl, InputAdornment, MenuItem, Typography} from "@mui/material";
import type {TimePeriod} from "@/types";
import Icon from "@/components/ui/icon.tsx";
import ArrowDownIconSvg from "@/assets/icons/arrow-down.svg";
import {StyledTextField} from "@/components/ui/index.tsx";

type Props<T extends FieldValues> = {
    title: string;
    timePeriod: TimePeriod;
    getTimeTitle: (timePeriod: TimePeriod) => string;
    control: Control<T>;
    name: Path<T>;
    timeTitle?: string;
};

const OverviewHeader = <T extends FieldValues>({
                                                   title,
                                                   timePeriod,
                                                   getTimeTitle,
                                                   control,
                                                   name,
                                                   timeTitle
                                               }: Props<T>) => (
    <Box
        sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
        }}
    >
        <Typography variant="h4">{title}</Typography>
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "right",
            }}
        >
            <Box sx={{display: "flex", alignItems: "center", gap: 2}}>
                <Typography variant="h4" component="h1">
                    {getTimeTitle(timePeriod)}&apos;s {timeTitle}
                </Typography>
                <Controller
                    name={name}
                    control={control}
                    render={({field}) => (
                        <FormControl>
                            <StyledTextField
                                {...field}
                                select
                                label="Period"
                                placeholder="Select Period"
                                SelectProps={{
                                    IconComponent: () => null,
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <Icon
                                                src={ArrowDownIconSvg}
                                                alt={"Dropdown Arrow"}
                                                sx={{width: 15, height: 15}}
                                            />
                                        </InputAdornment>
                                    ),
                                }}
                            >
                                <MenuItem value={""} disabled>
                                    Select Period
                                </MenuItem>
                                <MenuItem value={"today"}>Today</MenuItem>
                                <MenuItem value={"week"}>This Week</MenuItem>
                                <MenuItem value={"month"}>This Month</MenuItem>
                                <MenuItem value={"all-time"}>All Time</MenuItem>
                            </StyledTextField>
                        </FormControl>
                    )}
                />
            </Box>
        </Box>
    </Box>
);

export default OverviewHeader;
