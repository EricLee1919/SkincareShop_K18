import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box, Typography, Container, Grid, Avatar, Card, CardContent, CardHeader } from '@mui/material';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import VerifiedIcon from '@mui/icons-material/Verified';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
  },
});


const customerReviews = [
  {
    name: "Admin",
    role: "Reviewer",
    rating: 5,
    text: "Thank you so much!",
    date: "1 YEAR AGO",
    product: "Rigid necklace 24K",
    productImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQs2E5kg5eqcUNXVvJXMCcpqHF5fiD6Tb1jTg&s"
  },
  {
    name: "John Ema",
    role: "Reviewer",
    rating: 5,
    text: "An evening dress that reveals a woman's ankles while walking is the most disgusting...",
    date: "2 YEARS AGO",
    product: "Simple Product",
    productImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQs2E5kg5eqcUNXVvJXMCcpqHF5fiD6Tb1jTg&s"
  },
  {
    name: "Vysam",
    role: "Reviewer",
    rating: 5,
    text: "Go to a place where you're not going to be stressed, because a honeymoon itself...",
    date: "2 YEARS AGO",
    product: "Simple Product",
    productImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQs2E5kg5eqcUNXVvJXMCcpqHF5fiD6Tb1jTg&s"
  },
  {
    name: "George",
    role: "Reviewer",
    rating: 5,
    text: "I truly believe that philanthropy and commerce can work together.",
    date: "2 YEARS AGO",
    product: "Mesh flower earrings",
    productImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQs2E5kg5eqcUNXVvJXMCcpqHF5fiD6Tb1jTg&s"
  }
];

export default function ProductPromo() {

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* New Top Section */}
      <Box
        sx={{
          width: '100%',
          height: '400px',
          backgroundImage: `url('https://i.ytimg.com/vi/ZusJP4wSAxo/maxresdefault.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <Box sx={{ p: 4, position: 'relative', zIndex: 2 }}>
          <Typography variant="overline" display="block" gutterBottom>
            DIAMOND COMPANY
          </Typography>
          <Typography variant="h3" gutterBottom>
            We believe we can all make a difference.
          </Typography>
          <Typography variant="body1" gutterBottom>
            Aesthetic brunch polaroid bespoke, vice kale chips leggings 90's selfies raw denim.
          </Typography>
        </Box>
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1,
          }}
        />
      </Box>
      <Container sx={{ py: 8 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              sx={{
                width: '100%',
                height: 'auto',
                borderRadius: '10px',
                border: '4px solid #ffeb3b',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-10px)',
                },
              }}
              alt="Ring"
              src="https://ninetheme.com/themes/goldsmith/wp-content/uploads/2022/12/background-4-768x512.webp"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="overline" display="block" gutterBottom sx={{ color: '#ffeb3b' }}>
              RINGS
            </Typography>
            <Typography variant="h4" gutterBottom>
              Modern and eye-catching lines
            </Typography>
            <Typography variant="body1" gutterBottom>
              Inspired by the rebellious spirit of America and the intrigue of unwavering authenticity,
              R13 launched in Fall 2009. At the forefront of design, R13 cuts avant-garde silhouettes
              such as the skinny legging and harem pant from Italian and Turkish denim produced in
              Castelfranco, Italy. Pure indigo casting, quality stretch and machine hand mending give
              the jeans their superior shape.
            </Typography>
          </Grid>
        </Grid>

        <Grid container spacing={4} sx={{ mt: 8 }}>
          <Grid item xs={12} md={6}>
            <Typography variant="overline" display="block" gutterBottom sx={{ color: '#ffeb3b' }}>
              NECKLACES
            </Typography>
            <Typography variant="h4" gutterBottom>
              Exciting and innovative
            </Typography>
            <Typography variant="body1" gutterBottom>
              Inspired by the rebellious spirit of America and the intrigue of unwavering authenticity,
              R13 launched in Fall 2009. At the forefront of design, R13 cuts avant-garde silhouettes
              such as the skinny legging and harem pant from Italian and Turkish denim produced in
              Castelfranco, Italy. Pure indigo casting, quality stretch and machine hand mending give
              the jeans their superior shape and an authentic...
            </Typography>
            <Typography variant="body1" gutterBottom>
              Inspired by the rebellious spirit of America and the intrigue of unwavering authenticity,
              R13 launched in Fall 2009. At the forefront of design, R13 cuts avant-garde silhouettes
              such as the skinny legging and harem pant from Italian and Turkish denim produced in
              Castelfranco, Italy. Pure indigo casting, quality stretch and machine hand mending give
              the jeans their superior shape...
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              sx={{
                width: '100%',
                height: 'auto',
                borderRadius: '10px',
                border: '4px solid #ffeb3b',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-10px)',
                },
              }}
              alt="Necklace"
              src="https://ninetheme.com/themes/goldsmith/wp-content/uploads/2022/12/background-9-768x512.webp"
            />
          </Grid>
        </Grid>
      </Container>

      {/* New Section for Video */}
      <Box
        sx={{
          position: 'relative',
          width: '100vw',
          left: '50%',
          right: '50%',
          marginLeft: '-50vw',
          marginRight: '-50vw',
          height: '700px',
          overflow: 'hidden',
          mt: 8,
          backgroundColor: 'black',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: '50%',
            backgroundColor: 'black',
            color: 'white',
            zIndex: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            flexDirection: 'column',
          }}
        >
          <Box sx={{ p: 4 }}>
            <Typography variant="overline" display="block" gutterBottom>
              PRICE POLICY
            </Typography>
            <Typography variant="h4" gutterBottom>
              Popular understanding, <br /><u>diamonds</u> for everyone!
            </Typography>
            <Typography variant="body1" gutterBottom>
              Cardigan helvetica sriracha, portland celiac truffaut woke <br />artisan succulents cred art party slow-carb pinterest.
              Migas <br />humblebrag chicharrones everyday carry four loko.
            </Typography>
          </Box>
        </Box>
        <iframe
          width="100%"
          height="100%"
          src="https://www.youtube.com/embed/BGFjttL3-8A?autoplay=1&mute=1&loop=1&start=11&end=19&playlist=BGFjttL3-8A&controls=0&modestbranding=1&rel=0&disablekb=1"
          title="YouTube video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{
            position: 'absolute',
            width: '2000px',
            height: '1000px',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1,
            pointerEvents: 'none',  // Disable interaction
          }}
        ></iframe>
      </Box>

      {/* Customer Reviews Section */}
      <Container sx={{ py: 8 }}>
        <Typography variant="h4" gutterBottom textAlign="center">
          Customer Reviews
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {customerReviews.map((review, index) => (
            <Grid item xs={12} md={3} key={index}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: 'grey' }}>
                      {review.name[0]}
                    </Avatar>
                  }
                  action={
                    <VerifiedIcon color="primary" />
                  }
                  title={review.name}
                  subheader={review.role}
                />
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    {Array.from({ length: review.rating }, (_, i) => (
                      <Box key={i} component="span" sx={{ color: 'green', mr: 0.5 }}>★</Box>
                    ))}
                    <Typography variant="body2" color="text.secondary">
                      {review.rating}/5
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {review.text}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {review.date}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                    <Avatar alt={review.product} src={review.productImage} sx={{ width: 24, height: 24, mr: 1 }} />
                    <Typography variant="caption">{review.product}</Typography>
                  </Box>
                </CardContent>

              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </ThemeProvider>
  );
}