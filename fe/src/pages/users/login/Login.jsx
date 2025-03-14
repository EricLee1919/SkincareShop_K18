import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./_login.scss"; // Import SCSS
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button, Divider, IconButton, InputAdornment, TextField } from "@mui/material";
import GoogleButton from "react-google-button";
import { Visibility, VisibilityOff } from "@mui/icons-material";

function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  //  tài khoản giả bộ
  const fakeUsers = [
    { email: "admin@example.com", password: "123456" },
    { email: "user@example.com", password: "password" }
  ];

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: (values) => {
      const { email, password } = values;
      const user = fakeUsers.find((u) => u.email === email && u.password === password);

      if (user) {
        alert("Login successful!");
        navigate("/");
      } else {
        alert("Invalid email or password.");
      }
    },
    validationSchema: Yup.object().shape({
      email: Yup.string().required("Required").email("Email invalid"),
      password: Yup.string().required("Required"),
    }),
  });

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login</h2>
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-3">
            <TextField
              fullWidth
              variant="outlined"
              label="Email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
          </div>
          <div className="mb-3">
            <TextField
              fullWidth
              variant="outlined"
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <div className="link" style={{ textAlign: "right" }}>
              <Link to="/reset" className="switch_link">
                Forgot password?
              </Link>
            </div>
          </div>
          <Button
            type="submit"
            variant="contained"
            sx={{
              background: "linear-gradient(45deg, #A0D8B3  30%, #F4EFEA  90%)",
              border: 0,
              borderRadius: 15,
              boxShadow: "0 3px 5px 2px rgba(160, 216, 179, 0.82)",
              color: "white",
              height: 48,
              padding: "0 30px",
              fontSize: "1.2rem",
              fontWeight: "bold",
              textTransform: "none",
              "&:hover": {
                background: "linear-gradient(45deg,rgb(54, 107, 64)  30%, #aaa  90%)",
              },
            }}
          >
            Login
          </Button>
          <Divider sx={{ mt: 3, color: "grey" }}> or </Divider>
          <div className="login__google-container">
            <GoogleButton onClick={() => alert("Google Sign-In is not implemented yet")} />
          </div>
          <div className="link">
            Do not have an account?{" "}
            <Link to="/register" className="switch_link">
              Register
            </Link>{" "}
            now.
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
