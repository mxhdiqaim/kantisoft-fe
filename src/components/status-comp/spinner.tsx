import { useTheme, Box } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

// import logo from "../assets/icons/logo-short.svg";

const Spinner = () => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      {/*<img src={logo} style={{ width: "54px", height: "43px" }} alt='logo' />*/}

      <CircularProgress
        disableShrink
        sx={{ mt: 6, color: theme.palette.primary.main }}
      />
    </Box>
  );
};

export default Spinner;
