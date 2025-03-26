import { useState } from "react";
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  subject: Yup.string().required("Subject is required"),
  message: Yup.string().required("Message is required"),
});

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      // Here you would typically send the contact form data to your backend
      console.log("Contact form submitted:", values);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccess(true);
      resetForm();
    } catch (error) {
      setError("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 4, height: "100%" }}>
            <Typography variant="h5" gutterBottom>
              Contact Information
            </Typography>

            <Box sx={{ mt: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <EmailIcon sx={{ mr: 1, color: "primary.main" }} />
                <Typography variant="body1">
                  support@skincareshop.com
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <PhoneIcon sx={{ mr: 1, color: "primary.main" }} />
                <Typography variant="body1">+84 123 456 789</Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center" }}>
                <LocationOnIcon sx={{ mr: 1, color: "primary.main" }} />
                <Typography variant="body1">
                  123 Skincare Street, District 1, Ho Chi Minh City
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>
              Send us a Message
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                Thank you for your message. We'll get back to you soon!
              </Alert>
            )}

            <Formik
              initialValues={{
                name: "",
                email: "",
                subject: "",
                message: "",
              }}
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
                <Form>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        id="name"
                        name="name"
                        label="Your Name"
                        value={values.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.name && Boolean(errors.name)}
                        helperText={touched.name && errors.name}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        id="email"
                        name="email"
                        label="Email Address"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.email && Boolean(errors.email)}
                        helperText={touched.email && errors.email}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        id="subject"
                        name="subject"
                        label="Subject"
                        value={values.subject}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.subject && Boolean(errors.subject)}
                        helperText={touched.subject && errors.subject}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        id="message"
                        name="message"
                        label="Message"
                        value={values.message}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.message && Boolean(errors.message)}
                        helperText={touched.message && errors.message}
                        multiline
                        rows={4}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="large"
                        fullWidth
                        disabled={loading || isSubmitting}
                      >
                        {loading ? (
                          <CircularProgress size={24} />
                        ) : (
                          "Send Message"
                        )}
                      </Button>
                    </Grid>
                  </Grid>
                </Form>
              )}
            </Formik>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Contact;
