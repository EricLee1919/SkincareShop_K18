import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Grid,
  Box
} from '@mui/material';
import { RingLoader } from 'react-spinners';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const SearchResults = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const query = useQuery();
  const searchTerm = query.get('query');
  const navigate = useNavigate();

  useEffect(() => {
    if (searchTerm) {
      fetchSearchResults();
    }
  }, [searchTerm]);

  const fetchSearchResults = () => {
    axios.get('/api/diamonds')
      .then(response => {
        const filtered = response.data.filter(product =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setProducts(filtered);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
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
    <Container maxWidth="lg" style={{ padding: '40px 0', marginTop: "20px", marginBottom: "30px" }}>
      <Typography variant="h4" gutterBottom fontFamily= " Times New Roman" marginBottom="30px">
        Search Results for {searchTerm} 
      </Typography>
      <Grid container spacing={4}>
        {products.map((product) => (
          <Grid item key={product.diamond_id} xs={12} sm={6} md={3}>
            <Card
              onClick={() => handleProductClick(product.diamond_id)}
              style={{ cursor: 'pointer' }}
            >
              <CardMedia
                component="img"
                alt={product.name}
                height="200"
                image={product.image}
              />
              <CardContent>
                <Typography variant="h7" fontWeight="bold" gutterBottom>
                  {product.name}
                </Typography>
                <Typography variant="body1" color="textSecondary" fontWeight="bold" sx={{color: "#B19567"}} >
                  {product.price}đ
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  Carat: {product.carat}
                </Typography>
                <Typography variant="body1" color="textSecondary">
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

export default SearchResults;
