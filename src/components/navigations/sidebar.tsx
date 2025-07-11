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
import { Link, useLocation } from "react-router-dom";
import { appRoutes, type AppRouteType } from "@/routes";
import type { Props as AppBarProps } from "./appbar";

import ExpandLessOutlinedIcon from "@mui/icons-material/ExpandLessOutlined";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import LogoutIcon from "@mui/icons-material/Logout";

import CancelIcon from "@mui/icons-material/Cancel";

interface Props extends AppBarProps {
  sx?: SxProps<Theme>;
  showDrawer?: boolean;
}

const SideBar: FC<Props> = ({ sx, drawerState, toggleDrawer, showDrawer }) => {
  const theme = useTheme();
  const location = useLocation();

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
        prev.includes(route.to)
          ? prev.filter((item) => item !== route.to)
          : [...prev, route.to],
      );
    }
  };

  const renderMenuItem = (
    route: AppRouteType,
    index: number,
    level: number = 0,
    parentPath: string = "",
  ) => {
    // Calculate the full path for this route
    const fullPath = parentPath + route.to;

    const isSelected = location.pathname === fullPath;
    const isExpanded = expandedItems.includes(route.to);
    const hasChildren = route.children && route.children;

    return (
      <Fragment key={index}>
        <ListItem sx={{ pl: level * 2 }}>
          <ListItemButton
            component={Link}
            to={fullPath}
            selected={isSelected}
            onClick={() => handleItemClick(route)}
            sx={{
              backgroundColor: isSelected
                ? `${theme.palette.primary.main} !important`
                : "transparent",
              "&:hover": {
                backgroundColor: theme.palette.primary.light,
                color: "#fff",
              },
              my: -0.8,
            }}
          >
            <ListItemIcon>
              {isSelected && route.icon?.active
                ? route.icon.active
                : route.icon?.default}
            </ListItemIcon>
            <ListItemText
              primary={route.title}
              sx={{
                ".MuiListItemText-primary": {
                  color: isSelected
                    ? theme.palette.primary.contrastText
                    : "inherit",
                },
              }}
            />
            {hasChildren && (
              <IconButton size="small">
                {isExpanded ? (
                  <ExpandLessOutlinedIcon />
                ) : (
                  <ExpandMoreOutlinedIcon />
                )}
              </IconButton>
            )}
          </ListItemButton>
        </ListItem>

        {/* Render children if expanded */}
        {hasChildren && isExpanded && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <Box>
              {route.children?.map((childRoute, childIndex) =>
                renderMenuItem(
                  childRoute,
                  childIndex,
                  level + 1,
                  fullPath + "/",
                ),
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
              <img
                src="/images/SmartStock.svg"
                width={200}
                alt="Restaurant POS"
              />
            </ListItemIcon>
            <ListItemText />
          </ListItemButton>
        </ListItem>

        <Divider sx={{ display: { xs: "none", md: "block" } }} />

        {/* Routes rendering */}
        {appRoutes.map((route, index) => {
          const authGuard = route.authGuard ?? true;
          const withLayout = route.useLayout ?? true;

          if (route.hidden || !authGuard || !withLayout) return;

          return renderMenuItem(route, index);
        })}

        <Box position={"absolute"} bottom={0} width={"100%"}>
          <ListItem sx={{ pl: 2 }}>
            <ListItemButton
              component={Link}
              to={"/logout"}
              sx={{
                backgroundColor: "transparent",
                "&:hover": {
                  backgroundColor: theme.palette.primary.light,
                },
                py: 0.6,
              }}
            >
              <IconButton size={"small"}>
                <LogoutIcon sx={{ color: theme.palette.error.main }} />
              </IconButton>
              <ListItemText primary={"Logout"} />
            </ListItemButton>
          </ListItem>
        </Box>
      </List>
    </Drawer>
  );
};

export default SideBar;
