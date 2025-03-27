// src/components/product/ProductSearch.jsx
import React, { useState, useEffect } from "react";
import {
  TextField,
  Box,
  CircularProgress,
  Typography,
  Paper,
  Card,
  CardMedia,
  CardContent,
  Popper,
  ClickAwayListener,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import debounce from "lodash.debounce";
import ProductApi from "../../api/ProductApi";

const ProductSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const searchRef = React.useRef(null);
  const navigate = useNavigate();

  // Create debounced search function
  const debouncedSearch = React.useMemo(
    () =>
      debounce(async (query) => {
        if (!query || query.length < 2) {
          setSearchResults([]);
          setOpen(false);
          return;
        }

        setLoading(true);
        try {
          const response = await ProductApi.searchProducts(query);
          setSearchResults(response);
          setOpen(true);
        } catch (error) {
          console.error("Error fetching search results:", error);
          setSearchResults([]);
        } finally {
          setLoading(false);
        }
      }, 500),
    []
  );

  // Handle search input change
  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearchQuery(value);
    debouncedSearch(value);
  };

  // Handle product click
  const handleProductClick = (productId) => {
    setOpen(false);
    setSearchQuery("");
    navigate(`/product/${productId}`);
  };

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <Box sx={{ position: "relative", width: "100%", maxWidth: 600 }}>
        <TextField
          ref={searchRef}
          fullWidth
          placeholder="Search products..."
          value={searchQuery}
          onChange={handleSearchChange}
          variant="outlined"
          size="small"
          sx={{
            backgroundColor: "white",
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              "&:hover fieldset": {
                borderColor: "primary.main",
              },
              "&.Mui-focused fieldset": {
                borderColor: "primary.main",
                borderWidth: "2px",
              },
            },
          }}
        />

        <Popper
          open={open && searchResults.length > 0}
          anchorEl={searchRef.current}
          placement="bottom-start"
          style={{
            width: searchRef.current?.offsetWidth,
            zIndex: 1400,
            marginTop: "4px",
          }}
        >
          <Paper
            sx={{
              maxHeight: 400,
              overflow: "auto",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              borderRadius: "8px",
              border: "1px solid #e0e0e0",
            }}
          >
            {loading ? (
              <Box sx={{ p: 3, display: "flex", justifyContent: "center" }}>
                <CircularProgress size={24} color="primary" />
              </Box>
            ) : searchResults.length > 0 ? (
              searchResults.map((product) => (
                <Card
                  key={product.id}
                  sx={{
                    display: "flex",
                    p: 1.5,
                    cursor: "pointer",
                    border: "none",
                    borderRadius: 0,
                    borderBottom: "1px solid #f0f0f0",
                    "&:hover": {
                      backgroundColor: "rgba(25, 118, 210, 0.04)",
                    },
                    "&:last-child": {
                      borderBottom: "none",
                    },
                  }}
                  onClick={() => handleProductClick(product.id)}
                >
                  <CardMedia
                    component="img"
                    sx={{
                      width: 50,
                      height: 50,
                      objectFit: "cover",
                      borderRadius: "4px",
                    }}
                    image={product.imageUrl}
                    alt={product.name}
                  />
                  <CardContent
                    sx={{
                      flex: 1,
                      p: "0 16px",
                      "&:last-child": { pb: 0 },
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 500,
                        color: "#2c2c2c",
                        mb: 0.5,
                      }}
                    >
                      {product.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="primary"
                      sx={{ fontWeight: 600 }}
                    >
                      ${product.price.toFixed(2)}
                    </Typography>
                  </CardContent>
                </Card>
              ))
            ) : searchQuery.length >= 2 && !loading ? (
              <Box
                sx={{
                  p: 3,
                  textAlign: "center",
                  color: "#666",
                }}
              >
                <Typography variant="body2">No products found</Typography>
              </Box>
            ) : null}
          </Paper>
        </Popper>
      </Box>
    </ClickAwayListener>
  );
};

export default ProductSearch;
