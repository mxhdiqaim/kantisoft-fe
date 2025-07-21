import { useFullscreen } from "@/hooks/use-fullscreen";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import { AppBar, Box, IconButton, Toolbar, useTheme, alpha } from "@mui/material";
import { type FC } from "react";

import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import FullscreenOutlinedIcon from "@mui/icons-material/FullscreenOutlined";
import FullscreenExitOutlinedIcon from "@mui/icons-material/FullscreenExitOutlined";

export interface Props {
    toggleDrawer?: (open: boolean) => void;
    drawerState?: boolean;
}

const AppbarComponent: FC<Props> = ({ toggleDrawer, drawerState }) => {
    const theme = useTheme();
    const { isFullscreen, toggleFullscreen } = useFullscreen();
    return (
        <AppBar
            position="sticky"
            sx={{
                background: alpha(theme.palette.background.paper, 0.6),
                height: theme.layout.appBarHeight,
                boxShadow: "none",
                backdropFilter: "blur(8px)",
                borderBottom: `1px solid ${theme.palette.divider}`,
                width: { md: `calc(100% - ${theme.layout.sidebarWidth})` },
            }}
        >
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box component={"span"} />
                <IconButton
                    onClick={() => toggleDrawer && toggleDrawer(!drawerState)}
                    aria-label="menu"
                    sx={{
                        width: "50px",
                        height: "50px",
                        display: { xs: "block", md: "none" },
                    }}
                >
                    <MenuOutlinedIcon />
                </IconButton>

                <Box sx={{ flexGrow: 1 }} />

                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <IconButton
                        aria-label="toggle fullscreen"
                        onClick={toggleFullscreen} // Use the function from context
                        sx={{
                            background: theme.palette.background.default,
                            width: "40px",
                            height: "40px",
                        }}
                    >
                        {isFullscreen ? <FullscreenExitOutlinedIcon /> : <FullscreenOutlinedIcon />}
                    </IconButton>

                    <IconButton
                        aria-label="notifications"
                        sx={{
                            background: theme.palette.background.default,
                            width: "40px",
                            height: "40px",
                        }}
                    >
                        <NotificationsNoneOutlinedIcon />
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default AppbarComponent;
