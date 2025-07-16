import type { HTMLAttributes } from "react";
import { Box, Typography, type SxProps, type Theme } from "@mui/material";

type CustomNoRowsOverlayProps = HTMLAttributes<HTMLDivElement> & {
    sx?: SxProps<Theme>;
    period?: string;
};

const CustomNoRowsOverlay = (props: CustomNoRowsOverlayProps) => {
    const { period, ...rest } = props;

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
                No sales yet {period ? `for this ${period}.` : "."}
            </Typography>
        </Box>
    );
};

export default CustomNoRowsOverlay;
