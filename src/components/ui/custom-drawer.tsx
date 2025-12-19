import type {FC, ReactNode} from "react";
import {Box, type PaperProps, SwipeableDrawer, type SxProps, type Theme} from "@mui/material";
import type {DrawerAnchor} from "@/types";

interface Props {
    anchor?: DrawerAnchor;
    children: ReactNode;
    key?: number;
    onClose: (event: unknown) => void;
    onOpen: (event: unknown) => void;
    open: boolean;
    sx?: SxProps<Theme>;
    PaperProps?: Partial<PaperProps>;
}

const CustomDrawer: FC<Props> = ({anchor, open, onClose, onOpen, children, PaperProps, sx, key}) => {
    return (
        <SwipeableDrawer
            key={key}
            anchor={anchor}
            open={open}
            onClose={onClose}
            onOpen={onOpen}
            sx={sx}
            PaperProps={PaperProps}
        >
            <Box p={2}>{children}</Box>
        </SwipeableDrawer>
    );
};

export default CustomDrawer;
