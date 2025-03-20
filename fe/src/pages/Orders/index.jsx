import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import numeral from "numeral";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ErrorMessage from "../../components/common/ErrorMessage";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { fetchMyOrders } from "../../store/slices/orderSlice";

// Helper function to format dates
const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Helper function to get status color
const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case "processing":
      return "warning";
    case "shipped":
      return "info";
    case "delivered":
      return "success";
    case "cancelled":
      return "error";
    default:
      return "default";
  }
};

const Orders = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orders);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  if (loading) {
    return <LoadingSpinner message="Loading your orders..." />;
  }

  if (error) {
    return (
      <ErrorMessage message={error} onRetry={() => dispatch(fetchMyOrders())} />
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Orders
      </Typography>

      {orders && orders.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" gutterBottom>
            You haven't placed any orders yet
          </Typography>
          <Button
            component={Link}
            to="/products"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Browse Products
          </Button>
        </Paper>
      ) : (
        <>
          <TableContainer component={Paper} sx={{ mb: 4 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders &&
                  orders.map((order) => (
                    <TableRow
                      key={order.id}
                      hover
                      onClick={() => setSelectedOrder(order)}
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell>#{order.id}</TableCell>
                      <TableCell>{dayjs(order.createAt).fromNow()}</TableCell>
                      <TableCell>
                        đ{" "}
                        {(order.total && numeral(order.total).format("0,0")) ||
                          NaN}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={order.status}
                          color={getStatusColor(order.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOrder(order);
                          }}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          {selectedOrder && (
            <Paper sx={{ p: 3, mb: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h5">Order #{selectedOrder.id}</Typography>
                <Chip
                  label={selectedOrder.status}
                  color={getStatusColor(selectedOrder.status)}
                />
              </Box>

              <Divider sx={{ mb: 2 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Order Date
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {formatDate(selectedOrder.createdAt)}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Shipping Address
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {selectedOrder.shippingAddress}
                  </Typography>
                </Grid>
              </Grid>

              <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                Ordered Items
              </Typography>

              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell align="right">Subtotal</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedOrder.orderDetails &&
                      selectedOrder.orderDetails.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.product.name}</TableCell>
                          <TableCell>
                            {numeral(item.price).format(",0")} đ
                          </TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell align="right">
                            {numeral(item.price * item.quantity).format(",0")} đ
                          </TableCell>
                        </TableRow>
                      ))}

                    <TableRow>
                      <TableCell
                        colSpan={3}
                        align="right"
                        sx={{ fontWeight: "bold" }}
                      >
                        Total
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: "bold" }}>
                        {selectedOrder.total &&
                          numeral(selectedOrder.total).format("0,0")}{" "}
                        đ
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}
        </>
      )}
    </Container>
  );
};

export default Orders;
