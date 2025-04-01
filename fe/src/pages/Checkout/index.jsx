// Checkout.jsx
import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  Box,
  Divider,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  selectCartTotal,
  clearCart,
  selectCartItems,
} from "../../store/slices/cartSlice";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import axios from "axios";
import { getCurrentUser } from "../../store/slices/authSlice";
import convertCurrency from "../../utils/currency";

const steps = ["Shipping Information", "Review Order"];

const shippingSchema = Yup.object({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  address: Yup.string().required("Address is required"),
  city: Yup.string().required("City is required"),
  state: Yup.string().required("State is required"),
  zipCode: Yup.string().required("ZIP code is required"),
  phone: Yup.string().required("Phone number is required"),
});

const Checkout = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [shippingData, setShippingData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
  });
  const [usedPoints, setUsedPoints] = useState(0);
  const [maxUsablePoints, setMaxUsablePoints] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pointDialogOpen, setPointDialogOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      const maxPoints = Math.min(user.point || 0, cartTotal * 1000);
      setMaxUsablePoints(maxPoints);
    }
  }, [user, cartTotal]);

  const handleNext = () => setActiveStep((prevStep) => prevStep + 1);
  const handleBack = () => setActiveStep((prevStep) => prevStep - 1);

  const handleShippingSubmit = (values) => {
    setShippingData(values);
    handleNext();
  };

  const handleOrderSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const finalAmount = cartTotal * 1000 - usedPoints;
      const orderData = {
        details: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
        shippingAddress: `${shippingData.address}, ${shippingData.city}, ${shippingData.state}, ${shippingData.zipCode}`,
        shippingPhone: shippingData.phone,
        shippingReceiverFullName: `${shippingData.firstName} ${shippingData.lastName}`,
        point: usedPoints,
      };

      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.token)
        throw new Error("You must be logged in to place an order");

      const response = await axios.post(
        "http://localhost:8080/api/order",
        orderData,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      window.location.href = response.data;
      dispatch(clearCart());
    } catch (err) {
      console.error("Error creating order:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to place order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const OrderReview = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Order Summary
      </Typography>
      {cartItems.map((item) => (
        <Box key={item.id} display="flex" justifyContent="space-between" mb={2}>
          <Typography>
            {item.name} x {item.quantity}
          </Typography>
          <Typography>{convertCurrency(item.price * item.quantity)}</Typography>
        </Box>
      ))}
      <Divider sx={{ my: 2 }} />

      <Box sx={{ my: 3 }}>
        <Button variant="outlined" onClick={() => setPointDialogOpen(true)}>
          Apply Points
        </Button>
        <Dialog
          open={pointDialogOpen}
          onClose={() => setPointDialogOpen(false)}
        >
          <DialogTitle>Apply Points</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              You have {user?.point || 0} points. 1 point = 1 VND
            </Typography>
            <TextField
              label="Points to use"
              type="number"
              fullWidth
              value={usedPoints}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (val <= maxUsablePoints && val >= 0) {
                  setUsedPoints(val);
                }
              }}
              inputProps={{ min: 0, max: maxUsablePoints, step: 1000 }}
              helperText={`Max: ${maxUsablePoints.toLocaleString()} points`}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPointDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={() => setPointDialogOpen(false)}
              variant="contained"
            >
              Apply
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      <Box display="flex" justifyContent="space-between" mb={1}>
        <Typography>Total</Typography>
        <Typography>{convertCurrency(cartTotal)}</Typography>
      </Box>
      <Box display="flex" justifyContent="space-between" mb={1}>
        <Typography>Discount from Points</Typography>
        <Typography>- {convertCurrency(usedPoints * 1000)}</Typography>
      </Box>
      <Divider sx={{ my: 1 }} />
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h6">Final Total</Typography>
        <Typography variant="h6">
          {convertCurrency(cartTotal - usedPoints * 1000)}
        </Typography>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Shipping Information
        </Typography>
        <Typography gutterBottom>
          {shippingData.firstName} {shippingData.lastName}
        </Typography>
        <Typography gutterBottom>{shippingData.address}</Typography>
        <Typography gutterBottom>
          {shippingData.city}, {shippingData.state} {shippingData.zipCode}
        </Typography>
        <Typography gutterBottom>Phone: {shippingData.phone}</Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mt: 3, mb: 3 }}>
          {error}
        </Alert>
      )}

      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleOrderSubmit}
        disabled={loading}
        sx={{ mt: 3 }}
      >
        {loading ? <CircularProgress size={24} /> : "Payment"}
      </Button>
    </Box>
  );

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Formik
            initialValues={shippingData}
            validationSchema={shippingSchema}
            onSubmit={handleShippingSubmit}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
            }) => (
              <Form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      id="firstName"
                      name="firstName"
                      label="First Name"
                      value={values.firstName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.firstName && Boolean(errors.firstName)}
                      helperText={touched.firstName && errors.firstName}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      id="lastName"
                      name="lastName"
                      label="Last Name"
                      value={values.lastName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.lastName && Boolean(errors.lastName)}
                      helperText={touched.lastName && errors.lastName}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="address"
                      name="address"
                      label="Address"
                      value={values.address}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.address && Boolean(errors.address)}
                      helperText={touched.address && errors.address}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      id="city"
                      name="city"
                      label="City"
                      value={values.city}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.city && Boolean(errors.city)}
                      helperText={touched.city && errors.city}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      id="state"
                      name="state"
                      label="State"
                      value={values.state}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.state && Boolean(errors.state)}
                      helperText={touched.state && errors.state}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      id="zipCode"
                      name="zipCode"
                      label="ZIP Code"
                      value={values.zipCode}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.zipCode && Boolean(errors.zipCode)}
                      helperText={touched.zipCode && errors.zipCode}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      id="phone"
                      name="phone"
                      label="Phone Number"
                      value={values.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.phone && Boolean(errors.phone)}
                      helperText={touched.phone && errors.phone}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                      disabled={isSubmitting}
                    >
                      Continue to Review
                    </Button>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        );
      case 1:
        return <OrderReview />;
      default:
        return "Unknown step";
    }
  };

  if (cartItems.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box textAlign="center">
          <Typography variant="h5" gutterBottom>
            Your cart is empty
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/products")}
            sx={{ mt: 2 }}
          >
            Continue Shopping
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Checkout
        </Typography>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {getStepContent(activeStep)}
        {activeStep !== 0 && (
          <Button onClick={handleBack} sx={{ mt: 2 }}>
            Back
          </Button>
        )}
      </Paper>
    </Container>
  );
};

export default Checkout;
