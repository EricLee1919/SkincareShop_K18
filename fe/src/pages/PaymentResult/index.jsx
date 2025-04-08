import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Paper,
  Box,
  CircularProgress,
  Alert,
  Button,
  Divider,
  Avatar,
  Grid,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import axios from "axios";
import convertCurrency from "../../utils/currency";

const PaymentResult = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchOrderDetails = async () => {
      const orderId = searchParams.get("orderId");
      if (!orderId) {
        setError("Order ID is missing.");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`http://localhost:8080/api/order/${orderId}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setOrder(res.data);
      } catch (err) {
        setError("Failed to fetch order details.");
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) {
      fetchOrderDetails();
    }
  }, []);

  const isPaid = order?.status === "PAID";

  const PaymentDetailItem = ({ label, value }) => (
    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
      <Typography variant="body2" color="text.secondary">
        {label}:
      </Typography>
      <Typography variant="body2" fontWeight="medium">
        {value || "N/A"}
      </Typography>
    </Box>
  );

  const OrderProductItem = ({ item }) => {
    const { product, quantity, price } = item;
    return (
      <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }} variant="outlined">
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <Avatar
              src={product.image}
              alt={product.name}
              variant="rounded"
              sx={{ width: 80, height: 80 }}
            />
          </Grid>
          <Grid item xs={9}>
            <Typography fontWeight="bold">{product.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              Category: {product.category.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Suitable For: {product.suitableTypes.join(", ")}
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
              <Typography>Quantity: {quantity}</Typography>
              <Typography>Price: {convertCurrency(price)}</Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    );
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 3 }}>
            Loading payment result...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error || !order) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper sx={{ p: 4, borderRadius: 2 }}>
          <Box display="flex" flexDirection="column">
            <CancelIcon sx={{ fontSize: 80, color: "error.main", mb: 2 }} />
            <Typography variant="h4" gutterBottom>
              Payment Failed
            </Typography>
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
            <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
              <Button variant="outlined" onClick={() => navigate("/checkout")}>
                Return to Checkout
              </Button>
              <Button variant="contained" onClick={() => navigate("/cart")}>
                View Cart
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper sx={{ p: 4, borderRadius: 3 }}>
        {/* Status header */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
          {isPaid ? (
            <CheckCircleIcon sx={{ fontSize: 48, color: "success.main" }} />
          ) : (
            <CancelIcon sx={{ fontSize: 48, color: "error.main" }} />
          )}
          <Box>
            <Typography variant="h5">
              {isPaid ? "Payment Verification Success" : "Payment Failed"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {isPaid
                ? "Your payment has been verified successfully."
                : "We couldn't verify your payment. Please try again."}
            </Typography>
          </Box>
        </Box>

        {/* Order Info */}
        <Typography variant="h6" gutterBottom>Order Info</Typography>
        <Box sx={{ pl: 1, mb: 3 }}>
          <PaymentDetailItem label="Order ID" value={order.id} />
          <PaymentDetailItem label="Status" value={order.status} />
          <PaymentDetailItem label="Total Amount" value={convertCurrency(order.total)} />
          <PaymentDetailItem
            label="Created At"
            value={
              order.createAt ? new Date(order.createAt).toLocaleString() : "N/A"
            }
          />
        </Box>

        {/* Customer Info */}
        <Typography variant="h6" gutterBottom>Customer Info</Typography>
        <Box sx={{ pl: 1, mb: 3 }}>
          <PaymentDetailItem label="Name" value={order.account?.fullName} />
          <PaymentDetailItem label="Email" value={order.account?.email} />
          <PaymentDetailItem label="Phone" value={order.shippingPhone || order.account?.phone} />
          <PaymentDetailItem label="Address" value={order.shippingAddress || order.account?.address} />
        </Box>

        {/* Order Items */}
        <Typography variant="h6" gutterBottom>Order Items</Typography>
        <Box sx={{ mb: 3 }}>
          {order.orderDetails?.map((item) => (
            <OrderProductItem key={item.id} item={item} />
          ))}
        </Box>

        {/* Action buttons */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}>
          {isPaid ? (
            <>
              <Button variant="contained" onClick={() => navigate("/orders")}>
                View My Orders
              </Button>
              <Button variant="outlined" onClick={() => navigate("/products")}>
                Continue Shopping
              </Button>
            </>
          ) : (
            <>
              <Button variant="outlined" onClick={() => navigate("/checkout")}>
                Return to Checkout
              </Button>
              <Button variant="contained" onClick={() => navigate("/cart")}>
                View Cart
              </Button>
            </>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default PaymentResult;
