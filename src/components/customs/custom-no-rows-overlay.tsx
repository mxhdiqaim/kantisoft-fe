import type { HTMLAttributes } from "react";
import { Box, Typography, type SxProps, type Theme } from "@mui/material";

type CustomNoRowsOverlayProps = HTMLAttributes<HTMLDivElement> & {
    sx?: SxProps<Theme>;
    period?: string;
};

const CustomNoRowsOverlay = (props: CustomNoRowsOverlayProps) => {
    const { period = "No data to display.", ...rest } = props;

    return (
        <Box
            {...rest}
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                flexDirection: "column",
            }}
        >
            <Typography
                variant="h6"
                color="text.secondary"
                sx={{ fontWeight: 500 }}
            >
                {period}
            </Typography>
        </Box>
    );
};

export default CustomNoRowsOverlay;
