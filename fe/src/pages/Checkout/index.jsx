import { useState } from 'react';
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
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectCartTotal, clearCart, selectCartItems } from '../../store/slices/cartSlice';
import * as Yup from 'yup';
import { Formik, Form, ErrorMessage } from 'formik';
import axios from 'axios';

const steps = ['Shipping Information', 'Payment Details', 'Review Order'];

// Define validation schemas
const shippingSchema = Yup.object({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  address: Yup.string().required('Address is required'),
  city: Yup.string().required('City is required'),
  state: Yup.string().required('State is required'),
  zipCode: Yup.string().required('ZIP code is required'),
  phone: Yup.string().required('Phone number is required'),
});

const paymentSchema = Yup.object({
  paymentMethod: Yup.string().required('Payment method is required'),
  cardName: Yup.string().when('paymentMethod', {
    is: 'CREDIT_CARD',
    then: () => Yup.string().required('Name on card is required'),
    otherwise: () => Yup.string()
  }),
  cardNumber: Yup.string().when('paymentMethod', {
    is: 'CREDIT_CARD',
    then: () => Yup.string()
      .required('Card number is required')
      .matches(/^\d{16}$/, 'Card number must be 16 digits'),
    otherwise: () => Yup.string()
  }),
  expiryDate: Yup.string().when('paymentMethod', {
    is: 'CREDIT_CARD',
    then: () => Yup.string()
      .required('Expiry date is required')
      .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Expiry date must be in MM/YY format'),
    otherwise: () => Yup.string()
  }),
  cvv: Yup.string().when('paymentMethod', {
    is: 'CREDIT_CARD',
    then: () => Yup.string()
      .required('CVV is required')
      .matches(/^\d{3,4}$/, 'CVV must be 3 or 4 digits'),
    otherwise: () => Yup.string()
  }),
});

