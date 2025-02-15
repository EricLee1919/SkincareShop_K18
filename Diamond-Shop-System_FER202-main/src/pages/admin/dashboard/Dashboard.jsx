import { logout } from "../../../components/config/firebase";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
} from "@mui/material";
import { Routes, Route, Link } from "react-router-dom";
import UserManagement from "./UserManagement";

import ProductsManagement from "./ProductsManagement";
import LogoutIcon from "@mui/icons-material/Logout";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import product_management from "../../../assets/images/product-management.png";
import PaymentManagement from "./PaymentManagement";

const Dashboard = () => {
  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Box
        sx={{
          width: "255px",
          backgroundImage: `url("https://gcs.tripi.vn/public-tripi/tripi-feed/img/474087ecU/anh-nen-powerpoint-xam-khoi_022119957.jpg")`,
          color: "black",
          padding: "20px",
          mt: 2,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Main
        </Typography>
        <List>
          <ListItem button component={Link} to="/dashboard/usermanagement">
            <ListItemIcon>
              <ManageAccountsIcon style={{ color: "black" }} />
            </ListItemIcon>
            <ListItemText
              primary="User Management"
              style={{ color: "black" }}
            />
          </ListItem>
          <ListItem button component={Link} to="/dashboard/paymentmanagement">
            <img
              src="https://cdn.iconscout.com/icon/premium/png-256-thumb/payment-management-2084967-1747853.png"
              style={{ width: "12%", height: "10%" }}
            />
            <ListItemText
              primary="Payment Management"
              style={{ color: "black", marginLeft: "1.8rem" }}
            />
          </ListItem>
          <ListItem button component={Link} to="/dashboard/products">
            <img src={product_management} style={{ width: "13%" }} />
            <ListItemText
              primary="Product Management"
              style={{ color: "black", marginLeft: "1.8rem" }}
            />
          </ListItem>
          <Button className="dashboard__btn" onClick={logout}>
            <ListItemIcon sx={{ ml: 1.3 }}>
              <LogoutIcon style={{ color: "black" }} />
            </ListItemIcon>
            <ListItemText primary="Logout" style={{ color: "black" }} />
          </Button>
        </List>
      </Box>
      <Box style={{ flexGrow: 1, padding: "20px" }}>
        <Routes>
          <Route path="usermanagement" element={<UserManagement />} />
          <Route path="paymentmanagement" element={<PaymentManagement />} />
          <Route path="products" element={<ProductsManagement />} />
          <Route
            path="logout"
            element={<Typography variant="h4">logout</Typography>}
          />
        </Routes>
      </Box>
    </Box>
  );
};

export default Dashboard;
