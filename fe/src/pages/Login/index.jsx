import userIcon from "/src/assets/userIcon.png";
import passwordIcon from "/src/assets/passwordIcon.png";
import { InputAdornment } from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate, Link as RouterLink, useLocation } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Paper,
  Alert,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Formik, Form } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
  username: Yup.string().required("Username is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // Check for success message from registration
  useEffect(() => {
    if (location.state?.successMessage) {
      setSuccessMessage(location.state.successMessage);
      // Clear the state to prevent showing the message on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setLoading(true);
      setLoginError(null);
      setSuccessMessage(null); // Clear any previous success message
      console.log("Attempting login with:", { username: values.username });

      const response = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: values.username,
          password: values.password,
        }),
      });

      // Try to parse the response as JSON, but handle text responses too
      let data;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        try {
          data = await response.json();
        } catch (e) {
          console.error("Failed to parse response as JSON:", e);
          throw new Error("Server error. Please try again later.");
        }
      } else {
        // Handle text response (likely an error message)
        const textData = await response.text();
        console.log("Server returned text response:", textData);
        throw new Error(textData || "Server error. Please try again later.");
      }

      console.log("Login response status:", response.status);
      console.log("Login response data:", data);

      if (!response.ok) {
        let errorMessage = "Login failed";

        // Handle different error cases
        if (response.status === 401) {
          errorMessage = data?.message || "Wrong username or password";
        } else if (response.status === 404) {
          errorMessage = "User not found";
        } else if (response.status >= 500) {
          errorMessage = "Server error. Please try again later.";
        } else {
          errorMessage = data?.message || "Login failed. Please try again.";
        }

        throw new Error(errorMessage);
      }

      console.log("Login successful:", data);

      // Store user data in localStorage
      if (data) {
        localStorage.setItem("user", JSON.stringify(data));
        if (data.token) {
          localStorage.setItem("token", data.token);
        }

        // Reload the page to update navbar state
        window.location.href = "/";
      } else {
        // Navigate to homepage if no data (shouldn't happen normally)
        navigate("/");
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginError(
        error.message ||
          "Login failed. Please check your credentials and try again."
      );
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h4" gutterBottom>
            Welcome Back
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Sign in to your account to continue
          </Typography>

          {successMessage && (
            <Alert severity="success" sx={{ width: "100%", mb: 2 }}>
              {successMessage}
            </Alert>
          )}

          {loginError && (
            <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
              {loginError}
            </Alert>
          )}

          <Formik
            initialValues={{ username: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              isSubmitting,
            }) => (
              <Form style={{ width: "100%" }}>
                <TextField
                  fullWidth
                  id="username"
                  name="username"
                  label="Username"
                  value={values.username}
                  onChange={(e) => {
                    handleChange(e);
                    setLoginError(null);
                  }}
                  onBlur={handleBlur}
                  error={touched.username && Boolean(errors.username)}
                  helperText={touched.username && errors.username}
                  margin="normal"
                  required
                  autoComplete="username"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <img
                          src={userIcon}
                          alt="User Icon"
                          width={24}
                          height={24}
                        />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  id="password"
                  name="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  value={values.password}
                  onChange={(e) => {
                    handleChange(e);
                    setLoginError(null);
                  }}
                  onBlur={handleBlur}
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                  margin="normal"
                  required
                  autoComplete="current-password"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <img
                          src={passwordIcon}
                          alt="Password Icon"
                          width={24}
                          height={24}
                        />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handlePasswordVisibility}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    ),
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={loading || isSubmitting}
                  sx={{ mt: 3, mb: 2 }}
                >
                  {loading ? <CircularProgress size={24} /> : "Sign In"}
                </Button>

                <Box sx={{ textAlign: "center" }}>
                  <Link
                    component={RouterLink}
                    to="/forgot-password"
                    variant="body2"
                    sx={{ display: "block", mb: 2 }}
                  >
                    Forgot password?
                  </Link>
                  <Typography variant="body2" color="text.secondary">
                    Don't have an account?{" "}
                    <Link component={RouterLink} to="/register" variant="body2">
                      Sign up
                    </Link>
                  </Typography>
                </Box>
              </Form>
            )}
          </Formik>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
