
import {
  Facebook,
  Instagram,
  LinkedIn,
  Pinterest,
  Twitter,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import { useEffect } from "react";

const navbarHeight = 80; // Adjust this value based on your navbar's height


export default function Knowledge() {
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
    <Box>
      <Box
        sx={{
          backgroundImage: `url('https://wallpapercave.com/wp/wp7486057.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "10% 30%",
          backgroundRepeat: "no-repeat",
          height: "50vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        
      </Box>
      <Container>
      <Typography
          variant="h2"
          gutterBottom
          fontWeight="bold"
          sx={{ marginTop: "1rem", fontFamily: "Times New Roman" }}
        >
          Jewelry Knowledge
        </Typography>
        <Grid container spacing={2} sx={{ marginTop: "1rem" }}>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              02/07/2024
            </Typography>
          </Grid>
          <Grid item xs={6} sx={{ textAlign: "right" }}>
            <Typography variant="body2" color="text.secondary">
              Reading time: 9 Minutes
            </Typography>
          </Grid>
        </Grid>
        <Divider />
        <Box sx={{ marginTop: "2rem", marginBottom: "2rem" }}>
          <Box display="flex" justifyContent="right" mb={2}>
            <IconButton
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ color: "#3b5998" }}
            >
              <Facebook />
            </IconButton>
            <IconButton
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ color: "#00acee" }}
            >
              <Twitter />
            </IconButton>
            <IconButton
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ color: "#0e76a8" }}
            >
              <LinkedIn />
            </IconButton>
            <IconButton
              href="https://pinterest.com"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ color: "#c8232c" }}
            >
              <Pinterest />
            </IconButton>
            <IconButton
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ color: "#E1306C" }}
            >
              <Instagram />
            </IconButton>
          </Box>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Aims to systematize basic knowledge, as well as specialized terms in
            Jewelry in an easy-to-remember way. The following is a summary of
            product designs as well as how to recognize the names of different
            types of beads; And notes on estimating product surface size come
            with stone dividing types...
          </Typography>
        </Box>
        <Paper
          elevation={3}
          sx={{ padding: "1rem", marginBottom: "2rem", marginTop: "2rem" }}
        >
          <List component="nav">
            <ListItem  component="a" href="#section1">
              <ListItemText
                primary="Common Types of Earrings"
                sx={{
                  color: "#AFADB7",
                  "&:hover": {
                    color: "#B19567",
                  },
                }}
              />
            </ListItem>
            <ListItem  component="a" href="#section2">
              <ListItemText
                primary="Common Types of Earring Buckles"
                sx={{
                  color: "#AFADB7",
                  "&:hover": {
                    color: "#B19567",
                  },
                }}
              />
            </ListItem>
            <ListItem  component="a" href="#section3">
              <ListItemText
                primary="Common Types of Prong Settings"
                sx={{
                  color: "#AFADB7",
                  "&:hover": {
                    color: "#B19567",
                  },
                }}
              />
            </ListItem>
          </List>
        </Paper>

        <Box
          display="flex"
          flexDirection="column"
          gap={4}
          sx={{ padding: "1rem", marginBottom: "2rem" }}
        >
          <Box id="section1">
            <Typography variant="h5" gutterBottom fontWeight="bold">
              Common Types of Earrings
            </Typography>
            <Typography paragraph>
              <strong>Drop Earring:</strong>  This form usually has at least two parts. Part worn
              on the earlobe and part dropped below.
            </Typography>
            <img
              src="https://trangdoan.vn/kythuatkimhoan/wp-content/uploads/2020/11/KI%E1%BA%BEN-TH%E1%BB%A8C-C%C6%A0-B%E1%BA%A2N-CHUY%C3%8AN-NG%C3%80NH-N%E1%BB%AE-TRANG-2-300x300.jpg"
              alt="Drop Earrings"
              style={{ width: "30%", display: "block", margin: "1rem auto" }}
            />
            <Typography paragraph>
              <strong>Hoop Earrings</strong> are round, large and quite diverse in size. This
              type of earring may have or not have plated stones.
            </Typography>
            <img
              src="https://trangdoan.vn/kythuatkimhoan/wp-content/uploads/2020/11/KI%E1%BA%BEN-TH%E1%BB%A8C-C%C6%A0-B%E1%BA%A2N-CHUY%C3%8AN-NG%C3%80NH-N%E1%BB%AE-TRANG-4-300x300.jpg"
              alt="Hoop Earrings"
              style={{ width: "30%", display: "block", margin: "1rem auto" }}
            />
            <Typography paragraph>
              <strong>Huggies</strong> are a form of "Little Hoop", also round in shape but
              hugging the backhand. They may or may not be stoned on the
              surface. Some are designed to add a hanging part below to form a
              drop earring.
            </Typography>
            <img
              src="https://trangdoan.vn/kythuatkimhoan/wp-content/uploads/2020/11/KI%E1%BA%BEN-TH%E1%BB%A8C-C%C6%A0-B%E1%BA%A2N-CHUY%C3%8AN-NG%C3%80NH-N%E1%BB%AE-TRANG-5-300x300.jpg"
              alt="Huggies Earrings"
              style={{ width: "30%", display: "block", margin: "1rem auto" }}
            />
            <Typography paragraph>
              <strong>Studs</strong> are earrings close to the ear. Usually in the form of a main
              stone or with a surrounding slab border. Sometimes they can also
              add the falling part below to become Drop Earrings.
            </Typography>
            <img
              src="https://trangdoan.vn/kythuatkimhoan/wp-content/uploads/2020/11/KI%E1%BA%BEN-TH%E1%BB%A8C-C%C6%A0-B%E1%BA%A2N-CHUY%C3%8AN-NG%C3%80NH-N%E1%BB%AE-TRANG-12-300x300.jpg"
              alt="Stud Earrings"
              style={{ width: "30%", display: "block", margin: "1rem auto" }}
            />
          </Box>

          <Box id="section2">
            <Typography variant="h5" gutterBottom fontWeight="bold">
              Common Types of Earring Buckles
            </Typography>
            <Typography paragraph>
              <strong>Latch Back</strong> is often called Latch Back Earrings or Chicken Leg
              Buckle. The lock is made up of a round hinge below and a latch on
              the back.
            </Typography>
            <img
              src="https://trangdoan.vn/kythuatkimhoan/wp-content/uploads/2020/11/KI%E1%BA%BEN-TH%E1%BB%A8C-C%C6%A0-B%E1%BA%A2N-CHUY%C3%8AN-NG%C3%80NH-N%E1%BB%AE-TRANG-6-300x300.jpg"
              alt="Latch Back Earrings"
              style={{ width: "30%", display: "block", margin: "1rem auto" }}
            />
            <Typography paragraph>
              <strong>Hinged Earwire</strong> is a round buckle that also has the same structure
              as the clasp, but the moving part goes through the left ear
              instead of the rear flap. And the retaining pin is usually a
              highly elastic metal ring.
            </Typography>
            <img
              src="https://trangdoan.vn/kythuatkimhoan/wp-content/uploads/2020/11/KI%E1%BA%BEN-TH%E1%BB%A8C-C%C6%A0-B%E1%BA%A2N-CHUY%C3%8AN-NG%C3%80NH-N%E1%BB%AE-TRANG-3.jpg"
              alt="Hinged Earwire"
              style={{ width: "30%", display: "block", margin: "1rem auto" }}
            />
            <Typography paragraph>
              <strong>Screw Back</strong> is an earring with a pre-screwed shank. The user will
              rotate the cotton handle to adjust the opening or locking.
            </Typography>
            <img
              src="https://trangdoan.vn/kythuatkimhoan/wp-content/uploads/2020/11/KI%E1%BA%BEN-TH%E1%BB%A8C-C%C6%A0-B%E1%BA%A2N-CHUY%C3%8AN-NG%C3%80NH-N%E1%BB%AE-TRANG-10-300x300.jpg"
              alt="Screw Back Earrings"
              style={{ width: "30%", display: "block", margin: "1rem auto" }}
            />
            <Typography paragraph>
              <strong>Push Back</strong> is Push back earrings. Usually this type of rod has two
              convenient steps for the user to adjust the amplitude of the ear
              pressure more comfortably.
            </Typography>
            <img
              src="https://trangdoan.vn/kythuatkimhoan/wp-content/uploads/2020/11/KI%E1%BA%BEN-TH%E1%BB%A8C-C%C6%A0-B%E1%BA%A2N-CHUY%C3%8AN-NG%C3%80NH-N%E1%BB%AE-TRANG-7-300x300.jpg"
              alt="Push Back Earrings"
              style={{ width: "30%", display: "block", margin: "1rem auto" }}
            />
          </Box>

          <Box id="section3">
            <Typography variant="h5" gutterBottom fontWeight="bold">
              Common Types of Prong Settings
            </Typography>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Prongs for Main Stone (female seed):
            </Typography>
            <Typography paragraph>
              <strong>Bezel setting:</strong> is usually called Bezel setting.
            </Typography>
            <Typography paragraph>
              <strong>Prong setting:</strong> is where the stone is held in
              place by metal prongs. Usually, there are 4 to 6 prongs for the
              main stone and 4 prongs for side stones.
            </Typography>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Types of stone settings on products:
            </Typography>
            <Typography paragraph>
              <strong>PAVÉ SETTING (BALL PLATE PRONG):</strong> The word "pave'"
              means "sidewalk" in French. Pavé is a form of dividing small stone
              slabs, close together to form an array or one, two, or more
              straight, sparkling, continuous lines of stone. Pavé is divided
              into two types: Pavé with border (with border) and Pavé without
              border (no border).
            </Typography>
            <Typography paragraph>
              <strong>Share prong:</strong> (common prong, usually round prongs)
              - Share prong is where small stones are held by common prongs.
              Specifically, between two stones there will be at least one or two
              prongs.
            </Typography>
            <img
              src="https://trangdoan.vn/kythuatkimhoan/wp-content/uploads/2020/11/KI%E1%BA%BEN-TH%E1%BB%A8C-C%C6%A0-B%E1%BA%A2N-CHUY%C3%8AN-NG%C3%80NH-N%E1%BB%AE-TRANG-14-269x300.jpg"
              alt="Pavé Setting"
              style={{ width: "30%", display: "block", margin: "1rem auto" }}
            />
            <Typography paragraph>
              <strong>Split prong:</strong> (split prong, usually square prongs)
              - Split prong is where each stone has its own prong. In specific
              products, you often see small prongs surrounding the main stone.
            </Typography>
            <img
              src="https://trangdoan.vn/kythuatkimhoan/wp-content/uploads/2020/11/KI%E1%BA%BEN-TH%E1%BB%A8C-C%C6%A0-B%E1%BA%A2N-CHUY%C3%8AN-NG%C3%80NH-N%E1%BB%AE-TRANG-19.jpg"
              alt="Split Prong"
              style={{ width: "30%", display: "block", margin: "1rem auto" }}
            />
            <Typography paragraph>
              <strong>Channel Setting:</strong> (channel setting or square
              prong) - Channel setting is when stones are set in a channel or
              groove. This setting is often used for smaller stones.
            </Typography>
            <img
              src="https://trangdoan.vn/kythuatkimhoan/wp-content/uploads/2020/11/KI%E1%BA%BEN-TH%E1%BB%A8C-C%C6%A0-B%E1%BA%A2N-CHUY%C3%8AN-NG%C3%80NH-N%E1%BB%AE-TRANG-13.jpg"
              alt="Channel Setting"
              style={{ width: "30%", display: "block", margin: "1rem auto" }}
            />
            <Typography paragraph>
              <strong>Prong Setting:</strong> (prong setting or round prong) -
              Prong setting is where the stone is held in place by metal prongs.
              This setting is often used for larger stones.
            </Typography>
            <img
              src="https://trangdoan.vn/kythuatkimhoan/wp-content/uploads/2020/11/KI%E1%BA%BEN-TH%E1%BB%A8C-C%C6%A0-B%E1%BA%A2N-CHUY%C3%8AN-NG%C3%80NH-N%E1%BB%AE-TRANG-16-298x300.jpg"
              alt="Prong Setting"
              style={{ width: "30%", display: "block", margin: "1rem auto" }}
            />
            <Typography paragraph>
              <strong>Hammer Setting:</strong> (hammer setting or flat prong) -
              Hammer setting is where the stone is set by hammering the prongs
              around the stone. This setting is often used for softer stones
              that need extra protection.
            </Typography>
            <img
              src="https://trangdoan.vn/kythuatkimhoan/wp-content/uploads/2020/11/KI%E1%BA%BEN-TH%E1%BB%A8C-C%C6%A0-B%E1%BA%A2N-CHUY%C3%8AN-NG%C3%80NH-N%E1%BB%AE-TRANG-15-207x300.jpg"
              alt="Hammer Setting"
              style={{ width: "30%", display: "block", margin: "1rem auto" }}
            />
            <Typography paragraph>
              <strong>Scallop Set:</strong> (U shape split prong or U shape
              scallop setting) - Scallop set is a variation of the split prong
              setting where the prongs form a U shape. This setting is often
              used for a continuous line of stones.
            </Typography>
            <img
              src="https://trangdoan.vn/kythuatkimhoan/wp-content/uploads/2020/11/KI%E1%BA%BEN-TH%E1%BB%A8C-C%C6%A0-B%E1%BA%A2N-CHUY%C3%8AN-NG%C3%80NH-N%E1%BB%AE-TRANG-9-300x300.jpg"
              alt="Scallop Setting"
              style={{ width: "30%", display: "block", margin: "1rem auto" }}
            />
          </Box>
        </Box>
        <Box display="flex" justifyContent="center" mb={5}>
          <Button variant="outlined" sx={{ marginRight: "1rem" }}>
            Share
          </Button>
          <Button
            variant="outlined"
            startIcon={<Facebook sx={{ color: "#3b5998" }} />}
            href="https://facebook.com"
            sx={{ marginRight: "1rem" }}
          >
            Facebook
          </Button>
          <Button
            variant="outlined"
            startIcon={<Twitter sx={{ color: "#00acee" }} />}
            href="https://twitter.com"
            sx={{ marginRight: "1rem" }}
          >
            Twitter
          </Button>
          <Button
            variant="outlined"
            startIcon={<Pinterest sx={{ color: "#c8232c" }} />}
            href="https://pinterest.com"
            sx={{ marginRight: "1rem" }}
          >
            Pinterest
          </Button>
          <Button
            variant="outlined"
            startIcon={<LinkedIn sx={{ color: "#0e76a8" }} />}
            href="https://linkedin.com"
          >
            LinkedIn
          </Button>
        </Box>
      </Container>
    </Box>
  );
}