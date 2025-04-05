import React from 'react';
import { Container, Typography, Box, Grid, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
}));

const About = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h2" component="h1" gutterBottom align="center" sx={{ mb: 6 }}>
        About Our Skincare Shop
      </Typography>

      <Box sx={{ mb: 6 }}>
        <Typography variant="h5" gutterBottom align="center" color="text.secondary">
          Your Journey to Healthy, Beautiful Skin Starts Here
        </Typography>
        <Typography variant="body1" align="center" paragraph>
          We are dedicated to providing high-quality skincare products that help you achieve and maintain healthy, radiant skin.
          Our carefully curated selection of products is designed to meet your unique skincare needs.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <StyledPaper elevation={3}>
            <Typography variant="h4" gutterBottom>
              Our Mission
            </Typography>
            <Typography variant="body1">
              To empower individuals with knowledge and products that enhance their natural beauty
              while promoting healthy skincare practices.
            </Typography>
          </StyledPaper>
        </Grid>

        <Grid item xs={12} md={4}>
          <StyledPaper elevation={3}>
            <Typography variant="h4" gutterBottom>
              Our Values
            </Typography>
            <Typography variant="body1">
              Quality, transparency, and customer satisfaction are at the heart of everything we do.
              We believe in providing honest recommendations and exceptional service.
            </Typography>
          </StyledPaper>
        </Grid>

        <Grid item xs={12} md={4}>
          <StyledPaper elevation={3}>
            <Typography variant="h4" gutterBottom>
              Our Promise
            </Typography>
            <Typography variant="body1">
              We carefully select each product in our collection, ensuring they meet our high standards
              for quality, effectiveness, and safety.
            </Typography>
          </StyledPaper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 6 }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
          Why Choose Us?
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom align="center">
              Expert Selection
            </Typography>
            <Typography variant="body2" align="center">
              Products chosen by skincare experts
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom align="center">
              Quality Guaranteed
            </Typography>
            <Typography variant="body2" align="center">
              Only the finest skincare products
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom align="center">
              Personalized Care
            </Typography>
            <Typography variant="body2" align="center">
              Tailored recommendations for your skin
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom align="center">
              Customer Support
            </Typography>
            <Typography variant="body2" align="center">
              Dedicated assistance when you need it
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default About; 