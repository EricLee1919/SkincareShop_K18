
import { Box, Typography, Button, Container } from '@mui/material';
import img3 from '../../assets/images/img3.jpg';
import img13 from '../../assets/images/img13.jpg';
import { Link } from "react-router-dom"

const HandcraftedSection = () => {
  return (
    <Box style={{ display: 'flex', alignItems: 'center', padding: '40px 0' }}>
      <Container maxWidth="lg" style={{ display: 'flex', alignItems: 'center' }}>
        <Box style={{ flex: 1, paddingRight: '20px' }}>
          <Typography variant="h4" gutterBottom style={{ fontWeight: 'bold', color: '#2c3e50', fontFamily: 'serif' }}>
            Crafted With Love
          </Typography>
          <Typography variant="body1" gutterBottom style={{ color: '#2c3e50', fontFamily: 'serif' }}>
          Our premium cosmetics are crafted with high-quality ingredients and innovative formulas, 
          delivering exceptional results and unmatched beauty at an incredible value.
          </Typography>
          <Button variant="contained" component={Link}
            to="/jewelryknowledge" style={{ backgroundColor: '#2c3e50', color: 'white', fontFamily: 'serif', marginRight: 10, }}>
            ABOUT Products
          </Button>
          <Button variant="contained" component={Link}
            to="/diamondknowledge" style={{ backgroundColor: '#2c3e50', color: 'white', fontFamily: 'serif' }}>
            ABOUT US
          </Button>
        </Box>
        <Box style={{ flex: 1 }}>
          <img src={img13} alt="Manufactured With Pride" style={{ width: '710px', height: '568px', borderRadius: '15px' }} />
        </Box>
      </Container>
    </Box>
  );
};

export default HandcraftedSection;
