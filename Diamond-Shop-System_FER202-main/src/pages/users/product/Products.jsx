import { useState, useEffect } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import { Box, Typography, Card, CardMedia, CardContent, Container, Stack, Skeleton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Products = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/diamonds')
      .then(response => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);


  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (loading) {
    return (
      <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" height="30vh" >
        <Skeleton variant="rounded" width={210} height={200} />
        <Skeleton variant="rounded" width={210} height={200} />
        <Skeleton variant="rounded" width={210} height={200} />
        <Skeleton variant="rounded" width={210} height={200} />
      </Stack>
    );
  }

  return (
    <Container maxWidth="lg" style={{ padding: '40px 0' }}>
      <Slider {...settings}>
        {products.length > 0 ? (
          products.map((product) => (
            <Box key={product.diamond_id} padding={2}>
              <Card onClick={() => handleProductClick(product.diamond_id)} style={{
                cursor: 'pointer', borderRadius: '15px', boxShadow: '0 4px 8px rgba(0,0,0,0.2)', marginLeft: '2em', transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.3)'
                }
              }}>
                <CardMedia
                  component="img"
                  height="auto"
                  image={product.image}
                  alt={product.name}
                  style={{ borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}
                />
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography variant="h7" gutterBottom fontWeight="bold">
                    {product.name}
                  </Typography>
                  <br />
                  <Typography variant="h8" style={{ color: '#B19567', fontWeight: 'bold' }}>
                    {product.price}đ
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))
        ) : (
          <Typography variant="body2" color="textSecondary" style={{ textAlign: 'center', marginTop: '20px' }}>
            No products found
          </Typography>
        )}
      </Slider>
    </Container>
  );
};

const SampleNextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "#000", borderRadius: "50%" }}
      onClick={onClick}
    />
  );
};

const SamplePrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "#000", borderRadius: "50%" }}
      onClick={onClick}
    />
  );
};

export default Products;
