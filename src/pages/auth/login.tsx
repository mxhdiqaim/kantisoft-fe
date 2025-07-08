import { validateUserLogin } from "@/helpers/user-validation";
import { type UserLogin, userLoginSchema } from "@/types/user-types";
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  FormControl,
  FormHelperText,
  Grid,
} from "@mui/material";

import { useAuth } from "@/hooks/use-auth";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

const defaultValues = {
  password: "",
  email: "",
};

const Login = () => {
  const auth = useAuth();
  const { loading, login } = auth;

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "onBlur",
    resolver: yupResolver(userLoginSchema),
  });

  const onSubmit = async (data: UserLogin) => {
    try {
      // First validate the login data
      const validatedData = await validateUserLogin(data);

      const { email, password } = validatedData;

      // If validation passes, proceed with login
      login({ email, password }, (err) => {
        // Handle specific field errors
        if (err) {
          // If err is a general error message, set it for both fields
          setError("email", {
            type: "manual",
            message: err,
          });
          setError("password", {
            type: "manual",
            message: err,
          });
        }
      });
    } catch (error) {
      // Handle validation errors
      if (error instanceof Error) {
        // You can set a general error or parse the error message to set specific field errors
        setError("email", {
          type: "manual",
          message: error.message,
        });
        setError("password", {
          type: "manual",
          message: error.message,
        });
      }
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid
        size={12}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          m: { xs: 3, md: 0 },
        }}
      >
        <Box
          sx={{
            maxWidth: {
              xs: "100%",
              sm: "90%",
              md: "80%",
              lg: "70%",
              xl: "60%",
            },
          }}
        >
          <Box sx={{ textAlign: "center", mb: 5 }}>
            <Typography variant={"h2"} sx={{ fontWeight: 500 }}>
              Restaurant POS
            </Typography>
          </Box>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl fullWidth>
              <Controller
                name="email"
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    autoFocus
                    label="Email"
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    error={Boolean(errors.email)}
                    placeholder="example@gmail.com"
                    sx={{ minWidth: "90%" }}
                  />
                )}
              />
              {errors.email && (
                <FormHelperText sx={{ color: "error.main" }}>
                  {errors.email.message}
                </FormHelperText>
              )}
            </FormControl>
            <FormControl fullWidth sx={{ mt: 3 }}>
              <Controller
                name="password"
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    value={value}
                    onBlur={onBlur}
                    label="Password"
                    onChange={onChange}
                    id="auth-login-v2-password"
                    error={Boolean(errors.password)}
                    type={"password"}
                  />
                )}
              />
              {errors.password && (
                <FormHelperText sx={{ color: "error.main" }} id="">
                  {errors.password.message}
                </FormHelperText>
              )}
            </FormControl>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                my: 3,
              }}
            >
              <Link href="/reset-password" style={{ textDecoration: "none" }}>
                Forgot Password?
              </Link>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  width: "380px",
                  color: "#fff",
                  borderRadius: "48px",
                  p: 2,
                  mb: 2,
                }}
                disabled={loading}
              >
                Login
              </Button>
            </Box>
          </form>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Login;
