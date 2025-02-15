import { Box, Typography, Button, Container } from "@mui/material";
import img1 from "../../../assets/images/img1.jpg";
import img2 from "../../../assets/images/img2.jpg";
import img11 from "../../../assets/images/img11.jpg";
import img12 from "../../../assets/images/img12.jpg";

import Products from "../product/Products";
import HandcraftedSection from "../../../components/layout/HandcraftedSection";
import {Link} from "react-router-dom"

const HomePage = () => {
  return (
    <Box sx={{mt: 3}}>
      <Box
        style={{
          position: "relative",
          textAlign: "left",
          color: "black",
          width: "100%",
        }}
      >
        <img src={img11} alt="Hero" style={{ width: "100%", height: "auto" }} />
        <Container
          maxWidth="lg"
          style={{
            position: "absolute",
            top: "30%",
            left: "10%",
            color: "black",
            textAlign: "left",
          }}
        >
          <Typography variant="h6" gutterBottom style={{ color: "#6d6d6d" }}>
            UP TO 30% OFF
          </Typography>
          <Typography
            variant="h3"
            gutterBottom
            style={{ fontWeight: "bold", fontFamily: "serif" }}
          >
            For Love and Beauty
          </Typography>
          <Typography
            variant="h6"
            gutterBottom
            style={{ marginBottom: "20px", fontFamily: "serif" }}
          >
            Beauty That Lets You Shine Naturally. 
            <br />
            Your One-Stop Shop for Stunning Transformations.<br/> (and save up to 30%).
          </Typography>
        </Container>
      </Box>

      <Typography variant="h4" gutterBottom style={{ textAlign: 'center', marginTop: '40px' }}>
        Best Selling Products
      </Typography>

      <Products />

      <Box
        style={{
          position: "relative",
          textAlign: "left",
          color: "black",
          width: "100%",
        }}
      >
        <img
          src={img12}
          alt="Design Your Own Engagement Ring"
          style={{ width: "100%", height: "auto" }}
        />
        <Container
          maxWidth="lg"
          style={{
            position: "absolute",
            top: "50%",
            left: "10%",
            color: "white",
            textAlign: "left",
            transform: "translateY(-50%)",
          }}
        >
          <Typography
            variant="h3"
            gutterBottom
            style={{ fontWeight: "bold", fontFamily: "serif" }}
          >
            100% Organic
          </Typography>
          <Typography
            variant="h6"
            gutterBottom
            style={{
              marginBottom: "20px",
              maxWidth: "500px",
              fontFamily: "serif",
            }}
          >
            Elevate your beauty routine with carefully curated cosmetics 
            crafted to enhance your natural radiance. 
            Our expert selections are tailored to suit your unique style
             and skin needs, bringing confidence and elegance to every moment.
          </Typography>
          <Box>
            <Button
              variant="contained"
              component={Link}
            to="/diamonds"
              style={{
                backgroundColor: "#2c3e50",
                color: "white",
                fontFamily: "serif",
              }}
            >
              SHOP NOW
            </Button>
          </Box>
        </Container>
      </Box>

      <HandcraftedSection />
    </Box>
  );
};

export default HomePage;
