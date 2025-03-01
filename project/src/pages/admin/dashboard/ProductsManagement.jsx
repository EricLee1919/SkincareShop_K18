import { useState, useEffect } from 'react';
import axios from '../../../axiosConfig';
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
  DialogTitle,
  TextField,
  IconButton,
  FormControlLabel,
  Switch,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  styled,
  DialogContentText,
  Box,
  TablePagination,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid';
import { useDispatch } from 'react-redux';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { RingLoader } from 'react-spinners';

const StyledTableCell = styled(TableCell)({
  fontWeight: 'bold',
});

const ProductsManagement = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentProduct, setCurrentProduct] = useState({
    name: '',
    shape: '',
    carat: 0,
    color: [],
    price: 0,
    lab: '',
    origin: '',
    quantity: 0,
    diamond_status: false,
    image: '',
    diamond_id: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    axios.get('/diamonds')
      .then(response => {
        const updatedProducts = response.data.map(product => ({
          ...product,
          diamond_status: product.quantity > 0
        }));
        setProducts(updatedProducts);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  };

  const handleClickOpen = (product) => {
    if (product) {
      setIsEditing(true);
      setCurrentProduct(product);
    } else {
      setIsEditing(false);
      setCurrentProduct({
        name: '',
        shape: '',
        carat: 0,
        color: [],
        price: 0,
        lab: '',
        origin: '',
        quantity: 0,
        diamond_status: false,
        image: '',
        diamond_id: '',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setConfirmClose(true);
  };

  const handleSave = () => {
    console.log('Current Product:', currentProduct);

    if (!currentProduct.name || !currentProduct.carat || !currentProduct.price || !currentProduct.origin || !currentProduct.quantity || !currentProduct.image) {
      notifyFail();
      return;
    }

    currentProduct.diamond_status = currentProduct.quantity > 0;

    if (isEditing) {
      axios.put(`/diamonds/${currentProduct.diamond_id}`, currentProduct)
        .then(response => {
          console.log('Product updated:', response.data);
          fetchProducts();
          setOpen(false);
          notifySuccess();
        })
        .catch(error => {
          console.error('Error updating product:', error.response ? error.response.data : error.message);
        });
    } else {
      currentProduct.diamond_id = uuidv4();
      axios.post('/diamonds', currentProduct)
        .then(response => {
          console.log('Product added:', response.data);
          fetchProducts();
          setOpen(false);
          notifySuccess();
        })
        .catch(error => {
          console.error('Error adding product:', error.response ? error.response.data : error.message);
        });
    }
  };

  const handleDelete = (diamond_id) => {
    axios.delete(`/diamonds/${diamond_id}`)
      .then(response => {
        console.log('Product deleted:', response.data);
        fetchProducts();
      })
      .catch(error => {
        console.error('Error deleting product:', error.response ? error.response.data : error.message);
      });
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredProducts = products.filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()));

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

  const notifySuccess = () => toast.success('Save Successfully!', {
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

  const notifyFail = () => toast.error('Please fill in all required fields!', {
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
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <RingLoader color="#B19567" size={80} />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" style={{ marginTop: '20px' }}>
      <Typography variant="h4" gutterBottom sx={{ fontFamily: "Times New Roman" }}>
        Products Management
      </Typography>
      <Button
        variant="contained"
        color="primary"
        sx={{
          marginBottom: '10px', backgroundColor: "#B19567",
          "&:hover": {
            backgroundColor: "#2c3e50",
          },
        }}
        onClick={() => handleClickOpen(null)}>+ Add Product</Button>
      <TextField
        label="Search"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <Paper sx={{ width: '100%', overflow: 'hidden', marginTop: "20px", marginBottom: "50px" }}>
        <TableContainer component={Paper} style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <StyledTableCell>Name</StyledTableCell>
                <StyledTableCell>Shape</StyledTableCell>
                <StyledTableCell>Carat</StyledTableCell>
                <StyledTableCell>Color</StyledTableCell>
                <StyledTableCell>Price</StyledTableCell>
                <StyledTableCell>Lab</StyledTableCell>
                <StyledTableCell>Origin</StyledTableCell>
                <StyledTableCell>Quantity</StyledTableCell>
                <StyledTableCell>Image</StyledTableCell>
                <StyledTableCell>Status</StyledTableCell>
                <StyledTableCell>Action</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProducts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(product => (
                <TableRow key={product.diamond_id} hover>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.shape}</TableCell>
                  <TableCell>{product.carat}</TableCell>
                  <TableCell>{product.color.join(', ')}</TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell>{product.lab}</TableCell>
                  <TableCell>{product.origin}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>
                    <img src={product.image} alt={product.name} style={{ width: '50px', height: '50px' }} />
                  </TableCell>
                  <TableCell>{product.diamond_status ? 'Active' : 'Inactive'}</TableCell>
                  <TableCell>
                    <IconButton aria-label="edit" color="primary" onClick={() => handleClickOpen(product)} sx={{ color: "grey" }}>
                      <Edit />
                    </IconButton>
                    <IconButton aria-label="delete" color="secondary" onClick={() => handleRemove(product.diamond_id)} sx={{ color: "#CD5C5C" }}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
              }
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredProducts.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{isEditing ? 'Edit Product' : 'Add New Product'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            value={currentProduct.name}
            onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Shape</InputLabel>
            <Select
              label="Shape"
              value={currentProduct.shape}
              onChange={(e) => setCurrentProduct({ ...currentProduct, shape: e.target.value })}
            >
              <MenuItem value="Round">Round</MenuItem>
              <MenuItem value="Pear">Pear</MenuItem>
              <MenuItem value="Heart">Heart</MenuItem>
              <MenuItem value="Princess">Princess</MenuItem>
              <MenuItem value="Oval">Oval</MenuItem>
              <MenuItem value="Emerald">Emerald</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Carat"
            type="number"
            fullWidth
            value={currentProduct.carat}
            onChange={(e) => setCurrentProduct({ ...currentProduct, carat: e.target.value })}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Color</InputLabel>
            <Select
              label="Color"
              multiple
              value={currentProduct.color}
              onChange={(e) => setCurrentProduct({ ...currentProduct, color: e.target.value })}
              renderValue={(selected) => selected.join(', ')}
            >
              <MenuItem value="E">E</MenuItem>
              <MenuItem value="F">F</MenuItem>
              <MenuItem value="G">G</MenuItem>
              <MenuItem value="D">D</MenuItem>
              <MenuItem value="J">J</MenuItem>
              <MenuItem value="I">I</MenuItem>
              <MenuItem value="H">H</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Price"
            type="number"
            fullWidth
            value={currentProduct.price}
            onChange={(e) => setCurrentProduct({ ...currentProduct, price: e.target.value })}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Lab</InputLabel>
            <Select
              label="Lab"
              value={currentProduct.lab}
              onChange={(e) => setCurrentProduct({ ...currentProduct, lab: e.target.value })}
            >
              <MenuItem value="GIA">GIA</MenuItem>
              <MenuItem value="SJC">SJC</MenuItem>

            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Origin"
            type="text"
            fullWidth
            value={currentProduct.origin}
            onChange={(e) => setCurrentProduct({ ...currentProduct, origin: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Quantity"
            type="number"
            fullWidth
            value={currentProduct.quantity}
            onChange={(e) => setCurrentProduct({ ...currentProduct, quantity: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Image"
            type="text"
            fullWidth
            value={currentProduct.image}
            onChange={(e) => setCurrentProduct({ ...currentProduct, image: e.target.value })}
          />
          <FormControlLabel
            control={<Switch checked={currentProduct.diamond_status} onChange={(e) => setCurrentProduct({ ...currentProduct, diamond_status: e.target.checked })} />}
            label={currentProduct.diamond_status ? 'Active' : 'Inactive'}
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

      <Dialog
        open={confirmClose}
        onClose={() => handleConfirmClose(false)}
      >
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure to close this tab?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleConfirmClose(false)} color="primary" sx={{ color: "red" }}>
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
          <Typography>Are you sure you want to remove this item?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error" sx={{ color: "red" }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer />
    </Container>
  );
};

export default ProductsManagement;
