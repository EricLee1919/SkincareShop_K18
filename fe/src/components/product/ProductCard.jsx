import { Favorite, FavoriteBorder, ShoppingCart } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Rating,
  Tooltip,
  Typography
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../store/slices/cartSlice";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import numeral from "numeral";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();
  const { items } = useSelector((state) => state.cart);
  const isInCart = items.some((item) => item.id === product.id);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    dispatch(addToCart(product));
  };

  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const handleProductClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <Card
      onClick={handleProductClick}
      style={{ cursor: "pointer" }}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 3,
        },
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={product.image}
        alt={product.name}
        sx={{ objectFit: "cover" }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="h2" noWrap>
          {product.name}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            mb: 1,
          }}
        >
          {product.description}
        </Typography>
        <Box display="flex" alignItems="center" mb={1}>
          <Rating
            value={product.rating}
            precision={0.5}
            readOnly
            size="small"
          />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            ({product.ratings && product.ratings.length})
          </Typography>
        </Box>
        <Typography variant="h6" color="primary" gutterBottom>
          {numeral(product.price).format("0,0")} đ
        </Typography>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Button
            variant="contained"
            color="primary"
            startIcon={<ShoppingCart />}
            onClick={handleAddToCart}
            disabled={isInCart}
          >
            {isInCart ? "In Cart" : "Add to Cart"}
          </Button>
          <Tooltip
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <IconButton onClick={handleToggleFavorite} color="primary">
              {isFavorite ? <Favorite /> : <FavoriteBorder />}
            </IconButton>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
