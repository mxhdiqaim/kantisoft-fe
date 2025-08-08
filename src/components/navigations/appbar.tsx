import {useFullscreen} from "@/hooks/use-fullscreen";
import useNotifier from "@/hooks/useNotifier";
import {useLogoutMutation} from "@/store/slice";
import {selectCurrentUser} from "@/store/slice/auth-slice";
import {LogoutOutlined, PersonOutline} from "@mui/icons-material";
import FullscreenExitOutlinedIcon from "@mui/icons-material/FullscreenExitOutlined";
import FullscreenOutlinedIcon from "@mui/icons-material/FullscreenOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";

import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import {
    alpha,
    AppBar,
    Avatar,
    Box,
    CircularProgress,
    Divider,
    IconButton,
    Menu,
    MenuItem,
    Toolbar,
    Tooltip,
    useTheme,
} from "@mui/material";
import {type FC, type MouseEvent, useState} from "react";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";

export interface Props {
    toggleDrawer?: (open: boolean) => void;
    drawerState?: boolean;
}

const AppbarComponent: FC<Props> = ({toggleDrawer, drawerState}) => {
    const theme = useTheme();
    const {isFullscreen, toggleFullscreen} = useFullscreen();
    const navigate = useNavigate();
    const notify = useNotifier();

    const currentUser = useSelector(selectCurrentUser);
    const [logout, {isLoading: isLoggingOut}] = useLogoutMutation();

    const [profileMenuAnchorEl, setProfileMenuAnchorEl] = useState<null | HTMLElement>(null);
    const isProfileMenuOpen = Boolean(profileMenuAnchorEl);

    // 4. Handlers for the profile menu
    const handleProfileMenuClick = (event: MouseEvent<HTMLElement>) => {
        setProfileMenuAnchorEl(event.currentTarget);
    };

    const handleProfileMenuClose = () => {
        setProfileMenuAnchorEl(null);
    };

    const handleLogout = async () => {
        try {
            await logout({}).unwrap();
        } catch (error) {
            console.error("Server logout failed, proceeding with client-side logout:", error);
        } finally {
            navigate("/login");
            notify("You have been logged out successfully.", "success");
        }
    };

    return (
        <AppBar
            position="sticky"
            sx={{
                background: alpha(theme.palette.background.paper, 0.6),
                height: theme.layout.appBarHeight,
                boxShadow: "none",
                backdropFilter: "blur(8px)",
                borderBottom: `1px solid ${theme.palette.divider}`,
                width: {md: `calc(100% - ${theme.layout.sidebarWidth})`},
            }}
        >
            <Toolbar sx={{display: "flex", justifyContent: "space-between"}}>
                <Box component={"span"}/>
                <IconButton
                    onClick={() => toggleDrawer && toggleDrawer(!drawerState)}
                    aria-label="menu"
                    sx={{
                        display: {xs: "block", md: "none"},
                    }}
                >
                    <MenuOutlinedIcon/>
                </IconButton>

                <Box sx={{flexGrow: 1}}/>

                <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
                    <IconButton
                        aria-label="toggle fullscreen"
                        onClick={toggleFullscreen}
                        sx={{
                            background: theme.palette.background.default,
                        }}
                    >
                        {isFullscreen ? <FullscreenExitOutlinedIcon/> : <FullscreenOutlinedIcon/>}
                    </IconButton>

                    <IconButton
                        aria-label="notifications"
                        sx={{
                            background: theme.palette.background.default,
                        }}
                    >
                        <NotificationsNoneOutlinedIcon/>
                    </IconButton>
                    <Tooltip title="Account settings">
                        <IconButton onClick={handleProfileMenuClick} size="small">
                            <Avatar sx={{width: 36, height: 36, bgcolor: "primary.main"}}>
                                {currentUser?.firstName?.charAt(0).toUpperCase()}
                            </Avatar>
                        </IconButton>
                    </Tooltip>
                    <Menu
                        anchorEl={profileMenuAnchorEl}
                        open={isProfileMenuOpen}
                        onClose={handleProfileMenuClose}
                        PaperProps={{
                            elevation: 0,
                            sx: {
                                overflow: "visible",
                                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.15))",
                                mt: 1.5,
                                "& .MuiAvatar-root": {
                                    width: 32,
                                    height: 32,
                                    ml: -0.5,
                                    mr: 1,
                                },
                            },
                        }}
                        transformOrigin={{horizontal: "right", vertical: "top"}}
                        anchorOrigin={{horizontal: "right", vertical: "bottom"}}
                    >
                        <MenuItem onClick={() => navigate("/user/profile")}>
                            <PersonOutline sx={{mr: 1}}/> Profile
                        </MenuItem>
                        <Divider/>
                        <MenuItem onClick={handleLogout} sx={{color: "error.main"}} disabled={isLoggingOut}>
                            {isLoggingOut ? (
                                <CircularProgress size={20} sx={{mr: 1}} color="inherit"/>
                            ) : (
                                <LogoutOutlined sx={{mr: 1}}/>
                            )}
                            {isLoggingOut ? "Logging out..." : "Logout"}
                        </MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default AppbarComponent;
