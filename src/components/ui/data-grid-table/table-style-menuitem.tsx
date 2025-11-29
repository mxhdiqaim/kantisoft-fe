import type {ReactNode} from "react";
import {MenuItem, type MenuItemProps, styled, type SxProps, type Theme} from "@mui/material";

const StyledMenuItem = styled(MenuItem)(({theme}) => ({
    mx: 1,
    borderRadius: theme.borderRadius.small
}));

interface Props extends MenuItemProps {
    children: ReactNode;
    sx?: SxProps<Theme>;
}

const TableStyledMenuItem = ({children, ...props}: Props) => {
    return <StyledMenuItem {...props}>{children}</StyledMenuItem>;
};

export default TableStyledMenuItem;
