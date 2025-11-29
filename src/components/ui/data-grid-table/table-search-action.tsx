import {type BaseSyntheticEvent} from "react";
import {Box, Grid, MenuItem, type SxProps, type Theme} from "@mui/material";
import SearchField from "@/components/ui/search-field.tsx";
import type {Control} from "react-hook-form";
import CustomCard from "@/components/customs/custom-card.tsx";
import CustomButton from "@/components/ui/button.tsx";
import {FileDownloadOutlined} from "@mui/icons-material";

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
    onExportCsv?: () => void;
    onExportXlsx?: () => void;
    sx?: SxProps<Theme>;
}

const TableSearchActions = ({
                                searchSubmit,
                                handleSearch,
                                searchControl,
                                onExportCsv,
                                onExportXlsx,
                                sx,
                            }: Props) => {

    const handleCsvClick = () => {
        onExportCsv();
    };

    const handleXlsxClick = () => {
        onExportXlsx();
    };

    return (
        <CustomCard
            sx={{
                borderRadius: 2,
                mb: 2,
                width: "100%",
                "& .capitalize-cell": {
                    textTransform: "capitalize",
                },
                ...sx,
            }}
        >
            <Grid container spacing={2} alignItems={"center"}>
                <Grid size={{xs: 12, md: 9}}>
                    <Box sx={{display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap"}}>
                        <Box
                            component="form"
                            autoComplete="on"
                            onSubmit={searchSubmit(handleSearch)}
                            sx={{maxWidth: "100%", flexGrow: 1}}
                        >
                            <SearchField
                                name={"search"}
                                placeholder={"Search..."}
                                control={searchControl}
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        height: 40,
                                    },
                                    width: "100%",
                                }}
                            />
                        </Box>
                    </Box>
                </Grid>
                {onExportCsv && onExportXlsx && (
                    <Grid size={{xs: 12, md: 3}}>
                        <Box sx={{display: "flex", justifyContent: "flex-end", alignItems: "center"}}>
                            <CustomButton
                                title={"Export"}
                                startIcon={<FileDownloadOutlined/>}
                                sx={{height: 40, width: 100}}
                                variant={"contained"}
                            >
                                <MenuItem onClick={handleCsvClick}>Export as CSV</MenuItem>
                                <MenuItem onClick={handleXlsxClick}>Export as XLSX</MenuItem>
                            </CustomButton>
                        </Box>
                    </Grid>
                )}
            </Grid>
        </CustomCard>
    );
};

export default TableSearchActions;