import { useFormik } from "formik";
import * as Yup from "yup";
import { Alert, Box, Button, Grid, TextField } from "@mui/material";

export default function ContactForm() {
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      address: "",
      phone: "",
      message: "",
    },
    onSubmit: (values) => {
      alert(JSON.stringify(values));
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
        .required("Required")
        .min(2, "Must be 2 characters or more"),
      lastName: Yup.string()
        .required("Required")
        .min(2, "Must be 2 characters or more"),
      email: Yup.string().required("Required").email("Email invalid"),
      address: Yup.string().required("Required"),
      phone: Yup.string()
        .required("Required")
        .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),
      message: Yup.string()
        .required("Required")
        .min(10, "Must be 10 characters or more"),
    }),
  });

  return (
    <Box component="form" onSubmit={formik.handleSubmit}>
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <TextField
            required
            fullWidth
            id="outlined-firstName" // Thêm ID cho TextField
            label="First Name"
            name="firstName"
            value={formik.values.firstName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.firstName && Boolean(formik.errors.firstName)}
          />
          {formik.touched.firstName && formik.errors.firstName ? (
            <Alert severity="error">{formik.errors.firstName}</Alert>
          ) : null}
        </Grid>
        <Grid item xs={6}>
          <TextField
            required
            fullWidth
            id="outlined-lastName" // Thêm ID cho TextField
            label="Last Name"
            name="lastName"
            value={formik.values.lastName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.lastName && Boolean(formik.errors.lastName)}
          />
          {formik.touched.lastName && formik.errors.lastName ? (
            <Alert severity="error">{formik.errors.lastName}</Alert>
          ) : null}
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            id="outlined-email" // Thêm ID cho TextField
            label="Email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
          />
          {formik.touched.email && formik.errors.email ? (
            <Alert severity="error">{formik.errors.email}</Alert>
          ) : null}
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            id="outlined-address" // Thêm ID cho TextField
            label="Address"
            name="address"
            value={formik.values.address}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.address && Boolean(formik.errors.address)}
          />
          {formik.touched.address && formik.errors.address ? (
            <Alert severity="error">{formik.errors.address}</Alert>
          ) : null}
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            id="outlined-phone" // Thêm ID cho TextField
            label="Phone"
            name="phone"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.phone && Boolean(formik.errors.phone)}
          />
          {formik.touched.phone && formik.errors.phone ? (
            <Alert severity="error">{formik.errors.phone}</Alert>
          ) : null}
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="message"
            label="Message"
            fullWidth
            required
            multiline
            rows={4}
            value={formik.values.message}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.message && Boolean(formik.errors.message)}
            InputProps={{
              sx: {
                minHeight: "100px",
                maxHeight: "500px",
                resize: "vertical",
                overflow: "auto",
              },
            }}
          />
          {formik.touched.message && formik.errors.message ? (
            <Alert severity="error">{formik.errors.message}</Alert>
          ) : null}
        </Grid>
        <Grid item xs={12}>
          <Button fullWidth variant="contained" type="submit">
            Submit
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}