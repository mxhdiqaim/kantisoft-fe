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
} from "@mui/material";
import { useEffect, useState, type FC, type MouseEvent } from "react";

import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import FullscreenOutlinedIcon from "@mui/icons-material/FullscreenOutlined";
import FullscreenExitOutlinedIcon from "@mui/icons-material/FullscreenExitOutlined";
import { useDispatch, useSelector } from "react-redux";
import { useGetAllStoresQuery } from "@/store/slice";
import { selectActiveStore, setActiveStore } from "@/store/slice/store-slice";
import { ExpandMoreOutlined, StorefrontOutlined } from "@mui/icons-material";
import type { StoreType } from "@/types/store-types";

export interface Props {
    toggleDrawer?: (open: boolean) => void;
    drawerState?: boolean;
}

const AppbarComponent: FC<Props> = ({ toggleDrawer, drawerState }) => {
    const theme = useTheme();
    const { isFullscreen, toggleFullscreen } = useFullscreen();

    const dispatch = useDispatch();

    // Fetch all available stores from the API
    const { data: stores, isLoading: isLoadingStores } = useGetAllStoresQuery();

    const activeStore = useSelector(selectActiveStore);

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    // Effect to automatically set the first store as active if none is selected
    useEffect(() => {
        if (!activeStore && stores && stores.length > 0) {
            dispatch(setActiveStore(stores[0]));
        }
    }, [activeStore, stores, dispatch]);

    const handleMenuClick = (event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleStoreSelect = (store: StoreType) => {
        // Dispatch the action to update the active store
        dispatch(setActiveStore(store));
        handleMenuClose();
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
                                onClick={handleMenuClick}
                                startIcon={<StorefrontOutlined />}
                                endIcon={<ExpandMoreOutlined />}
                                sx={{ color: "text.primary", textTransform: "none" }}
                            >
                                <Typography variant="subtitle2" fontWeight="bold">
                                    {activeStore ? activeStore.name : "Select Store"}
                                </Typography>
                            </Button>
                        )}
                        <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
                            {stores?.map((store) => (
                                <MenuItem
                                    key={store.id}
                                    onClick={() => handleStoreSelect(store)}
                                    selected={store.id === activeStore?.id}
                                >
                                    {store.name}
                                </MenuItem>
                            ))}
                        </Menu>
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
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default AppbarComponent;
