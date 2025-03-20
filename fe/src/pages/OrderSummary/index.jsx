import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Paper, Grid, Divider, Button, Alert, CircularProgress } from '@mui/material';
import { useSelector } from 'react-redux';
import axios from 'axios';
import PaymentIcon from '@mui/icons-material/Payment';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import ReceiptIcon from '@mui/icons-material/Receipt';

const OrderSummary = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
  // Get order ID from URL params
  const orderId = new URLSearchParams(location.search).get('orderId');
  
  // Handle proceeding with VNPay payment
  const handleProceedToPayment = () => {
    // Get the stored VNPay URL from sessionStorage
    const vnpayUrl = sessionStorage.getItem('vnpayUrl');
    
    if (vnpayUrl) {
      console.log('Proceeding to VNPay payment page:', vnpayUrl);
      window.location.href = vnpayUrl;
    } else {
      setError('Payment URL not found. Please try again or contact support.');
    }
  };
  
  useEffect(() => {
    if (!orderId) {
      setError('Order ID not found');
      setLoading(false);
      return;
    }
    
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });
        setOrder(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Failed to load order details. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchOrder();
  }, [orderId, user]);
  
  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" mt={2}>Loading order details...</Typography>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button 
          variant="contained" 
          color="primary" 
          sx={{ mt: 2 }}
          onClick={() => navigate('/')}
        >
          Return to Home
        </Button>
      </Container>
    );
  }
  
  if (!order) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning">Order not found.</Alert>
        <Button 
          variant="contained" 
          color="primary" 
          sx={{ mt: 2 }}
          onClick={() => navigate('/')}
        >
          Return to Home
        </Button>
      </Container>
    );
  }
  
  const displayPaymentInstructions = order.paymentMethod === 'VNPAY' && order.status !== 'PAID';
  
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <AssignmentTurnedInIcon color="primary" sx={{ fontSize: 30, mr: 2 }} />
          <Typography variant="h4" component="h1">
            Order Summary
          </Typography>
        </Box>
        
        <Alert severity="success" sx={{ mb: 3 }}>
          Your order has been successfully placed! Order ID: #{order.id}
        </Alert>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Order Details
            </Typography>
            <Typography variant="body1">Order Date: {new Date(order.orderDate).toLocaleString()}</Typography>
            <Typography variant="body1">Status: <strong>{order.status}</strong></Typography>
            <Typography variant="body1">
              Payment Method: {order.paymentMethod === 'VNPAY' ? 'Bank Transfer (MB Bank)' : 'MoMo'}
            </Typography>
            <Typography variant="body1">Total Amount: ${order.total?.toFixed(2)}</Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Shipping Address
            </Typography>
            <Typography variant="body1">{user?.fullName}</Typography>
            <Typography variant="body1">{user?.email}</Typography>
            <Typography variant="body1">{user?.phone || 'No phone provided'}</Typography>
            <Typography variant="body1">{user?.address || 'No address provided'}</Typography>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 3 }} />
        
        <Typography variant="h6" gutterBottom>
          Order Items
        </Typography>
        
        {order.details?.map((item, index) => (
          <Box key={index} sx={{ py: 1 }}>
            <Grid container alignItems="center">
              <Grid item xs={7}>
                <Typography variant="body1">
                  {item.productName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Quantity: {item.quantity}
                </Typography>
              </Grid>
              <Grid item xs={5} sx={{ textAlign: 'right' }}>
                <Typography variant="body1">
                  ${(item.price * item.quantity).toFixed(2)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ${item.price.toFixed(2)} each
                </Typography>
              </Grid>
            </Grid>
            {index < order.details.length - 1 && <Divider sx={{ my: 1 }} />}
          </Box>
        ))}
        
        <Box sx={{ mt: 2, bgcolor: '#f5f5f5', p: 2, borderRadius: 1 }}>
          <Grid container>
            <Grid item xs={6}>
              <Typography variant="body1">Subtotal:</Typography>
              {/* Add tax or shipping if applicable */}
            </Grid>
            <Grid item xs={6} sx={{ textAlign: 'right' }}>
              <Typography variant="body1">${order.total?.toFixed(2)}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1"><strong>Total:</strong></Typography>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: 'right' }}>
              <Typography variant="body1"><strong>${order.total?.toFixed(2)}</strong></Typography>
            </Grid>
          </Grid>
        </Box>
      </Paper>
      
      {displayPaymentInstructions && (
        <Paper elevation={3} sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <PaymentIcon color="primary" sx={{ fontSize: 30, mr: 2 }} />
            <Typography variant="h5" component="h2">
              Payment Instructions
            </Typography>
          </Box>
          
          <Alert severity="info" sx={{ mb: 3 }}>
            Please complete your bank transfer to finalize your order.
          </Alert>
          
          <Box sx={{ p: 2, bgcolor: '#f8f8f8', borderRadius: 1, border: '1px solid #e0e0e0' }}>
            <Typography variant="h6" gutterBottom>Bank Transfer Details</Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">Bank:</Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body1"><strong>MB Bank</strong></Typography>
              </Grid>
              
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">Account Number:</Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body1"><strong>0838500046</strong></Typography>
              </Grid>
              
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">Account Holder:</Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body1"><strong>SkinCare Shop K18</strong></Typography>
              </Grid>
              
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">Amount:</Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body1"><strong>${order.total?.toFixed(2)}</strong></Typography>
              </Grid>
              
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">Reference:</Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body1"><strong>Order #{order.id}</strong></Typography>
              </Grid>
            </Grid>
          </Box>
          
          <Alert severity="warning" sx={{ mt: 3 }}>
            Please include your order number in the transfer reference to help us match your payment.
          </Alert>
          
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Button 
              variant="outlined" 
              startIcon={<ReceiptIcon />}
              onClick={() => window.print()}
            >
              Print Instructions
            </Button>
            <Box>
              <Button 
                variant="outlined"
                color="secondary"
                onClick={() => navigate('/payment-result?orderId=' + order.id)}
                sx={{ mr: 2 }}
              >
                I've Made A Manual Transfer
              </Button>
              <Button 
                variant="contained" 
                color="primary"
                onClick={handleProceedToPayment}
              >
                Proceed to Payment Portal
              </Button>
            </Box>
          </Box>
        </Paper>
      )}
      
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="outlined" onClick={() => navigate('/')}>
          Continue Shopping
        </Button>
        <Button variant="contained" onClick={() => navigate('/orders')}>
          View All Orders
        </Button>
      </Box>
    </Container>
  );
};

export default OrderSummary; 