import type { ReactNode, FC } from "react";
import {
  Box,
  Button,
  SwipeableDrawer,
  type SxProps,
  type Theme,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";

interface CustomDrawerProps {
  anchor?: "left" | "bottom";
  children: ReactNode;
  key?: number;
  onClose: (event: unknown) => void;
  onOpen: (event: unknown) => void;
  open: boolean;
  sx?: SxProps<Theme>;
}

const CustomDrawer: FC<CustomDrawerProps> = ({
  anchor = "bottom",
  open,
  onClose,
  onOpen,
  children,
  sx,
  key,
}) => {
  return (
    <SwipeableDrawer
      anchor={anchor}
      open={open}
      onClose={onClose}
      onOpen={onOpen}
      sx={{ ...sx }}
      key={key}
    >
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button onClick={onClose} sx={{ width: "fit-content", mt: 2, mr: 0.5 }}>
          <CancelIcon sx={{ color: "#686868" }} />
        </Button>
      </Box>
      <Box p={2}>{children}</Box>
    </SwipeableDrawer>
  );
};

export default CustomDrawer;
