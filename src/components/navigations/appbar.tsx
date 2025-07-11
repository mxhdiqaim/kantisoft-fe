import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";

import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import { AppBar, Box, IconButton, Toolbar, useTheme } from "@mui/material";
import { type FC } from "react";

export interface Props {
    toggleDrawer?: (open: boolean) => void;
    drawerState?: boolean;
}

const AppbarComponent: FC<Props> = ({ toggleDrawer, drawerState }) => {
    const theme = useTheme();
    return (
        <AppBar
            position="sticky"
            sx={{
                background: theme.palette.background.paper,
                height: theme.layout.appBarHeight,
                boxShadow: "none",
                backdropFilter: "blur(15px)",
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
            </Toolbar>
        </AppBar>
    );
};

export default AppbarComponent;
