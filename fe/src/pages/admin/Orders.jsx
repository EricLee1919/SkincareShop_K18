import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
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
  Divider,
} from "@mui/material";
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  CheckCircle as VerifyIcon,
  Cancel as CancelIcon,
  Visibility as ViewIcon,
  MonetizationOn as PaymentIcon,
  AccountBalance as BankIcon,
} from "@mui/icons-material";
import AdminLayout from "../../components/layout/AdminLayout";
import OrderApi from "../../api/OrderApi";
import { format } from "date-fns";

// Constants
const VALID_ORDER_STATUSES = [
  "PAID",
  "PENDING_PAYMENT",
  "IN_PROCESS",
  "CANCEL",
];
const ROWS_PER_PAGE_OPTIONS = [5, 10, 25, 50];

const Orders = () => {
  // State declarations
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [openVerifyDialog, setOpenVerifyDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  // Refs
  const searchTimeoutRef = useRef(null);
  const renderCount = useRef(0);
  const isMounted = useRef(true);

  // Memoized values
  const user = useMemo(() => {
    try {
      const userData = localStorage.getItem("user");
      if (!userData) return null;
      return JSON.parse(userData);
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  }, []);

  // Utility functions
  const isValidOrderStatus = (status) => VALID_ORDER_STATUSES.includes(status);

  const getStatusChip = (status) => {
    const statusConfig = {
      PAID: { label: "Paid", color: "success" },
      PENDING_PAYMENT: { label: "Payment Pending", color: "warning" },
      IN_PROCESS: { label: "Processing", color: "primary" },
      CANCEL: { label: "Cancelled", color: "error" },
    };

    const config = statusConfig[status] || { label: status, color: "default" };
    return <Chip label={config.label} color={config.color} size="small" />;
  };

  const getPaymentMethodChip = (paymentMethod) => {
    if (!paymentMethod) return <Chip label="N/A" size="small" />;

    const methodConfig = {
      BANK_TRANSFER: {
        label: "Bank Transfer",
        color: "primary",
        icon: <BankIcon />,
      },
      MOMO: { label: "MoMo", color: "secondary", icon: <PaymentIcon /> },
      VNPAY: { label: "VNPay", color: "info", icon: <PaymentIcon /> },
      CREDIT_CARD: {
        label: "Credit Card",
        color: "default",
        icon: <PaymentIcon />,
      },
    };

    const config = methodConfig[paymentMethod] || {
      label: paymentMethod,
      color: "default",
    };
    return (
      <Chip
        label={config.label}
        color={config.color}
        size="small"
        icon={config.icon}
      />
    );
  };

  // API calls
  const fetchOrders = useCallback(async () => {
    if (!isMounted.current) return;

    try {
      setLoading(true);
      setError(null);

      if (!user?.token) {
        throw new Error("Authentication required");
      }

      const ordersData = await orderApi.getAllOrders(user.token);

      if (isMounted.current) {
        setOrders(ordersData || []);
        setLoading(false);
        setInitialLoadComplete(true);
      }
    } catch (error) {
      if (error.name === "CanceledError" || !isMounted.current) {
        console.log("Request canceled");
        return;
      }

      console.error("Error fetching orders:", error);
      if (isMounted.current) {
        setError(error.message || "Failed to load orders. Please try again.");
        setLoading(false);
        setInitialLoadComplete(true);
      }
    }
  }, [user]);

  // Event handlers
  const handleRefresh = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
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
    if (!selectedOrder || !isValidOrderStatus("PAID")) {
      setError("Invalid order status");
      return;
    }

    setVerifyLoading(true);

    try {
      await orderApi.updateOrderStatus(selectedOrder.id, "PAID", user.token);
      handleCloseVerifyDialog();
      setRefreshTrigger((prev) => prev + 1);
      setError(null);
    } catch (error) {
      console.error("Error verifying payment:", error);
      setError(error.message || "Failed to verify payment. Please try again.");
    } finally {
      setVerifyLoading(false);
    }
  }, [selectedOrder, user, handleCloseVerifyDialog]);

  const handleCancelOrder = useCallback(
    async (orderId) => {
      try {
        await orderApi.updateOrderStatus(orderId, "CANCEL", user.token);
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, status: "CANCEL" } : order
          )
        );
      } catch (error) {
        console.error("Error cancelling order:", error);
        setError(error.message || "Failed to cancel order. Please try again.");
      }
    },
    [user]
  );

  // Effects
  useEffect(() => {
    renderCount.current += 1;
    console.log(`Orders component rendered: ${renderCount.current} times`);
  });

  useEffect(() => {
    if (initialLoadComplete && refreshTrigger === 0) return;

    fetchOrders();

    return () => {
      isMounted.current = false;
    };
  }, [fetchOrders, refreshTrigger, initialLoadComplete]);

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm]);

  useEffect(() => {
    if (error?.includes("Authentication required") || error?.includes("401")) {
      console.error("Authentication error:", error);
      // Handle authentication error - maybe redirect to login
    }
  }, [error]);

  // Filtering and pagination
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        debouncedSearchTerm === "" ||
        order.id.toString().includes(debouncedSearchTerm) ||
        (order.account?.username &&
          order.account.username
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase())) ||
        (order.shippingAddress &&
          order.shippingAddress
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase()));

      const matchesFilter =
        filter === "all" ||
        (filter === "pending" && order.status === "PENDING_PAYMENT") ||
        (filter === "paid" && order.status === "PAID") ||
        (filter === "processing" && order.status === "IN_PROCESS") ||
        (filter === "cancelled" && order.status === "CANCEL");

      return matchesSearch && matchesFilter;
    });
  }, [orders, debouncedSearchTerm, filter]);

  const paginatedOrders = useMemo(() => {
    return filteredOrders.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [filteredOrders, page, rowsPerPage]);

  // Loading state
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
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="60vh"
        >
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
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box
        mb={3}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
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
            variant={filter === "all" ? "contained" : "outlined"}
            onClick={() => setFilter("all")}
            size="small"
            sx={{ ml: 1 }}
          >
            All
          </Button>
          <Button
            variant={filter === "pending" ? "contained" : "outlined"}
            onClick={() => setFilter("pending")}
            size="small"
            color="warning"
            sx={{ ml: 1 }}
          >
            Pending Payments
          </Button>
          <Button
            variant={filter === "paid" ? "contained" : "outlined"}
            onClick={() => setFilter("paid")}
            size="small"
            color="success"
            sx={{ ml: 1 }}
          >
            Paid
          </Button>
          <Button
            variant={filter === "processing" ? "contained" : "outlined"}
            onClick={() => setFilter("processing")}
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
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No Orders Found
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            There are no orders in the database yet. Orders will appear here
            after customers make purchases.
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
        <Paper sx={{ width: "100%", borderRadius: 2, overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: "calc(100vh - 300px)" }}>
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
                        bgcolor:
                          order.status === "PENDING_PAYMENT"
                            ? "rgba(255, 152, 0, 0.08)"
                            : "inherit",
                      }}
                    >
                      <TableCell>{order.id}</TableCell>
                      <TableCell>{order.account?.username || "N/A"}</TableCell>
                      <TableCell>
                        {order.createdDate
                          ? (() => {
                              try {
                                return format(
                                  new Date(order.createdDate),
                                  "dd/MM/yyyy HH:mm"
                                );
                              } catch (error) {
                                console.error("Invalid date format:", error);
                                return "Invalid date";
                              }
                            })()
                          : "N/A"}
                      </TableCell>
                      <TableCell
                        sx={{
                          maxWidth: 200,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {order.shippingAddress || "N/A"}
                      </TableCell>
                      <TableCell>
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(order.total)}
                      </TableCell>
                      <TableCell>
                        {getPaymentMethodChip(order.paymentMethod)}
                      </TableCell>
                      <TableCell>{getStatusChip(order.status)}</TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          {order.status === "PENDING_PAYMENT" &&
                            order.paymentMethod === "BANK_TRANSFER" && (
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

                          {(order.status === "IN_PROCESS" ||
                            order.status === "PENDING_PAYMENT") && (
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
                      <Button
                        onClick={() => {
                          setSearchTerm("");
                          setFilter("all");
                        }}
                        variant="outlined"
                        size="small"
                        sx={{ mt: 1 }}
                      >
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
        <DialogTitle>Verify Bank Transfer Payment</DialogTitle>
        <DialogContent>
          <DialogContentText paragraph>
            Please confirm that you have verified the bank transfer for this
            order:
          </DialogContentText>

          {selectedOrder && (
            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Order #{selectedOrder.id}
              </Typography>
              <Divider sx={{ my: 1 }} />

              <Box sx={{ mt: 2 }}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2" color="text.secondary">
                    Customer:
                  </Typography>
                  <Typography variant="body2">
                    {selectedOrder.account?.username || "N/A"}
                  </Typography>
                </Box>

                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2" color="text.secondary">
                    Amount:
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(selectedOrder.total)}
                  </Typography>
                </Box>

                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2" color="text.secondary">
                    Payment Method:
                  </Typography>
                  <Typography variant="body2">
                    {getPaymentMethodChip(selectedOrder.paymentMethod)}
                  </Typography>
                </Box>

                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2" color="text.secondary">
                    Status:
                  </Typography>
                  <Typography variant="body2">
                    {getStatusChip(selectedOrder.status)}
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" gutterBottom>
                  Bank Account Details
                </Typography>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2" color="text.secondary">
                    Bank:
                  </Typography>
                  <Typography variant="body2">MB Bank</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2" color="text.secondary">
                    Account Number:
                  </Typography>
                  <Typography variant="body2">0838500046</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    Account Holder:
                  </Typography>
                  <Typography variant="body2">SkinCare Shop K18</Typography>
                </Box>
              </Box>
            </Paper>
          )}

          <Alert severity="warning" sx={{ mb: 2 }}>
            Please verify in your bank account that you've received the exact
            payment amount before confirming.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseVerifyDialog}>Cancel</Button>
          <Button
            onClick={handleVerifyPayment}
            variant="contained"
            color="success"
            disabled={verifyLoading}
            startIcon={
              verifyLoading ? <CircularProgress size={20} /> : <VerifyIcon />
            }
          >
            Confirm Payment
          </Button>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
};

export default Orders;
