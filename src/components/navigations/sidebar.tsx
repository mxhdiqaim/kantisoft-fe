import { useState, Fragment, type FC } from "react";
import {
    Box,
    Button,
    Collapse,
    Divider,
    Drawer,
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
import { appRoutes, type AppRouteType } from "@/routes";
import type { Props as AppBarProps } from "./appbar";

import ExpandLessOutlinedIcon from "@mui/icons-material/ExpandLessOutlined";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import { LogoutOutlined } from "@mui/icons-material";

import CancelIcon from "@mui/icons-material/Cancel";
import { useLogoutMutation } from "@/store/slice";
import { useTranslation } from "react-i18next";

interface Props extends AppBarProps {
    sx?: SxProps<Theme>;
    showDrawer?: boolean;
}

const SideBar: FC<Props> = ({ sx, drawerState, toggleDrawer, showDrawer }) => {
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
    const handleItemClick = (route: AppRouteType) => {
        if (showDrawer) return;

        if (toggleDrawer) {
            toggleDrawer(!drawerState);
        }

        // Toggle expanded state for items with children
        if (route.children) {
            setExpandedItems((prev) =>
                prev.includes(route.to) ? prev.filter((item) => item !== route.to) : [...prev, route.to],
            );
        }
    };

    const renderMenuItem = (route: AppRouteType, index: number, level: number = 0, parentPath: string = "") => {
        // Calculate the full path for this route
        const fullPath = parentPath + route.to;

        const isActive = location.pathname.startsWith(fullPath);
        const isSelected = location.pathname === fullPath;
        const isExpanded = expandedItems.includes(route.to);
        const hasChildren = route.children && route.children;

        return (
            <Fragment key={index}>
                <ListItem disablePadding sx={{ px: 2, py: 0.5 }}>
                    <ListItemButton
                        component={Link}
                        to={fullPath}
                        selected={isSelected}
                        onClick={() => handleItemClick(route)}
                        sx={{
                            borderRadius: theme.shape.borderRadius,
                            py: 1,
                            px: 2,
                            color: theme.palette.text.secondary,
                            transition: theme.transitions.create(["background-color", "color"], {
                                duration: theme.transitions.duration.short,
                            }),

                            "&.Mui-selected": {
                                color: theme.palette.primary.main,
                                backgroundColor: theme.palette.action.selected,
                                fontWeight: "fontWeightBold",
                                "&:hover": {
                                    backgroundColor: theme.palette.action.hover,
                                },
                            },

                            // Hover styles for non-selected items
                            "&:hover": {
                                backgroundColor: theme.palette.action.hover,
                                color: isActive ? theme.palette.primary.main : theme.palette.text.primary,
                            },
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: 40, color: "inherit" }}>{route.icon?.default}</ListItemIcon>
                        <ListItemText
                            primary={t(route.title as string)}
                            primaryTypographyProps={{
                                fontWeight: isSelected ? "bold" : "regular",
                                variant: "body2",
                            }}
                        />
                        {hasChildren && (
                            <Box
                                component={isExpanded ? ExpandLessOutlinedIcon : ExpandMoreOutlinedIcon}
                                sx={{
                                    fontSize: 20,
                                    color: theme.palette.text.secondary,
                                }}
                            />
                        )}
                    </ListItemButton>
                </ListItem>

                {/* Render children if expanded */}
                {hasChildren && (
                    <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding sx={{ pl: 2 }}>
                            {route.children?.map((childRoute, childIndex) =>
                                renderMenuItem(childRoute, childIndex, level + 1, fullPath + "/"),
                            )}
                        </List>
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
            <List sx={{ height: "100%", display: "flex", flexDirection: "column", p: 1 }}>
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

                {/* Routes rendering */}
                <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
                    {appRoutes.map((route, index) => {
                        const authGuard = route.authGuard ?? true;
                        const withLayout = route.useLayout ?? true;

                        if (route.hidden || !authGuard || !withLayout) return;

                        return renderMenuItem(route, index);
                    })}
                </Box>

                <Box position={"absolute"} bottom={0} width={"100%"} p={2}>
                    <Button
                        fullWidth
                        onClick={handleLogout}
                        disabled={isLoading}
                        variant="contained"
                        startIcon={<LogoutOutlined />}
                        sx={{
                            backgroundColor: theme.palette.error.main,
                            color: theme.palette.error.contrastText,
                            justifyContent: "flex-start",
                            py: 1.5,
                            px: 2,
                            boxShadow: theme.customShadows.button,
                            transition: theme.transitions.create(["background-color", "transform"], {
                                duration: theme.transitions.duration.short,
                            }),
                            "&:hover": {
                                // Darken the button on hover for clear visual feedback
                                backgroundColor: theme.palette.error.dark,
                                // Add a subtle scale effect for a modern feel
                                transform: "scale(1.02)",
                            },
                        }}
                    >
                        {isLoading ? "Logging out..." : t("Logout")}
                    </Button>
                </Box>
            </List>
        </Drawer>
    );
};

export default SideBar;
