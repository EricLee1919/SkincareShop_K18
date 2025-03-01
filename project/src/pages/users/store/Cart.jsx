import { useState } from "react"; // Import useState
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateQuantity } from "./cartSlice";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Grid,
  Paper,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material"; // Import Dialog components
import ClearIcon from "@mui/icons-material/Clear";
import { useNavigate } from "react-router-dom";

const formatCurrency = (value) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

const Cart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const navigate = useNavigate();

  // State to store item ID for confirmation dialog
  const [confirmDeleteItemId, setConfirmDeleteItemId] = useState(null);

  const handleRemove = (id) => {
    setConfirmDeleteItemId(id); // Set the item ID for confirmation
  };

  const handleConfirmDelete = () => {
    dispatch(removeFromCart(confirmDeleteItemId));
    setConfirmDeleteItemId(null); // Clear the confirmation state after deletion
  };

  const handleCancelDelete = () => {
    setConfirmDeleteItemId(null); // Clear the confirmation state if canceled
  };

  const handleQuantityChange = (item, newQuantity) => {
    if (newQuantity > 0 && newQuantity <= item.availableQuantity) {
      dispatch(updateQuantity({ id: item.id, quantity: newQuantity }));
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const handleCheckout = () => {
    const orderDetails = {
      cartItems,
      totalAmount: calculateTotal(),
    };
    localStorage.setItem("orderDetails", JSON.stringify(orderDetails));
    navigate("/checkout");
  };

  if (cartItems.length === 0) {
    return (
      <Box
        p={3}
        marginTop="30px"
        marginBottom="30px"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <img
          src="https://cdn-icons-png.freepik.com/512/11329/11329060.png"
          style={{ width: "20%", height: "20%" }}
        />
        <Typography variant="h5">
          Your Cart is <span style={{ color: "red" }}>Empty!</span>
        </Typography>
        <Typography variant="body1" sx={{ color: "grey" }}>
          Must add items on the cart before you proceed to checkout.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/diamonds")}
          sx={{
            mt: 2,
            backgroundColor: "#B19567",
            "&:hover": {
              backgroundColor: "#2c3e50",
            },
          }}
        >
          Continue Shopping
        </Button>
      </Box>
    );
  }

  return (
    <Box p={3} mt={2}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontFamily: "Times New Roman", textAlign: "center" }}
      >
        Shopping Cart
      </Typography>
      <Paper elevation={3} style={{ padding: "20px" }}>
        <Grid container spacing={2}>
          <Grid item xs={1}>
            No.
          </Grid>
          <Grid item xs={1}></Grid>
          <Grid item xs={3}>
            Produc
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
          <Grid item xs={1}></Grid>
        </Grid>
        <Divider style={{ margin: "10px 0" }} />
        {cartItems.map((item, index) => (
          <Grid container spacing={2} key={item.id} alignItems="center">
            <Grid item xs={1}>
              {index + 1}
            </Grid>
            <Grid item xs={1}>
              <Box display="flex">
                <img
                  src={item.image}
                  alt={item.name}
                  style={{ width: "50px", height: "50px" }}
                />
              </Box>
            </Grid>
            <Grid item xs={3}>
              <Box display="flex" alignItems="center">
                <Typography>{item.name}</Typography>
              </Box>
            </Grid>
            <Grid item xs={2}>
              {formatCurrency(item.price)}
            </Grid>
            <Grid item xs={2}>
              <Box display="flex" alignItems="center">
                <Button
                  onClick={() => handleQuantityChange(item, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  -
                </Button>
                <Typography>{item.quantity}</Typography>
                <Button
                  onClick={() => handleQuantityChange(item, item.quantity + 1)}
                  disabled={item.quantity >= item.availableQuantity}
                >
                  +
                </Button>
              </Box>
            </Grid>
            <Grid item xs={2}>
              {formatCurrency(item.price * item.quantity)}
            </Grid>
            <Grid item xs={1}>
              <IconButton
                onClick={() => handleRemove(item.id)}
                color="secondary"
                sx={{ color: "#AFADB7" }}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </Grid>
          </Grid>
        ))}
        <Divider style={{ margin: "10px 0" }} />
        <Box mt={3} textAlign="right">
          <Typography variant="h6" style={{ marginRight: "20px" }}>
            Total (estimated): {formatCurrency(calculateTotal())}
          </Typography>
          <Button
            variant="contained"
            onClick={handleCheckout}
            sx={{
              marginRight: "10px",
              backgroundColor: "#B19567",
              "&:hover": { backgroundColor: "#2c3e50" },
            }}
          >
            Checkout
          </Button>
        </Box>
      </Paper>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDeleteItemId !== null} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to remove this item from your cart?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            sx={{ color: "red" }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Cart;
