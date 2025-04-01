import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const ProductSort = ({ sortBy, onSortChange }) => {
  const handleChange = (event) => {
    onSortChange(event.target.value);
  };

  return (
    <FormControl sx={{ minWidth: 200 }}>
      <InputLabel>Sort By</InputLabel>
      <Select value={sortBy} label="Sort By" onChange={handleChange}>
        <MenuItem value="newest">Newest First</MenuItem>
        <MenuItem value="price_low">Price: Low to High</MenuItem>
        <MenuItem value="price_high">Price: High to Low</MenuItem>
        <MenuItem value="rating">Highest Rated</MenuItem>
        <MenuItem value="popularity">Most Popular</MenuItem>
      </Select>
    </FormControl>
  );
};

export default ProductSort; 