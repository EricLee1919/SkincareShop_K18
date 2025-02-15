import {
  Box,
  Typography,
  Container,
  Grid,
  IconButton,
  Link,
} from "@mui/material";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import { Link as RouterLink } from "react-router-dom";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PhoneIphoneOutlinedIcon from "@mui/icons-material/PhoneIphoneOutlined";
import DiamondOutlinedIcon from "@mui/icons-material/DiamondOutlined";

const BannerImg = {
  backgroundImage: `url('https://wallpaperaccess.com/full/2474989.jpg')`,
  backgroundPosition: "10% 71%",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  color: "white",
};

const InfoLinks = [
  {
    title: "Home",
    link: "/",
  },
  {
    title: "Products",
    link: "/diamonds",
  },
  {
    title: "Measure Guide",
    link: "/measureguide",
  },
  {
    title: "Sale Off",
    link: "/saleoff",
  },
  {
    title: "About Us",
    link: "/aboutus",
  },
];

const AccountLinks = [
  {
    title: "Profile",
    link: "/profile",
  },
  {
    title: "Cart",
    link: "/cart",
  },
  {
    title: "FAQ",
    link: "/faqs",
  },
  {
    title: "Contact",
    link: "/contact",
  },
];

const navbarHeight = 80;

const Footer = () => {

  const scrollToTop = () => {
    window.scrollTo({
      top: navbarHeight,
      behavior: 'smooth',
    });
  };

  return (
    <Box style={BannerImg} >
      <Container sx={{ paddingTop: "2rem", paddingBottom: "0.5rem" }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={3}>
            <IconButton
              component={RouterLink}
              to="/"
              disableRipple
              onClick={scrollToTop}
              style={{ marginLeft: "3rem" }}
            >
              <DiamondOutlinedIcon fontSize="large" sx={{ color: "#B19567" }} />
            </IconButton>
            <br />
            <Typography
              variant="h4"
              fontWeight="bold"
              component={RouterLink}
              to="/"
              onClick={scrollToTop}
              style={{
                color: "#B19567",
                marginBottom: "10px",
                textDecoration: "none",
              }}
            >
              Beauty Shop
            </Typography>
            <Typography
              variant="body2"
              sx={{ marginTop: "1rem", color: "#ccc" }}
            >
              Feel Beautiful, Be Unstoppable.
            </Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Information
            </Typography>
            <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
              {InfoLinks.map((link) => (
                <li key={link.title} style={{ marginBottom: "8px" }}>
                  <Link
                    component={RouterLink}
                    to={link.link}
                    onClick={scrollToTop}
                    style={{ color: "#ccc", textDecoration: "none" }}
                    onMouseEnter={(e) => (e.target.style.color = "#B19567")}
                    onMouseLeave={(e) => (e.target.style.color = "#ccc")}
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Account
            </Typography>
            <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
              {AccountLinks.map((link) => (
                <li key={link.title} style={{ marginBottom: "8px" }}>
                  <Link
                    component={RouterLink}
                    to={link.link}
                    onClick={scrollToTop}
                    style={{ color: "#ccc", textDecoration: "none" }}
                    onMouseEnter={(e) => (e.target.style.color = "#B19567")}
                    onMouseLeave={(e) => (e.target.style.color = "#ccc")}
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Contact Us
            </Typography>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <LocationOnOutlinedIcon sx={{ color: "#ccc" }} />
              <Typography variant="body2" sx={{ color: "#ccc" }}>Vinhomes Grand Park</Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <PhoneIphoneOutlinedIcon sx={{ color: "#ccc" }} />
              <Typography variant="body2" sx={{ color: "#ccc" }}>+84 794442282</Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Link
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ textDecoration: "none" }}
              >
                <IconButton
                  aria-label="instagram"
                  sx={{
                    color: "#ccc",
                    "&:hover": {
                      color: "#B19567",
                    },
                  }}
                >
                  <FaInstagram />
                </IconButton>
              </Link>
              <Link
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ textDecoration: "none" }}
              >
                <IconButton
                  aria-label="facebook"
                  sx={{
                    color: "#ccc",
                    "&:hover": {
                      color: "#B19567",
                    },
                  }}
                >
                  <FaFacebook />
                </IconButton>
              </Link>
              <Link
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ textDecoration: "none" }}
              >
                <IconButton
                  aria-label="linkedin"
                  sx={{
                    color: "#ccc",
                    "&:hover": {
                      color: "#B19567",
                    },
                  }}
                >
                  <FaLinkedin />
                </IconButton>
              </Link>
            </Box>
          </Grid>
        </Grid>
      </Container>
      <Box
        sx={{
          color: "#fff",
          borderTop: "1px solid #fff",
          width: "100%",
          mt: 2,
          padding: "10px 0",
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={6} sx={{ display: "flex", justifyContent: "center" }}>
            <Typography variant="body2" color="#ccc">
              &copy; 2025 Beauty Shop. All rights reserved.
            </Typography>
          </Grid>
          <Grid item xs={6} sx={{ display: "flex", justifyContent: "center" }}>
            <Link
              href="https://www.visa.com"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ textDecoration: "none" }}
            >
              <img
                src="https://thietkelogo.com/wp-content/uploads/2017/10/visa_logo_sm.jpg"
                alt="Visa"
                style={{ width: "40px", height: "20px" }}
              />
            </Link>
            <Link
              href="https://www.mastercard.com"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ textDecoration: "none" }}
            >
              <img
                src="https://png.pngitem.com/pimgs/s/1-17788_mastercard-logo-transparent-vector-logo-png-mastercard-png.png"
                alt="MasterCard"
                style={{ width: "40px", height: "20px", marginLeft: "10px" }}
              />
            </Link>
            <Link
              href="https://vnpay.vn/"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ textDecoration: "none" }}
            >
              <img
                src="https://admin.softmaster.vn/_default_upload_bucket/154573132_152687123342645_1913382004205201124_n.png"
                alt="VNPay"
                style={{ width: "40px", height: "20px", marginLeft: "10px" }}
              />
            </Link>
            <Link
              href="https://www.momo.vn/"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ textDecoration: "none" }}
            >
              <img
                src="https://sieuthituivai.com/wp-content/uploads/2023/07/logo-momo-4.jpg"
                alt="MoMo"
                style={{
                  width: "40px",
                  height: "20px",
                  marginLeft: "10px",
                  objectPosition: "center",
                }}
              />
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Footer;
