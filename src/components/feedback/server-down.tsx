import BlankLayout from "@/components/layout/blank-layout";
import { Box, type BoxProps, styled, Typography } from "@mui/material";

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
            <Typography
              variant="h1"
              sx={{
                color: "rgba(76, 78, 100, 0.87)",
                fontSize: "4rem !important",
              }}
            >
              503
            </Typography>
          </BoxWrapper>

          <img
            alt="error-illustration"
            width={500}
            height={500}
            style={{ marginBottom: "100px" }}
            src="/images/server-down.svg"
          />
          <Typography
            mb={0.5}
            variant="h5"
            sx={{
              fontSize: "1.5rem !important",
              color: "rgba(76, 78, 100, 0.87)",
            }}
          >
            Service not available, please try again.
          </Typography>
        </Box>
      </Box>
    </BlankLayout>
  );
};

export default ServerDown;
