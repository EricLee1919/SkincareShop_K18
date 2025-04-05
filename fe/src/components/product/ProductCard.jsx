import { Favorite, FavoriteBorder, ShoppingCart } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  IconButton,
  Rating,
  Tooltip,
  Typography,
} from "@mui/material";
import numeral from "numeral";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  addToWishlist,
  removeFromWishlist,
  selectWishlistItems,
} from "../../store/slices/cartSlice";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items: cartItems } = useSelector((state) => state.cart);
  const wishlist = useSelector(selectWishlistItems);

  const isInCart = cartItems.some((item) => item.id === product.id);
  const isFavorite = wishlist.some((item) => item.id === product.id);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!isInCart) {
      dispatch(addToCart(product));
    }
  };

  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    if (isFavorite) {
      dispatch(removeFromWishlist(product.id));
    } else {
      dispatch(addToWishlist(product));
    }
  };

  const handleOnClick = (e) => {
    // Check if the click is on any interactive element
    const isInteractiveElement =
      e.target.closest("button") ||
      e.target.closest("svg") ||
      e.target.closest(".MuiIconButton-root") ||
      e.target.closest(".MuiButton-root") ||
      e.target.closest(".MuiTooltip-root") ||
      e.target.closest(".MuiIcon-root") ||
      e.target.closest(".MuiTouchRipple-root");

    if (isInteractiveElement) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    navigate(`/products/${product.id}`);
  };

  const averageRating =
    product.feedback && product.feedback.length > 0
      ? product.feedback.reduce((sum, r) => sum + r.rate, 0) /
        product.feedback.length
      : 0;

  return (
    <Card
      onClick={handleOnClick}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s",
        cursor: "pointer",
        borderRadius: 2,
        boxShadow: 1,
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 4,
        },
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={product.image}
        alt={product.name}
        sx={{
          objectFit: "cover",
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
        }}
      />
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Typography gutterBottom variant="h6" noWrap>
          {product.name}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            mb: 1,
          }}
        >
          Code: {product.code}
        </Typography>

        {/* Rating */}
        <Box display="flex" alignItems="center" mb={1}>
          <Rating value={averageRating} precision={0.5} readOnly size="small" />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
            ({product.feedback?.length || 0})
          </Typography>
        </Box>

        {/* Category */}
        <div
          style={{
            height: 100,
          }}
        >
          {product.category?.name && (
            <Chip
              label={product.category.name}
              size="small"
              variant="outlined"
              sx={{ mb: 1 }}
            />
          )}

          {/* Suitable Types */}
          <Box display="flex" flexWrap="wrap" mb={2}>
            {product.suitableTypes.map((item) => (
              <Chip
                key={item}
                label={item}
                size="small"
                variant="outlined"
                sx={{ mr: 0.5, mb: 0.5 }}
              />
            ))}
          </Box>
        </div>

        {/* Price */}
        <Typography
          variant="h6"
          color="primary"
          fontWeight={600}
          sx={{ mb: 2 }}
        >
          {numeral(product.price).format("0,0")} đ
        </Typography>

        {/* Buttons */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Button
            variant="contained"
            color="primary"
            startIcon={<ShoppingCart />}
            onClick={handleAddToCart}
            disabled={isInCart}
            sx={{ fontSize: "0.875rem", textTransform: "none" }}
          >
            {isInCart ? "In Cart" : "Add to Cart"}
          </Button>

          <Tooltip
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <IconButton
              onClick={handleToggleFavorite}
              color="primary"
              sx={{
                "&:hover": {
                  backgroundColor: "rgba(156, 39, 176, 0.04)",
                },
                zIndex: 2, // Add z-index to ensure button is clickable
              }}
            >
              {isFavorite ? <Favorite /> : <FavoriteBorder />}
            </IconButton>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
