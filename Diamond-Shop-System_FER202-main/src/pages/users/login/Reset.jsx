import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { auth, sendPasswordReset } from "../../../components/config/firebase";
import "./_reset.scss";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button, TextField } from "@mui/material";
function Reset() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (loading) return;
    if (user) navigate("/dashboard");
  }, [user, loading, navigate]);

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    onSubmit: async (values) => {
      await sendPasswordReset(values.email);
    },

    validationSchema: Yup.object().shape({
      email: Yup.string()
        .required("Required")
        .email("Email invalid"),
    }),
  });
  return (
    <div className="reset">
      <div className="reset__container">
        <h2>Reset Password</h2>
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
            Send password reset email
          </Button>
          <div>
            Do not have an account? <Link to="/register">Register</Link> now.
          </div>
        </form>
      </div>
    </div>
  );
}
export default Reset;