const Checkout = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [shippingData, setShippingData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
  });
  const [paymentData, setPaymentData] = useState({
    paymentMethod: 'VNPAY',
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleShippingSubmit = (values) => {
    setShippingData(values);
    handleNext();
  };

  const handlePaymentSubmit = (values) => {
    console.log('Payment form values:', values);
    setPaymentData({
      ...paymentData,
      ...values
    });
    console.log('Updated payment data:', {...paymentData, ...values});
    
    // Debug state update timing
    setTimeout(() => {
      console.log('Payment data after state update:', paymentData);
      handleNext();
    }, 0);
  };

  const handleOrderSubmit = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Format shipping address
      const formattedAddress = `${shippingData.address}, ${shippingData.city}, ${shippingData.state} ${shippingData.zipCode}`;
      
      // Combine shipping and payment data
      const orderData = {
        details: cartItems.map(item => ({
          productId: item.id,
          productName: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        paymentMethod: paymentData.paymentMethod,
        shippingAddress: formattedAddress
      };
      
      console.log('Submitting order:', orderData);
      
      // Get user token
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.token) {
        throw new Error('You must be logged in to place an order');
      }
      
      // Create order in the system
      const response = await axios.post('http://localhost:8080/api/orders/create', orderData, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      
      console.log('Order created:', response.data);
      
      if (!response.data) {
        throw new Error('No response from server');
      }
      
      const { orderId, paymentUrl } = response.data;
      
      if (paymentData.paymentMethod === 'MOMO') {
        // For MoMo, redirect to payment gateway
        if (paymentUrl) {
          console.log('Redirecting to MoMo payment URL:', paymentUrl);
          window.location.href = paymentUrl;
        } else {
          throw new Error('Payment URL not provided for MoMo payment');
        }
      } else if (paymentData.paymentMethod === 'VNPAY') {
        // For VNPay, go to order summary page first
        console.log('Navigating to order summary for VNPay payment details');
        // Store the payment URL in case we need it later
        if (paymentUrl) {
          sessionStorage.setItem('vnpayUrl', paymentUrl);
        }
        navigate(`/order-summary?orderId=${orderId}`);
      } else if (paymentData.paymentMethod === 'BANK_TRANSFER') {
        // For bank transfer, navigate to payment result with bank transfer information
        console.log('Navigating to payment result for bank transfer');
        navigate(`/payment-result?orderId=${orderId}&method=bank_transfer`);
      } else {
        // For credit card, clear cart and go to orders page
        dispatch(clearCart());
        navigate('/orders', { 
          state: { message: 'Order placed successfully!' } 
        });
      }
      
      // Only clear cart for credit card payments
      // (we'll clear cart after bank transfer/MoMo/VNPay is confirmed)
      if (paymentData.paymentMethod === 'CREDIT_CARD') {
        dispatch(clearCart());
      }
      
    } catch (err) {
      console.error('Error creating order:', err);
      setError(err.response?.data?.message || err.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const ShippingForm = () => (
    <Formik
      initialValues={shippingData}
      validationSchema={shippingSchema}
      onSubmit={handleShippingSubmit}
    >
      {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
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
                Continue to Payment
              </Button>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );

  const PaymentForm = () => (
    <Formik
      initialValues={paymentData}
      validationSchema={paymentSchema}
      onSubmit={handlePaymentSubmit}
    >
      {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
        <Form onSubmit={handleSubmit}>
          <FormControl component="fieldset" sx={{ mb: 3 }}>
            <FormLabel component="legend">Payment Method</FormLabel>
                <RadioGroup
                  name="paymentMethod"
                  value={values.paymentMethod}
              onChange={handleChange}
                  >
                    <FormControlLabel 
                value="BANK_TRANSFER"
                      control={<Radio />} 
                label="Bank Transfer (MB Bank)"
              />
                    <FormControlLabel 
                      value="MOMO" 
                      control={<Radio />} 
                label="MoMo e-Wallet" 
              />
                    <FormControlLabel 
                value="VNPAY" 
                      control={<Radio />} 
                label="VNPay (Credit/Debit Card)" 
              />
                </RadioGroup>
              </FormControl>
          
          {values.paymentMethod === 'BANK_TRANSFER' && (
            <Box sx={{ mb: 3, p: 2, bgcolor: "#f8f9fa", borderRadius: 1 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>
                Bank Transfer Information:
              </Typography>
              <Typography variant="body2" paragraph>
                • Bank: MB Bank (Military Commercial Joint Stock Bank)
              </Typography>
              <Typography variant="body2" paragraph>
                • Account Number: 0838500046
              </Typography>
              <Typography variant="body2" paragraph>
                • Account Holder: TRUONG DINH LONG
              </Typography>
              <Typography variant="body2" paragraph>
                • Amount: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(cartTotal)}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                After completing your order, you'll be shown a QR code for easy bank transfer. Please include your order number in the transfer description.
              </Typography>
            </Box>
          )}

            {values.paymentMethod === 'CREDIT_CARD' && (
              <>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="cardName"
                    name="cardName"
                    label="Name on Card"
                    value={values.cardName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.cardName && Boolean(errors.cardName)}
                    helperText={touched.cardName && errors.cardName}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="cardNumber"
                    name="cardNumber"
                    label="Card Number"
                    value={values.cardNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.cardNumber && Boolean(errors.cardNumber)}
                    helperText={touched.cardNumber && errors.cardNumber}
                    required
                    placeholder="1234567890123456"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="expiryDate"
                    name="expiryDate"
                    label="Expiry Date"
                    placeholder="MM/YY"
                    value={values.expiryDate}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.expiryDate && Boolean(errors.expiryDate)}
                    helperText={touched.expiryDate && errors.expiryDate}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="cvv"
                    name="cvv"
                    label="CVV"
                    value={values.cvv}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.cvv && Boolean(errors.cvv)}
                    helperText={touched.cvv && errors.cvv}
                    required
                    placeholder="123"
                  />
                </Grid>
              </>
            )}

            {values.paymentMethod === 'MOMO' && (
              <Grid item xs={12}>
                <Box sx={{ p: 2, border: '1px solid #f5f5f5', borderRadius: 2, bgcolor: '#fafafa' }}>
                  <Typography variant="body1" gutterBottom>
                    You'll be redirected to MoMo to complete your payment after reviewing your order.
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Your order will be processed once payment is completed.
                  </Typography>
                </Box>
              </Grid>
            )}

            {values.paymentMethod === 'VNPAY' && (
              <Grid item xs={12}>
                <Box sx={{ p: 2, border: '1px solid #f0f0f0', borderRadius: 2, bgcolor: '#f8f8f8' }}>
                  <Typography variant="body1" fontWeight="medium" gutterBottom>
                    MB Bank Account Transfer
                  </Typography>
                  
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Account Number
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          0838500046
                        </Typography>
                      </Box>
                      
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Account Holder
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          SkinCare Shop K18
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Bank
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          MB Bank
                        </Typography>
                      </Box>
                      
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Transfer Note
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          Payment for Order {new Date().getTime()}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    You'll be redirected to VNPay to complete your bank transfer. The transfer will be sent to this MB Bank account.
                  </Typography>
                </Box>
              </Grid>
            )}

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
        </Form>
      )}
    </Formik>
  );

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
          <Typography>
            ${(item.price * item.quantity).toFixed(2)}
          </Typography>
        </Box>
      ))}
      <Divider sx={{ my: 2 }} />
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h6">Total</Typography>
        <Typography variant="h6">${cartTotal.toFixed(2)}</Typography>
      </Box>
      
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>Shipping Information</Typography>
        <Typography gutterBottom>
          {shippingData.firstName} {shippingData.lastName}
        </Typography>
        <Typography gutterBottom>
          {shippingData.address}
        </Typography>
        <Typography gutterBottom>
          {shippingData.city}, {shippingData.state} {shippingData.zipCode}
        </Typography>
        <Typography gutterBottom>
          Phone: {shippingData.phone}
        </Typography>
      </Box>
      
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>Payment Information</Typography>
        {paymentData.paymentMethod === 'CREDIT_CARD' ? (
          <>
            <Typography gutterBottom>
              Card: **** **** **** {paymentData.cardNumber.slice(-4)}
            </Typography>
            <Typography gutterBottom>
              Expiry: {paymentData.expiryDate}
            </Typography>
          </>
        ) : paymentData.paymentMethod === 'MOMO' ? (
          <Typography gutterBottom>
            Payment Method: MoMo e-Wallet
          </Typography>
        ) : (
          <>
            <Typography gutterBottom fontWeight="medium">
              Payment Method: Bank Transfer (MB Bank)
            </Typography>
            <Paper sx={{ p: 2, mt: 2, bgcolor: '#f8f8f8', borderRadius: 2 }}>
              <Typography variant="body2" color="text.secondary">Account Information</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Typography variant="body2">Bank:</Typography>
                <Typography variant="body2" fontWeight="medium">MB Bank</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Typography variant="body2">Account Number:</Typography>
                <Typography variant="body2" fontWeight="medium">0838500046</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Typography variant="body2">Account Holder:</Typography>
                <Typography variant="body2" fontWeight="medium">SkinCare Shop K18</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Typography variant="body2">Amount:</Typography>
                <Typography variant="body2" fontWeight="medium">${cartTotal.toFixed(2)}</Typography>
              </Box>
            </Paper>
          </>
        )}
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
        {loading ? <CircularProgress size={24} /> : 'Place Order'}
      </Button>
    </Box>
  );

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <ShippingForm />;
      case 1:
        return <PaymentForm />;
      case 2:
        return <OrderReview />;
      default:
        return 'Unknown step';
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
            onClick={() => navigate('/products')}
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