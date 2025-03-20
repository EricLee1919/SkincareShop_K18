import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Card,
  CardContent,
  CardHeader,
  Button,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Inventory,
  Category,
  People,
  ShoppingCart,
  AttachMoney,
  BarChart,
} from '@mui/icons-material';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
  });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is admin
    const checkAdmin = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          // Check if user has manager role
          if (userData.roleEnum !== 'MANAGER') {
            navigate('/');
          }
        } catch (error) {
          console.error('Failed to parse user data:', error);
          navigate('/login');
        }
      } else {
        navigate('/login');
      }
      setLoading(false);
    };

    checkAdmin();
    
    // TODO: Fetch dashboard statistics from API
    // For now, we'll use dummy data
    setStats({
      totalProducts: 24,
      totalOrders: 150,
      totalUsers: 75,
      totalRevenue: 12500,
    });
  }, [navigate]);

  if (loading) {
    return null;
  }

  const navigateTo = (path) => {
    navigate(path);
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
    { text: 'Products', icon: <Inventory />, path: '/admin/products' },
    { text: 'Categories', icon: <Category />, path: '/admin/categories' },
    { text: 'Orders', icon: <ShoppingCart />, path: '/admin/orders' },
    { text: 'Customers', icon: <People />, path: '/admin/customers' },
    { text: 'Reports', icon: <BarChart />, path: '/admin/reports' },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Sidebar */}
      <Box
        component="nav"
        sx={{
          width: 240,
          flexShrink: 0,
          display: { xs: 'none', sm: 'block' },
        }}
      >
        <Paper
          sx={{
            height: '100%',
            borderRadius: 0,
            p: 2,
            position: 'fixed',
            width: 240,
            boxShadow: 3,
          }}
        >
          <Typography
            variant="h6"
            component="div"
            sx={{ fontWeight: 'bold', mb: 2, py: 1, textAlign: 'center' }}
          >
            Admin Panel
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <List>
            {menuItems.map((item) => (
              <ListItem
                button
                key={item.text}
                onClick={() => navigateTo(item.path)}
                sx={{
                  borderRadius: 1,
                  mb: 1,
                  bgcolor: window.location.pathname === item.path ? 'rgba(156, 39, 176, 0.08)' : 'transparent',
                  '&:hover': {
                    bgcolor: 'rgba(156, 39, 176, 0.12)',
                  },
                }}
              >
                <ListItemIcon sx={{ color: window.location.pathname === item.path ? 'primary.main' : 'inherit' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: window.location.pathname === item.path ? 'bold' : 'normal',
                    color: window.location.pathname === item.path ? 'primary.main' : 'inherit',
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - 240px)` },
          ml: { sm: `240px` },
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 2, mb: 4 }}>
            Dashboard
          </Typography>

          {/* Stats cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Total Products
                  </Typography>
                  <Typography variant="h4" component="div">
                    {stats.totalProducts}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Total Orders
                  </Typography>
                  <Typography variant="h4" component="div">
                    {stats.totalOrders}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Total Customers
                  </Typography>
                  <Typography variant="h4" component="div">
                    {stats.totalUsers}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Total Revenue
                  </Typography>
                  <Typography variant="h4" component="div">
                    ${stats.totalRevenue.toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Quick actions */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Quick Actions
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                  <Button 
                    variant="contained" 
                    startIcon={<Inventory />}
                    onClick={() => navigateTo('/admin/products/add')}
                  >
                    Add New Product
                  </Button>
                  <Button 
                    variant="outlined" 
                    startIcon={<Category />}
                    onClick={() => navigateTo('/admin/categories')}
                  >
                    Manage Categories
                  </Button>
                  <Button 
                    variant="outlined" 
                    startIcon={<ShoppingCart />}
                    onClick={() => navigateTo('/admin/orders')}
                  >
                    View Recent Orders
                  </Button>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Recent Activity
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="New order #1234"
                      secondary="Jane Doe - 2 hours ago"
                    />
                  </ListItem>
                  <Divider component="li" />
                  <ListItem>
                    <ListItemText
                      primary="New user registered"
                      secondary="John Smith - 4 hours ago"
                    />
                  </ListItem>
                  <Divider component="li" />
                  <ListItem>
                    <ListItemText
                      primary="Product stock updated"
                      secondary="Hydrating Serum - 5 hours ago"
                    />
                  </ListItem>
                </List>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default AdminDashboard; 