import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Slider,
  Checkbox,
  FormControlLabel,
  FormGroup,
  TextField,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductGrid from "../../components/product/ProductGrid";
import { fetchProducts } from "../../store/slices/productSlice";
import { fetchCategories } from "../../store/slices/categorySlice";
import convertCurrency from "../../utils/currency";

const skinTypes = ["NORMAL", "OILY", "DRY", "SENSITIVE", "COMBINATION"];

const Products = ({ type }) => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.categories);

  const [filters, setFilters] = useState({
    category: "",
    priceRange: [0, 10000000],
    rating: 0,
    suitableTypes: [],
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    dispatch(fetchProducts({ type }));
    dispatch(fetchCategories());
  }, [dispatch, type]);

  const filteredProducts = useMemo(() => {
    let filtered = Array.isArray(products)
      ? products.filter((product) => !product.isDeleted)
      : [];

    if (filters.category) {
      filtered = filtered.filter((p) => p.category?.id === filters.category);
    }

    filtered = filtered.filter(
      (p) =>
        p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );

    filtered = filtered.filter((p) => {
      const avgRating =
        p.feedback && p.feedback.length > 0
          ? p.feedback.reduce((sum, f) => sum + f.rate, 0) / p.feedback.length
          : 0;
      return avgRating >= filters.rating;
    });

    if (filters.suitableTypes.length > 0) {
      filtered = filtered.filter((p) =>
        filters.suitableTypes.some((type) => p.suitableTypes?.includes(type))
      );
    }

    if (searchTerm.trim()) {
      const keyword = searchTerm.trim().toLowerCase();
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(keyword));
    }

    switch (sortBy) {
      case "priceAsc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "priceDesc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => {
          const avgA =
            a.feedback?.reduce((sum, f) => sum + f.rate, 0) /
              (a.feedback?.length || 1) || 0;
          const avgB =
            b.feedback?.reduce((sum, f) => sum + f.rate, 0) /
              (b.feedback?.length || 1) || 0;
          return avgB - avgA;
        });
        break;
      case "newest":
      default:
        break;
    }

    return filtered;
  }, [products, filters, searchTerm, sortBy]);

  const handleCategoryChange = (e) => {
    setFilters({ ...filters, category: e.target.value });
  };

  const handlePriceRangeChange = (_, newValue) => {
    setFilters({ ...filters, priceRange: newValue });
  };

  const handleRatingChange = (_, newValue) => {
    setFilters({ ...filters, rating: newValue });
  };

  const handleSkinTypeChange = (type) => {
    const newTypes = filters.suitableTypes.includes(type)
      ? filters.suitableTypes.filter((t) => t !== type)
      : [...filters.suitableTypes, type];

    setFilters({ ...filters, suitableTypes: newTypes });
  };

  const handleSort = (value) => {
    setSortBy(value);
  };

  const handleRetry = () => {
    dispatch(fetchProducts({ type }));
  };

  return (
    <div style={{ backgroundColor: "#f5f5f5" }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Our Products
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Filters
              </Typography>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={filters.category}
                  label="Category"
                  onChange={handleCategoryChange}
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Divider sx={{ my: 2 }} />

              <Typography gutterBottom>Price Range</Typography>
              <Slider
                value={filters.priceRange}
                onChange={handlePriceRangeChange}
                valueLabelDisplay="auto"
                min={0}
                max={10000000}
                step={50000}
                marks={[
                  { value: 0, label: convertCurrency(0) },
                  { value: 100000, label: convertCurrency(100000) },
                  { value: 10000000, label: convertCurrency(10000000) },
                ]}
                sx={{ mb: 2 }}
              />

              <Divider sx={{ my: 2 }} />

              <Typography gutterBottom>Minimum Rating</Typography>
              <Slider
                value={filters.rating}
                onChange={handleRatingChange}
                valueLabelDisplay="auto"
                min={0}
                max={5}
                step={0.5}
                marks={[
                  { value: 0, label: "0" },
                  { value: 2.5, label: "2.5" },
                  { value: 5, label: "5" },
                ]}
              />

              <Divider sx={{ my: 2 }} />

              <Typography gutterBottom>Suitable Skin Types</Typography>
              <FormGroup>
                {skinTypes.map((type) => (
                  <FormControlLabel
                    key={type}
                    control={
                      <Checkbox
                        checked={filters.suitableTypes.includes(type)}
                        onChange={() => handleSkinTypeChange(type)}
                      />
                    }
                    label={type}
                  />
                ))}
              </FormGroup>
            </Paper>
          </Grid>

          <Grid item xs={12} md={9}>
            <Box
              sx={{
                mb: 3,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <TextField
                label="Search by name"
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ width: 300 }}
              />

              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  label="Sort By"
                  onChange={(e) => handleSort(e.target.value)}
                >
                  <MenuItem value="newest">Newest First</MenuItem>
                  <MenuItem value="priceAsc">Price: Low to High</MenuItem>
                  <MenuItem value="priceDesc">Price: High to Low</MenuItem>
                  <MenuItem value="rating">Highest Rated</MenuItem>
                </Select>
              </FormControl>
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
    </div>
  );
};

export default Products;
