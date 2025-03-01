import { useState, useEffect } from "react";
import axios from "../../../axiosConfig";
import {
  Typography,
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
  FormControlLabel,
  Switch,
  styled,
  DialogContentText,
  Box,
  TablePagination,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { v4 as uuidv4 } from "uuid";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { RingLoader } from "react-spinners";

const StyledTableCell = styled(TableCell)({
  fontWeight: "bold",
});

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentUser, setCurrentUser] = useState({
    user_id: "",
    fullname: "",
    email: "",
    phone: "",
    address_shipping: "",
    avatar: "",
    gender: false,
    role: false,
    account_status: false,
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios
      .get("/users")
      .then((response) => {
        console.log("Fetched users:", response.data);
        setUsers(response.data);
        setFilteredUsers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  };

  const handleClickOpen = (user) => {
    if (user) {
      setIsEditing(true);
      setCurrentUser(user);
    } else {
      setIsEditing(false);
      setCurrentUser({
        user_id: uuidv4(),
        fullname: "",
        email: "",
        phone: "",
        address_shipping: "",
        avatar: "",
        gender: false,
        role: false,
        account_status: false,
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setConfirmClose(true);
  };

  const handleSave = () => {
    console.log("Current User:", currentUser);

    if (
      !currentUser.fullname ||
      !currentUser.email ||
      !currentUser.phone ||
      !currentUser.address_shipping
    ) {
      notifyFail();
      return;
    }

    if (isEditing) {
      axios
        .put(`/users/${currentUser.user_id}`, currentUser)
        .then((response) => {
          console.log("User updated:", response.data);
          fetchUsers();
          setOpen(false);
          notifySuccess();
        })
        .catch((error) => {
          console.error(
            "Error updating user:",
            error.response ? error.response.data : error.message
          );
        });
    } else {
      axios
        .post("/users", currentUser)
        .then((response) => {
          console.log("User added:", response.data);
          fetchUsers();
          setOpen(false);
          notifySuccess();
        })
        .catch((error) => {
          console.error(
            "Error adding user:",
            error.response ? error.response.data : error.message
          );
        });
    }
  };

  const handleDelete = (user_id) => {
    axios
      .delete(`/users/${user_id}`)
      .then((response) => {
        console.log("User deleted:", response.data);
        fetchUsers();
      })
      .catch((error) => {
        console.error(
          "Error deleting user:",
          error.response ? error.response.data : error.message
        );
      });
  };

  const [confirmClose, setConfirmClose] = useState(false);
  const dispatch = useDispatch();

  const handleConfirmClose = (confirm) => {
    if (confirm) {
      setOpen(false);
    }
    setConfirmClose(false);
  };

  const [confirmDeleteItemId, setConfirmDeleteItemId] = useState(null);

  const handleRemove = (id) => {
    setConfirmDeleteItemId(id); // Set the item ID for confirmation
  };

  const handleConfirmDelete = () => {
    dispatch(handleDelete(confirmDeleteItemId));
    setConfirmDeleteItemId(null); // Clear the confirmation state after deletion
  };

  const handleCancelDelete = () => {
    setConfirmDeleteItemId(null); // Clear the confirmation state if canceled
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const notifySuccess = () =>
    toast.success("Save Successfully!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });

  const notifyFail = () =>
    toast.error("Please fill in all required fields!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });

  if (loading) {
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
    <Container maxWidth="lg" style={{ marginTop: "20px" }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontFamily: "Times New Roman" }}
      >
        User Management
      </Typography>
      <Button
        variant="contained"
        sx={{
          marginBottom: "10px",
          backgroundColor: "#B19567",
          "&:hover": {
            backgroundColor: "#2c3e50",
          },
        }}
        onClick={() => handleClickOpen(null)}
      >
        + Add User
      </Button>
      <Paper sx={{ width: "100%", overflow: "hidden", marginTop: "20px" }}>
        <Container
          component={Paper}
          style={{ maxHeight: "60vh", overflowY: "auto" }}
        >
          <Table stickyHeader>
            <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <StyledTableCell>UserID</StyledTableCell>
                <StyledTableCell>Full Name</StyledTableCell>
                <StyledTableCell>Email</StyledTableCell>
                <StyledTableCell>Phone</StyledTableCell>
                <StyledTableCell>Address</StyledTableCell>
                <StyledTableCell>Avatar</StyledTableCell>
                <StyledTableCell>Gender</StyledTableCell>
                <StyledTableCell>Role</StyledTableCell>
                <StyledTableCell>Status</StyledTableCell>
                <StyledTableCell>Action</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => (
                  <TableRow key={user.user_id} hover>
                    <TableCell>{user.user_id}</TableCell>
                    <TableCell>{user.fullname}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell>{user.address_shipping}</TableCell>
                    <TableCell>
                      <img
                        src={user.avatar}
                        alt={user.fullname}
                        style={{ width: "50px", height: "50px" }}
                      />
                    </TableCell>
                    <TableCell>{user.gender ? "Male" : "Female"}</TableCell>
                    <TableCell>{user.role ? "Admin" : "User"}</TableCell>
                    <TableCell>
                      {user.account_status ? "Active" : "Inactive"}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        aria-label="edit"
                        color="primary"
                        onClick={() => handleClickOpen(user)}
                        sx={{ color: "grey" }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        aria-label="delete"
                        color="secondary"
                        onClick={() => handleRemove(user.user_id)}
                        sx={{ color: "#CD5C5C" }}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </Container>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{isEditing ? "Edit User" : "Add New User"}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Full Name"
            type="text"
            fullWidth
            value={currentUser.fullname}
            onChange={(e) =>
              setCurrentUser({ ...currentUser, fullname: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            value={currentUser.email}
            onChange={(e) =>
              setCurrentUser({ ...currentUser, email: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Phone"
            type="text"
            fullWidth
            value={currentUser.phone}
            onChange={(e) =>
              setCurrentUser({ ...currentUser, phone: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Address"
            type="text"
            fullWidth
            value={currentUser.address_shipping}
            onChange={(e) =>
              setCurrentUser({
                ...currentUser,
                address_shipping: e.target.value,
              })
            }
          />
          <TextField
            margin="dense"
            label="Avatar"
            type="text"
            fullWidth
            value={currentUser.avatar}
            onChange={(e) =>
              setCurrentUser({ ...currentUser, avatar: e.target.value })
            }
          />
          <FormControlLabel
            control={
              <Switch
                checked={currentUser.gender}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, gender: e.target.checked })
                }
              />
            }
            label={currentUser.gender ? "Male" : "Female"}
          />
          <FormControlLabel
            control={
              <Switch
                checked={currentUser.role}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, role: e.target.checked })
                }
              />
            }
            label={currentUser.role ? "Admin" : "User"}
          />
          <FormControlLabel
            control={
              <Switch
                checked={currentUser.account_status}
                onChange={(e) =>
                  setCurrentUser({
                    ...currentUser,
                    account_status: e.target.checked,
                  })
                }
              />
            }
            label={currentUser.account_status ? "Active" : "Inactive"}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" sx={{ color: "red" }}>
            Close
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmClose} onClose={() => handleConfirmClose(false)}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure to close this tab?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => handleConfirmClose(false)}
            color="primary"
            sx={{ color: "red" }}
          >
            No
          </Button>
          <Button onClick={() => handleConfirmClose(true)} color="primary">
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmDeleteItemId !== null} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to remove this user?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            sx={{ color: "red" }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer />
    </Container>
  );
};

export default UserManagement;
