import { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Box,
  Container,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Avatar,
  Tooltip,
  Chip,
} from "@mui/material";
import {
  ShoppingCart,
  Person,
  Menu as MenuIcon,
  Search,
  Favorite,
  Logout,
  AccountCircle,
  ShoppingBag,
  Dashboard as DashboardIcon,
} from "@mui/icons-material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCartItemCount } from "../../store/slices/cartSlice";
import ProductSearch from "../product/ProductSearch";
const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [user, setUser] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const location = useLocation();
  const cartItemCount = useSelector(selectCartItemCount);

  // Check if user is logged in
  const checkUserAuth = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        console.log("User authenticated:", userData);
      } catch (error) {
        console.error("Failed to parse user data:", error);
        setUser(null);
      }
    } else {
      setUser(null);
      console.log("No user found in localStorage");
    }
  };

  // Check auth on component mount and when location changes
  useEffect(() => {
    checkUserAuth();
  }, [location.pathname]);

  const isAuthenticated = !!user;

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleLogout = () => {
    // Remove user data and token from local storage
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    handleMenuClose();
    navigate("/");
  };

  const navigateTo = (path) => {
    navigate(path);
    handleMenuClose();
    setDrawerOpen(false);
  };

  const menuItems = [
    { text: "Home", path: "/" },
    { text: "Products", path: "/products" },
    { text: "About", path: "/about" },
    { text: "Contact", path: "/contact" },
  ];

  // Add authenticated-only menu items
  const authenticatedMenuItems = isAuthenticated
    ? [
        { text: "My Profile", path: "/profile" },
        { text: "My Orders", path: "/orders" },
        // Add Admin link if user has manager role
        ...(user?.roleEnum === "MANAGER"
          ? [{ text: "Admin Panel", path: "/admin" }]
          : []),
      ]
    : [];

  const renderProfileMenu = (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
      keepMounted
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
    >
      {isAuthenticated
        ? [
            <MenuItem key="profile-header" disabled sx={{ opacity: 1 }}>
              <Box sx={{ display: "flex", flexDirection: "column", ml: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: theme.palette.primary.main,
                    }}
                  >
                    {user?.username?.charAt(0)?.toUpperCase() || "U"}
                  </Avatar>
                  <Typography variant="subtitle1">
                    {user?.username || "User"}
                  </Typography>
                </Box>
                <Typography
                  variant="caption"
                  sx={{ mt: 0.5, color: "text.secondary" }}
                >
                  Role: {user?.roleEnum || "User"}
                </Typography>
              </Box>
            </MenuItem>,
            <Divider key="divider-top" />,
            <MenuItem key="profile" onClick={() => navigateTo("/profile")}>
              <AccountCircle sx={{ mr: 2 }} />
              My Profile
            </MenuItem>,
            <MenuItem key="orders" onClick={() => navigateTo("/orders")}>
              <ShoppingBag sx={{ mr: 2 }} />
              My Orders
            </MenuItem>,
            // Add Admin menu item if user has manager role
            ...(user?.roleEnum === "MANAGER"
              ? [
                  <MenuItem key="admin" onClick={() => navigateTo("/admin")}>
                    <DashboardIcon sx={{ mr: 2 }} />
                    Admin Panel
                  </MenuItem>,
                ]
              : []),
            <Divider key="divider-bottom" />,
            <MenuItem key="logout" onClick={handleLogout}>
              <Logout sx={{ mr: 2 }} />
              Logout
            </MenuItem>,
          ]
        : [
            <MenuItem key="login" onClick={() => navigateTo("/login")}>
              Login
            </MenuItem>,
            <MenuItem key="register" onClick={() => navigateTo("/register")}>
              Register
            </MenuItem>,
          ]}
    </Menu>
  );

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        SkinCare Shop
      </Typography>
      {isAuthenticated && (
        <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
          <Chip
            avatar={
              <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                {user?.username?.charAt(0)?.toUpperCase() || "U"}
              </Avatar>
            }
            label={
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "start",
                }}
              >
                <Typography variant="body2" sx={{ lineHeight: 1.2 }}>
                  {user?.username || "User"}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ opacity: 0.8, lineHeight: 1 }}
                >
                  {user?.roleEnum || "User"}
                </Typography>
              </Box>
            }
            variant="outlined"
          />
        </Box>
      )}
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              sx={{ textAlign: "center" }}
              onClick={() => navigateTo(item.path)}
            >
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
        {isAuthenticated &&
          authenticatedMenuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                sx={{ textAlign: "center" }}
                onClick={() => navigateTo(item.path)}
              >
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        {isAuthenticated && (
          <ListItem disablePadding>
            <ListItemButton sx={{ textAlign: "center" }} onClick={handleLogout}>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="sticky">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}

            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{
                mr: 2,
                display: { xs: "none", sm: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".2rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              SKINCARE
            </Typography>

            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{
                mr: 2,
                display: { xs: "flex", sm: "none" },
                flexGrow: 1,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".2rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              SKINCARE
            </Typography>

            {!isMobile && (
              <Box sx={{ flexGrow: 1, display: "flex" }}>
                {menuItems.map((item) => (
                  <Button
                    key={item.text}
                    onClick={() => navigateTo(item.path)}
                    sx={{ my: 2, color: "white", display: "block" }}
                  >
                    {item.text}
                  </Button>
                ))}
                {isAuthenticated &&
                  authenticatedMenuItems.map((item) => (
                    <Button
                      key={item.text}
                      onClick={() => navigateTo(item.path)}
                      sx={{ my: 2, color: "white", display: "block" }}
                    >
                      {item.text}
                    </Button>
                  ))}
              </Box>
            )}

            <Box sx={{ flexGrow: 0, display: "flex", alignItems: "center" }}>
              {isAuthenticated && !isMobile && (
                <Chip
                  avatar={
                    <Avatar sx={{ bgcolor: theme.palette.secondary.main }}>
                      {user?.username?.charAt(0)?.toUpperCase() || "U"}
                    </Avatar>
                  }
                  label={
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "start",
                      }}
                    >
                      <Typography variant="body2" sx={{ lineHeight: 1.2 }}>
                        {user?.username || "User"}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ opacity: 0.8, lineHeight: 1 }}
                      >
                        {user?.roleEnum || "User"}
                      </Typography>
                    </Box>
                  }
                  sx={{
                    mr: 2,
                    color: "white",
                    "& .MuiChip-label": { color: "white" },
                    borderColor: "rgba(255,255,255,0.3)",
                  }}
                  variant="outlined"
                />
              )}
              {/* Add the ProductSearch component here */}
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  justifyContent: "center",
                  px: 2,
                  maxWidth: "800px",
                  width: "100%",
                }}
              >
                <ProductSearch />
              </Box>
              {/*  product bar */}
              <IconButton
                color="inherit"
                onClick={() => navigate("/favorites")}
              >
                <Favorite />
              </IconButton>
              <IconButton color="inherit" onClick={() => navigate("/cart")}>
                <Badge badgeContent={cartItemCount} color="error">
                  <ShoppingCart />
                </Badge>
              </IconButton>
              <Tooltip title={isAuthenticated ? "Account" : "Login/Register"}>
                <IconButton
                  size="large"
                  edge="end"
                  aria-label="account of current user"
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                >
                  <Person />
                </IconButton>
              </Tooltip>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Drawer
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 240 },
        }}
      >
        {drawer}
      </Drawer>
      {renderProfileMenu}
    </>
  );
};

export default Navbar;
