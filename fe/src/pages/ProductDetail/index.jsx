import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Favorite, ShoppingCart } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Grid,
  Rating,
  Typography,
} from "@mui/material";
import numeral from "numeral";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../store/slices/cartSlice";
import { fetchProductById } from "../../store/slices/productSlice";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const {
    selectedProduct: product,
    loading,
    error,
  } = useSelector((state) => state.products);
  const { items } = useSelector((state) => state.cart);
  const isInCart = items.some((item) => item.id === product?.id);
  console.log(product);
  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
  }, [dispatch, id]);

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart(product));
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading product details..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        message={error}
        onRetry={() => dispatch(fetchProductById(id))}
      />
    );
  }

  if (!product) {
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Box
            component="img"
            src={product.image}
            alt={product.name}
            sx={{
              width: "100%",
              height: "auto",
              borderRadius: 2,
              boxShadow: 3,
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom>
            {product.name}
          </Typography>

          <Box display="flex" alignItems="center" mb={2}>
            <Rating value={product.rating} precision={0.5} readOnly />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              ({product.reviewCount} reviews)
            </Typography>
          </Box>

          <Typography variant="h5" color="primary" gutterBottom>
            {product.price && numeral(product.price).format("0,0")} đ
          </Typography>

          {product.category && (
            <Chip
              label={product.category.name}
              color="primary"
              variant="outlined"
              sx={{ mb: 2 }}
            />
          )}

          <Typography variant="body1" paragraph>
            {product.description}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Box display="flex" gap={2}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<ShoppingCart />}
              onClick={handleAddToCart}
              disabled={isInCart}
              fullWidth
            >
              {isInCart ? "In Cart" : "Add to Cart"}
            </Button>
            <Button
              variant="outlined"
              color="primary"
              size="large"
              startIcon={<Favorite />}
              fullWidth
            >
              Add to Wishlist
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductDetail;
