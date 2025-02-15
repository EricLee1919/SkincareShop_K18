import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./pages/users/store/store.jsx";
import Navbar from "./components/layout/NavBar/Navbar.jsx";
import Footer from "./components/layout/Footer/Footer.jsx";
import { Box } from "@mui/material";
import ScrollToTop from "./components/scrollToTop/ScrollToTop.jsx";
import ScrollToTopButton from "./components/scrollToTopButton/scrollTopButton.jsx";

// Các trang người dùng
import HomePage from "./pages/users/homepage/HomePage.jsx";
import ProductList from "./pages/users/product/ProductList";
import Measure from "./pages/users/homepage/Measure.jsx";
import Promotion from "./pages/users/homepage/Promotion.jsx";
import FAQ from "./pages/users/homepage/FAQ/FAQ.jsx";
import AboutUs from "./pages/users/aboutUs/AboutUs.jsx";
import Contact from "./pages/users/Contact/Contact.jsx";
import ProductDetail from "./pages/users/product/ProductDetail.jsx";
import Cart from "./pages/users/store/Cart";
import Checkout from "./pages/users/Payment/checkout/Checkout.jsx";
import Login from "./pages/users/login/Login.jsx";
import Reset from "./pages/users/login/Reset.jsx";
import Register from "./pages/guest/Register.jsx";
import Profile from "./pages/users/profile/Profile.jsx";
import SearchResults from "./pages/users/homepage/search/SearchResult.jsx";
import DiamondKnowledge from "./pages/users/homepage/DiamondKnowledge.jsx";
import JewelryKnowledge from "./pages/users/homepage/JewelryKnowledge.jsx";

// Các trang admin
import Dashboard from "./pages/admin/dashboard/Dashboard.jsx";
import ProtectedRoute from "./ProteredRoute/ProtredRoute.jsx";
import NotAuthorized from "./NotAuthorized.jsx";
import LinkChatbox from "./components/chatbox/chatButton/LinkChatbox.jsx";
import ChatBoxButton from "./components/chatbox/chatButton/chatboxButton.jsx";
import { Landing } from "./components/chatbox/Landing/index.jsx";
import { ChatRoom } from "./components/chatbox/ChatRoom/index.jsx";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="app">
          <ScrollToTop />
          <Navbar />
          <Box component="main" sx={{ mt: 5, flexGrow: 1 }}>
            <Routes>
              {/* Các route người dùng */}
              <Route path="/" element={<HomePage />} />
              <Route path="/diamonds" element={<ProductList />} />
              <Route path="/measureguide" element={<Measure />} />
              <Route path="/saleoff" element={<Promotion />} />
              <Route path="/faqs" element={<FAQ />} />
              <Route path="/aboutus" element={<AboutUs />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/login" element={<Login />} />
              <Route path="/reset" element={<Reset />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/diamondknowledge" element={<DiamondKnowledge />} />
              <Route path="/jewelryknowledge" element={<JewelryKnowledge />} />
              {/* Các route admin */}
              <Route element={<ProtectedRoute roles={[true]} />}>
                <Route path="/dashboard*" element={<Dashboard />} />
              </Route>
              {/* Route cho trang không được phép */}
              <Route path="/not-authorized" element={<NotAuthorized />} />

              <Route path="/chatbox" element={<LinkChatbox />} />
              <Route path="/landing" element={<Landing />} />
              <Route path="/room/:id" element={<ChatRoom />} />
            </Routes>
          </Box>
          <Footer />
          <ChatBoxButton />
        </div>
      </Router>
      <ScrollToTopButton />
    </Provider>
  );
}

export default App;
