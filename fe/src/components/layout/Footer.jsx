import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Facebook,
  Instagram,
  Twitter,
  Pinterest,
  YouTube,
} from '@mui/icons-material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'primary.main',
        color: 'white',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              SKINCARE
            </Typography>
            <Typography variant="body2" paragraph>
              Your trusted destination for premium skincare products.
              We believe in the power of natural ingredients and
              cutting-edge science to bring out your skin's natural beauty.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <IconButton color="inherit">
                <Facebook />
              </IconButton>
              <IconButton color="inherit">
                <Instagram />
              </IconButton>
              <IconButton color="inherit">
                <Twitter />
              </IconButton>
              <IconButton color="inherit">
                <Pinterest />
              </IconButton>
              <IconButton color="inherit">
                <YouTube />
              </IconButton>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" gutterBottom>
              Shop
            </Typography>
            <Box component="ul" sx={{ p: 0, m: 0, listStyle: 'none' }}>
              <Box component="li" sx={{ mb: 1 }}>
                <Link href="/products" color="inherit" underline="hover">
                  All Products
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link href="/products?category=face" color="inherit" underline="hover">
                  Face Care
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link href="/products?category=body" color="inherit" underline="hover">
                  Body Care
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link href="/products?category=hair" color="inherit" underline="hover">
                  Hair Care
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link href="/products?category=sets" color="inherit" underline="hover">
                  Sets & Gifts
                </Link>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" gutterBottom>
              About
            </Typography>
            <Box component="ul" sx={{ p: 0, m: 0, listStyle: 'none' }}>
              <Box component="li" sx={{ mb: 1 }}>
                <Link href="/about" color="inherit" underline="hover">
                  Our Story
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link href="/ingredients" color="inherit" underline="hover">
                  Ingredients
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link href="/sustainability" color="inherit" underline="hover">
                  Sustainability
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link href="/careers" color="inherit" underline="hover">
                  Careers
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link href="/press" color="inherit" underline="hover">
                  Press
                </Link>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" gutterBottom>
              Help
            </Typography>
            <Box component="ul" sx={{ p: 0, m: 0, listStyle: 'none' }}>
              <Box component="li" sx={{ mb: 1 }}>
                <Link href="/contact" color="inherit" underline="hover">
                  Contact Us
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link href="/faq" color="inherit" underline="hover">
                  FAQs
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link href="/shipping" color="inherit" underline="hover">
                  Shipping
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link href="/returns" color="inherit" underline="hover">
                  Returns
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link href="/track-order" color="inherit" underline="hover">
                  Track Order
                </Link>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" gutterBottom>
              Legal
            </Typography>
            <Box component="ul" sx={{ p: 0, m: 0, listStyle: 'none' }}>
              <Box component="li" sx={{ mb: 1 }}>
                <Link href="/terms" color="inherit" underline="hover">
                  Terms of Service
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link href="/privacy" color="inherit" underline="hover">
                  Privacy Policy
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link href="/cookies" color="inherit" underline="hover">
                  Cookie Policy
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link href="/accessibility" color="inherit" underline="hover">
                  Accessibility
                </Link>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, bgcolor: 'rgba(255, 255, 255, 0.2)' }} />

        <Typography variant="body2" align="center">
          © {new Date().getFullYear()} SkinCare Shop. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer; 