import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [saveLoading, setSaveLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      setLoading(true);
      
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:8080/api/category', {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      
      const data = await response.json();
      console.log('Categories loaded:', data);
      
      // Filter out deleted categories if they're returned
      const activeCategories = data.filter(category => !category.deleted);
      setCategories(activeCategories);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to fetch categories. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleDeleteClick = (category) => {
    setSelectedCategory(category);
    setOpenDeleteDialog(true);
  };

  const handleEditClick = (category) => {
    setSelectedCategory(category);
    setCategoryName(category.name);
    setOpenEditDialog(true);
  };

  const handleAddClick = () => {
    setCategoryName('');
    setOpenAddDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDeleteDialog(false);
    setOpenEditDialog(false);
    setOpenAddDialog(false);
    setSelectedCategory(null);
    setCategoryName('');
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCategory) return;
    
    try {
      setSaveLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication token is missing');
      }
      
      const response = await fetch(`http://localhost:8080/api/category/${selectedCategory.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete category');
      }
      
      // Update the local state
      setCategories(categories.filter(cat => cat.id !== selectedCategory.id));
      
      setSnackbar({
        open: true,
        message: `Category "${selectedCategory.name}" deleted successfully`,
        severity: 'success',
      });
    } catch (err) {
      console.error('Error deleting category:', err);
      setSnackbar({
        open: true,
        message: err.message || 'Failed to delete category',
        severity: 'error',
      });
    } finally {
      setSaveLoading(false);
      handleCloseDialog();
    }
  };

  const handleSaveCategory = async () => {
    if (!categoryName.trim()) {
      setSnackbar({
        open: true,
        message: 'Category name cannot be empty',
        severity: 'error',
      });
      return;
    }
    
    try {
      setSaveLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication token is missing');
      }
      
      const isEditing = !!selectedCategory;
      const url = isEditing 
        ? `http://localhost:8080/api/category/${selectedCategory.id}`
        : 'http://localhost:8080/api/category';
      
      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name: categoryName }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to ${isEditing ? 'update' : 'create'} category`);
      }
      
      const savedCategory = await response.json();
      
      // Update the local state
      if (isEditing) {
        setCategories(categories.map(cat => 
          cat.id === selectedCategory.id ? savedCategory : cat
        ));
      } else {
        setCategories([...categories, savedCategory]);
      }
      
      setSnackbar({
        open: true,
        message: `Category ${isEditing ? 'updated' : 'created'} successfully`,
        severity: 'success',
      });
    } catch (err) {
      console.error(`Error ${selectedCategory ? 'updating' : 'creating'} category:`, err);
      setSnackbar({
        open: true,
        message: err.message || `Failed to ${selectedCategory ? 'update' : 'create'} category`,
        severity: 'error',
      });
    } finally {
      setSaveLoading(false);
      handleCloseDialog();
    }
  };

  if (loading && categories.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box component="main" sx={{ p: 3 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1">
            Categories Management
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddClick}
          >
            Add Category
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      No categories found
                    </TableCell>
                  </TableRow>
                ) : (
                  categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>{category.id}</TableCell>
                      <TableCell>{category.name}</TableCell>
                      <TableCell>
                        <IconButton
                          color="primary"
                          onClick={() => handleEditClick(category)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteClick(category)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={openDeleteDialog}
          onClose={handleCloseDialog}
        >
          <DialogTitle>Delete Category</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete the category "{selectedCategory?.name}"?
              This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} disabled={saveLoading}>
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              color="error"
              disabled={saveLoading}
              startIcon={saveLoading ? <CircularProgress size={20} /> : null}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Category Dialog */}
        <Dialog
          open={openEditDialog}
          onClose={handleCloseDialog}
        >
          <DialogTitle>Edit Category</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Category Name"
              fullWidth
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              variant="outlined"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} disabled={saveLoading}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveCategory}
              color="primary"
              disabled={saveLoading}
              startIcon={saveLoading ? <CircularProgress size={20} /> : null}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add Category Dialog */}
        <Dialog
          open={openAddDialog}
          onClose={handleCloseDialog}
        >
          <DialogTitle>Add New Category</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Category Name"
              fullWidth
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              variant="outlined"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} disabled={saveLoading}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveCategory}
              color="primary"
              disabled={saveLoading}
              startIcon={saveLoading ? <CircularProgress size={20} /> : null}
            >
              Add
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default Categories; 