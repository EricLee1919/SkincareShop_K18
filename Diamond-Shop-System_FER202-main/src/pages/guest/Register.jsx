import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import {
  auth,
  registerWithEmailAndPassword,
} from "../../components/config/firebase";
import "./_register.scss";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button, TextField } from "@mui/material";

function Register() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (user) navigate("/dashboard");
  }, [user, loading, navigate]);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      name: "",
    },
    onSubmit: async (values) => {
      const { name, email, password } = values;
      await registerWithEmailAndPassword(name, email, password);
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required("Required"),
      email: Yup.string()
        .required("Required")
        .email("Email invalid"),
      password: Yup.string().required("Required"),
    }),
  });
  return (
    <div className="register">
      <div className="register__container">
        <h2>Register</h2>
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-3">
            <TextField
              fullWidth
              variant="outlined"
              label="Username"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
          </div>
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
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
          </div>
          <Button
            type="submit"
            variant="contained"
            sx={{
              background: "linear-gradient(45deg, #aaa 30%, #434343 90%)",
              border: 0,
              borderRadius: 15,
              boxShadow: "0 3px 5px 2px rgba(0, 0, 0, .3)",
              color: "white",
              height: 48,
              padding: "0 30px",
              fontSize: "1.2rem",
              fontWeight: "bold",
              textTransform: "none",
              "&:hover": {
                background: "linear-gradient(45deg, #434343  30%, #aaa  90%)",
              },
            }}
          >
            Register
          </Button>
          <div>
            Already have an account? <Link to="/">Login</Link> now.
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
