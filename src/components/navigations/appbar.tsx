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
    MenuItem,
    Toolbar,
    Tooltip,
    useTheme,
} from "@mui/material";
import {type FC} from "react";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import CustomButton from "@/components/ui/button.tsx";

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
            <Toolbar sx={{display: "flex", justifyContent: "space-between", alignItems: "center", height: "100%"}}>
                <Box component={"span"}
                     sx={{display: {xs: "flex", md: "none"}, alignItems: "center", justifyContent: "center"}}>
                    <IconButton
                        onClick={() => toggleDrawer && toggleDrawer(!drawerState)}
                        aria-label="menu"
                        sx={{
                            display: {xs: "block", md: "none"},
                        }}
                    >
                        <MenuOutlinedIcon/>
                    </IconButton>
                </Box>

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
                        disabled={true}
                    >
                        <NotificationsNoneOutlinedIcon/>
                    </IconButton>
                    <CustomButton
                        variant={"text"}
                        sx={{
                            color: theme.palette.text.primary,
                        }}
                        startIcon={
                            <Tooltip title="Account settings" placement={"top"}>
                                <Avatar
                                    sx={{width: 36, height: 36, backgroundColor: "primary.main"}}>
                                    {currentUser?.firstName?.charAt(0).toUpperCase()}
                                </Avatar>
                            </Tooltip>
                        }
                    >
                        <MenuItem onClick={() => navigate("/users/profile")} sx={{mx: 1, borderRadius: 3}}>
                            <PersonOutline sx={{mr: 1}}/> Profile
                        </MenuItem>
                        <Divider/>
                        <MenuItem onClick={handleLogout} sx={{color: "error.main", mx: 1, borderRadius: 3}}
                                  disabled={isLoggingOut}>
                            {isLoggingOut ? (
                                <CircularProgress size={20} sx={{mr: 1}} color="inherit"/>
                            ) : (
                                <LogoutOutlined sx={{mr: 1}}/>
                            )}
                            {isLoggingOut ? "Logging out..." : "Logout"}
                        </MenuItem>
                    </CustomButton>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default AppbarComponent;
