import {type Control, Controller} from "react-hook-form";
import {Box, FormControl, InputLabel, MenuItem, Select, Typography} from "@mui/material";
import type {Period as TimePeriod} from "@/types/order-types.ts";

type Props = {
    title: string;
    timePeriod: TimePeriod;
    getTimeTitle: (timePeriod: TimePeriod) => string;
    control: Control<any>;
};

const OverviewHeader = ({title, timePeriod, getTimeTitle, control}: Props) => (
    <Box
        sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
        }}
    >
        <Typography variant="h4">{`${title} Overview`}</Typography>
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "right",
            }}
        >
            <Box sx={{display: "flex", alignItems: "center", gap: 2}}>
                <Typography variant="h4" component="h1">
                    {getTimeTitle(timePeriod)}&apos;s {title}
                </Typography>
                <Controller
                    name="period"
                    control={control}
                    render={({field}) => (
                        <FormControl sx={{minWidth: 120}} size="small">
                            <InputLabel id="period-select-label">Period</InputLabel>
                            <Select {...field} labelId="period-select-label" label="Period">
                                <MenuItem value={"today"}>Today</MenuItem>
                                <MenuItem value={"week"}>This Week</MenuItem>
                                <MenuItem value={"month"}>This Month</MenuItem>
                                <MenuItem value={"all-time"}>All Time</MenuItem>
                            </Select>
                        </FormControl>
                    )}
                />
            </Box>
        </Box>
    </Box>
);

export default OverviewHeader;
