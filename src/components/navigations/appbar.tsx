import { useFullscreen } from "@/hooks/use-fullscreen";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import {
    AppBar,
    Box,
    IconButton,
    Toolbar,
    useTheme,
    alpha,
    Button,
    CircularProgress,
    Typography,
    Menu,
    MenuItem,
    Tooltip,
    Avatar,
    Divider,
} from "@mui/material";
import { useEffect, useState, type FC, type MouseEvent } from "react";

import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import FullscreenOutlinedIcon from "@mui/icons-material/FullscreenOutlined";
import FullscreenExitOutlinedIcon from "@mui/icons-material/FullscreenExitOutlined";
import { useDispatch, useSelector } from "react-redux";
import { useGetAllStoresQuery, useLogoutMutation } from "@/store/slice";
import { selectActiveStore, setActiveStore } from "@/store/slice/store-slice";
import { LogoutOutlined, PersonOutline, StorefrontOutlined } from "@mui/icons-material";
import { selectCurrentUser } from "@/store/slice/auth-slice";
import { useNavigate } from "react-router-dom";
import useNotifier from "@/hooks/useNotifier";

export interface Props {
    toggleDrawer?: (open: boolean) => void;
    drawerState?: boolean;
}

const AppbarComponent: FC<Props> = ({ toggleDrawer, drawerState }) => {
    const theme = useTheme();
    const { isFullscreen, toggleFullscreen } = useFullscreen();
    const navigate = useNavigate();
    const notify = useNotifier();
    const dispatch = useDispatch();

    // Fetch all available stores from the API
    const { data: stores, isLoading: isLoadingStores } = useGetAllStoresQuery();
    const activeStore = useSelector(selectActiveStore);

    const currentUser = useSelector(selectCurrentUser);
    const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

    // const [storeMenuAnchorEl, setStoreMenuAnchorEl] = useState<null | HTMLElement>(null);
    // const isStoreMenuOpen = Boolean(storeMenuAnchorEl);

    const [profileMenuAnchorEl, setProfileMenuAnchorEl] = useState<null | HTMLElement>(null);
    const isProfileMenuOpen = Boolean(profileMenuAnchorEl);

    // const handleStoreMenuClick = (event: MouseEvent<HTMLElement>) => {
    //     setStoreMenuAnchorEl(event.currentTarget);
    // };

    // const handleStoreMenuClose = () => {
    //     setStoreMenuAnchorEl(null);
    // };

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

    // const handleStoreSelect = (store: StoreType) => {
    //     // Dispatch the action to update the active store
    //     dispatch(setActiveStore(store));
    //     // handleMenuClose();
    //     handleStoreMenuClose();
    // };

    // Effect to automatically set the first store as active if none is selected
    useEffect(() => {
        if (!activeStore && stores && stores.length > 0) {
            dispatch(setActiveStore(stores[0]));
        }
    }, [activeStore, stores, dispatch]);

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
                        display: { xs: "block", md: "none" },
                    }}
                >
                    <MenuOutlinedIcon />
                </IconButton>

                <Box sx={{ flexGrow: 1 }} />

                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box>
                        {isLoadingStores ? (
                            <CircularProgress size={24} />
                        ) : (
                            <Button
                                id="store-selector-button"
                                // onClick={handleStoreMenuClick}
                                startIcon={<StorefrontOutlined />}
                                sx={{ color: "text.primary", textTransform: "none" }}
                            >
                                <Typography variant="subtitle2" fontWeight="bold">
                                    {activeStore && activeStore.name}
                                </Typography>
                            </Button>
                        )}
                    </Box>
                    <IconButton
                        aria-label="toggle fullscreen"
                        onClick={toggleFullscreen} // Use the function from context
                        sx={{
                            background: theme.palette.background.default,
                        }}
                    >
                        {isFullscreen ? <FullscreenExitOutlinedIcon /> : <FullscreenOutlinedIcon />}
                    </IconButton>

                    <IconButton
                        aria-label="notifications"
                        sx={{
                            background: theme.palette.background.default,
                        }}
                    >
                        <NotificationsNoneOutlinedIcon />
                    </IconButton>
                    <Tooltip title="Account settings">
                        <IconButton onClick={handleProfileMenuClick} size="small">
                            <Avatar sx={{ width: 36, height: 36, bgcolor: "primary.main" }}>
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
                        transformOrigin={{ horizontal: "right", vertical: "top" }}
                        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                    >
                        <MenuItem onClick={() => navigate("/profile")}>
                            <PersonOutline sx={{ mr: 1 }} /> Profile
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={handleLogout} sx={{ color: "error.main" }} disabled={isLoggingOut}>
                            {isLoggingOut ? (
                                <CircularProgress size={20} sx={{ mr: 1 }} color="inherit" />
                            ) : (
                                <LogoutOutlined sx={{ mr: 1 }} />
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
