import { Box, useTheme } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

const Spinner = () => {
    const theme = useTheme();
    return (
        <Box
            sx={{
                height: "calc(100vh - 120px)",
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
