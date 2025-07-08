import { type FC } from "react";
import { Search } from "@mui/icons-material";
import {
  AppBar,
  Toolbar,
  IconButton,
  InputAdornment,
  TextField,
  useTheme,
} from "@mui/material";

import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";

export interface Props {
  toggleDrawer?: (open: boolean) => void;
  drawerState?: boolean;
}

const AppbarComponent: FC<Props> = ({ toggleDrawer, drawerState }) => {
  const theme = useTheme();
  return (
    <AppBar
      position="sticky"
      sx={{
        background: "rgba(255, 255, 255, 0.19)",
        height: theme.layout.appBarHeight,
        boxShadow: "none",
        backdropFilter: "blur(15px)",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <TextField
          id="filled-start-adornment"
          placeholder="Search here..."
          sx={{
            m: 1,
            width: "600px",
            background: theme.palette.background.paper,
            borderRadius: "10px",
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                border: "none",
              },
            },
            display: { xs: "none", md: "block" },
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            },
          }}
          variant="outlined"
        />

        <IconButton
          onClick={() => toggleDrawer && toggleDrawer(!drawerState)}
          aria-label="menu"
          sx={{
            width: "50px",
            height: "50px",
            display: { xs: "block", md: "none" },
          }}
        >
          <MenuOutlinedIcon />
        </IconButton>
        <IconButton
          aria-label="notifications"
          sx={{
            background: theme.palette.background.paper,
            width: "40px",
            height: "40px",
          }}
        >
          <NotificationsNoneOutlinedIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default AppbarComponent;
