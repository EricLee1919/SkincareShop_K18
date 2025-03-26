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
  const [shouldSearch, setShouldSearch] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  const handleSearch = async (value) => {
    if (!value.trim() || value.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }

    if (!shouldSearch) {
      setShouldSearch(true);
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

  useEffect(() => {
    const timer = setTimeout(() => {
      if (shouldSearch) {
        handleSearch(searchTerm);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, shouldSearch]);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    if (!shouldSearch && e.target.value.length >= 2) {
      setShouldSearch(true);
    }
  };

  const handleProductClick = (productId) => {
    setOpen(false);
    setSearchTerm("");
    setShouldSearch(false);
    navigate(`/product/${productId}`);
  };

  const handleClear = () => {
    setSearchTerm("");
    setResults([]);
    setOpen(false);
    setShouldSearch(false);
  };

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <Box sx={{ position: "relative", width: "100%", maxWidth: 600 }}>
        <Paper
          ref={searchRef}
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch(searchTerm);
          }}
          sx={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            borderRadius: "8px",
            backgroundColor: "white",
            border: "2px solid",
            borderColor: open ? "primary.main" : "transparent",
            transition: "all 0.3s ease",
            boxShadow: "0 2px 5px rgba(0,0,0,0.08)",
            "&:hover": {
              boxShadow: "0 4px 10px rgba(0,0,0,0.12)",
            },
          }}
        >
          <IconButton
            sx={{
              p: "10px",
              color: "action.active",
            }}
          >
            <SearchIcon />
          </IconButton>

          <InputBase
            sx={{
              ml: 1,
              flex: 1,
              "& .MuiInputBase-input": {
                padding: "12px 8px",
                fontSize: "0.95rem",
                "&::placeholder": {
                  color: "#9e9e9e",
                  opacity: 1,
                },
              },
            }}
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleInputChange}
          />

          {searchTerm && (
            <IconButton
              size="small"
              onClick={handleClear}
              sx={{
                mx: 1.5,
                color: "action.active",
                "&:hover": {
                  color: "primary.main",
                },
              }}
            >
              ×
            </IconButton>
          )}
        </Paper>

        <Popper
          open={open && results.length > 0}
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
            ) : results.length > 0 ? (
              results.map((product) => (
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
            ) : searchTerm.length >= 2 && !loading ? (
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
