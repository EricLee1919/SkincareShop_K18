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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Rating,
} from "@mui/material";
import dayjs from "dayjs";
import numeral from "numeral";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import ErrorMessage from "../../components/common/ErrorMessage";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { fetchAdminOrders, fetchMyOrders } from "../../store/slices/orderSlice";

const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const getStatusColor = (status) => {
  switch (status) {
    case "IN_PROCESS":
      return "warning";
    case "shipped":
      return "info";
    case "PAID":
      return "success";
    case "CANCEL":
      return "error";
    default:
      return "default";
  }
};

const Orders = ({ idAdmin = false }) => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orders);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Dialog State
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOrderDetailId, setSelectedOrderDetailId] = useState(null);
  const [selectedOrderDetail, setSelectedOrderDetail] = useState(null);
  const [ratingValue, setRatingValue] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");

  useEffect(() => {
    dispatch(idAdmin ? fetchAdminOrders() : fetchMyOrders());
  }, [dispatch]);

  const handleOpenFeedback = (orderDetail) => {
    setSelectedOrderDetail(orderDetail);
    setSelectedOrderDetailId(orderDetail.id);
    setRatingValue(0);
    setFeedbackText("");
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOrderDetailId(null);
    setSelectedOrderDetail(null);
    setRatingValue(0);
    setFeedbackText("");
  };

  const handleSubmitFeedback = async () => {
    try {
      await axios.patch(
        `http://localhost:8080/api/order/rating/${selectedOrderDetailId}`,
        {
          rate: ratingValue,
          feedback: feedbackText,
        }
      );

      alert("Thank you for your feedback!");
      handleCloseDialog();
      dispatch(fetchMyOrders()); // optional: refresh data
    } catch (err) {
      console.error("Error submitting feedback:", err);
      alert("Failed to submit feedback.");
    }
  };

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
                        {order.total ? numeral(order.total).format("0,0") : NaN}
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
                    {formatDate(selectedOrder.createAt)}
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
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Point
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {selectedOrder.point}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Apply Point
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {selectedOrder.applyPoint}
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
                      <TableCell>Feedback</TableCell>
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
                          <TableCell>
                            {item.rating ? (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 4,
                                }}
                              >
                                <Rating value={item.rating} />
                                <span>-</span>
                                {item.feedback}
                              </Typography>
                            ) : (
                              <Button
                                size="small"
                                onClick={() => handleOpenFeedback(item)}
                              >
                                Feedback
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}

                    <TableRow>
                      <TableCell
                        colSpan={4}
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

          <Dialog
            open={openDialog}
            onClose={handleCloseDialog}
            PaperProps={{ sx: { borderRadius: 3, p: 2 } }}
          >
            <DialogTitle sx={{ fontWeight: 600, fontSize: "1.25rem" }}>
              📝 Give Your Feedback
            </DialogTitle>
            <DialogContent sx={{ minWidth: 400 }}>
              {selectedOrderDetail && (
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    alignItems: "flex-start",
                    mb: 3,
                  }}
                >
                  {selectedOrderDetail.product.image && (
                    <Box
                      component="img"
                      src={selectedOrderDetail.product.image}
                      alt={selectedOrderDetail.product.name}
                      sx={{
                        width: 100,
                        height: 100,
                        objectFit: "contain",
                        borderRadius: 2,
                        border: "1px solid #eee",
                        backgroundColor: "#fafafa",
                        p: 1,
                      }}
                    />
                  )}
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {selectedOrderDetail.product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mt={0.5}>
                      Price: {numeral(selectedOrderDetail.price).format(",0")} đ
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Quantity: {selectedOrderDetail.quantity}
                    </Typography>
                  </Box>
                </Box>
              )}

              <Typography variant="subtitle2" gutterBottom>
                Your Rating
              </Typography>
              <Rating
                value={ratingValue}
                onChange={(_, newValue) => setRatingValue(newValue)}
                size="large"
                sx={{ mb: 2 }}
              />

              <TextField
                label="Your Feedback"
                fullWidth
                multiline
                rows={3}
                placeholder="What do you think about this product?"
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                sx={{ mb: 1 }}
              />
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button
                onClick={handleCloseDialog}
                variant="text"
                color="inherit"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitFeedback}
                variant="contained"
                disabled={ratingValue === 0}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  px: 3,
                }}
              >
                Submit
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Container>
  );
};

export default Orders;
