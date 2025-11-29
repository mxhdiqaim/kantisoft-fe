import {FileDownloadOutlined} from "@mui/icons-material";
import {Box, Button, Menu, MenuItem, type SxProps, type Theme} from "@mui/material";
import {type MouseEvent, useState} from "react";
import CustomCard from "./custom-card";

interface Props {
    onExportCsv: () => void;
    onExportXlsx: () => void;
    sx?: SxProps<Theme>;
}

const ExportCard = ({onExportCsv, onExportXlsx, sx}: Props) => {
    const [exportAnchorEl, setExportAnchorEl] = useState<null | HTMLElement>(null);
    const isExportMenuOpen = Boolean(exportAnchorEl);

    const handleOpen = (event: MouseEvent<HTMLButtonElement>) => {
        setExportAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setExportAnchorEl(null);
    };

    const handleCsvClick = () => {
        onExportCsv();
        handleClose();
    };

    const handleXlsxClick = () => {
        onExportXlsx();
        handleClose();
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
            <Box sx={{display: "flex", justifyContent: "flex-end", alignItems: "center"}}>
                {/* Export Button and Menu */}
                <Button
                    variant="contained"
                    size="small"
                    startIcon={<FileDownloadOutlined/>}
                    sx={{height: 45, minWidth: 200}}
                    onClick={handleOpen}
                >
                    Export
                </Button>
                <Menu
                    anchorEl={exportAnchorEl}
                    open={isExportMenuOpen}
                    onClose={handleClose}
                >
                    <MenuItem onClick={handleCsvClick}>Export as CSV</MenuItem>
                    <MenuItem onClick={handleXlsxClick}>Export as XLSX</MenuItem>
                </Menu>
            </Box>
        </CustomCard>
    );
};

export default ExportCard;