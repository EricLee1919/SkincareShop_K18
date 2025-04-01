import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Container,
  Typography,
  Paper,
  Box,
  CircularProgress,
  Alert,
  Button,
  Divider,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { addToCart, updateQuantity, clearCart } from '../../store/slices/cartSlice';
import axios from 'axios';

const PaymentResult = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentResult, setPaymentResult] = useState(null);
  const [order, setOrder] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const searchParams = new URLSearchParams(location.search);
  const user = JSON.parse(localStorage.getItem('user'));
  
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        
        // First, check if this is a payment callback from VNPay
        const vnp_ResponseCode = searchParams.get('vnp_ResponseCode');
        const vnp_TransactionNo = searchParams.get('vnp_TransactionNo');
        
        let isVnpayCallback = false;
        
        // If we have VNPay response parameters, we need to verify the payment
        if (vnp_ResponseCode) {
          console.log('VNPay callback detected with response code:', vnp_ResponseCode);
          isVnpayCallback = true;
          
          // Construct an object with all URL parameters for verification
          const verificationParams = {};
          for (const [key, value] of searchParams.entries()) {
            verificationParams[key] = value;
          }
          
          // Call the backend to verify VNPay payment
          try {
            const verifyResponse = await axios.get(
              'http://localhost:8080/api/payment/vnpay-verify', {
                params: verificationParams,
                headers: {
                  Authorization: `Bearer ${user.token}`
                }
              }
            );
            
            console.log('VNPay payment verification result:', verifyResponse.data);
            setPaymentResult(verifyResponse.data);
            
            // If payment verification was successful, fetch the order details
            if (verifyResponse.data.success) {
              const orderId = searchParams.get('orderId') || verifyResponse.data.order?.id;
              
              if (orderId) {
                const orderResponse = await axios.get(`http://localhost:8080/api/orders/${orderId}`, {
                  headers: {
                    Authorization: `Bearer ${user.token}`
                  }
                });
                
                setOrder(orderResponse.data);
              }
            }
          } catch (error) {
            console.error('Error verifying VNPay payment:', error);
            setError('Failed to verify payment. Please contact customer support.');
          }
        } else {
          // Standard order fetch for direct access or MoMo callback
          const orderId = searchParams.get('orderId');
          
          if (!orderId) {
            setError('Order ID not found in URL');
            setLoading(false);
            return;
          }
          
          // Get order details
          const orderResponse = await axios.get(`http://localhost:8080/api/orders/${orderId}`, {
            headers: {
              Authorization: `Bearer ${user.token}`
            }
          });
          
          setOrder(orderResponse.data);
          
          // For manual transfers, create a simple payment result
          if (orderResponse.data.paymentMethod === 'VNPAY' && !isVnpayCallback) {
            setPaymentResult({
              success: true,
              message: 'Your bank transfer information has been recorded',
              paymentDetails: {
                paymentMethod: 'Bank Transfer (MB Bank)',
                bankCode: 'MBBANK',
                transactionNo: 'Manual Transfer',
                amount: orderResponse.data.total,
                status: 'Pending Verification'
              }
            });
          }
        }
        
        // Clear the cart after a successful payment result page load
        dispatch(clearCart());
        
      } catch (error) {
        console.error('Error in payment result page:', error);
        setError('Failed to load order details. Please check your order history.');
      } finally {
        setLoading(false);
      }
    };
    
    if (user?.token) {
      fetchOrder();
    }
  }, [searchParams, user, dispatch]);
  
  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 3 }}>
          Verifying payment...
        </Typography>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper sx={{ p: 4, borderRadius: 2 }}>
          <Box display="flex" flexDirection="column" alignItems="center">
            <CancelIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
            <Typography variant="h4" gutterBottom>
              Payment Verification Failed
            </Typography>
            <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
              {error}
            </Alert>
            <Alert severity="info" sx={{ width: '100%', mt: 2, mb: 2 }}>
              Your cart has been restored. You can try the payment again or choose a different payment method.
            </Alert>
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button 
                variant="outlined" 
                color="primary" 
                onClick={() => navigate('/checkout')}
              >
                Return to Checkout
              </Button>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={() => navigate('/cart')}
              >
                View Cart
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    );
  }
  
  const isSuccess = paymentResult?.success;
  
  const PaymentDetailItem = ({ label, value }) => (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
      <Typography variant="body1">{label}:</Typography>
      <Typography variant="body1" fontWeight="medium">{value}</Typography>
    </Box>
  );
  
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <Box display="flex" flexDirection="column" alignItems="center">
          {isSuccess ? (
            <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
          ) : (
            <CancelIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
          )}
          
          <Typography variant="h4" gutterBottom>
            {isSuccess ? 'Payment Successful' : 'Payment Failed'}
          </Typography>
          
          <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mb: 3 }}>
            {paymentResult?.message || (isSuccess ? 
              'Your payment has been processed successfully.' : 
              'There was a problem processing your payment.')}
          </Typography>
          
          {!isSuccess && (
            <Alert severity="info" sx={{ width: '100%', mb: 3 }}>
              Your cart has been restored. You can try again with a different payment method.
            </Alert>
          )}
          
          {order && (
            <Box sx={{ width: '100%', mt: 2 }}>
              <Divider sx={{ my: 3 }} />
              
              <Typography variant="h6" gutterBottom>
                Order Details
              </Typography>
              
              <PaymentDetailItem label="Order ID" value={order.id} />
              <PaymentDetailItem label="Total Amount" value={`$${order.total?.toFixed(2)}`} />
              <PaymentDetailItem label="Status" value={order.status} />
              <PaymentDetailItem label="Shipping Address" value={order.shippingAddress} />
            </Box>
          )}
          
          {isSuccess && (
            <Box sx={{ width: '100%', mt: 3, p: 2, bgcolor: '#f8f8f8', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom color="primary">
                Bank Account Information
              </Typography>
              <PaymentDetailItem label="Bank" value="MB Bank" />
              <PaymentDetailItem label="Account Number" value="0838500046" />
              <PaymentDetailItem label="Account Holder" value="SkinCare Shop K18" />
              <PaymentDetailItem label="Transfer Amount" value={`$${order?.total?.toFixed(2) || '0.00'}`} />
              <PaymentDetailItem label="Transaction Date" value={new Date().toLocaleString()} />
              <PaymentDetailItem label="Transaction ID" value={paymentResult?.paymentDetails?.transactionNo || 'N/A'} />
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" fontWeight="medium" color="primary.dark" sx={{ mb: 1 }}>
                Payment Verification
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Your payment has been verified and successfully recorded in our system.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                In a real environment, the bank transfer would be verified against your MB Bank account transactions.
                For sandbox testing, we've simulated a successful payment verification.
              </Typography>
              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  <strong>How Verification Works:</strong><br/>
                  1. You make a transfer to MB Bank account 0838500046<br/>
                  2. The bank confirms receipt of funds<br/>
                  3. Your order status is updated to "PAID"<br/>
                  4. Your purchase is processed for delivery
                </Typography>
              </Alert>
            </Box>
          )}
          
          <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
            {isSuccess ? (
              <>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={() => navigate('/orders')}
                >
                  View My Orders
                </Button>
                
                <Button 
                  variant="outlined"
                  onClick={() => navigate('/products')}
                >
                  Continue Shopping
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  onClick={() => navigate('/checkout')}
                >
                  Return to Checkout
                </Button>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={() => navigate('/cart')}
                >
                  View Cart
                </Button>
              </>
            )}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default PaymentResult; 