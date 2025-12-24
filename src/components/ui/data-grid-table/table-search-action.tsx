import {type BaseSyntheticEvent} from "react";
import {Box, Grid, type SxProps, type Theme} from "@mui/material";
import SearchField from "@/components/ui/search-field.tsx";
import type {Control} from "react-hook-form";
import CustomCard from "@/components/customs/custom-card.tsx";
import CustomButton from "@/components/ui/button.tsx";
import {FileDownloadOutlined} from "@mui/icons-material";
import {UserRoleEnum} from "@/types/user-types.ts";
import {useAppSelector} from "@/store";
import {selectCurrentUser} from "@/store/slice/auth-slice.ts";
import TableStyledMenuItem from "@/components/ui/data-grid-table/table-style-menuitem.tsx";

interface Props {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    searchSubmit: (data: any) => (e?: BaseSyntheticEvent) => Promise<void>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handleSearch: (data: any) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    searchControl: Control<any>;
    onExportCsv?: () => void;
    onExportXlsx?: () => void;
    sx?: SxProps<Theme>;
    placeholder?: string;
}

const TableSearchActions = ({
                                searchSubmit,
                                handleSearch,
                                searchControl,
                                onExportCsv,
                                onExportXlsx,
                                sx,
                                placeholder = "Search...",
                            }: Props) => {

    const currentUser = useAppSelector(selectCurrentUser);

    const handleCsvClick = () => {
        onExportCsv();
    };

    const handleXlsxClick = () => {
        onExportXlsx();
    };

    const showExport = onExportCsv && onExportXlsx;
    const canExport = [UserRoleEnum.MANAGER, UserRoleEnum.ADMIN].includes(currentUser.role);

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
                <Grid size={{xs: 12, md: canExport ? 9 : 12}}>
                    <Box sx={{display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap"}}>
                        <Box
                            component="form"
                            autoComplete="on"
                            onSubmit={searchSubmit(handleSearch)}
                            sx={{maxWidth: "100%", flexGrow: 1}}
                        >
                            <SearchField
                                name={"search"}
                                placeholder={placeholder}
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
                {(showExport && canExport) && (
                    <Grid size={{xs: 12, md: 3}}>
                        <Box sx={{display: "flex", justifyContent: "flex-end", alignItems: "center"}}>
                            <CustomButton
                                title={"Export"}
                                startIcon={<FileDownloadOutlined/>}
                                sx={{height: 40, width: 100}}
                                variant={"contained"}
                            >
                                <TableStyledMenuItem onClick={handleCsvClick}>Export as CSV</TableStyledMenuItem>
                                <TableStyledMenuItem onClick={handleXlsxClick}>Export as XLSX</TableStyledMenuItem>
                            </CustomButton>
                        </Box>
                    </Grid>
                )}
            </Grid>
        </CustomCard>
    );
};

export default TableSearchActions;