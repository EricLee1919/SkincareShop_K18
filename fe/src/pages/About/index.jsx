import { Container, Box, Typography, Paper, Grid } from "@mui/material";
import Layout from "../../components/layout/Layout";

const About = () => {
  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 4 }}>
              <Typography variant="h3" gutterBottom align="center">
                About Us
              </Typography>
              <Typography
                variant="h6"
                color="text.secondary"
                gutterBottom
                align="center"
              >
                Your Trusted Skincare Partner
              </Typography>

              <Box sx={{ mt: 4 }}>
                <Typography variant="body1" paragraph>
                  Welcome to SkinCare Shop K18, your premier destination for
                  high-quality skincare products. We are dedicated to providing
                  our customers with the best skincare solutions that help
                  maintain healthy, radiant skin.
                </Typography>

                <Typography variant="body1" paragraph>
                  Our mission is to empower individuals to achieve their
                  skincare goals by offering carefully curated products from
                  trusted brands. We believe that everyone deserves access to
                  effective skincare solutions that work.
                </Typography>

                <Typography variant="body1" paragraph>
                  At SkinCare Shop K18, we:
                </Typography>
                <Box component="ul" sx={{ pl: 4 }}>
                  <Typography component="li" variant="body1">
                    Offer a wide selection of premium skincare products
                  </Typography>
                  <Typography component="li" variant="body1">
                    Provide expert advice and recommendations
                  </Typography>
                  <Typography component="li" variant="body1">
                    Ensure all products are authentic and safe
                  </Typography>
                  <Typography component="li" variant="body1">
                    Deliver excellent customer service
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default About;
