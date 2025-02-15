import React, { useState } from 'react';
import { createTheme, ThemeProvider, Container, Typography, Accordion, AccordionSummary, AccordionDetails, Grid, Box, Divider, CssBaseline } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import faqData from './FAQ_Data.jsx';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import PaymentIcon from '@mui/icons-material/Payment';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    background: {
      default: '#f5f5f5',
    },
    text: {
      primary: '#000',
      secondary: '#555',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h2: {
      fontWeight: 700,
      fontSize: '2.5rem',
      marginBottom: '0.5em',
    },
    subtitle1: {
      fontSize: '1.2rem',
      color: '#888',
    },
    body1: {
      fontSize: '1rem',
      color: '#333',
    },
    h5: {
      fontWeight: 500,
    },
  },
  components: {
    MuiAccordion: {
      styleOverrides: {
        root: {
          marginBottom: '10px',
          borderRadius: '8px',
          backgroundColor: '#ffffff',
          '&:before': {
            display: 'none',
          },
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #ccc',
          borderRadius: '8px',
          '&.Mui-expanded': {
            minHeight: '48px',
            borderBottom: 'none',
          },
        },
        content: {
          '&.Mui-expanded': {
            margin: '12px 0',
          },
        },
      },
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          padding: '16px',
          borderBottomLeftRadius: '8px',
          borderBottomRightRadius: '8px',
        },
      },
    },
  },
});

function FAQ() {
  const [expandedQuestion, setExpandedQuestion] = useState(false);

  const handleQuestionChange = (panel) => (event, isExpanded) => {
    setExpandedQuestion(isExpanded ? panel : false);
  };

  const renderFAQSection = (category, title) => (
    <Grid item xs={12} sm={6} key={category}>
      <Box mb={4} p={2} height="100%">
        <Typography variant="h5" align="center" gutterBottom>
          {title}
        </Typography>
        {faqData[category].map((faq, idx) => (
          <Accordion 
            key={idx} 
            expanded={expandedQuestion === faq.question} 
            onChange={handleQuestionChange(faq.question)}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{faq.question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography component="div">
                {faq.answers.map((answer, i) => (
                  <p key={i}>{answer}</p>
                ))}
                {faq.images && faq.images.map((image, i) => (
                  <img key={i} src={image} alt={`Guide ${i}`} style={{ maxWidth: '100%', marginTop: '10px', borderRadius: '8px' }} />
                ))}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Grid>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box position="relative" width="100%">
        <Box
          sx={{
            backgroundImage: `url('https://www.datocms-assets.com/39109/1647275691-de-beers-jewellers-alchemist-of-light-couture-collection.webp?auto=format&fit=max&w=1200')`,
            backgroundSize: "cover", // Đảm bảo hình ảnh bao phủ toàn bộ phần tử
            backgroundPosition: "top", // Đặt hình ảnh ở giữa
            backgroundRepeat: "no-repeat", // Không lặp lại hình ảnh
            height: "50vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        ></Box>
        <Box
          position="absolute"
          top="35%"
          left="47%"
          transform="translate(-50%, -50%)"
          color="#fff"
          textAlign="center"
        >
          <Typography variant="h2">FAQ</Typography>
        </Box>
      </Box>
      <Container
        maxWidth="xl"
        style={{
          marginTop: "2em",
          padding: "2em",
          borderRadius: "8px",
        }}
      >
        <Grid container spacing={3}>
          {renderFAQSection('ProductsAndServices', 'Products And Services')}
          {renderFAQSection('Shipping', 'Shipping')}
          {renderFAQSection('OrderAndPay', 'Order And Pay')}
          {renderFAQSection('ExchangeAndWarrantyPolicy', 'Exchange And Warranty Policy')}
        </Grid>
        <Divider style={{ margin: '40px 0' }} />
        <Box mt={4} mb={4}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Box textAlign="center">
                <LocalOfferOutlinedIcon fontSize="large" style={{ color: '#000000' }} />
                <Typography variant="h6">Amazing Value Every Day</Typography>
                <Typography variant="body1">Items prices that fit your budget</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box textAlign="center">
                <ThumbUpOutlinedIcon fontSize="large" style={{ color: '#000000' }} />
                <Typography variant="h6">Successful Customer Service</Typography>
                <Typography variant="body1">We work with a focus on 100% customer satisfaction.</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box textAlign="center">
                <PaymentIcon fontSize="large" style={{ color: '#000000' }} />
                <Typography variant="h6">All Payment Methods</Typography>
                <Typography variant="body1">Don't bother with payment details.</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box textAlign="center">
                <LocalShippingOutlinedIcon fontSize="large" style={{ color: '#000000' }} />
                <Typography variant="h6">Completely Free Shipping</Typography>
                <Typography variant="body1">We'll handle the shipping.</Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default FAQ;