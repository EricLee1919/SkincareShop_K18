import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useState, useEffect } from "react";
import Layout from "./components/layout/Layout";
import AdminLayout from "./components/layout/AdminLayout";
import { Toaster } from "react-hot-toast";
import ForgotPassword from "./pages/ForgotPassword";
import About from "./pages/About";
import Contact from "./pages/Contact";
// Pages
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import PaymentResult from "./pages/PaymentResult";
import OrderSummary from "./pages/OrderSummary";

// Admin Pages
import AdminDashboard from "./pages/Admin/Dashboard";
import AdminProducts from "./pages/Admin/Products";
import ProductForm from "./pages/Admin/ProductForm";
import Categories from "./pages/Admin/Categories";
import AdminOrders from "./pages/admin/Orders";

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#00796B", // Xanh vịt
    },
    secondary: {
      main: "#F8BBD0", // Pink
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 600,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      textTransform: "none",
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 12,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
        },
      },
    },
  },
});

// Protected route component
const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = () => {
      const user = localStorage.getItem("user");
      setIsAuthenticated(!!user);
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    return null; // Or a loading spinner
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Admin route component
const AdminRoute = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is admin
    const checkAdmin = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setIsAdmin(userData.roleEnum === "MANAGER");
        } catch (error) {
          console.error("Failed to parse user data:", error);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    };

    checkAdmin();
  }, []);

  if (loading) {
    return null; // Or a loading spinner
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Toaster position="top-center" />
      <BrowserRouter>
        <Routes>
          {/* Client Routes */}
          <Route
            path="/"
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />
          <Route
            path="/products"
            element={
              <Layout>
                <Products />
              </Layout>
            }
          />
          <Route
            path="/products/:id"
            element={
              <Layout>
                <ProductDetail />
              </Layout>
            }
          />
          <Route
            path="/cart"
            element={
              <Layout>
                <Cart />
              </Layout>
            }
          />
          <Route
            path="/login"
            element={
              <Layout>
                <Login />
              </Layout>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <Layout>
                <ForgotPassword />
              </Layout>
            }
          />

          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          <Route
            path="/register"
            element={
              <Layout>
                <Register />
              </Layout>
            }
          />

          {/* Protected Client Routes */}
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Layout>
                  <Checkout />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Layout>
                  <Orders />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment-result"
            element={
              <ProtectedRoute>
                <Layout>
                  <PaymentResult />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/order-summary"
            element={
              <ProtectedRoute>
                <Layout>
                  <OrderSummary />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </AdminRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <AdminRoute>
                <AdminLayout>
                  <AdminProducts />
                </AdminLayout>
              </AdminRoute>
            }
          />
          <Route
            path="/admin/products/add"
            element={
              <AdminRoute>
                <AdminLayout>
                  <ProductForm />
                </AdminLayout>
              </AdminRoute>
            }
          />
          <Route
            path="/admin/products/edit/:id"
            element={
              <AdminRoute>
                <AdminLayout>
                  <ProductForm />
                </AdminLayout>
              </AdminRoute>
            }
          />
          <Route
            path="/admin/categories"
            element={
              <AdminRoute>
                <AdminLayout>
                  <Categories />
                </AdminLayout>
              </AdminRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <AdminRoute>
                <AdminLayout>
                  <AdminOrders />
                </AdminLayout>
              </AdminRoute>
            }
          />

          {/* 404 Route */}
          <Route
            path="*"
            element={
              <Layout>
                <NotFound />
              </Layout>
            }
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
