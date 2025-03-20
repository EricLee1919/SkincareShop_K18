import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Typography,
  Paper,
  Divider,
} from '@mui/material';

const ProductFilter = ({ filters, onFilterChange, categories }) => {
  const handleCategoryChange = (event) => {
    onFilterChange({ ...filters, category: event.target.value });
  };

  const handlePriceRangeChange = (event, newValue) => {
    onFilterChange({ ...filters, priceRange: newValue });
  };

  const handleRatingChange = (event, newValue) => {
    onFilterChange({ ...filters, rating: newValue });
  };

  return (
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
        max={1000}
        step={10}
        marks={[
          { value: 0, label: '$0' },
          { value: 500, label: '$500' },
          { value: 1000, label: '$1000' },
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
          { value: 0, label: '0' },
          { value: 2.5, label: '2.5' },
          { value: 5, label: '5' },
        ]}
      />
    </Paper>
  );
};

export default ProductFilter; 