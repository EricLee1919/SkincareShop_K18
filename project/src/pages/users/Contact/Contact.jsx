import {
  Box,
  Container,
  Grid,
  Link,
  ThemeProvider,
  Typography,
} from "@mui/material";
import PlaceIcon from "@mui/icons-material/Place";
import PhoneIcon from "@mui/icons-material/Phone";
import CssBaseline from "@mui/material/CssBaseline";
import { theme } from "./ContactTheme";
import ContactForm from "./ContactForm";

export default function Contact() {
  return (
    <Box>
      <Box
        sx={{
          backgroundImage: `url('https://www.webfx.com/wp-content/uploads/2023/08/032431_40_Best_Contact_Us_Page_Designs.png')`,
          backgroundSize: "cover", // Đảm bảo hình ảnh bao phủ toàn bộ phần tử
          backgroundPosition: "0 30%", // Đặt hình ảnh ở giữa
          backgroundRepeat: "no-repeat", // Không lặp lại hình ảnh
          height: "50vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <Typography
          textAlign="center"
          variant="h2"
          gutterBottom
          sx={{ mt: 2, fontFamily: "Times New Roman", color: "white" }}
        >
          Contact Us
        </Typography>
      </Box>
      <Container sx={{ mt: 5 }}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Typography variant="h6" gutterBottom>
                At Diamond Jewelry shop, we are committed to providing
                exceptional customer service and ensuring your experience with
                us is nothing short of extraordinary. Whether you have a
                question about our stunning collection, need assistance with a
                purchase, or want to schedule a consultation, our dedicated team
                is here to help.
              </Typography>
              <br />
              <Box display="flex">
                <PlaceIcon sx={{ mr: 1 }} />
                <Typography variant="body1" gutterBottom>
                  Vinhomes Grand Park
                </Typography>
              </Box>
              <Box display="flex">
                <PhoneIcon sx={{ mr: 1 }} />
                <Typography gutterBottom> +84 794442282</Typography>
              </Box>
              <br />
              <Typography variant="body2" gutterBottom>
                <strong>Email:</strong>{" "}
                <Link
                  href="https://www.google.com/intl/vi/gmail/about/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  support@diamondjewelry.com
                </Link>
                <br />
                <strong>Facebook:</strong>{" "}
                <Link
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  @DiamondJewelry
                </Link>
                <br />
                <strong>Instagram:</strong>{" "}
                <Link
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  @DiamondJewelryOfficial
                </Link>
              </Typography>
            </Grid>
            <Grid item xs={6} sx={{ mb: 5 }}>
              <ContactForm />
            </Grid>
          </Grid>
        </ThemeProvider>
      </Container>
    </Box>
  );
}