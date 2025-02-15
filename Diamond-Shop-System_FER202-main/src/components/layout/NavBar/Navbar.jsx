import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Container,
  Box,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  ListItemIcon,
  Badge,
  TextField,
  InputAdornment,
} from "@mui/material";
import {
  ShoppingCart,
  Search,
  Logout,
  KeyboardArrowDown as KeyboardArrowDownIcon,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import DiamondOutlinedIcon from "@mui/icons-material/DiamondOutlined";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { auth, logout } from "../../config/firebase.jsx"; // Cập nhật import
import axios from "axios";
import { RingLoader } from "react-spinners";
import { useAuthState } from "react-firebase-hooks/auth"; // Sử dụng hook để kiểm tra trạng thái đăng nhập

const Navbar = () => {
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorElBlog, setAnchorElBlog] = useState(null);
  const [anchorElPages, setAnchorElPages] = useState(null);
  const [closeTimerBlog, setCloseTimerBlog] = useState(null);
  const [closeTimerPages, setCloseTimerPages] = useState(null);
  const [accountEl, setAccountEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const cartItemCount = useSelector((state) => state.cart.items.length);
  const [userAuth, loadingAuth] = useAuthState(auth); // Kiểm tra trạng thái đăng nhập

  useEffect(() => {
    axios
      .get("/users")
      .then((response) => {
        setUser(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  const handleMouseOverBlog = (event) => {
    if (closeTimerBlog) {
      clearTimeout(closeTimerBlog);
      setCloseTimerBlog(null);
    }
    setAnchorElBlog(event.currentTarget);
  };

  const handleMouseOutBlog = () => {
    const timer = setTimeout(() => {
      setAnchorElBlog(null);
    }, 1000);
    setCloseTimerBlog(timer);
  };

  const handleMouseOverPages = (event) => {
    if (closeTimerPages) {
      clearTimeout(closeTimerPages);
      setCloseTimerPages(null);
    }
    setAnchorElPages(event.currentTarget);
  };

  const handleMouseOutPages = () => {
    const timer = setTimeout(() => {
      setAnchorElPages(null);
    }, 1000);
    setCloseTimerPages(timer);
  };

  const handleMenuEnterBlog = () => {
    if (closeTimerBlog) {
      clearTimeout(closeTimerBlog);
      setCloseTimerBlog(null);
    }
  };

  const handleMenuLeaveBlog = () => {
    const timer = setTimeout(() => {
      setAnchorElBlog(null);
    }, 1000);
    setCloseTimerBlog(timer);
  };

  const handleMenuEnterPages = () => {
    if (closeTimerPages) {
      clearTimeout(closeTimerPages);
      setCloseTimerPages(null);
    }
  };

  const handleMenuLeavePages = () => {
    const timer = setTimeout(() => {
      setAnchorElPages(null);
    }, 1000);
    setCloseTimerPages(timer);
  };

  const handleLogout = () => {
    logout();
    navigate("/login"); // Điều hướng về trang đăng nhập sau khi đăng xuất
  };

  const handleAccountMenuOpen = (event) => {
    setAccountEl(event.currentTarget);
  };

  const handleAccountMenuClose = () => {
    setAccountEl(null);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      navigate(`/search?query=${searchQuery.trim()}`);
    }
  };

  if (loading || loadingAuth) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="50vh"
      >
        <RingLoader color="#B19567" size={80} />
      </Box>
    );
  }

  return (
    <AppBar
      position="fixed"
      style={{
        backgroundColor: "#ffffff",
        color: "#000000",
        boxShadow: "none",
        borderBottom: "1px solid #e0e0e0",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          style={{
            display: "flex",
            justifyContent: "space-between",
            position: "relative",
          }}
        >
          <Box style={{ display: "flex", alignItems: "center" }}>
            <Button
              component={Link}
              to="/"
              color="inherit"
              size="small"
              disableRipple
              sx={{
                "&:hover": {
                  color: "#B19567",
                  backgroundColor: "transparent",
                },
              }}
            >
              Home
            </Button>
            <Button
              component={Link}
              to="/diamonds"
              color="inherit"
              size="small"
              disableRipple
              sx={{
                "&:hover": {
                  color: "#B19567",
                  backgroundColor: "transparent",
                },
              }}
            >
              Diamonds
            </Button>
            <Button
              color="inherit"
              size="small"
              disableRipple
              onMouseOver={handleMouseOverBlog}
              onMouseOut={handleMouseOutBlog}
              endIcon={<KeyboardArrowDownIcon />}
              sx={{
                margin: "0 8px",
                textTransform: "none",
                "&:hover": { color: "#B19567", backgroundColor: "transparent" },
              }}
            >
              BLOG
            </Button>
            <Menu
              anchorEl={anchorElBlog}
              keepMounted
              open={Boolean(anchorElBlog)}
              onClose={handleMouseOutBlog}
              MenuListProps={{
                onMouseLeave: handleMenuLeaveBlog,
                onMouseEnter: handleMenuEnterBlog,
                onClick: () => setAnchorElBlog(null),
              }}
              sx={{
                "& .MuiMenuItem-root": {
                  display: "flex",
                  alignItems: "center",
                },
              }}
            >
              <MenuItem
                component={Link}
                to="/diamondknowledge"
                disableRipple
                sx={{
                  display: "flex",
                  alignItems: "center",
                  "&:hover": {
                    color: "#B19567",
                    backgroundColor: "transparent",
                  },
                }}
              >
                Consmetic Insight
              </MenuItem>
              <MenuItem
                component={Link}
                to="/jewelryknowledge"
                disableRipple
                sx={{
                  display: "flex",
                  alignItems: "center",
                  "&:hover": {
                    color: "#B19567",
                    backgroundColor: "transparent",
                  },
                }}
              >
                Beauty Tips
              </MenuItem>
              <MenuItem
                component={Link}
                to="/measureguide"
                disableRipple
                sx={{
                  "&:hover": {
                    color: "#B19567",
                    backgroundColor: "transparent",
                  },
                }}
              >
                Cosmetic's Brands
              </MenuItem>
            </Menu>

            <Button
              component={Link}
              to="/saleoff"
              color="inherit"
              size="small"
              disableRipple
              sx={{
                "&:hover": {
                  color: "#B19567",
                  backgroundColor: "transparent",
                },
              }}
            >
              Sale Off
            </Button>
            <Button
              color="inherit"
              size="small"
              disableRipple
              onMouseOver={handleMouseOverPages}
              onMouseOut={handleMouseOutPages}
              endIcon={<KeyboardArrowDownIcon />}
              sx={{
                margin: "0 8px",
                textTransform: "none",
                "&:hover": { color: "#B19567", backgroundColor: "transparent" },
              }}
            >
              PAGES
            </Button>
            <Menu
              anchorEl={anchorElPages}
              keepMounted
              open={Boolean(anchorElPages)}
              onClose={handleMouseOutPages}
              MenuListProps={{
                onMouseLeave: handleMenuLeavePages,
                onMouseEnter: handleMenuEnterPages,
                onClick: () => setAnchorElPages(null),
              }}
              sx={{
                "& .MuiMenuItem-root": {
                  display: "flex",
                  alignItems: "center",
                },
              }}
            >
              <MenuItem
                component={Link}
                to="/aboutus"
                disableRipple
                sx={{
                  display: "flex",
                  alignItems: "center",
                  "&:hover": {
                    color: "#B19567",
                    backgroundColor: "transparent",
                  },
                }}
              >
                About Us
              </MenuItem>
              <MenuItem
                component={Link}
                to="/contact"
                disableRipple
                sx={{
                  display: "flex",
                  alignItems: "center",
                  "&:hover": {
                    color: "#B19567",
                    backgroundColor: "transparent",
                  },
                }}
              >
                Contact Us
              </MenuItem>
              <MenuItem
                component={Link}
                to="/faqs"
                disableRipple
                sx={{
                  "&:hover": {
                    color: "#B19567",
                    backgroundColor: "transparent",
                  },
                }}
              >
                FAQ
              </MenuItem>
            </Menu>
          </Box>
          <Box
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              alignItems: "center",
            }}
          >
            <IconButton component={Link} to="/" disableRipple>
              <DiamondOutlinedIcon fontSize="large" sx={{ color: "#B19567" }} />
            </IconButton>
            <Typography
              component={Link}
              to="/"
              variant="h4"
              fontWeight="bold"
              style={{ color: "#B19567", textDecoration: "none" }}
            >
             Beauty Shop
            </Typography>
          </Box>
          <Box style={{ display: "flex", alignItems: "center" }}>
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSearchSubmit();
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleSearchSubmit}>
                      <Search />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ marginRight: "10px" }}
            />
            <IconButton
              color="inherit"
              component={Link}
              to="/cart"
              disableRipple
              sx={{
                "&:hover": {
                  color: "#B19567",
                },
              }}
            >
              <Badge
                badgeContent={cartItemCount}
                sx={{
                  "& .MuiBadge-badge": {
                    backgroundColor: "#B19567", // Màu của badge
                    color: "#fff", // Màu chữ của badge
                  },
                }}
              >
                <ShoppingCart
                  sx={{
                    color: "black",
                    "&:hover": {
                      color: "#B19567",
                    },
                  }}
                />
              </Badge>
            </IconButton>
            {userAuth ? (
              <>
                <IconButton
                  color="inherit"
                  onClick={handleAccountMenuOpen}
                  disableRipple
                  sx={{
                    "&:hover": {
                      color: "#B19567",
                    },
                  }}
                >
                  <Avatar src={userAuth.photoURL} /> {/* Hiển thị hình ảnh của user */}
                </IconButton>
                <Menu
                  anchorEl={accountEl}
                  id="account-menu"
                  open={Boolean(accountEl)}
                  onClose={handleAccountMenuClose}
                  onClick={handleAccountMenuClose}
                  PaperProps={{
                    elevation: 0,
                    sx: {
                      overflow: "visible",
                      filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                      mt: 1.5,
                      "& .MuiAvatar-root": {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                      },
                      "&::before": {
                        content: '""',
                        display: "block",
                        position: "absolute",
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: "background.paper",
                        transform: "translateY(-50%) rotate(45deg)",
                        zIndex: 0,
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                  <MenuItem onClick={() => navigate("/profile")}>
                    <Avatar src={userAuth.photoURL} />
                    Profile
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={() => navigate("/dashboard")}>
                    <Avatar src={userAuth.photoURL} />
                    Dashboard
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <Logout fontSize="small" />
                      Log out
                    </ListItemIcon>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                component={Link}
                to="/login"
                color="inherit"
                size="small"
                disableRipple
                sx={{
                  "&:hover": {
                    color: "#B19567",
                    backgroundColor: "transparent",
                  },
                }}
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
