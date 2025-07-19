import { type FC, type ReactNode, useState } from "react";
import { Box, useTheme } from "@mui/material";
import AppbarComponent from "./appbar";
import SideBar from "./sidebar";
import useScreenSize from "@/hooks/use-screen-size";
import CustomDrawer from "@/components/customs/custom-drawer";
import OfflineBanner from "@/pages/errors/offline-banner";
import type { AppRouteType } from "@/routes";

interface Props {
    children: ReactNode;
    appRoutes: AppRouteType[]; // Add appRoutes to props
}

const Layout: FC<Props> = ({ children, appRoutes }) => {
    const screenSize = useScreenSize();
    const [drawerState, setDrawerState] = useState(false);
    const theme = useTheme();

    const showDrawer = screenSize === "mobile" || screenSize === "tablet";

    const toggleDrawer = (open: boolean) => {
        setDrawerState(open);
    };

    return (
        <Box sx={{ display: "flex" }}>
            {/* Sidebar */}
            {showDrawer ? (
                <CustomDrawer
                    anchor="left"
                    open={drawerState}
                    onClose={() => toggleDrawer(false)}
                    onOpen={() => toggleDrawer(true)}
                >
                    <SideBar {...{ toggleDrawer, drawerState, showDrawer, appRoutes }} />
                </CustomDrawer>
            ) : (
                <SideBar {...{ toggleDrawer, drawerState, showDrawer, appRoutes }} />
            )}

            {/* Main content area */}

            <Box component="main" sx={{ flexGrow: 1, background: theme.palette.background.default }}>
                <OfflineBanner />
                <AppbarComponent {...{ toggleDrawer, drawerState }} />

                {/* Main content */}
                <Box component="main" sx={{ flexGrow: 1, p: 2 }}>
                    {children}
                </Box>
            </Box>
        </Box>
    );
};

export default Layout;
