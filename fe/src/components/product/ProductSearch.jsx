// src/components/product/ProductSearch.jsx
import { useState, useEffect, useRef } from "react";
import SearchIcon from "@mui/icons-material/Search";
import {
  IconButton,
  InputBase,
  Paper,
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Popper,
  ClickAwayListener,
  CircularProgress,
} from "@mui/material";
import ProductApi from "../../api/ProductApi";
import { useNavigate } from "react-router-dom";

const ProductSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  const handleSearch = async (value) => {
    if (!value.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }

    try {
      setLoading(true);
      const response = await ProductApi.searchProducts(value);
      setResults(response);
      setOpen(true);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(searchTerm);
    }, 300); // Wait 300ms after last keystroke before searching

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleProductClick = (productId) => {
    setOpen(false);
    setSearchTerm("");
    navigate(`/product/${productId}`);
  };

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <Box sx={{ position: "relative", width: "100%", maxWidth: 600 }}>
        <Paper
          ref={searchRef}
          component="form"
          onSubmit={(e) => e.preventDefault()}
          sx={{
            p: "2px 4px",
            display: "flex",
            alignItems: "center",
            width: "100%",
          }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => searchTerm && setOpen(true)}
          />
          <IconButton sx={{ p: "10px" }}>
            <SearchIcon />
          </IconButton>
        </Paper>

        <Popper
          open={open}
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
              boxShadow: 3,
            }}
          >
            {loading ? (
              <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
                <CircularProgress size={24} />
              </Box>
            ) : results.length > 0 ? (
              results.map((product) => (
                <Card
                  key={product.id}
                  sx={{
                    display: "flex",
                    p: 1,
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "action.hover",
                    },
                  }}
                  onClick={() => handleProductClick(product.id)}
                >
                  <CardMedia
                    component="img"
                    sx={{ width: 60, height: 60, objectFit: "cover" }}
                    image={product.imageUrl}
                    alt={product.name}
                  />
                  <CardContent
                    sx={{ flex: 1, p: 1, "&:last-child": { pb: 1 } }}
                  >
                    <Typography variant="subtitle2" noWrap>
                      {product.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="primary"
                      sx={{ fontWeight: "bold" }}
                    >
                      ${product.price.toFixed(2)}
                    </Typography>
                  </CardContent>
                </Card>
              ))
            ) : searchTerm && !loading ? (
              <Box sx={{ p: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  No products found
                </Typography>
              </Box>
            ) : null}
          </Paper>
        </Popper>
      </Box>
    </ClickAwayListener>
  );
};

export default ProductSearch;
