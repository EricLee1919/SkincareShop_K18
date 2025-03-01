import { useEffect, useState } from 'react';
import {
  Typography,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Select,
  MenuItem,
  CircularProgress,
  Box
} from '@mui/material';
import { firebaseConfig } from '../../../components/config/firebase';
// Firebase imports
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import axios from '../../../axiosConfig'; // Ensure this path is correct

// Initialize Firebase app
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const getStatusStyle = (status) => {
  switch (status) {
    case 'COMPLETED':
      return { backgroundColor: 'green', color: 'white', borderRadius: '5px', padding: '5px 10px' };
    case 'CANCELLED':
      return { backgroundColor: 'red', color: 'white', borderRadius: '5px', padding: '5px 10px' };
    case 'PENDING':
      return { backgroundColor: 'orange', color: 'white', borderRadius: '5px', padding: '5px 10px' };
    default:
      return {};
  }
};

const OrderManagement = () => {
  const [open, setOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleClickOpen = (order) => {
    setSelectedOrder(order);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/orders');
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const orderRef = doc(db, 'orders', selectedOrder.orderId);
      await setDoc(orderRef, selectedOrder);
      fetchOrders(); // Refresh the orders list
      setOpen(false);
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  return (
    <Container maxWidth="lg" style={{ marginTop: '20px' }}>
      <Typography variant="h5" gutterBottom>
        Order Management
      </Typography>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>OrderID</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Phone number</TableCell>
                <TableCell>Method</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <TableRow key={order.orderId}>
                    <TableCell>{order.orderId}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>{order.location}</TableCell>
                    <TableCell>{order.phoneNumber}</TableCell>
                    <TableCell>{order.method}</TableCell>
                    <TableCell>{order.price}</TableCell>
                    <TableCell>
                      <span style={getStatusStyle(order.status)}>{order.status}</span>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleClickOpen(order)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={10} align="center">
                    No orders found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {selectedOrder && (
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Details Order</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Order ID: {selectedOrder.orderId}
            </DialogContentText>
            <TextField margin="dense" label="Customer" type="text" fullWidth value={selectedOrder.customer} disabled />
            <TextField margin="dense" label="Date" type="text" fullWidth value={selectedOrder.date} disabled />
            <TextField margin="dense" label="Method" type="text" fullWidth value={selectedOrder.method} disabled />
            <TextField margin="dense" label="Location" type="text" fullWidth value={selectedOrder.location} onChange={(e) => setSelectedOrder({ ...selectedOrder, location: e.target.value })} />
            <TextField margin="dense" label="Phone Number" type="text" fullWidth value={selectedOrder.phoneNumber} onChange={(e) => setSelectedOrder({ ...selectedOrder, phoneNumber: e.target.value })} />
            <Typography variant="h6" gutterBottom style={{ marginTop: '10px' }}>Product:</Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Price</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedOrder.products.map((product, index) => (
                  <TableRow key={index}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.quantity}</TableCell>
                    <TableCell>{product.price}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={2}>Total</TableCell>
                  <TableCell>{selectedOrder.products.reduce((acc, product) => acc + parseFloat(product.price.replace('.', '')), 0).toLocaleString()}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Select
              margin="dense"
              label="Status"
              fullWidth
              value={selectedOrder.status}
              onChange={(e) => setSelectedOrder({ ...selectedOrder, status: e.target.value })}
            >
              <MenuItem value="COMPLETED">COMPLETED</MenuItem>
              <MenuItem value="CANCELLED">CANCELLED</MenuItem>
              <MenuItem value="PENDING">PENDING</MenuItem>
            </Select>
            <TextField margin="dense" label="Note" type="text" fullWidth multiline rows={4} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Close
            </Button>
            <Button onClick={handleSave} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
};

export default OrderManagement;
