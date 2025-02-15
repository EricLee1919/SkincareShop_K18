import {
  Facebook,
  Instagram,
  LinkedIn,
  Pinterest,
  Share,
  Twitter,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import { useEffect } from "react";

const navbarHeight = 80; // Adjust this value based on your navbar's height

export default function Measure() {

  useEffect(() => {
    const handleHashChange = () => {
      const { hash } = window.location;
      if (hash) {
        const element = document.querySelector(hash);
        if (element) {
          const offsetTop = element.offsetTop - navbarHeight;
          window.scrollTo({
            top: offsetTop,
            behavior: "smooth",
          });
        }
      }
    };

    const handleLinkClick = (event) => {
      const targetId = event.target.getAttribute("href");
      if (targetId && targetId.startsWith("#")) {
        const element = document.querySelector(targetId);
        if (element) {
          event.preventDefault();
          const offsetTop = element.offsetTop - navbarHeight;
          window.scrollTo({
            top: offsetTop,
            behavior: "smooth",
          });
        }
      }
    };

    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", handleLinkClick);
    });

    // Initial check if there is a hash in the URL
    handleHashChange();

    window.addEventListener("hashchange", handleHashChange, false);

    return () => {
      window.removeEventListener("hashchange", handleHashChange, false);
      document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.removeEventListener("click", handleLinkClick);
      });
    };
  }, []);

  return (
    <Box sx={{mt: 3}}>
      <Box
        sx={{
          backgroundImage: `url('https://www.lialijewellery.com/pub/media/catalog/category/Diamond_Engagement_Ring.jpg')`,
          backgroundSize: "cover", // Đảm bảo hình ảnh bao phủ toàn bộ phần tử
          backgroundPosition: "10% 60%", // Đặt hình ảnh ở giữa
          backgroundRepeat: "no-repeat", // Không lặp lại hình ảnh
          height: "50vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      ></Box>
      <Container>
        <Typography
          variant="h2"
          gutterBottom
          fontWeight="bold"
          sx={{ marginTop: "1rem", fontFamily: "Times New Roman" }}
        >
          Instructions for measuring size and ring size
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="body3" color="text.secondary">
              02/07/2024
            </Typography>
          </Grid>
          <Grid item xs={6} sx={{ textAlign: "right" }}>
            <Typography variant="body3" color="text.secondary">
              Reading time: 9 Minutes
            </Typography>
          </Grid>
        </Grid>
        <br />
        <Divider />

        <Box sx={{ marginTop: "2rem", marginBottom: "2rem" }}>
          <Box display="flex" justifyContent="right" mb={2}>
            <IconButton
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#3b5998" }}
            >
              <Facebook />
            </IconButton>
            <IconButton
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#00acee" }}
            >
              <Twitter />
            </IconButton>
            <IconButton
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#0e76a8" }}
            >
              <LinkedIn />
            </IconButton>
            <IconButton
              href="https://pinterest.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#c8232c" }}
            >
              <Pinterest />
            </IconButton>
            <IconButton
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#E1306C" }}
            >
              <Instagram />
            </IconButton>
          </Box>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Diamond Jewelry will guide you on how to measure your ring size at
            home and secretly measure a ring to surprise your loved one,
            especially for those special moments in life. With the tips in this
            article, you can easily shop for gold rings, silver rings, wedding
            rings, diamond rings, or couple rings online without any worries.
          </Typography>
        </Box>
        <Paper
          elevation={3}
          style={{ padding: "1rem", marginBottom: "2rem", marginTop: "2rem" }}
        >
          <List component="nav">
            <ListItem>
              <Link
                href="#section1"
                underline="none"
                sx={{
                  color: "#AFADB7",
                  "&:hover": {
                    color: "#B19567",
                  },
                }}
              >
                <ListItemText primary="Diamond Jelwelry ring size chart" />
              </Link>
            </ListItem>
            <ListItem>
              <Link
                href="#section2"
                underline="none"
                sx={{
                  color: "#AFADB7",
                  "&:hover": {
                    color: "#B19567",
                  },
                }}
              >
                <ListItemText primary="The simplest ways to measure ring size" />
              </Link>
            </ListItem>
            <ListItem>
              <Link
                href="#section3"
                underline="none"
                sx={{
                  color: "#AFADB7",
                  "&:hover": {
                    color: "#B19567",
                  },
                }}
              >
                <ListItemText primary="Notes when measuring" />
              </Link>
            </ListItem>
            <ListItem>
              <Link
                href="#section4"
                underline="none"
                sx={{
                  color: "#AFADB7",
                  "&:hover": {
                    color: "#B19567",
                  },
                }}
              >
                <ListItemText primary="Secret tips for measuring ring size" />
              </Link>
            </ListItem>
          </List>
        </Paper>

        <Box
          display="flex"
          flexDirection="column"
          gap={4}
          style={{ padding: "1rem", marginBottom: "2rem" }}
        >
          <Box id="section1">
            <Typography variant="h5" gutterBottom fontWeight="bold">
              Diamond Jewelry ring size chart
            </Typography>
            <Typography variant="body1" gutterBottom>
              Diamond Jewelry women’s ring sizes range from size 4.5 – 8.5.
              Diamond Shop men’s ring sizes range from size 9 – 13.5.
            </Typography>
            <img
              src="https://www.moonlessweb.com/cdn/shop/articles/Screen_Shot_2022-03-21_at_2.49.17_AM.png?v=1647845376"
              alt="Ring Size Chart"
              style={{ width: "50%", display: "block", margin: "1rem auto" }}
            />
          </Box>

          <Box id="section2">
            <Typography variant="h5" gutterBottom fontWeight="bold">
              The simplest ways to measure ring size
            </Typography>
            <Typography variant="body1" gutterBottom fontWeight="bold">
              Measuring with paper & ruler
            </Typography>
            <Typography variant="body1" gutterBottom>
              Step 1: Prepare a ruler, a pair of scissors, a pen, and a piece of
              paper.
            </Typography>
            <Typography variant="body1" gutterBottom>
              Step 2: Cut a piece of paper about 10 cm long and 1 cm wide.
            </Typography>
            <Typography variant="body1" gutterBottom>
              Step 3: Use the cut piece of paper to wrap around the finger you
              want to measure.
            </Typography>
            <Typography variant="body1" gutterBottom>
              Step 4: Mark the overlapping point.
            </Typography>
            <Typography variant="body1" gutterBottom>
              Step 5: Remove and measure the length of the paper from the
              starting point to the marked point. Divide the measurement by
              3.14. Then compare the result with the ring size chart.
            </Typography>
            <img
              src="https://www.pnj.com.vn/blog/wp-content/uploads/2021/11/huong-dan-do-size-nhan-2.jpg"
              alt="Measuring with paper & ruler"
              style={{ width: "70%", display: "block", margin: "0 auto" }}
            />
            <Typography variant="body1" gutterBottom fontWeight="bold">
              Measuring using an existing ring
            </Typography>
            <Typography variant="body1" gutterBottom>
              Step 1: Prepare a ruler and the ring you want to measure.
            </Typography>
            <Typography variant="body1" gutterBottom>
              Step 2: Compare the ruler's millimeters with the sizes on the ring
              size chart above.
            </Typography>
            <img
              src="https://www.pnj.com.vn/blog/wp-content/uploads/2021/11/huong-dan-do-size-nhan-3.jpg"
              alt="Measuring using an existing ring"
              style={{ width: "70%", display: "block", margin: "1rem auto" }}
            />
          </Box>

          <Box id="section3">
            <Typography variant="h5" gutterBottom fontWeight="bold">
              Notes when measuring
            </Typography>
            <Typography variant="body1" gutterBottom fontWeight="bold">
              Finger size depends on temperature
            </Typography>
            <Typography variant="body1" gutterBottom>
              Temperature can cause inaccurate ring size measurements. When it's
              cold, your finger may be smaller than usual, so add 1 mm to the
              circumference. When it's hot, subtract 1 mm. If your finger joints
              are large, measure the circumference near the joint (not on the
              joint) so that the ring can be worn easily but not fall off.
            </Typography>
            <Typography variant="body1" gutterBottom fontWeight="bold">
              Pay attention to the thickness of rings
            </Typography>
            <Typography variant="body1" gutterBottom>
              The thickness of the ring also affects each person’s ring size.
              For rings like gold rings, silver rings, especially Diamond
              Jewelry wedding rings, the thickness varies. Therefore, when
              measuring, you need to pay attention and adjust the size to ensure
              the ring is comfortable to wear.
            </Typography>
            <img
              src="https://cdn.shopify.com/s/files/1/2175/7819/files/Ring_Dimensions_480x480.png?v=1683842305"
              alt="Pay attention to the thickness of rings"
              style={{ width: "50%", display: "block", margin: "1rem auto" }}
            />
            <Typography variant="body1" gutterBottom fontWeight="bold">
              Be aware of finger joints
            </Typography>
            <Typography variant="body1" gutterBottom>
              Finger joints may be larger than the base of the finger. Measure
              both the joint and the base, then take the average size to choose
              the right ring size. This way, the ring will be comfortable and
              not cause discomfort when bending the finger.
            </Typography>
            <img
              src="https://www.pnj.com.vn/blog/wp-content/uploads/2021/11/huong-dan-do-size-nhan-6.jpg"
              alt="Be aware of finger joints"
              style={{ width: "30%", display: "block", margin: "1rem auto" }}
            />
            <Typography variant="body1" gutterBottom fontWeight="bold">
              Measure multiple times for the most accurate data
            </Typography>
            <Typography variant="body1" gutterBottom>
              There may be errors when measuring finger size, so carefully
              measure 3-4 times to find the most accurate measurement. This
              method will give you a measurement accuracy of 85-95%.
            </Typography>
            <Typography variant="body1" gutterBottom fontWeight="bold">
              Are men’s and women’s ring sizes different?
            </Typography>
            <Typography variant="body1" gutterBottom>
              Men and women have different hand sizes, but finger sizes are
              relatively similar. Therefore, you can measure ring sizes for men
              the same way as for women. This method can be applied to wedding
              rings, fashion rings, or silver rings.
            </Typography>
          </Box>

          <Box id="section4">
            <Typography variant="h5" gutterBottom fontWeight="bold">
              Secret tips for measuring ring size
            </Typography>
            <Typography variant="body1" gutterBottom fontWeight="bold">
              Borrowing a ring from the person you want to gift
            </Typography>
            <Typography variant="body1" gutterBottom>
              Men can secretly measure the size by pretending to borrow the ring
              (regular, fashion, or couple rings), then use a ruler to measure
              the inner circumference as instructed above.
            </Typography>
            <Typography variant="body1" gutterBottom fontWeight="bold">
              Asking for help from family members
            </Typography>
            <Typography variant="body1" gutterBottom>
              The simplest way to find out your loved one’s ring size without
              her noticing or suspecting is to ask for help from family members,
              like her mother, sisters, or friends. They can naturally get this
              information by asking and trying on rings.
            </Typography>
            <Typography variant="body1" gutterBottom fontWeight="bold">
              Observation and estimation
            </Typography>
            <Typography variant="body1" gutterBottom>
              If you can't measure or for some reason can't get the measurement,
              you can estimate the ring size based on height and weight
              according to the chart below:
            </Typography>
            <img
              src="https://cdn.shopify.com/s/files/1/0644/2958/8701/files/chon-size-nhan-theo-chieu-cao-can-nang_2048x2048.png?v=1684829695"
              alt="Observation and estimation"
              style={{ width: "60%", display: "block", margin: "1rem auto" }}
            />
            <Typography variant="body1" gutterBottom fontWeight="bold">
              Pretend to ask her to try on a ring to help you buy it for someone
              else
            </Typography>
            <Typography variant="body1" gutterBottom>
              In this way, you need to skillfully ask her to try on a ring,
              maybe a fashion ring or a gold ring you want to buy for your
              mother or sister. Meanwhile, pay attention to her finger size so
              you can easily buy a matching couple ring or wedding ring.
            </Typography>
            <img
              src="https://www.pnj.com.vn/blog/wp-content/uploads/2021/11/huong-dan-do-size-nhan-8.jpg"
              alt="Pretend to ask her to try on a ring to help you buy it for someone
              else"
              style={{ width: "60%", display: "block", margin: "1rem auto" }}
            />
            <Typography variant="body1" gutterBottom fontWeight="bold">
              Secretly measure naturally
            </Typography>
            <Typography variant="body1" gutterBottom>
              If the above methods are not effective, you can try:
            </Typography>
            <Typography variant="body1" gutterBottom>
              Measure her finger when she’s sleeping: You can also try this
              method. When she’s asleep, use a string or thread to measure her
              finger. If she wakes up, calmly say you’re caressing her hand to
              avoid suspicion.
            </Typography>
            <Typography variant="body1" gutterBottom>
              Compare your finger with hers: Observe carefully the joints and
              base of her finger compared to yours to find the most accurate
              ring size.
            </Typography>
            <br />
            <Typography variant="body1" gutterBottom>
              <strong>What if the ring doesn’t fit?</strong> Don’t worry!
              Diamond Jewelry offers free product exchange within 48 hours. Feel
              free to shop and experience the best customer service at Diamond
              Jewelry!
            </Typography>
          </Box>
        </Box>
        <Box display="flex" justifyContent="center" mb={5}>
          <Button
            variant="outlined"
            startIcon={<Share />}
            style={{ marginRight: "1rem" }}
          >
            Share
          </Button>
          <Button
            variant="outlined"
            startIcon={<Facebook style={{ color: "#3b5998" }} />}
            href="https://facebook.com"
            style={{ marginRight: "1rem" }}
          >
            Facebook
          </Button>
          <Button
            variant="outlined"
            startIcon={<Twitter style={{ color: "#00acee" }} />}
            href="https://twitter.com"
            style={{ marginRight: "1rem" }}
          >
            Twitter
          </Button>
          <Button
            variant="outlined"
            startIcon={<Pinterest style={{ color: "#c8232c" }} />}
            href="https://pinterest.com"
            style={{ marginRight: "1rem" }}
          >
            Pinterest
          </Button>
          <Button
            variant="outlined"
            startIcon={<LinkedIn style={{ color: "#0e76a8" }} />}
            href="https://linkedin.com"
          >
            LinkedIn
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
