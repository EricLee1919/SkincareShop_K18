import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Grid,
  Box,
  TextField,
  MenuItem,
  Slider,
  Button,
} from '@mui/material';
import { RingLoader } from 'react-spinners';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [shape, setShape] = useState('');
  const [carat, setCarat] = useState([0.1, 20]);
  const [color, setColor] = useState('');
  const [price, setPrice] = useState([0, 200000000]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    axios.get('/api/diamonds')
      .then(response => {
        const products = response.data.map(product => {
          if (parseInt(product.quantity) === 0) {
            product.diamond_status = 'Inactive';
          } else {
            product.diamond_status = 'Active';
          }
          return product;
        });
        const activeProducts = products.filter(product => product.diamond_status === 'Active');
        setProducts(activeProducts);
        setFilteredProducts(activeProducts);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  };

  const handleSearch = () => {
    const filtered = products.filter(product => {
      return (
        (shape ? product.shape === shape : true) &&
        (carat[0] <= product.carat && product.carat <= carat[1]) &&
        (color ? product.color.includes(color) : true) &&
        (price[0] <= product.price && product.price <= price[1])
      );
    });
    setFilteredProducts(filtered);
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <RingLoader color="#B19567" size={80}/>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" style={{ padding: '40px 0', marginTop: 5 }}>
      <Box mb={4}>
        <Box display="flex" flexDirection="column" alignItems="center" mb={2} p={2} bgcolor="#f5f5f5" borderRadius={4}>
          <Box display="flex" width="100%" justifyContent="space-between" mb={2}>
            <TextField
              label="Shape"
              select
              value={shape}
              onChange={(e) => setShape(e.target.value)}
              variant="outlined"
              fullWidth
              margin="normal"
              style={{ marginRight: '20px' }}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Round">Round</MenuItem>
              <MenuItem value="Princess">Princess</MenuItem>
              <MenuItem value="Emerald">Emerald</MenuItem>
              <MenuItem value="Asscher">Asscher</MenuItem>
              <MenuItem value="Radiant">Radiant</MenuItem>
              <MenuItem value="Cushion">Cushion</MenuItem>
              <MenuItem value="Oval">Oval</MenuItem>
              <MenuItem value="Pear">Pear</MenuItem>
              <MenuItem value="Marquise">Marquise</MenuItem>
              <MenuItem value="Heart">Heart</MenuItem>
            </TextField>
            <TextField
              label="Color"
              select
              value={color}
              onChange={(e) => setColor(e.target.value)}
              variant="outlined"
              fullWidth
              margin="normal"
              style={{ marginRight: '20px' }}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="D">D</MenuItem>
              <MenuItem value="E">E</MenuItem>
              <MenuItem value="F">F</MenuItem>
              <MenuItem value="G">G</MenuItem>
              <MenuItem value="H">H</MenuItem>
              <MenuItem value="I">I</MenuItem>
              <MenuItem value="J">J</MenuItem>
              <MenuItem value="K">K</MenuItem>
              <MenuItem value="L">L</MenuItem>
            </TextField>
            <Button variant="contained" color="primary" onClick={handleSearch} style={{ backgroundColor: "#2c3e50", height: '56px', alignSelf: 'center' }}>
              SEARCH
            </Button>
          </Box>
          <Box display="flex" width="100%" justifyContent="space-between">
            <Box flexGrow={1} style={{ marginRight: '20px' }}>
              <Typography gutterBottom>Carat</Typography>
              <Slider
                value={carat}
                onChange={(e, newValue) => setCarat(newValue)}
                valueLabelDisplay="auto"
                min={0.1}
                max={20}
                sx={{
                  color: "#B19567",
                  "& .MuiSlider-thumb": {
                    backgroundColor: "#8E6D4D",
                  },
                  "& .MuiSlider-track": {
                    backgroundColor: "#B19567",
                  },
                  "& .MuiSlider-rail": {
                    backgroundColor: "#C4C4C4",
                  },
                }}
              />
            </Box>
            <Box flexGrow={1}>
              <Typography gutterBottom>Price</Typography>
              <Slider
                value={price}
                onChange={(e, newValue) => setPrice(newValue)}
                valueLabelDisplay="auto"
                min={0}
                max={200000000}
                sx={{
                  color: "#B19567",
                  "& .MuiSlider-thumb": {
                    backgroundColor: "#8E6D4D",
                  },
                  "& .MuiSlider-track": {
                    backgroundColor: "#B19567",
                  },
                  "& .MuiSlider-rail": {
                    backgroundColor: "#C4C4C4",
                  },
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
      <Typography variant="h5" gutterBottom>
        {filteredProducts.length} Product found
      </Typography>
      <Grid container spacing={4}>
        {filteredProducts.map((product) => (
          <Grid item key={product.diamond_id} xs={12} sm={6} md={3}>
            <Card onClick={() => handleProductClick(product.diamond_id)} style={{ cursor: 'pointer' }}>
              <CardMedia
                component="img"
                alt={product.name}
                height="auto"
                image={product.image}
              />
              <CardContent>
                <Typography variant="h7" gutterBottom fontWeight="bold">
                  {product.name}
                </Typography>
                <Typography variant="body2" fontWeight="bold" sx={{ color: "#B19567" }}>
                  {product.price}đ
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Carat: {product.carat}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Color: {product.color.join(', ')}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ProductList;
