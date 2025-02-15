// src/components/Profile.js
import { useState, useEffect } from "react";
import axios from "../../../axiosConfig";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  FormControlLabel,
  Switch,
  Avatar,
} from "@mui/material";
import { RingLoader } from 'react-spinners';

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({
    fullname: "",
    gender: false,
    address_shipping: "",
    email: "",
    address: "",
    phone: "",
  });

  useEffect(() => {
    const user_id = localStorage.getItem("user_id");
    axios
      .get(`/users/${user_id}`)
      .then((response) => {
        setUser(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        setLoading(false);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSwitchChange = (e) => {
    setUser({ ...user, gender: e.target.checked });
  };

  const handleSave = () => {
    if (!user.fullname || !user.address_shipping) {
      alert("Please fill in all required fields.");
      return;
    }

    axios
      .put(`/users/${user.user_id}`, user)
      .then((response) => {
        console.log("User updated:", response.data);
        alert("Profile updated successfully");
      })
      .catch((error) => {
        console.error("Error updating user:", error);
      });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <RingLoader color="#B19567" size={80}/>
      </Box>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 5, mb: 5 }}>
      <Typography variant="h4" gutterBottom textAlign="center" sx={{ fontFamily: "Times New Roman" }}>
        Profile
      </Typography>
      <Avatar
        alt="User Avatar"
        src={user.avatar}
        sx={{ width: "30%", height: "30%", margin: "auto", mt: 2, mb: 1 }}
      />
      <Box component="form" noValidate autoComplete="off">
        <TextField
          label="Full Name"
          name="fullname"
          fullWidth
          margin="normal"
          value={user.fullname}
          onChange={handleInputChange}
        />
        <FormControlLabel
          control={
            <Switch checked={user.gender} onChange={handleSwitchChange} />
          }
          label={user.gender ? "Male" : "Female"}
        />
        <TextField
          label="Phone"
          name="phone"
          fullWidth
          margin="normal"
          value={user.phone}
          onChange={handleInputChange}
        />
          <TextField
          label="Email"
          name="email"
          fullWidth
          margin="normal"
          value={user.email}
          onChange={handleInputChange}
        />
        <TextField
          label="Address"
          name="address_shipping"
          fullWidth
          margin="normal"
          value={user.address_shipping}
          onChange={handleInputChange}
        />
        <Button variant="contained" color="primary" onClick={handleSave} sx={{  mt: 1, ml: 60, backgroundColor: "#B19567", "&:hover": { backgroundColor: "#2c3e50" }, }}>
          Save
        </Button>
      </Box>
    </Container>
  );
};

export default Profile;
