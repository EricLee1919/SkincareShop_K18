import React from "react";
import { Container, Grid, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import ProductCard from "../../components/product/ProductCard";
import { selectWishlistItems } from "../../store/slices/cartSlice";

export default function WishList() {
  const wishlist = useSelector(selectWishlistItems);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Your Wishlist
      </Typography>

      {wishlist.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          You haven't added any products to your wishlist yet.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {wishlist.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
