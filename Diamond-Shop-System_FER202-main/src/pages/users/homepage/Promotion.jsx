import { Box, Container, Grid, Typography } from "@mui/material";

export default function Promotion() {
  return (
    <Box position="relative" width="100%" sx={{ mb: 5 }}>
      <Box
        sx={{
          backgroundImage: `url('https://sloovi-blog.s3.us-east-2.amazonaws.com/wp-content/uploads/2022/07/16105441/1-sales-promotion.webp')`,
          backgroundSize: "cover",
          backgroundPosition: "0 40%",
          backgroundRepeat: "no-repeat",
          height: "40vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      ></Box>

      <Container sx={{ mt: 5 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom textAlign="center">

          Get exclusive promotions and discounts on our products and services!

          We are thrilled to introduce a range of exclusive promotional programs and discount packages that are available only at our esteemed diamond store. Our commitment to excellence ensures that every piece of diamond jewelry you purchase from us is of the highest quality, accompanied by unparalleled customer service.        </Typography>
        <Grid container spacing={2} sx={{ marginTop: "1rem" }}>
          <Grid item xs={12} sm={6} md={6}>
            <Box
              sx={{
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                overflow: "hidden",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                textAlign: "center",
                backgroundColor: "#f9f9f9",
                "& img": {
                  width: "100%",
                  height: "300px",
                },
                "&:hover": {
                  boxShadow: "0 8px 10px rgba(0, 0, 0, 0.15)",
                },
              }}
            >
              <img
                src="https://quejewelry.vn/wp-content/uploads/2023/10/Kim-cuong-thien-nhien-mau-dac-biet.jpg.webp"
                alt="Rare Colors"
              />
              <Box sx={{ padding: "16px" }}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Rare Colors
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Get <span style={{ color: "red" }}>10%</span> off +{" "}
                  <span style={{ color: "red" }}>2% GIA</span> when buying with
                  a shell
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box
              sx={{
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                overflow: "hidden",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                textAlign: "center",
                backgroundColor: "#f9f9f9",
                "& img": {
                  width: "180%",
                  height: "300px",
                },
                "&:hover": {
                  boxShadow: "0 8px 10px rgba(0, 0, 0, 0.15)",
                },
              }}
            >
              <img
                src="https://i.ytimg.com/vi/JkybfyLO2FI/maxresdefault.jpg"
                style = {{objectPosition: "bottom" }}
              />
              <Box sx={{ padding: "16px" }}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Clarity
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Get <span style={{ color: "red" }}>10%</span> off
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box
              sx={{
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                overflow: "hidden",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                textAlign: "center",
                backgroundColor: "#f9f9f9",
                "& img": {
                  width: "100%",
                  height: "300px",
                },
                "&:hover": {
                  boxShadow: "0 8px 10px rgba(0, 0, 0, 0.15)",
                },
              }}
            >
              <img
                src="https://kimcuongdaquy.info/wp-content/uploads/2021/01/Kim-cuong-la-gi-cover-1700x956-1-1700x956.jpg"
                alt="Shapes"
              />
              <Box sx={{ padding: "16px" }}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Shapes
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Get <span style={{ color: "red" }}>15%</span> off
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box
              sx={{
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                overflow: "hidden",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                textAlign: "center",
                backgroundColor: "#f9f9f9",
                "& img": {
                  width: "100%",
                  height: "300px",
                },
                "&:hover": {
                  boxShadow: "0 8px 10px rgba(0, 0, 0, 0.15)",
                },
              }}
            >
              <img
                src="https://bizweb.dktcdn.net/100/337/476/products/img-3267-ccb63dd2-98bb-489b-bdad-d1a5cef795e1.jpg?v=1713847937997"
                alt="Hot deal"
              />
              <Box sx={{ padding: "16px" }}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Hot Deal
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Get <span style={{ color: "red" }}>48%</span> off
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box
              sx={{
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                overflow: "hidden",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                textAlign: "center",
                backgroundColor: "#f9f9f9",
                "& img": {
                  width: "100%",
                  height: "300px",
                },
                "&:hover": {
                  boxShadow: "0 8px 10px rgba(0, 0, 0, 0.15)",
                },
              }}
            >
              <img
                src="https://www.tierra.vn/files/overview-km-kc-desk-xjyKTwwN1P.webp"
                alt="Large Diamond"
              />
              <Box sx={{ padding: "16px" }}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Large Diamond
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Prices from only{" "}
                  <span style={{ color: "red" }}>90 million</span> VND
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <Box
              sx={{
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                overflow: "hidden",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                textAlign: "center",
                backgroundColor: "#f9f9f9",
                "& img": {
                  width: "100%",
                  height: "300px",
                },
                "&:hover": {
                  boxShadow: "0 8px 10px rgba(0, 0, 0, 0.15)",
                },
              }}
            >
              <img
                src="https://www.miningreview.com/wp-content/uploads/2023/11/214783365_l_normal_none-1.jpg  "
                alt="Special Offer"
              />
              <Box sx={{ padding: "16px" }}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Special Offer
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Get <span style={{ color: "red" }}>15%</span> off
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}