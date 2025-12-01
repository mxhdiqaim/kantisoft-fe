import {appRoutes, type AppRouteType} from "@/routes";
import {useAppSelector} from "@/store";
import {apiSlice, useGetAllStoresQuery, useLogoutMutation} from "@/store/slice";
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
    MenuItem,
    type SxProps,
    type Theme,
    useTheme,
} from "@mui/material";
import {type FC, Fragment, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {Link, useLocation, useNavigate} from "react-router-dom";
import type {Props as AppBarProps} from "./appbar";
import {UserRoleEnum} from "@/types/user-types.ts";
import type {StoreType} from "@/types/store-types.ts";
import CustomButton from "@/components/ui/button.tsx";

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

    const handleStoreSelect = (store: StoreType) => {
        dispatch(setActiveStore(store));
        // Reset the entire API state to force refetching of all data for the new store
        dispatch(apiSlice.util.resetApiState());
        // handleMenuClose();
    };

    const handleLogout = async () => {
        try {
            await logout({}).unwrap();
        } catch (error) {
            console.error("Server logout failed, proceeding with client-side logout:", error);
        } finally {
            navigate("/login");
        }
    };

    const [expandedItems, setExpandedItems] = useState<string[]>([]);

    const handleItemClick = (route: AppRouteType) => {
        if (showDrawer) return;

        if (toggleDrawer) {
            toggleDrawer(!drawerState);
        }

        if (route.children) {
            setExpandedItems((prev) =>
                prev.includes(route.to) ? prev.filter((item) => item !== route.to) : [...prev, route.to],
            );
        }
    };

    const filterRoutes = (routes: AppRouteType[]): AppRouteType[] => {
        return routes
            .filter((route) => {
                if (route.hidden || !(route.authGuard ?? true) || !(route.useLayout ?? true)) {
                    return false;
                }
                if (route.roles && currentUser) {
                    return route.roles.includes(currentUser.role);
                }
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

                            "&:hover": {
                                backgroundColor: theme.palette.action.hover,
                                color: isActive ? theme.palette.primary.main : theme.palette.text.primary,
                            },
                        }}
                    >
                        {route?.icon && <ListItemIcon sx={{minWidth: 40, color: "inherit"}}>{route.icon}</ListItemIcon>}
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
        if (stores && stores.length > 0 && currentUser) {
            const userDefaultStore = stores.find((store) => store.id === currentUser.storeId);

            if (currentUser.role !== UserRoleEnum.MANAGER) {
                // For non-managers, always set their default store as active
                if (userDefaultStore && activeStore?.id !== userDefaultStore.id) {
                    dispatch(setActiveStore(userDefaultStore));
                }
            } else {
                // For managers, if no store is active, set their default one.
                if (!activeStore && userDefaultStore) {
                    dispatch(setActiveStore(userDefaultStore));
                }
            }
        }
    }, [activeStore, stores, currentUser, dispatch]);

    const isManager = currentUser?.role === UserRoleEnum.MANAGER;

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
                {isLoadingStores ? (
                    <CircularProgress size={24}/>
                ) : (
                    <CustomButton
                        startIcon={<StorefrontOutlined sx={{mr: 1}}/>}
                        endIcon={<ExpandMoreOutlinedIcon/>}
                        title={activeStore?.name || "Select Store"}
                        sx={{
                            borderRadius: 1,
                            color: "text.primary",
                            textTransform: "none",
                            cursor: isManager ? "pointer" : "default",
                        }}
                        component={isManager ? "button" : Link}
                        to={!isManager ? "/" : undefined}
                    >
                        {isManager && (
                            (stores ?? []).map((store) => (
                                <MenuItem key={store.id} onClick={() => handleStoreSelect(store)}
                                          selected={store.id === activeStore?.id}>
                                    {store.name}
                                </MenuItem>
                            ))
                        )}
                    </CustomButton>
                )}
                {screenSize === "mobile" || screenSize === "tablet" ? (
                    <IconButton aria-label="menu" sx={{borderRadius: 1}}
                                onClick={() => toggleDrawer && toggleDrawer(!drawerState)}>
                        <Icon src={CancelSvgIcon} alt={"Cancel Icon"}/>
                    </IconButton>
                ) : (
                    <IconButton aria-label="menu" sx={{borderRadius: 1}}>
                        <Icon src={CollapseSvgIcon} alt={"Collapse Icon"}/>
                    </IconButton>
                )}
            </Box>

            <List sx={{height: "100%", display: "flex", flexDirection: "column", overflowY: "auto"}}>
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
                            backgroundColor: theme.palette.error.dark,
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
