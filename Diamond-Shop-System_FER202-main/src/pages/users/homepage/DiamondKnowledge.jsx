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
import {
  Facebook,
  Instagram,
  LinkedIn,
  Pinterest,
  Share,
  Twitter,
} from "@mui/icons-material";
import { useEffect } from "react";

const navbarHeight = 80; // Adjust this value based on your navbar's height

export default function DiamondKnowledge() {

  useEffect(() => {
    const handleHashChange = () => {
      const { hash } = window.location;
      if (hash) {
        const element = document.querySelector(hash);
        if (element) {
          const offsetTop = element.offsetTop - navbarHeight;
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth',
          });
        }
      }
    };

    const handleLinkClick = (event) => {
      const targetId = event.target.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        const element = document.querySelector(targetId);
        if (element) {
          event.preventDefault();
          const offsetTop = element.offsetTop - navbarHeight;
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth',
          });
        }
      }
    };

    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', handleLinkClick);
    });

    // Initial check if there is a hash in the URL
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange, false);

    return () => {
      window.removeEventListener('hashchange', handleHashChange, false);
      document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.removeEventListener('click', handleLinkClick);
      });
    };
  }, []);

  return (
    <Box sx={{mt: 3}}>
      <Box
        sx={{
          backgroundImage: `url('https://cdn.wallpapersafari.com/57/31/7vCJNK.jpg')`,
          backgroundSize: "cover", // Đảm bảo hình ảnh bao phủ toàn bộ phần tử
          backgroundPosition: "10% 50%", // Đặt hình ảnh ở giữa
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
          Knowledge about Diamond
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="body3" color="text.secondary">
              02/07/2024
            </Typography>
          </Grid>
          <Grid item xs={6} sx={{ textAlign: "right" }}>
            <Typography variant="body3" color="text.secondary">
              Reading time: 20 Minutes
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
            To choose a truly "luxurious" diamond, consumers, especially
            well-known diamond enthusiasts, must go through a thorough learning
            process to make a wise "investment" in diamonds. Therefore, to
            appraise the value of a diamond, we first need to understand the 4C
            standards, followed by the Rapaport Diamond Price List. The
            following article will provide readers with knowledge on how to
            appraise the value of diamonds in the market, where traps of "fake
            diamonds" and "sky-high prices" are increasingly prevalent.
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
                <ListItemText primary="Diamond pricing factors" />
              </Link>
            </ListItem>
            <ListItem>
              <Link
                href="#section2"
                underline="none"
                sx={{
                  ml: 3,
                  color: "#AFADB7",
                  "&:hover": {
                    color: "#B19567",
                  },
                }}
              >
                <ListItemText primary="Weight (Carat) - The first pricing factor" />
              </Link>
            </ListItem>
            <ListItem>
              <Link
                href="#section3"
                underline="none"
                sx={{
                  ml: 3,
                  color: "#AFADB7",
                  "&:hover": {
                    color: "#B19567",
                  },
                }}
              >
                <ListItemText primary="Color - The second pricing factor" />
              </Link>
            </ListItem>
            <ListItem>
              <Link
                href="#section4"
                underline="none"
                sx={{
                  ml: 3,
                  color: "#AFADB7",
                  "&:hover": {
                    color: "#B19567",
                  },
                }}
              >
                <ListItemText primary="Clarity - The third pricing factore" />
              </Link>
            </ListItem>
            <ListItem>
              <Link
                href="#section5"
                underline="none"
                sx={{
                  ml: 3,
                  color: "#AFADB7",
                  "&:hover": {
                    color: "#B19567",
                  },
                }}
              >
                <ListItemText primary="Cut - The fourth pricing factor" />
              </Link>
            </ListItem>
            <ListItem>
              <Link
                href="#section6"
                underline="none"
                sx={{
                  color: "#AFADB7",
                  "&:hover": {
                    color: "#B19567",
                  },
                }}
              >
                <ListItemText primary="How to calculate the price of diamonds?" />
              </Link>
            </ListItem>
            <ListItem>
              <Link
                href="#section7"
                underline="none"
                sx={{
                  ml: 3,
                  color: "#AFADB7",
                  "&:hover": {
                    color: "#B19567",
                  },
                }}
              >
                <ListItemText primary=" Price per carat" />
              </Link>
            </ListItem>
            <ListItem>
              <Link
                href="#section8"
                underline="none"
                sx={{
                  ml: 3,
                  color: "#AFADB7",
                  "&:hover": {
                    color: "#B19567",
                  },
                }}
              >
                <ListItemText primary=" Rapaport diamond price list" />
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
            <Typography variant="h4" gutterBottom fontWeight="bold">
              Diamond pricing factors
            </Typography>
            <Typography variant="body1" gutterBottom>
              Diamonds are fundamentally priced based on the 4C standards, which include:
            </Typography>
            <Typography variant="body1" gutterBottom sx={{ ml: 3 }}>
              - <strong>Carat:</strong> The weight or size of the diamond.
            </Typography>
            <Typography variant="body1" gutterBottom sx={{ ml: 3 }}>
              - <strong>Color:</strong> The color of the diamond.
            </Typography>
            <Typography variant="body1" gutterBottom sx={{ ml: 3 }}>
              - <strong>Clarity:</strong> The purity or cleanliness of the diamond, referring to the absence of internal inclusions and external blemishes.
            </Typography>
            <Typography variant="body1" gutterBottom sx={{ ml: 3 }}>
              - <strong>Cut:</strong> The cut or the relative proportions and angles of the facets on the diamond.
            </Typography>
            <Typography variant="body1" gutterBottom>
              Additionally, sometimes diamonds are evaluated based on the 5C standards, which include "Cost" (price) alongside the original 4Cs, or even the 6C standards with "Certification" (authenticity certification). There is also consideration for the "Shape" of the diamond: round, square, rectangular, oval, etc.
            </Typography>
            <Typography variant="body1" gutterBottom>
              To appraise a diamond, the first criterion that diamond appraisers and knowledgeable enthusiasts consider is the 4Cs. As introduced in the series "Diamond Classification and Proper Care Guide" (see more at the provided link), the 4Cs stand for Carat (weight), Color, Clarity, and Cut. Therefore, before we proceed with calculations, the most important thing is to study its 4Cs. Each "C" plays an essential role in making a diamond beautiful, luxurious, and rare.
            </Typography>
          </Box>
          <Box id="section2">
            <Typography variant="h5" gutterBottom fontWeight="bold">
              Weight (Carat) - The first pricing factor
            </Typography>
            <img
              src="https://static.wixstatic.com/media/452282_8564f860e9fe496aade2c34fb0b82a92~mv2.png/v1/fill/w_925,h_254,al_c,lg_1,q_85,enc_auto/452282_8564f860e9fe496aade2c34fb0b82a92~mv2.png"
              alt="Weight (Carat) - The first pricing factor"
              style={{ width: "60%", display: "block", margin: "1rem auto" }}
            />
            <Typography variant="body1" gutterBottom>
              The first "C" is carat, a unit of weight. Carat is used to refer to the size of a diamond, but this can be misleading.
            </Typography>
            <Typography variant="body1" gutterBottom>
              Carat is a very important factor in diamond pricing because it indicates the rarity of a diamond. Most diamonds found today are around 1 carat, and most diamonds sold as jewelry range between 1 and 2 carats. The larger the diamond, the rarer it is, and thus its price increases. This is especially true for colored diamonds, where a 2-carat colored diamond can be equivalent in price to a 10+ carat colorless diamond. Therefore, it all depends on the other three Cs. Additionally, the value of a diamond does not increase proportionally with carat size-a 3-carat diamond is not three times the price of a 1-carat diamond.
            </Typography>
          </Box>
          <Box id="section3">
            <Typography variant="h5" gutterBottom fontWeight="bold">
              Color - The second pricing factor
            </Typography>
            <Typography variant="body1" gutterBottom>
              Most diamonds that are found and purchased are classified as colorless diamonds. When grading the color quality of these diamonds, the absence of color is what we look for. The more colorless a diamond is, the rarer and more valuable it is, and thus its price is higher. The categories in color grading do not reflect the price increase of diamonds. Generally, most people will buy diamonds in the G-H-I category if they are not overly concerned with the diamond's internal quality. This mainly relates to the price of diamonds in this category.
            </Typography>
            <img
              src="https://hollowaydiamonds.com.au/wp-content/uploads/2021/10/Holloway-Diamonds-Diamonds-Colour-Chart.jpg"
              alt="Color - The second pricing factor"
              style={{ width: "50%", display: "block", margin: "1rem auto" }}
            />
            <Typography variant="body1" gutterBottom>
              For the most part, you will not see any yellow tint in the G-H-I category. However, if you are interested in having a perfectly colorless diamond, Saga recommends choosing diamonds in the D-E-F category. If you are considering purchasing a diamond as an investment, Saga suggests choosing a D color diamond. This is a factor that drives up the price of diamonds, but consider the following factors as well.
            </Typography>
          </Box>
          <Box id="section4">
            <Typography variant="h5" gutterBottom fontWeight="bold">
              Clarity - The third pricing factor
            </Typography>
            <Typography variant="body1" gutterBottom>
              The final of the three main factors that determine the price of a diamond is its clarity. Clarity includes both internal inclusions and external blemishes on the diamond, such as crystals, clouds, white spots, or tiny specks within the diamond.
            </Typography>
            <img
              src="https://brentwallace.net/sites/assets/images/shared/diamond-clarity1.png"
              alt="Clarity - The third pricing factor"
              style={{ width: "30%", display: "block", margin: "1rem auto" }}
            />
            <Typography variant="body1" gutterBottom>
              Clarity plays a crucial role in pricing diamonds. Diamond enthusiasts or prospective buyers do not want any inclusions in their diamonds. This is why most people do not choose diamonds with clarity lower than VS2. Diamonds with clarity grades from I1 to I3 are no longer used in jewelry, making them an unsuitable choice for diamond connoisseurs. However, if you are interested in purchasing diamonds as an investment, Saga recommends buying a Flawless diamond (completely free of internal and external flaws). Once again, consider the next factor as well.
            </Typography>
          </Box>
          <Box id="section5">
            <Typography variant="h5" gutterBottom fontWeight="bold">
              Cut - The fourth pricing factor
            </Typography>
            <img
              src="https://static.wixstatic.com/media/452282_2f4c7ed8bac84166a94a3093671a0258~mv2.png/v1/fill/w_525,h_302,al_c,lg_1,q_85,enc_auto/452282_2f4c7ed8bac84166a94a3093671a0258~mv2.png"
              alt="Clarity - The third pricing factor"
              style={{ width: "50%", display: "block", margin: "1rem auto" }}
            />
            <Typography variant="body1" gutterBottom>
              You will not see the cut of a diamond listed on diamond price charts, but it plays a crucial role in contributing to the diamond's value. When a diamond is mined, it is called a rough diamond. Its shape is very irregular. Diamond cutting machines then analyze the diamond to determine the optimal method to cut it to maximize yield and perfection. This is when the thickness of the pavilion is formed.
            </Typography>
            <Typography variant="body1" gutterBottom>
              Next, the cut diamonds are polished to make the facets perfectly aligned and symmetrical. Generally, this polishing process makes the diamond radiant and sparkling. The cut of the diamond determines how light enters the diamond and reflects outward. Therefore, this final factor, the brightness of the diamond, significantly determines the value of a particular diamond.
            </Typography>
          </Box>
          <Box id="section6">
            <Typography variant="h4" gutterBottom fontWeight="bold">
              How to calculate the price of diamonds?
            </Typography>
            <Typography variant="body1" gutterBottom>
              This is a question that many entrepreneurs, those who want to own valuable diamonds, or even diamond enthusiasts often ask when they are considering investing a significant amount of money or simply want to "play."
            </Typography>
            <Typography variant="body1" gutterBottom>
              Below are simple steps to calculate the price of a diamond, which will help you decide on a diamond that suits your preferences while still fitting your budget.
            </Typography>
            <Typography variant="body1" gutterBottom>
              When it comes to pricing, all diamonds are categorized by weight (carat), and each weight level has its own price. They are then divided into two types: round or fancy shapes (any shape other than round). However, regardless of whether the diamond you want to buy is round or fancy-shaped, the method for calculating the price of diamonds using the Rapaport Diamond Price List is identical.
            </Typography>
          </Box>
          <Box id="section7">
            <Typography variant="h5" gutterBottom fontWeight="bold">
              Price per carat
            </Typography>
            <img
              src="https://static.wixstatic.com/media/452282_ef0d0591d5464bd5b0c0ed5b8cbb2007~mv2.png/v1/fill/w_875,h_490,al_c,lg_1,q_90,enc_auto/452282_ef0d0591d5464bd5b0c0ed5b8cbb2007~mv2.png"
              alt="3 Carat Diamond Price List of Rapaport Price List"
              style={{ width: "50%", display: "block", margin: "1rem auto" }}
            />
            <Typography variant="body1" gutterBottom>
              If you are interested in a 3-carat diamond, G color, with VS1 clarity, you should look up the price list for a 3-carat diamond and find the corresponding values for G color with VS1 clarity. In the table above, we can see that the value is $28,270 per carat. Understanding the price per carat value is crucial when looking at diamond prices in the diamond industry because it is not the final price quoted. The calculation is very simple and straightforward:
            </Typography>
            <Typography variant="body1" gutterBottom fontWeight="bold">
              Diamond Price = Price per Carat x Carat Weight
            </Typography>
            <Typography variant="body1" gutterBottom>
              Applying this to the example mentioned above, we have the calculation: 28,270 x 3 = $84,810.
            </Typography>
            <Typography variant="body1" gutterBottom>
              Therefore, we would need to pay $84,810 for a 3-carat diamond, G color, and VS1 clarity.
            </Typography>
            <Typography variant="body1" gutterBottom>
              Suppose you want to buy a diamond with a specific carat weight, such as a 3.12-carat diamond, G color, and VS2 clarity. The calculation would be: 28,270 x 3.12 = $88,202.
            </Typography>
          </Box>
          <Box id="section8">
            <Typography variant="h5" gutterBottom fontWeight="bold">
              Rapaport diamond price list
            </Typography>
            <Typography variant="body1" gutterBottom>
              The Rapaport Price List is a reliable source of information for diamond trading and is often used by dealers to price diamonds. However, the prices in this list can be significantly higher than the actual transaction prices. The Rapaport is published online at midnight every Thursday.
            </Typography>
            <Typography variant="body1" gutterBottom>
              The Rapaport Price List does not provide the exact transaction price of a diamond but serves as a starting point for negotiations and as a basis for estimating the value of a range of diamonds with different sizes and qualities. The transaction price is the result of negotiations between the seller and the buyer, and it reflects many factors including the physical characteristics of the diamond, sales terms, customer service, and a variety of other factors. Transaction prices can be significantly higher or lower than the listed prices. Therefore, both buyers and sellers should consult with experts or experienced diamond enthusiasts before deciding on a diamond transaction.
            </Typography>
            <Typography variant="body1" gutterBottom>
              So, how do you read the Rapaport Price List?
            </Typography>
            <Typography variant="body1" gutterBottom fontWeight="bold">
              In the price chart:
            </Typography>
            <Typography variant="body1" gutterBottom sx={{ ml: 3 }}>
              - Weight (Carat): The top row (in bold), indicates the weight of the diamond in the range from .ct-.ct.
            </Typography>
            <Typography variant="body1" gutterBottom sx={{ ml: 3 }}>
              - Color: Represented in descending order: D-F, G-H, I-J, K-L, M-N.
            </Typography>
            <Typography variant="body1" gutterBottom sx={{ ml: 3 }}>
              - Clarity: Represented in descending order: IF, VVS, VS, SI1, SI2, SI3, I1, I2, I3.
            </Typography>
            <Typography variant="body1" gutterBottom sx={{ ml: 3 }}>
              - Date of the Price List: Top row in bold.
            </Typography>
            <img
              src="https://static.wixstatic.com/media/452282_b68101795a3745c8be4ea70e178c43d5~mv2.png/v1/fill/w_748,h_552,al_c,lg_1,q_90,enc_auto/452282_b68101795a3745c8be4ea70e178c43d5~mv2.png"
              alt="Rapaport diamond price list from .01-.29 ct"
              style={{ width: "50%", display: "block", margin: "1rem auto" }}
            />
            <Typography variant="body1" gutterBottom fontWeight="bold">
              Calculation guide:
            </Typography>
            <Typography variant="body1" gutterBottom sx={{ ml: 3 }}>
              Step 1: Match the weight of the diamond to be priced with the weight in the Rapaport table.
            </Typography>
            <Typography variant="body1" gutterBottom sx={{ ml: 3 }}>
              Step 2: Match the color of the diamond to be priced with the color in the table.
            </Typography>
            <Typography variant="body1" gutterBottom sx={{ ml: 3 }}>
              Step 3: Match the clarity of the diamond to be priced with the clarity in the table.
            </Typography>
            <Typography variant="body1" gutterBottom sx={{ ml: 3 }}>
              Step 4: Cross-reference the horizontal column (clarity) and vertical column (color grade) to find the price per carat (ct) of the diamond to be priced (the unit in the price table is $100 per carat (ct)).
            </Typography>
            <Typography variant="body1" gutterBottom fontWeight="bold">
              Example:
            </Typography>
            <img
              src="https://static.wixstatic.com/media/452282_0fc5037bf33c491192a99fa04694f367~mv2.png/v1/fill/w_750,h_439,al_c,lg_1,q_85,enc_auto/452282_0fc5037bf33c491192a99fa04694f367~mv2.png"
              alt="Rapaport diamond price list from .30-.89 ct"
              style={{ width: "50%", display: "block", margin: "1rem auto" }}
            />
            <Typography variant="body1" gutterBottom>
              [According to the price list dated 09/07/2012] To calculate the price of a diamond weighing 0.5578ct, color F, and clarity VVS1, follow these steps:
            </Typography>
            <Typography variant="body1" gutterBottom sx={{ ml: 3 }}>
              1. The weight of the diamond is 0.558 carats, which falls within the range (.50 – .69ct). <br />
              2. Match the color grade of the diamond, which is F, with the table. <br />
              3. Match the clarity of the diamond, which is VVS1, with the table. <br />
              4. Cross-reference the color and clarity of the diamond to find the price, which is 56.
            </Typography>
            <Typography variant="body1" gutterBottom>
              Calculation: 56 x $100 x 0.5578 ct = $3,124
            </Typography>
            <Typography variant="body1" gutterBottom>
              Therefore, you would need to pay $3,124 to purchase a 0.5578 ct diamond, color F, and clarity VVS1.
            </Typography>
            <Typography variant="body1" gutterBottom>
              Additionally, after considering and calculating the price of the diamond in hand, you should carefully review the Certification (GIA Diamond Certificate) to avoid purchasing low-quality or counterfeit diamonds.
            </Typography>
            <img
              src="https://static.wixstatic.com/media/452282_d279b2a7838f45bea0f6e06906cb0983~mv2.png/v1/fill/w_760,h_595,al_c,q_90,enc_auto/452282_d279b2a7838f45bea0f6e06906cb0983~mv2.png"
              alt="GIA diamond certificate"
              style={{ width: "50%", display: "block", margin: "1rem auto" }}
            />
            <br />
            <Typography variant="body1" gutterBottom>
              I hope the above article has helped you understand the 4C standards and the Rapaport Price List in diamond pricing. With the two basic methods based on carat and cross-referencing with the Rapaport table, you can easily choose a diamond that fits your budget and style while ensuring reliability. Be a smart consumer by understanding the product thoroughly before deciding to "invest" in this most precious gemstone!
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
      </Container >
    </Box >
  );
}
