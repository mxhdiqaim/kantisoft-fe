/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, Fragment, type FC } from "react";
import {
    Box,
    Button,
    Collapse,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    type SxProps,
    type Theme,
    useTheme,
} from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import type { Props as AppBarProps } from "./appbar";

import ExpandLessOutlinedIcon from "@mui/icons-material/ExpandLessOutlined";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import { LogoutOutlined } from "@mui/icons-material";

import CancelIcon from "@mui/icons-material/Cancel";
import { useLogoutMutation } from "@/store/slice";
import { useTranslation } from "react-i18next";
import { type AppRouteType, type BaseAppRouteType } from "@/routes"; // Import the correct dynamic route type

interface Props extends AppBarProps {
    sx?: SxProps<Theme>;
    showDrawer?: boolean;
    appRoutes: AppRouteType[]; // Use the dynamic AppRouteType
}

const SideBar: FC<Props> = ({ sx, drawerState, toggleDrawer, showDrawer, appRoutes }) => {
    const { t } = useTranslation();
    const theme = useTheme();
    const location = useLocation();
    const navigate = useNavigate();
    const [logout, { isLoading }] = useLogoutMutation();

    const handleLogout = async () => {
        try {
            // Call the logout mutation
            await logout({}).unwrap();
        } catch (error) {
            // The console will show if the server call failed, but we proceed.
            console.error("Server logout failed, proceeding with client-side logout:", error);
        } finally {
            // This block runs whether the try succeeded or failed.
            // Since the apiSlice always clears local credentials,
            // we can safely navigate the user away.
            navigate("/login");
        }
    };

    // Add state to track which menu items are expanded
    const [expandedItems, setExpandedItems] = useState<string[]>([]);

    // function to handle both drawer close and menu expand
    const handleItemClick = (route: BaseAppRouteType) => {
        if (showDrawer && toggleDrawer) {
            toggleDrawer(!drawerState);
        }

        if (route.children) {
            setExpandedItems((prev: any[]) =>
                // Use the stable `key` instead of the dynamic `to` path
                prev.includes(route.key) ? prev.filter((item) => item !== route.key) : [...prev, route.key],
            );
        }
    };

    const renderMenuItem = (
        route: AppRouteType, // Update type here
        index: number,
        level: number = 0,
    ) => {
        const isSelected = location.pathname === route.to;
        // Use the stable `key` to check if the item is expanded
        const isExpanded = expandedItems.includes(route.key as any);
        const hasChildren = route.children && route.children.length > 0;

        return (
            <Fragment key={index}>
                <ListItem sx={{ pl: level * 2 }}>
                    <ListItemButton
                        component={Link}
                        to={route.to}
                        selected={isSelected}
                        onClick={() => handleItemClick(route)}
                    >
                        <ListItemIcon>
                            {isSelected && route.icon?.active ? route.icon.active : route.icon?.default}
                        </ListItemIcon>
                        <ListItemText primary={t(route.title as string)} />
                        {hasChildren && (
                            <IconButton size="small">
                                {isExpanded ? <ExpandLessOutlinedIcon /> : <ExpandMoreOutlinedIcon />}
                            </IconButton>
                        )}
                    </ListItemButton>
                </ListItem>

                {hasChildren && (
                    <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                        <Box>
                            {route.children?.map((childRoute, childIndex) =>
                                renderMenuItem(childRoute, childIndex, level + 1),
                            )}
                        </Box>
                    </Collapse>
                )}
            </Fragment>
        );
    };

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: { xs: "100vw", md: theme.layout.sidebarWidth },
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                    width: { xs: "100vw", md: theme.layout.sidebarWidth },
                    boxSizing: "border-box",
                },
                background: theme.palette.background.default,
                position: { xs: "absolute", md: "relative" },
                zIndex: 10,
                ...sx,
            }}
        >
            <List sx={{ height: `${theme.layout.sidebarHeight}vh` }}>
                <Box
                    sx={{
                        display: { xs: "flex", md: "none" },
                        justifyContent: "flex-end",
                    }}
                >
                    <Button
                        onClick={() => toggleDrawer && toggleDrawer(!drawerState)}
                        sx={{ width: "fit-content", mt: 1, mr: 0.5 }}
                    >
                        <CancelIcon sx={{ color: theme.palette.alternate.dark }} />
                    </Button>
                </Box>
                <ListItem sx={{ width: "100%" }}>
                    <ListItemButton
                        component={Link}
                        to={"/"}
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <ListItemIcon>
                            <img src="/images/SmartStock.svg" width={200} alt="Restaurant POS" />
                        </ListItemIcon>
                        <ListItemText />
                    </ListItemButton>
                </ListItem>

                <Divider sx={{ display: { xs: "none", md: "block" } }} />

                {/* Use the dynamic appRoutes prop for rendering */}
                {appRoutes.map((route, index) => {
                    if (route.hidden) return null;
                    return renderMenuItem(route, index);
                })}

                <Box position={"absolute"} bottom={0} width={"100%"}>
                    <ListItemButton
                        component={Button}
                        fullWidth
                        onClick={handleLogout}
                        disabled={isLoading}
                        variant="outlined"
                        startIcon={<LogoutOutlined />}
                        sx={{
                            backgroundColor: "transparent",
                            "&:hover": {
                                backgroundColor: theme.palette.error.light,
                                color: theme.palette.error.contrastText,
                            },
                            py: 2,
                            pl: 2,
                        }}
                    >
                        Logout
                    </ListItemButton>
                </Box>
            </List>
        </Drawer>
    );
};

export default SideBar;
