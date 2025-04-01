import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Grid,
  Paper,
  Rating,
  Typography,
} from "@mui/material";
import { Favorite, ShoppingCart } from "@mui/icons-material";
import numeral from "numeral";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import ErrorMessage from "../../components/common/ErrorMessage";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { addToCart } from "../../store/slices/cartSlice";
import { fetchProductById } from "../../store/slices/productSlice";

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

  // ✅ Tính trung bình đánh giá
  const averageRating =
    product.feedback && product.feedback.length > 0
      ? product.feedback.reduce((sum, fb) => sum + fb.rate, 0) /
        product.feedback.length
      : 0;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* IMAGE */}
        <Grid item xs={12} md={6}>
          <Box
            component="img"
            src={product.image}
            alt={product.name}
            sx={{
              width: "100%",
              borderRadius: 3,
              objectFit: "contain",
              boxShadow: 4,
              p: 2,
              backgroundColor: "#fff",
            }}
          />
        </Grid>

        {/* DETAILS */}
        <Grid item xs={12} md={6}>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            {product.name}
          </Typography>

          <Box display="flex" alignItems="center" mb={2}>
            <Rating value={averageRating} precision={0.5} readOnly />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              ({product.feedback?.length || 0} reviews)
            </Typography>
          </Box>

          <Typography
            variant="h5"
            color="primary"
            fontWeight={600}
            gutterBottom
          >
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
            {product.description || "No description provided."}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Box>
            {/* FEEDBACK SECTION */}
            {product.feedback && product.feedback.length > 0 && (
              <Box sx={{ mt: 6 }}>
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  Customer Feedback
                </Typography>

                <Grid container spacing={2}>
                  {product.feedback.map((fb, index) => (
                    <Grid item xs={12} md={12} key={index}>
                      <Paper
                        elevation={2}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          height: "100%",
                          backgroundColor: "#fafafa",
                        }}
                      >
                        <Box display="flex" alignItems="center" mb={1}>
                          <Rating value={fb.rate} readOnly size="small" />
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ ml: 1 }}
                          >
                            {fb.rate} stars
                          </Typography>
                        </Box>
                        <Typography variant="body2">{fb.feedback}</Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </Box>

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
