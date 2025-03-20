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
import PaymentIcon from '@mui/icons-material/Payment';
import { addToCart, updateQuantity, clearCart } from '../../store/slices/cartSlice';
import axios from 'axios';

const PaymentResult = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentResult, setPaymentResult] = useState(null);
  const [order, setOrder] = useState(null);
  const [confirmingTransfer, setConfirmingTransfer] = useState(false);
  const [fetchComplete, setFetchComplete] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const searchParams = new URLSearchParams(location.search);
  const user = JSON.parse(localStorage.getItem('user'));
  const isBankTransfer = searchParams.get('method') === 'bank_transfer';
  const orderId = searchParams.get('orderId');
  
  useEffect(() => {
    if (user && orderId && !fetchComplete) {
    const fetchOrder = async () => {
        setLoading(true);
        setError(null);
        
        try {
          console.log("Payment Result: Fetching order details for orderId:", orderId);
          console.log("Payment Result: User authenticated:", user ? "Yes" : "No");
          
          // Make sure we have a valid token
          const token = user.token;
          if (!token) {
            console.error("Payment Result: No authentication token available");
            setError("Authentication required. Please login to view your order.");
            setLoading(false);
            setFetchComplete(true);
            return;
          }
          
          console.log("Payment Result: Token available, proceeding with order fetch");
        
        // First, check if this is a payment callback from VNPay
        const vnp_ResponseCode = searchParams.get('vnp_ResponseCode');
        
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
                    Authorization: `Bearer ${token}`
                  }
              }
            );
            
            console.log('VNPay payment verification result:', verifyResponse.data);
            setPaymentResult(verifyResponse.data);
            
            // If payment verification was successful, fetch the order details
            if (verifyResponse.data.success) {
              const orderId = searchParams.get('orderId') || verifyResponse.data.order?.id;
              
              if (orderId) {
                  try {
                    const ordersResponse = await axios.get('http://localhost:8080/api/orders/my-orders', {
                  headers: {
                        Authorization: `Bearer ${token}`
                      }
                    });
                    
                    // Find the specific order by ID using the same improved matching logic
                    const matchingOrder = ordersResponse.data.find(order => {
                      // Convert both to strings for comparison
                      const orderIdStr = order.id.toString();
                      const searchIdStr = orderId.toString();
                      
                      // Try exact match first
                      if (orderIdStr === searchIdStr) {
                        return true;
                      }
                      
                      // If the orderId is a UUID, try to extract just the first part
                      if (searchIdStr.includes('-')) {
                        // Try different approaches to match UUIDs
                        // 1. Check if the numeric part matches
                        const numericPart = searchIdStr.split('-')[0];
                        if (orderIdStr === numericPart) {
                          return true;
                        }
                        
                        // 2. Convert hexadecimal to decimal if possible
                        try {
                          const hexValue = numericPart.replace(/^0x/, '');
                          const decimalValue = parseInt(hexValue, 16).toString();
                          if (orderIdStr === decimalValue) {
                            return true;
                          }
                        } catch (e) {
                          console.log("Couldn't convert hex to decimal:", e);
                        }
                      }
                      
                      return false;
                    });
                    
                    if (matchingOrder) {
                      setOrder(matchingOrder);
                    } else {
                      setError(`Order #${orderId} not found in your orders`);
                    }
                  } catch (error) {
                    console.error('Error fetching order details:', error);
                    setError('Failed to load order details. Please check your order history.');
                  }
                }
            }
          } catch (error) {
            console.error('Error verifying VNPay payment:', error);
            setError('Failed to verify payment. Please contact customer support.');
          }
        } else {
            // Standard order fetch for direct access or bank transfer
          if (!orderId) {
            setError('Order ID not found in URL');
            } else {
              try {
                // Get all user orders and find the matching one
                console.log("Payment Result: Fetching user orders from /api/orders/my-orders");
                console.log("Payment Result: Authorization header will use token:", token.substring(0, 10) + "...");
                
                const ordersResponse = await axios.get('http://localhost:8080/api/orders/my-orders', {
            headers: {
                    Authorization: `Bearer ${token}`
                  }
                });

                console.log('Payment Result: Fetched orders successfully:', ordersResponse.data.length, 'orders found');
                console.log('Payment Result: Looking for order ID:', orderId);
                
                // Find the specific order by ID, handling both numeric and UUID formats
                const matchingOrder = ordersResponse.data.find(order => {
                  // Convert both to strings for comparison
                  const orderIdStr = order.id.toString();
                  const searchIdStr = orderId.toString();
                  
                  // Try exact match first
                  if (orderIdStr === searchIdStr) {
                    return true;
                  }
                  
                  // If the orderId is a UUID, try to extract just the first part
                  if (searchIdStr.includes('-')) {
                    // Try different approaches to match UUIDs
                    // 1. Check if the numeric part matches
                    const numericPart = searchIdStr.split('-')[0];
                    if (orderIdStr === numericPart) {
                      return true;
                    }
                    
                    // 2. Convert hexadecimal to decimal if possible
                    try {
                      const hexValue = numericPart.replace(/^0x/, '');
                      const decimalValue = parseInt(hexValue, 16).toString();
                      if (orderIdStr === decimalValue) {
                        return true;
                      }
                    } catch (e) {
                      console.log("Couldn't convert hex to decimal:", e);
                    }
                  }
                  
                  return false;
                });

                console.log('Matching order found:', matchingOrder);
                
                if (!matchingOrder) {
                  setError(`Order #${orderId} not found in your orders. Please check your order history or contact support.`);
                } else {
                  setOrder(matchingOrder);
                  
                  // For bank transfers, create a simple payment result
                  if (isBankTransfer) {
                    setPaymentResult({
                      success: false,
                      message: 'Please complete your bank transfer to confirm the order',
                      paymentDetails: {
                        paymentMethod: 'Bank Transfer (MB Bank)',
                        bankCode: 'MBBANK',
                        transactionNo: 'Pending Transfer',
                        amount: matchingOrder.total,
                        status: 'Awaiting Payment'
                      }
                    });
                  } 
                  // For VNPay manual transfers without callback
                  else if (matchingOrder.paymentMethod === 'VNPAY' && !isVnpayCallback) {
            setPaymentResult({
              success: true,
              message: 'Your bank transfer information has been recorded',
              paymentDetails: {
                paymentMethod: 'Bank Transfer (MB Bank)',
                bankCode: 'MBBANK',
                transactionNo: 'Manual Transfer',
                        amount: matchingOrder.total,
                status: 'Pending Verification'
              }
            });
                  }
                }
              } catch (error) {
                console.error('Error fetching orders:', error);
                setError('Failed to load your orders. Please try again later.');
              }
          }
        }
        
        // Clear the cart after a successful payment result page load
        dispatch(clearCart());
        
      } catch (error) {
        console.error('Error in payment result page:', error);
        setError('Failed to load order details. Please check your order history.');
      } finally {
        setLoading(false);
          setFetchComplete(true);
      }
    };
    
      fetchOrder();
    }
  }, [user, orderId, searchParams, dispatch, isBankTransfer, fetchComplete]);

  const handleConfirmTransfer = async () => {
    if (!order || !user?.token) {
      setError("Missing order information or not logged in");
      return;
    }
    
    setConfirmingTransfer(true);
    setError(null);
    
    try {
      console.log("PaymentResult: Confirming bank transfer for order ID:", order.id);
      
      // Notify backend that customer has completed the transfer
      console.log("PaymentResult: Sending confirmation request to API");
      const response = await axios.post(
        `http://localhost:8080/api/payment/bank-transfer/confirm/${order.id}`,
        {}, // Empty body
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log("PaymentResult: Bank transfer confirmation response:", response.data);
      
      if (response.data && response.data.success) {
        console.log("PaymentResult: Bank transfer confirmation successful");
        
        // Update the order status locally
        setOrder({
          ...order,
          status: 'PENDING_PAYMENT'
        });
        
        // Update the payment result
        setPaymentResult({
          ...paymentResult,
          success: true,
          message: 'Your transfer confirmation has been sent. The order will be processed once payment is verified.',
          paymentDetails: {
            ...paymentResult.paymentDetails,
            status: 'Awaiting Verification'
          }
        });
      } else {
        console.error("PaymentResult: Bank transfer confirmation failed:", response.data);
        setError(response.data?.message || 'Failed to confirm transfer. Please contact customer support.');
      }
    } catch (error) {
      console.error('PaymentResult: Error confirming transfer:', error);
      
      // Log detailed information about the error
      let errorDetails = {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      };
      console.error('PaymentResult: Error details:', errorDetails);
      
      // Check for CORS-related errors
      if (error.message && error.message.includes('Network Error')) {
        setError(`CORS issue detected: The server can't be reached. Please try again later or contact support.`);
      } else if (error.response?.status === 401) {
        setError(`Authentication error: Your session may have expired. Please login again.`);
      } else {
        setError(`Failed to confirm transfer: ${error.message}. Please contact customer support.`);
      }
    } finally {
      setConfirmingTransfer(false);
    }
  };
  
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
  
  // Determine payment states
  const isPendingVerification = order?.status === 'PENDING_PAYMENT';
  const isAwaitingConfirmation = isBankTransfer && !isPendingVerification && !loading;
  
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <Box display="flex" flexDirection="column" alignItems="center">
          {isPendingVerification ? (
            <CheckCircleIcon sx={{ fontSize: 80, color: 'warning.main', mb: 2 }} />
          ) : isAwaitingConfirmation ? (
            <PaymentIcon sx={{ fontSize: 80, color: 'info.main', mb: 2 }} />
          ) : isSuccess ? (
            <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
          ) : (
            <CancelIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
          )}
          
          <Typography variant="h4" gutterBottom>
            {isPendingVerification ? 'Transfer Confirmed' : 
              isAwaitingConfirmation ? 'Bank Transfer Required' :
              isSuccess ? 'Payment Successful' : 'Payment Failed'}
          </Typography>
          
          <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mb: 3 }}>
            {isPendingVerification ? 
              'Your bank transfer has been confirmed. Your order will be processed once payment is verified by our team.' :
              isAwaitingConfirmation ?
              'Please complete your bank transfer using the information below, then click the confirmation button.' :
              paymentResult?.message || (isSuccess ? 
              'Your payment has been processed successfully.' : 
              'There was a problem processing your payment.')}
          </Typography>
          
          {isPendingVerification && (
            <Alert severity="info" sx={{ width: '100%', mb: 3 }}>
              Our team will verify your payment shortly. You can check the status in your order history.
            </Alert>
          )}
          
          {!isSuccess && !isPendingVerification && (
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
              <PaymentDetailItem label="Total Amount" value={`${Number(order.total).toLocaleString('vi-VN')} đ`} />
              <PaymentDetailItem label="Status" value={
                isPendingVerification ? 
                "Awaiting Payment Verification" : 
                order.status
              } />
              <PaymentDetailItem label="Shipping Address" value={order.shippingAddress} />
            </Box>
          )}
          
          {isBankTransfer && !isPendingVerification && (
            <Box sx={{ width: '100%', mt: 3, p: 2, bgcolor: '#f8f8f8', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom color="primary">
                Bank Account Information
              </Typography>
              <PaymentDetailItem label="Bank" value="MB Bank" />
              <PaymentDetailItem label="Account Number" value="0838500046" />
              <PaymentDetailItem label="Account Holder" value="TRUONG DINH LONG" />
              <PaymentDetailItem label="Transfer Amount" value={`${Number(order?.total || 0).toLocaleString('vi-VN')} đ`} />
              <PaymentDetailItem label="Reference" value={`Order ${order?.id || 'N/A'}`} />
              
              <Box sx={{ my: 3, display: 'flex', justifyContent: 'center' }}>
                <Box 
                  component="img" 
                  src="https://i.ibb.co/V3KkwKr/qr-code.jpg" 
                  alt="Bank Transfer QR Code"
                  sx={{ 
                    width: 250, 
                    height: 250, 
                    border: '1px solid #e0e0e0',
                    borderRadius: 2,
                    p: 2,
                    bgcolor: 'white' 
                  }}
                />
              </Box>
              
              <Typography variant="subtitle2" fontWeight="medium" color="primary.dark" sx={{ mb: 1 }}>
                Payment Steps:
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                1. Scan the QR code using your banking app or use the account details above
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                2. Transfer the exact amount with the order ID as reference
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                3. After completing your transfer, click the button below
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                4. Your order will be processed after payment verification
                </Typography>
              
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                onClick={handleConfirmTransfer}
                disabled={confirmingTransfer}
              >
                {confirmingTransfer ? <CircularProgress size={24} /> : 'I Have Completed the Transfer'}
              </Button>
            </Box>
          )}
          
          <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                <Button 
              variant="outlined"
                  color="primary" 
                  onClick={() => navigate('/orders')}
                >
                  View My Orders
                </Button>
                <Button 
                  variant="contained" 
                  color="primary" 
              onClick={() => navigate('/')}
                >
              Continue Shopping
                </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default PaymentResult; 