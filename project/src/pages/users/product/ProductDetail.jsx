import { useState, useEffect } from "react";
import axios from "../../../axiosConfig";
import { useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Grid,
  Button,
  Card,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { addToCart } from "../store/cartSlice";
import { useNavigate } from "react-router-dom";
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { RingLoader } from 'react-spinners';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false); // State for Snackbar
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`/diamonds/${id}`)
      .then((response) => {
        setProduct(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        ...product,
        id: product.diamond_id,
        availableQuantity: parseInt(product.quantity),
      })
    );
    setSnackbarOpen(true); // Open Snackbar when adding to cart
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    notifySuccess(); 
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/cart");
  };

  const notifySuccess = () => toast.success('Add to cart successfully!', {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Bounce,
  });

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <RingLoader color="#B19567" size={80}/>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" style={{ paddingTop: 40, marginBottom: 40, marginTop: 20 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6}>
          <Card elevation={3}>
            <img
              src={product?.image}
              alt={product?.name}
              style={{ width: "100%", maxHeight: 600, objectFit: "cover" }}
            />
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box paddingLeft={4}>
            <Typography
              variant="h5"
              component="div"
              gutterBottom
              fontWeight="bold"
            >
              {product?.name}
            </Typography>
            <Typography
              variant="h5"
              fontWeight="bold"
              style={{ color: "#d32f2f", marginBottom: 20 }}
            >
              {parseInt(product?.price).toLocaleString()}đ
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6">
                  <strong>Shape:</strong> {product?.shape}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6">
                  <strong>Carat:</strong> {product?.carat}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6">
                  <strong>Color:</strong> {product?.color.join(", ")}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6">
                  <strong>Lab:</strong> {product?.lab}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6">
                  <strong>Origin:</strong> {product?.origin}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6">
                  <strong>Quantity:</strong> {product?.quantity}
                </Typography>
              </Grid>
              <Box marginTop={4}>
                <Button
                  variant="contained"
                  onClick={handleAddToCart}
                  sx={{
                    marginRight: 2, backgroundColor: "#B19567", "&:hover": {
                      backgroundColor: "#2c3e50",
                    },
                  }}
                >
                  Add to Cart
                </Button>
                <Button
                  variant="contained"
                  onClick={handleBuyNow}
                  sx={{
                    backgroundColor: "#2c3e50", "&:hover": {
                      backgroundColor: "#B19567",
                    },
                  }}
                >
                  Buy Now
                </Button>
              </Box>
            </Grid>
          </Box>
        </Grid>
      </Grid>
      <ToastContainer />
    </Container>
  );
};

export default ProductDetail;