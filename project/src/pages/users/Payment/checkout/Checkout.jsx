import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Grid,
  TextField,
  Typography,
  Button,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Avatar,
  Snackbar,
  Paper,
  Divider,
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { db } from "../../../../components/config/firebase";
import { doc, getDoc } from "firebase/firestore";

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  address: Yup.string().required("Address Line 1 is required"),
  province: Yup.string().required("Province/Territory is required"),
  country: Yup.string().required("Country/Region is required"),
  phone: Yup.string().required("Shipping Phone is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  paymentMethod: Yup.string().required("Payment Method is required"),
  consent: Yup.boolean().oneOf([true], "Consent is required"),
});

const Checkout = () => {
  const [orderDetails, setOrderDetails] = useState(null);
  const [userData, setUserData] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    const storedOrderDetails = JSON.parse(localStorage.getItem("orderDetails"));
    if (storedOrderDetails) {
      setOrderDetails(storedOrderDetails);
    }

    const userId = localStorage.getItem("user_id");
    if (userId) {
      fetchUserData(userId);
    }
  }, []);

  const fetchUserData = async (userId) => {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      setUserData(userDoc.data());
    }
  };

  const handleSubmit = (values) => {
    const userId = localStorage.getItem("user_id"); // Lấy user_id từ localStorage
    const paymentData = {
      user_id: userId,
      diamonds: orderDetails.cartItems.map((item) => ({
        diamond_id: item.id,
        quantity: item.quantity,
      })),
      totalAmount: orderDetails.totalAmount,
      paymentChoice: values.paymentMethod,
    };

    axios
      .post("/api/payments", paymentData)
      .then((response) => {
        console.log("Response from backend:", response);
        if (response.data && response.data.payUrl) {
          window.location.href = response.data.payUrl; // Chuyển hướng tới cổng thanh toán MoMo hoặc VNPay
        } else {
          console.error("Payment URL not received:", response.data);
          setSnackbarMessage("Payment URL not received.");
          setSnackbarOpen(true);
        }
      })
      .catch((error) => {
        console.error(
          "Error processing payment:",
          error.response ? error.response.data : error.message
        );
        setSnackbarMessage(
          `Error processing payment: ${
            error.response ? error.response.data.message : error.message
          }`
        );
        setSnackbarOpen(true);
      });
  };

  const handlePaymentMethodChange = (event) => {
    localStorage.removeItem("paymentMethod");
    handleChange(event);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };
  return (
    <Container maxWidth="xl">
      <Box margin={5}>
        <Typography variant="h4" gutterBottom textAlign={"center"} mb={"25px"}>
          Order Summary
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} style={{ padding: "20px" }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  Product
                </Grid>
                <Grid item xs={2}>
                  Price
                </Grid>
                <Grid item xs={2}>
                  Quantity
                </Grid>
                <Grid item xs={2}>
                  Total
                </Grid>
              </Grid>
              <Divider style={{ margin: "10px 0" }} />
              {orderDetails &&
                orderDetails.cartItems.map((item) => (
                  <Grid container spacing={2} key={item.id} alignItems="center">
                    <Grid item xs={6}>
                      <Box display="flex" alignItems="center">
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{ width: "50px", height: "50px" }}
                        />
                        <Typography ml={1}>{item.name}</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={2}>
                      {formatCurrency(item.price)}
                    </Grid>
                    <Grid item xs={2}>
                      <Box display="flex" alignItems="center">
                        <Typography ml={3}>{item.quantity}</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={2}>
                      {formatCurrency(item.price * item.quantity)}
                    </Grid>
                  </Grid>
                ))}
              <Divider style={{ margin: "10px 0" }} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Formik
              initialValues={{
                firstName: userData.fullname
                  ? userData.fullname.split(" ")[0]
                  : "",
                lastName: userData.fullname
                  ? userData.fullname.split(" ")[1]
                  : "",
                address: userData.address_shipping || "",
                province: "",
                country: "",
                phone: userData.phone || "",
                email: userData.email || "",
                paymentMethod: "MOMO",
                consent: false,
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              enableReinitialize // Thêm dòng này để formik khởi tạo lại giá trị khi userData thay đổi
            >
              {({ errors, touched, values, handleChange }) => (
                <Form>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="First Name"
                        fullWidth
                        name="firstName"
                        value={values.firstName}
                        onChange={handleChange}
                        error={touched.firstName && Boolean(errors.firstName)}
                        helperText={touched.firstName && errors.firstName}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Last Name"
                        fullWidth
                        name="lastName"
                        value={values.lastName}
                        onChange={handleChange}
                        error={touched.lastName && Boolean(errors.lastName)}
                        helperText={touched.lastName && errors.lastName}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Address "
                        fullWidth
                        name="address"
                        value={values.address}
                        onChange={handleChange}
                        error={touched.address && Boolean(errors.address)}
                        helperText={touched.address && errors.address}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Province/Territory"
                        fullWidth
                        name="province"
                        value={values.province}
                        onChange={handleChange}
                        error={touched.province && Boolean(errors.province)}
                        helperText={touched.province && errors.province}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Country/Region"
                        fullWidth
                        name="country"
                        value={values.country}
                        onChange={handleChange}
                        error={touched.country && Boolean(errors.country)}
                        helperText={touched.country && errors.country}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Shipping Phone"
                        fullWidth
                        name="phone"
                        value={values.phone}
                        onChange={handleChange}
                        error={touched.phone && Boolean(errors.phone)}
                        helperText={touched.phone && errors.phone}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Email"
                        fullWidth
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        error={touched.email && Boolean(errors.email)}
                        helperText={touched.email && errors.email}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl
                        fullWidth
                        required
                        error={
                          touched.paymentMethod && Boolean(errors.paymentMethod)
                        }
                      >
                        <InputLabel>Payment Method</InputLabel>
                        <Select
                          name="paymentMethod"
                          value={values.paymentMethod}
                          onChange={(e) => {
                            handleChange(e);
                            handlePaymentMethodChange(e);
                          }}
                        >
                          <MenuItem value="MOMO">
                            <Avatar
                              src="https://static.ybox.vn/2023/5/2/1683614751843-pham108n6v2au-avatar.png"
                              style={{ marginRight: 8 }}
                            />
                            MoMo
                          </MenuItem>
                          <MenuItem value="VNPAY">
                            <Avatar
                              src="https://vinadesign.vn/uploads/images/2023/05/vnpay-logo-vinadesign-25-12-57-55.jpg?gidzl=Ra8S3NOFps1gLHaAS179Pc5K60vdHfisBbH8NsCHbsCk1abVCaASDda2JbXXHCymSGORLM8eTETTT0xDPm"
                              style={{ marginRight: 8 }}
                            />
                            VNPay
                          </MenuItem>
                        </Select>
                        {touched.paymentMethod && errors.paymentMethod && (
                          <Typography color="error" variant="caption">
                            {errors.paymentMethod}
                          </Typography>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            required
                            name="consent"
                            checked={values.consent}
                            onChange={handleChange}
                          />
                        }
                        label={
                          <Typography variant="body2">
                            I have read and consent to jewellery.com processing
                            my information in accordance with the
                            <a href="#">Privacy statement</a>.
                          </Typography>
                        }
                      />
                      {touched.consent && errors.consent && (
                        <Typography color="error" variant="caption">
                          {errors.consent}
                        </Typography>
                      )}
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                      >
                        PayMent
                      </Button>
                    </Grid>
                  </Grid>
                </Form>
              )}
            </Formik>
          </Grid>
        </Grid>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />
    </Container>
  );
};

export default Checkout;
