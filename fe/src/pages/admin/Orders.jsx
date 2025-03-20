import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { 
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  Alert,
  Divider
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  CheckCircle as VerifyIcon,
  Cancel as CancelIcon,
  Visibility as ViewIcon,
  MonetizationOn as PaymentIcon,
  AccountBalance as BankIcon
} from '@mui/icons-material';
import AdminLayout from '../../components/layout/AdminLayout';
import axios from 'axios';
import { format } from 'date-fns';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [openVerifyDialog, setOpenVerifyDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const searchTimeoutRef = useRef(null);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  
  // Debug render count
  const renderCount = useRef(0);
  
  // Track component renders
  useEffect(() => {
    renderCount.current += 1;
    console.log(`Orders component rendered: ${renderCount.current} times`);
  });

  // Parse user from localStorage only once
  const user = useMemo(() => {
    try {
      const userData = localStorage.getItem('user');
      if (!userData) return null;
      return JSON.parse(userData);
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }, []); // Empty dependency array = only run once
  
  console.log('Admin Orders - Current user:', user);

  // This useEffect is only for the initial load and manual refreshes
  useEffect(() => {
    if (initialLoadComplete && refreshTrigger === 0) {
      return; // Skip if we've already loaded data once and not manually refreshing
    }
    
    let isMounted = true;
    const controller = new AbortController();
    
    const fetchOrders = async () => {
      try {
        if (!isMounted) return;
        
        setLoading(true);
        setError(null);
        
        console.log('Fetching orders with token:', user?.token);
        
        // Use signal for proper request cancellation
        const response = await axios.get('http://localhost:8080/api/orders', {
          headers: {
            Authorization: `Bearer ${user?.token}`
          },
          signal: controller.signal
        });
        
        console.log('Orders API response:', response.data);
        
        if (isMounted) {
          setOrders(response.data || []);
          setLoading(false);
          setInitialLoadComplete(true); // Mark that we've loaded data at least once
        }
      } catch (error) {
        if (error.name === 'CanceledError' || !isMounted) {
          // Request was canceled, do nothing
          console.log('Request canceled');
          return;
        }
        
        console.error('Error fetching orders:', error);
        if (isMounted) {
          setError('Failed to load orders. Please try again.');
          setLoading(false);
          setInitialLoadComplete(true); // Mark as complete even on error to prevent loops
        }
      }
    };
    
    if (user?.token) {
      console.log('Calling fetchOrders with refreshTrigger:', refreshTrigger);
      fetchOrders();
    } else {
      console.error('No user token found');
      setError('Authentication error. Please log in again.');
      setLoading(false);
      setInitialLoadComplete(true); // Mark as complete even with no token
    }
    
    // Clean up function
    return () => {
      console.log('Cleaning up orders fetch');
      isMounted = false;
      controller.abort();
    };
  }, [user, refreshTrigger, initialLoadComplete]); // Added initialLoadComplete to dependencies
  
  // Use debounced search term to prevent too many re-renders
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms delay

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm]);

  const handleRefresh = useCallback(() => {
    console.log('Manual refresh triggered');
    setRefreshTrigger(prev => prev + 1);
  }, []);

  const handleChangePage = useCallback((event, newPage) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);
  
  const handleSearchChange = useCallback((event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  }, []);
  
  const handleOpenVerifyDialog = useCallback((order) => {
    setSelectedOrder(order);
    setOpenVerifyDialog(true);
  }, []);
  
  const handleCloseVerifyDialog = useCallback(() => {
    setOpenVerifyDialog(false);
  }, []);
  
  const handleVerifyPayment = useCallback(async () => {
    if (!selectedOrder) return;
    
    setVerifyLoading(true);
    
    try {
      // Update order status to PAID
      await axios.patch(
        `http://localhost:8080/api/orders/${selectedOrder.id}?status=PAID`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user?.token}`
          }
        }
      );
      
      // Close dialog first to prevent state updates while unmounting
      handleCloseVerifyDialog();
      
      // Then trigger a single refresh of the orders
      setRefreshTrigger(prev => prev + 1);
      
      // Clear any previous errors
      setError(null);
    } catch (error) {
      console.error('Error verifying payment:', error);
      setError('Failed to verify payment. Please try again.');
    } finally {
      setVerifyLoading(false);
    }
  }, [selectedOrder, user, handleCloseVerifyDialog]);
  
  const handleCancelOrder = useCallback(async (orderId) => {
    try {
      await axios.patch(
        `http://localhost:8080/api/orders/${orderId}?status=CANCEL`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user?.token}`
          }
        }
      );
      
      // Update the order in the local state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, status: 'CANCEL' } : order
        )
      );
      
      // Show success message or notification here if needed
    } catch (error) {
      console.error('Error cancelling order:', error);
      setError('Failed to cancel order. Please try again.');
    }
  }, [user]);
  
  const getStatusChip = (status) => {
    switch(status) {
      case 'PAID':
        return <Chip label="Paid" color="success" size="small" />;
      case 'PENDING_PAYMENT':
        return <Chip label="Payment Pending" color="warning" size="small" />;
      case 'IN_PROCESS':
        return <Chip label="Processing" color="primary" size="small" />;
      case 'CANCEL':
        return <Chip label="Cancelled" color="error" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };
  
  const getPaymentMethodChip = (paymentMethod) => {
    if (!paymentMethod) {
      return <Chip label="N/A" size="small" />;
    }
    
    switch(paymentMethod) {
      case 'BANK_TRANSFER':
        return <Chip 
          label="Bank Transfer" 
          color="primary" 
          size="small" 
          icon={<BankIcon />}
        />;
      case 'MOMO':
        return <Chip 
          label="MoMo" 
          color="secondary" 
          size="small" 
          icon={<PaymentIcon />}
        />;
      case 'VNPAY':
        return <Chip 
          label="VNPay" 
          color="info" 
          size="small" 
          icon={<PaymentIcon />}
        />;
      case 'CREDIT_CARD':
        return <Chip 
          label="Credit Card" 
          color="default" 
          size="small" 
          icon={<PaymentIcon />}
        />;
      default:
        return <Chip label={paymentMethod || 'N/A'} size="small" />;
    }
  };
  
  const filteredOrders = orders.filter(order => {
    // Apply search term filter
    const matchesSearch = 
      debouncedSearchTerm === '' || 
      order.id.toString().includes(debouncedSearchTerm) ||
      (order.account?.username && order.account.username.toLowerCase().includes(debouncedSearchTerm.toLowerCase())) ||
      (order.shippingAddress && order.shippingAddress.toLowerCase().includes(debouncedSearchTerm.toLowerCase()));
    
    // Apply status filter
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'pending' && order.status === 'PENDING_PAYMENT') ||
      (filter === 'paid' && order.status === 'PAID') ||
      (filter === 'processing' && order.status === 'IN_PROCESS') ||
      (filter === 'cancelled' && order.status === 'CANCEL');
    
    return matchesSearch && matchesFilter;
  });
  
  const paginatedOrders = filteredOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  
  // Ensure we have data to display
  const hasOrders = Array.isArray(orders) && orders.length > 0;
  const hasFilteredOrders = filteredOrders.length > 0;
  
  if (loading) {
    return (
      <AdminLayout>
        <Box mb={4}>
          <Typography variant="h4" gutterBottom>
            Order Management
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Loading orders...
          </Typography>
        </Box>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>
          Order Management
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          View and manage customer orders
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Render count: {renderCount.current}
        </Typography>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
      )}
      
      <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
        <TextField
          placeholder="Search orders..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
          sx={{ width: 250 }}
        />
        
        <Box>
          <Button 
            variant={filter === 'all' ? 'contained' : 'outlined'} 
            onClick={() => setFilter('all')}
            size="small"
            sx={{ ml: 1 }}
          >
            All
          </Button>
          <Button 
            variant={filter === 'pending' ? 'contained' : 'outlined'} 
            onClick={() => setFilter('pending')}
            size="small"
            color="warning"
            sx={{ ml: 1 }}
          >
            Pending Payments
          </Button>
          <Button 
            variant={filter === 'paid' ? 'contained' : 'outlined'} 
            onClick={() => setFilter('paid')}
            size="small"
            color="success"
            sx={{ ml: 1 }}
          >
            Paid
          </Button>
          <Button 
            variant={filter === 'processing' ? 'contained' : 'outlined'} 
            onClick={() => setFilter('processing')}
            size="small"
            color="primary"
            sx={{ ml: 1 }}
          >
            Processing
          </Button>
          <Tooltip title="Refresh orders">
            <IconButton onClick={handleRefresh} size="small" sx={{ ml: 1 }}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      
      {!hasOrders ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No Orders Found
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            There are no orders in the database yet. Orders will appear here after customers make purchases.
          </Typography>
          <Button 
            startIcon={<RefreshIcon />}
            variant="contained"
            onClick={handleRefresh}
          >
            Refresh
          </Button>
        </Paper>
      ) : (
        <Paper sx={{ width: '100%', borderRadius: 2, overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 'calc(100vh - 300px)' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Shipping Address</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Payment Method</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {hasFilteredOrders ? (
                  paginatedOrders.map((order) => (
                    <TableRow 
                      key={order.id}
                      hover
                      sx={{
                        bgcolor: order.status === 'PENDING_PAYMENT' ? 'rgba(255, 152, 0, 0.08)' : 'inherit'
                      }}
                    >
                      <TableCell>{order.id}</TableCell>
                      <TableCell>{order.account?.username || 'N/A'}</TableCell>
                      <TableCell>
                        {order.createdDate ? (
                          (() => {
                            try {
                              return format(new Date(order.createdDate), 'dd/MM/yyyy HH:mm');
                            } catch (error) {
                              console.error('Invalid date format:', error);
                              return 'Invalid date';
                            }
                          })()
                        ) : (
                          'N/A'
                        )}
                      </TableCell>
                      <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {order.shippingAddress || 'N/A'}
                      </TableCell>
                      <TableCell>
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total)}
                      </TableCell>
                      <TableCell>
                        {getPaymentMethodChip(order.paymentMethod)}
                      </TableCell>
                      <TableCell>
                        {getStatusChip(order.status)}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {order.status === 'PENDING_PAYMENT' && order.paymentMethod === 'BANK_TRANSFER' && (
                            <Tooltip title="Verify Bank Transfer">
                              <IconButton 
                                size="small" 
                                color="success"
                                onClick={() => handleOpenVerifyDialog(order)}
                              >
                                <VerifyIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                          
                          {(order.status === 'IN_PROCESS' || order.status === 'PENDING_PAYMENT') && (
                            <Tooltip title="Cancel Order">
                              <IconButton 
                                size="small" 
                                color="error"
                                onClick={() => handleCancelOrder(order.id)}
                              >
                                <CancelIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                          
                          <Tooltip title="View Order Details">
                            <IconButton size="small">
                              <ViewIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <Typography variant="body1" sx={{ py: 3 }}>
                        No orders match your search criteria
                      </Typography>
                      <Button onClick={() => {
                        setSearchTerm('');
                        setFilter('all');
                      }} variant="outlined" size="small" sx={{ mt: 1 }}>
                        Clear Filters
                      </Button>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          {hasFilteredOrders && (
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={filteredOrders.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          )}
        </Paper>
      )}
      
      {/* Payment Verification Dialog */}
      <Dialog
        open={openVerifyDialog}
        onClose={handleCloseVerifyDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Verify Bank Transfer Payment
        </DialogTitle>
        <DialogContent>
          <DialogContentText paragraph>
            Please confirm that you have verified the bank transfer for this order:
          </DialogContentText>
          
          {selectedOrder && (
            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>Order #{selectedOrder.id}</Typography>
              <Divider sx={{ my: 1 }} />
              
              <Box sx={{ mt: 2 }}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2" color="text.secondary">Customer:</Typography>
                  <Typography variant="body2">{selectedOrder.account?.username || 'N/A'}</Typography>
                </Box>
                
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2" color="text.secondary">Amount:</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedOrder.total)}
                  </Typography>
                </Box>
                
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2" color="text.secondary">Payment Method:</Typography>
                  <Typography variant="body2">{getPaymentMethodChip(selectedOrder.paymentMethod)}</Typography>
                </Box>
                
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2" color="text.secondary">Status:</Typography>
                  <Typography variant="body2">{getStatusChip(selectedOrder.status)}</Typography>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="subtitle2" gutterBottom>Bank Account Details</Typography>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2" color="text.secondary">Bank:</Typography>
                  <Typography variant="body2">MB Bank</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2" color="text.secondary">Account Number:</Typography>
                  <Typography variant="body2">0838500046</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">Account Holder:</Typography>
                  <Typography variant="body2">SkinCare Shop K18</Typography>
                </Box>
              </Box>
            </Paper>
          )}
          
          <Alert severity="warning" sx={{ mb: 2 }}>
            Please verify in your bank account that you've received the exact payment amount before confirming.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseVerifyDialog}>Cancel</Button>
          <Button 
            onClick={handleVerifyPayment}
            variant="contained" 
            color="success"
            disabled={verifyLoading}
            startIcon={verifyLoading ? <CircularProgress size={20} /> : <VerifyIcon />}
          >
            Confirm Payment
          </Button>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
};

export default Orders; 