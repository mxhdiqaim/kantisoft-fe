import {appRoutes, type AppRouteType} from "@/routes";
import {useAppSelector} from "@/store";
import {useGetAllStoresQuery, useLogoutMutation} from "@/store/slice";
import {selectCurrentUser} from "@/store/slice/auth-slice";
import {selectActiveStore, setActiveStore} from "@/store/slice/store-slice";
import {LogoutOutlined, StorefrontOutlined} from "@mui/icons-material";

import Icon from "@/components/ui/icon.tsx";
import CancelSvgIcon from "@/assets/icons/cancel.svg";
import CollapseSvgIcon from "@/assets/icons/collapse.svg";
import useScreenSize from "@/hooks/use-screen-size";

import ExpandLessOutlinedIcon from "@mui/icons-material/ExpandLessOutlined";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import {
    Box,
    Button,
    CircularProgress,
    Collapse,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    type SxProps,
    type Theme,
    Typography,
    useTheme,
} from "@mui/material";
import {type FC, Fragment, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {Link, useLocation, useNavigate} from "react-router-dom";
import type {Props as AppBarProps} from "./appbar";

interface Props extends AppBarProps {
    sx?: SxProps<Theme>;
    showDrawer?: boolean;
}

const SideBar: FC<Props> = ({sx, drawerState, toggleDrawer, showDrawer}) => {
    const {t} = useTranslation();
    const theme = useTheme();
    const screenSize = useScreenSize();
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [logout, {isLoading}] = useLogoutMutation();
    const currentUser = useAppSelector(selectCurrentUser);

    const {data: stores, isLoading: isLoadingStores} = useGetAllStoresQuery();
    const activeStore = useSelector(selectActiveStore);

    const handleLogout = async () => {
        try {
            // Call the logout mutation
            await logout({}).unwrap();
        } catch (error) {
            // The console will show if the server call failed, but we proceed.
            console.error("Server logout failed, proceeding with client-side logout:", error);
        } finally {
            // Since the apiSlice always clears local credentials,
            // we can safely navigate the user away.
            navigate("/login");
        }
    };

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

    const filterRoutes = (routes: AppRouteType[]): AppRouteType[] => {
        return routes
            .filter((route) => {
                // Basic filtering for hidden/auth routes
                if (route.hidden || !(route.authGuard ?? true) || !(route.useLayout ?? true)) {
                    return false;
                }
                // Role-based filtering
                if (route.roles && currentUser) {
                    // return route.roles.includes("manager");
                    return route.roles.includes(currentUser.role);
                }
                // If no roles are specified, show to all authenticated users
                return true;
            })
            .map((route) => {
                if (route.children) {
                    return {...route, children: filterRoutes(route.children)};
                }
                return route;
            });
    };

    const renderMenuItem = (route: AppRouteType, index: number, level: number = 0, parentPath: string = "") => {
        const fullPath = parentPath + route.to;

        const isActive = location.pathname.startsWith(fullPath);
        const isSelected = location.pathname === fullPath;
        const isExpanded = expandedItems.includes(route.to);
        const hasChildren = route.children && route.children.length > 0;

        const linkProps = !hasChildren ? {component: Link, to: fullPath} : {};

        return (
            <Fragment key={index}>
                <ListItem disablePadding sx={{px: 2, py: 0.5}}>
                    <ListItemButton
                        selected={isSelected}
                        onClick={() => handleItemClick(route)}
                        {...linkProps}
                        sx={{
                            borderRadius: level > 0 ? 2 : theme.borderRadius.small,
                            height: level > 0 ? 38 : "auto",
                            py: 1,
                            px: 2,
                            color: theme.palette.text.secondary,
                            transition: theme.transitions.create(["background-color", "color"], {
                                duration: theme.transitions.duration.short,
                            }),

                            ...(isExpanded && {
                                color: theme.palette.text.primary,
                                border: `0.5px solid ${theme.palette.alternate.dark}`,
                                backgroundColor: theme.palette.background.default,
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
                        {route?.icon && (
                            <ListItemIcon
                                sx={{minWidth: 40, color: "inherit"}}>{route.icon}</ListItemIcon>
                        )}
                        <ListItemText
                            primary={t(route.title as string)}
                            slotProps={{
                                primary: {
                                    variant: "body2",
                                    sx: {
                                        color: isSelected ? theme.palette.text.primary : "inherit",
                                    },
                                },
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
                        <List component="div" disablePadding>
                            {route.children?.map((childRoute, childIndex) =>
                                renderMenuItem(childRoute, childIndex, level + 1, fullPath + "/"),
                            )}
                        </List>
                    </Collapse>
                )}
            </Fragment>
        );
    };

    useEffect(() => {
        if (!activeStore && stores && stores.length > 0) {
            dispatch(setActiveStore(stores[0]));
        }
    }, [activeStore, stores, dispatch]);
    return (
        <Drawer
            variant="permanent"
            sx={{
                width: {xs: "100vw", md: `${theme.layout.sidebarWidth}px`},
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                    width: {xs: "100vw", md: `${theme.layout.sidebarWidth}px`},
                    boxSizing: "border-box",
                },
                background: theme.palette.background.default,
                position: {xs: "absolute", md: "relative"},
                zIndex: 10,
                ...sx,
            }}
        >
            {/*<Box sx={{height: "100%", display: "flex", flexDirection: "column", overflowY: "auto"}}>*/}
            {/*    <Box*/}
            {/*        sx={{*/}
            {/*            display: {xs: "flex", md: "none"},*/}
            {/*            justifyContent: "flex-end",*/}
            {/*        }}*/}
            {/*    >*/}
            {/*        <Button*/}
            {/*            onClick={() => toggleDrawer && toggleDrawer(!drawerState)}*/}
            {/*            sx={{width: "fit-content", mt: 1, mr: 0.5}}*/}
            {/*        >*/}
            {/*            <CancelIcon sx={{color: theme.palette.alternate.dark}}/>*/}
            {/*        </Button>*/}
            {/*    </Box>*/}
            {/*    <ListItem sx={{width: "100%"}}>*/}
            {/*        {isLoadingStores ? (*/}
            {/*            <CircularProgress size={24}/>*/}
            {/*        ) : (*/}
            {/*            <ListItemButton*/}
            {/*                // component={Link}*/}
            {/*                // to={"/home"}*/}
            {/*                sx={{*/}
            {/*                    display: "flex",*/}
            {/*                    justifyContent: "center",*/}
            {/*                    alignItems: "center",*/}
            {/*                    color: "text.primary",*/}
            {/*                    textTransform: "none",*/}
            {/*                }}*/}
            {/*            >*/}
            {/*                <StorefrontOutlined sx={{mr: 1}}/>*/}
            {/*                <Typography variant="subtitle2" fontWeight="bold">*/}
            {/*                    {activeStore && activeStore.name}*/}
            {/*                </Typography>*/}
            {/*                <ListItemText/>*/}
            {/*            </ListItemButton>*/}
            {/*        )}*/}
            {/*    </ListItem>*/}

            {/*</Box>*/}

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "90%",
                    py: 2,
                    mx: "auto",
                    height: theme.layout.appBarHeight,
                    borderBottom: "1px solid #CFD1D3",
                }}
            >
                {isLoadingStores ?
                    (<CircularProgress size={24}/>)
                    : (
                        <IconButton aria-label={"BILFI"} component={Link} to={"/"} sx={{
                            borderRadius: 1, display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            color: "text.primary",
                            textTransform: "none",
                        }}>
                            <StorefrontOutlined sx={{mr: 1}}/>
                            <Typography variant="subtitle2" fontWeight="bold">
                                {activeStore && activeStore.name}
                            </Typography>
                            <ListItemText/>
                        </IconButton>

                    )}
                {screenSize === "mobile" || screenSize === "tablet" ? (
                    <IconButton
                        aria-label="menu"
                        sx={{borderRadius: 1}}
                        onClick={() => toggleDrawer && toggleDrawer(!drawerState)}
                    >
                        <Icon src={CancelSvgIcon} alt={"Cancel Icon"}/>
                    </IconButton>
                ) : (
                    <IconButton aria-label="menu" sx={{borderRadius: 1}}>
                        <Icon src={CollapseSvgIcon} alt={"Collapse Icon"}/>
                    </IconButton>
                )}
            </Box>

            {/* Routes rendering */}
            <List sx={{height: "100%", display: "flex", flexDirection: "column", overflowY: "auto"}}>
                {/* Routes rendering */}
                <Box sx={{flexGrow: 1, overflowY: "auto"}}>
                    {filterRoutes(appRoutes).map((route, index) => renderMenuItem(route, index))}
                </Box>
            </List>
            <Box position={"absolute"} bottom={0} width={"100%"} p={2}>
                <Button
                    fullWidth
                    onClick={handleLogout}
                    disabled={isLoading}
                    variant="contained"
                    startIcon={<LogoutOutlined/>}
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
        </Drawer>
    );
};

export default SideBar;
