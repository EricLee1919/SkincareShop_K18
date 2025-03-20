import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  Card,
  CardContent,
  CardMedia,
  Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../store/slices/productSlice';
import ProductCard from '../../components/product/ProductCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    dispatch(fetchProducts({ filters: {}, searchTerm: '', sortBy: 'popularity' }));
  }, [dispatch]);

  useEffect(() => {
    if (products && products.length > 0) {
      // Filter out any deleted products, just in case
      const activeProducts = products.filter(product => !product.isDeleted);
      setFeaturedProducts(activeProducts.slice(0, 4));
    }
  }, [products]);

  const handleShopNow = () => {
    navigate('/products');
  };

  return (
    <Box>
      {/* Hero Section */}
      <Paper
        sx={{
          position: 'relative',
          height: { xs: '60vh', md: '80vh' },
          backgroundColor: 'primary.main',
          color: 'white',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          borderRadius: 0,
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              maxWidth: { xs: '100%', md: '50%' },
              p: { xs: 3, md: 0 },
            }}
          >
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 700,
                textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
              }}
            >
              Discover Your Skin's True Potential
            </Typography>
            <Typography
              variant="h5"
              component="p"
              paragraph
              sx={{
                textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
                mb: 4,
              }}
            >
              Premium skincare products that nourish and reveal your natural beauty.
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              onClick={handleShopNow}
              sx={{
                py: 1.5,
                px: 4,
                fontSize: '1.1rem',
              }}
            >
              Shop Now
            </Button>
          </Box>
        </Container>
      </Paper>

      {/* Featured Categories */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" component="h2" align="center" gutterBottom>
          Shop by Category
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          paragraph
          sx={{ mb: 6 }}
        >
          Explore our carefully curated product categories
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                height: 320,
                cursor: 'pointer',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                },
              }}
              onClick={() => navigate('/products?category=face')}
            >
              <CardMedia
                component="img"
                height="200"
                image="https://placehold.jp/3d4070/ffffff/600x400.png?text=Face+Care"
                alt="Face Care"
              />
              <CardContent>
                <Typography variant="h6" component="h3" gutterBottom>
                  Face Care
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Cleansers, moisturizers, and serums for your face
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                height: 320,
                cursor: 'pointer',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                },
              }}
              onClick={() => navigate('/products?category=body')}
            >
              <CardMedia
                component="img"
                height="200"
                image="https://placehold.jp/3d4070/ffffff/600x400.png?text=Body+Care"
                alt="Body Care"
              />
              <CardContent>
                <Typography variant="h6" component="h3" gutterBottom>
                  Body Care
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Lotions, scrubs, and oils for your body
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                height: 320,
                cursor: 'pointer',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                },
              }}
              onClick={() => navigate('/products?category=hair')}
            >
              <CardMedia
                component="img"
                height="200"
                image="https://placehold.jp/3d4070/ffffff/600x400.png?text=Hair+Care"
                alt="Hair Care"
              />
              <CardContent>
                <Typography variant="h6" component="h3" gutterBottom>
                  Hair Care
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Shampoos, conditioners, and treatments for your hair
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                height: 320,
                cursor: 'pointer',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                },
              }}
              onClick={() => navigate('/products?category=sets')}
            >
              <CardMedia
                component="img"
                height="200"
                image="https://placehold.jp/3d4070/ffffff/600x400.png?text=Gift+Sets"
                alt="Gift Sets"
              />
              <CardContent>
                <Typography variant="h6" component="h3" gutterBottom>
                  Gift Sets
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Perfect bundles for gifting or trying new products
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Featured Products */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" align="center" gutterBottom>
            Featured Products
          </Typography>
          <Typography
            variant="subtitle1"
            align="center"
            color="text.secondary"
            paragraph
            sx={{ mb: 6 }}
          >
            Our most popular and highest-rated skincare products
          </Typography>

          {loading ? (
            <LoadingSpinner message="Loading featured products..." />
          ) : error ? (
            <ErrorMessage message={error} onRetry={() => dispatch(fetchProducts({}))} />
          ) : (
            <Grid container spacing={3}>
              {featuredProducts.map((product) => (
                <Grid item key={product.id} xs={12} sm={6} md={3}>
                  <ProductCard product={product} />
                </Grid>
              ))}
            </Grid>
          )}

          <Box display="flex" justifyContent="center" mt={6}>
            <Button
              variant="outlined"
              color="primary"
              size="large"
              onClick={handleShopNow}
            >
              View All Products
            </Button>
          </Box>
        </Container>
      </Box>

      {/* About Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src="https://placehold.jp/3d4070/ffffff/800x600.png?text=About+Us"
              alt="About Us"
              sx={{
                width: '100%',
                height: 'auto',
                borderRadius: 2,
                boxShadow: 3,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" component="h2" gutterBottom>
              About Our Brand
            </Typography>
            <Typography variant="body1" paragraph>
              At SkinCare, we believe that beautiful skin starts with healthy ingredients.
              Our products are carefully formulated using the finest natural ingredients,
              backed by scientific research.
            </Typography>
            <Typography variant="body1" paragraph>
              Founded in 2010, we've been dedicated to creating effective, sustainable,
              and cruelty-free skincare products that help you achieve your best skin.
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate('/about')}
              sx={{ mt: 2 }}
            >
              Learn More
            </Button>
          </Grid>
        </Grid>
      </Container>

      {/* Testimonials */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" align="center" gutterBottom>
            What Our Customers Say
          </Typography>
          <Typography
            variant="subtitle1"
            align="center"
            color="text.secondary"
            paragraph
            sx={{ mb: 6 }}
          >
            Real reviews from our satisfied customers
          </Typography>

          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="body1" paragraph>
                    "I've been using the Complete Skincare Set for three months and my skin
                    has never looked better. The moisturizer is especially amazing!"
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle2" color="primary">
                    Emily Johnson
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Verified Customer
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="body1" paragraph>
                    "The Hydrating Serum has completely transformed my dry skin. It's gentle
                    but effective, and a little goes a long way."
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle2" color="primary">
                    Michael Smith
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Verified Customer
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="body1" paragraph>
                    "I'm impressed with how quickly the Brightening Cream evened out my skin
                    tone. It's now a permanent part of my skincare routine!"
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle2" color="primary">
                    Sarah Williams
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Verified Customer
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Home; 