import { Box, styled, type SxProps, type Theme } from "@mui/material";
import type { ReactNode } from "react";

const StyledBox = styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    height: "100%",
    gap: theme.spacing(1),
}));

interface Props {
    children: ReactNode;
    sx?: SxProps<Theme>;
}

const TableStyledBox = ({ children, ...props }: Props) => {
    return <StyledBox {...props}>{children}</StyledBox>;
};

export default TableStyledBox;
