import { type FC, type ReactNode, useState } from "react";
import { Box } from "@mui/material";
import AppbarComponent from "./appbar";
import SideBar from "./sidebar";
import useScreenSize from "@/hooks/use-screen-size";
import CustomDrawer from "@/components/customs/custom-drawer";
import OfflineBanner from "@/components/feedback/offline-banner";

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
    const screenSize = useScreenSize();
    const [drawerState, setDrawerState] = useState(false);

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
                    <SideBar {...{ toggleDrawer, drawerState }} />
                </CustomDrawer>
            ) : (
                <SideBar />
            )}

            {/* Main content area */}

            <Box sx={{ flexGrow: 1 }}>
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
