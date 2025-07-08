import BlankLayout from "@/components/layout/blank-layout";
import { Typography, Box, type BoxProps, styled } from "@mui/material";

const BoxWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  [theme.breakpoints.down("md")]: {
    width: "90vw",
  },
}));

const ServerDown = () => {
  return (
    <BlankLayout>
      <Box className="content-center">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <BoxWrapper mb={2}>
            <Typography variant="h1" sx={{ color: "rgba(76, 78, 100, 0.87)" }}>
              503
            </Typography>

            <Typography
              mb={0.5}
              variant="h5"
              sx={{
                fontSize: "1.15rem !important",
                color: "rgba(76, 78, 100, 0.87)",
              }}
            >
              Service Unavailable
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "rgba(76, 78, 100, 0.68)" }}
            >
              Please check console 👨🏻‍💻
            </Typography>
          </BoxWrapper>

          <img
            alt="error-illustration"
            width={500}
            height={500}
            style={{ marginBottom: "100px" }}
            src="/images/server_down.svg"
          />
        </Box>
      </Box>
    </BlankLayout>
  );
};

export default ServerDown;
