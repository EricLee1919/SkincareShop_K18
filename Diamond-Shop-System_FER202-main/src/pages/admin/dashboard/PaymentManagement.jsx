import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import axios from "../../../axiosConfig";
import { useEffect, useState } from "react";
import { RingLoader } from "react-spinners";
import CloseIcon from "@mui/icons-material/Close";

const StyledTableCell = styled(TableCell)({
  fontWeight: "bold",
});

const PaymentManagement = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const fetchData = () => {
    setLoading(true);
    axios
      .get("/payments")
      .then((res) => {
        setUsers(res.data);
        setFilteredUsers(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefund = (payment_id) => {
    axios
      .post(`/refund/${payment_id}`, payment_id)
      .then((res) => {
        setLoading(false);
        console.log(res.data);
        fetchData();
        setOpen(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClickOpen = (order) => {
    setSelectedOrder(order);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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
    <Container
      maxWidth="lg"
      style={{ marginTop: "40px", marginBottom: "50px" }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontFamily: "Times New Roman" }}
      >
        Payment Management
      </Typography>
      <Paper sx={{ width: "100%", overflow: "hidden", marginTop: "30px" }}>
        <TableContainer style={{ maxHeight: "60vh", overflowY: "auto" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <StyledTableCell>UserID</StyledTableCell>
                <StyledTableCell>Full Name</StyledTableCell>
                <StyledTableCell>Payment ID</StyledTableCell>
                <StyledTableCell>Amount</StyledTableCell>
                <StyledTableCell>Date</StyledTableCell>
                <StyledTableCell>Payment Method</StyledTableCell>
                <StyledTableCell>Status</StyledTableCell>
                <StyledTableCell>Action</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user, index) => (
                  <TableRow key={index} hover>
                    <TableCell>{user.user_id}</TableCell>
                    <TableCell>{user.fullname}</TableCell>
                    <TableCell>{user.payment_id}</TableCell>
                    <TableCell>{user.totalAmount}</TableCell>
                    <TableCell>{user.date}</TableCell>
                    <TableCell>{user.paymentChoice}</TableCell>
                    <TableCell>{user.status ? "True" : "False"}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleClickOpen(user)}
                        sx={{
                          backgroundColor: "#B19567",
                          "&:hover": {
                            backgroundColor: "#2c3e50",
                          },
                        }}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
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
      {selectedOrder && (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
          <DialogTitle>
            Order Details
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              <strong>Order ID:</strong> {selectedOrder.user_id}
            </DialogContentText>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="dense"
                  label="Customer"
                  type="text"
                  fullWidth
                  value={selectedOrder.fullname}
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="dense"
                  label="Date"
                  type="text"
                  fullWidth
                  value={selectedOrder.date}
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="dense"
                  label="Method"
                  type="text"
                  fullWidth
                  value={selectedOrder.paymentChoice}
                  disabled
                />
              </Grid>

              <Grid item xs={12}>
                <Typography
                  variant="h6"
                  gutterBottom
                  style={{ marginTop: "10px" }}
                >
                  Products
                </Typography>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                      <TableCell colSpan={2}>IDs</TableCell>
                      <TableCell>Quantity</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedOrder.diamonds.map((diamond) => (
                      <TableRow key={diamond.diamond_id} hover>
                        <TableCell colSpan={2}>{diamond.diamond_id}</TableCell>
                        <TableCell colSpan={2}>{diamond.quantity}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow sx={{ backgroundColor: "#ccc" }}>
                      <TableCell colSpan={2}>Total</TableCell>
                      <TableCell>{selectedOrder.totalAmount}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary" sx={{ color: "red" }}>
              Close
            </Button>
            <Button
              onClick={() => handleRefund(selectedOrder.payment_id)}
              disabled={!selectedOrder.status}
              color="primary"
            >
              Refund
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
};

export default PaymentManagement;
