import { Box, Container, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductFilter from "../../components/product/ProductFilter";
import ProductGrid from "../../components/product/ProductGrid";
import ProductSort from "../../components/product/ProductSort";
import { fetchProducts } from "../../store/slices/productSlice";

const Products = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const [filters, setFilters] = useState({
    category: "",
    priceRange: [0, 1000],
    rating: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    dispatch(fetchProducts({ filters, searchTerm, sortBy }));
  }, [dispatch, filters, searchTerm, sortBy]);

  // Filter out deleted products, in case any slip through from the API
  const filteredProducts = Array.isArray(products)
    ? products.filter((product) => !product.isDeleted)
    : [];

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleSort = (value) => {
    setSortBy(value);
  };

  const handleRetry = () => {
    dispatch(fetchProducts({ filters, searchTerm, sortBy }));
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Our Products
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <ProductFilter
            filters={filters}
            onFilterChange={handleFilterChange}
            categories={[]} // TODO: Add categories from API
          />
        </Grid>

        <Grid item xs={12} md={9}>
          <Box
            sx={{
              mb: 3,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {/* <ProductSearch onSearch={handleSearch} /> */}
            <ProductSort sortBy={sortBy} onSortChange={handleSort} />
          </Box>

          <ProductGrid
            products={filteredProducts}
            loading={loading}
            error={error}
            onRetry={handleRetry}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Products;
