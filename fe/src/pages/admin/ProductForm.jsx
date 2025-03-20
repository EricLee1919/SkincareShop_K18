import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { ArrowBack, Save, Upload } from '@mui/icons-material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const productValidationSchema = Yup.object({
  name: Yup.string().required('Product name is required'),
  description: Yup.string(),
  price: Yup.number()
    .positive('Price must be positive')
    .required('Price is required'),
  quantity: Yup.number()
    .integer('Stock must be an integer')
    .min(0, 'Stock cannot be negative')
    .required('Stock is required'),
  categoryId: Yup.number().required('Category is required'),
  image: Yup.string().required('Image URL is required'),
  code: Yup.string()
    .matches(/PD\d{5}/, "Code must follow pattern 'PDxxxxx' (e.g., PD00001)")
    .required('Product code is required'),
});

const ProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [loading, setLoading] = useState(isEditMode);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    categoryId: '',
    image: '',
    code: isEditMode ? '' : 'PD',
    isDeleted: false,
  });

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
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
        console.log('Categories loaded for product form:', data);
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to fetch categories. Please try again.');
      }
    };

    fetchCategories();
  }, []);

  // Fetch product data if in edit mode
  useEffect(() => {
    const fetchProduct = async () => {
      if (!isEditMode) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:8080/api/product/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch product details');
        }
        const productData = await response.json();
        
        // Transform the product data to match our form fields
        setProduct({
          name: productData.name,
          description: productData.description || '',
          price: productData.price,
          quantity: productData.quantity,
          categoryId: productData.category.id,
          image: productData.image,
          code: productData.code,
          isDeleted: productData.isDeleted,
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to fetch product details. Please try again.');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, isEditMode]);

  // Check if user is admin
  useEffect(() => {
    const checkAdmin = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
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
    };

    checkAdmin();
  }, [navigate]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setSaveLoading(true);
      setError(null);
      setSuccess(null);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token is missing');
      }
      
      // Prepare the data for API
      const productData = {
        ...values,
        id: isEditMode ? Number(id) : 0,
        isDeleted: values.isDeleted || false,
      };
      
      console.log('Sending product data to API:', productData);
      
      // Make API call
      const response = await fetch(
        isEditMode 
          ? `http://localhost:8080/api/product/${id}` 
          : 'http://localhost:8080/api/product',
        {
          method: isEditMode ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(productData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save product');
      }

      const savedProduct = await response.json();
      
      // Success message
      setSuccess(isEditMode 
        ? `Product "${values.name}" updated successfully!` 
        : `Product "${values.name}" created successfully with ID ${savedProduct.id}!`
      );
      
      // Navigate back after a short delay
      setTimeout(() => {
        navigate('/admin/products');
      }, 2000);
    } catch (err) {
      console.error('Error saving product:', err);
      setError(err.message || 'Failed to save product. Please try again.');
    } finally {
      setSaveLoading(false);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: '100%',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <IconButton 
              sx={{ mr: 2 }} 
              onClick={() => navigate('/admin/products')}
            >
              <ArrowBack />
            </IconButton>
            <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
              {isEditMode ? 'Edit Product' : 'Add New Product'}
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate('/admin/categories')}
              sx={{ ml: 2 }}
            >
              Manage Categories
            </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {success}
            </Alert>
          )}

          <Paper sx={{ p: 3 }}>
            <Formik
              initialValues={product}
              validationSchema={productValidationSchema}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ values, errors, touched, handleChange, handleBlur, isSubmitting, setFieldValue }) => (
                <Form>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                      <Typography variant="h6" gutterBottom>
                        Product Information
                      </Typography>
                      <TextField
                        fullWidth
                        id="name"
                        name="name"
                        label="Product Name"
                        value={values.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.name && Boolean(errors.name)}
                        helperText={touched.name && errors.name}
                        margin="normal"
                        required
                      />

                      <TextField
                        fullWidth
                        id="description"
                        name="description"
                        label="Description"
                        value={values.description}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.description && Boolean(errors.description)}
                        helperText={touched.description && errors.description}
                        margin="normal"
                        multiline
                        rows={4}
                      />

                      <FormControl 
                        fullWidth 
                        margin="normal"
                        error={touched.categoryId && Boolean(errors.categoryId)}
                        required
                      >
                        <InputLabel id="category-label">Category</InputLabel>
                        <Select
                          labelId="category-label"
                          id="categoryId"
                          name="categoryId"
                          value={values.categoryId}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          label="Category"
                        >
                          {categories.map((category) => (
                            <MenuItem key={category.id} value={category.id}>
                              {category.name}
                            </MenuItem>
                          ))}
                        </Select>
                        {touched.categoryId && errors.categoryId && (
                          <FormHelperText>{errors.categoryId}</FormHelperText>
                        )}
                      </FormControl>

                      <TextField
                        fullWidth
                        id="code"
                        name="code"
                        label="Product Code (Format: PDxxxxx)"
                        value={values.code}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.code && Boolean(errors.code)}
                        helperText={touched.code && errors.code}
                        margin="normal"
                        required
                        disabled={isEditMode}
                      />
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <Typography variant="h6" gutterBottom>
                        Product Details
                      </Typography>
                      <TextField
                        fullWidth
                        id="price"
                        name="price"
                        label="Price"
                        type="number"
                        value={values.price}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.price && Boolean(errors.price)}
                        helperText={touched.price && errors.price}
                        margin="normal"
                        required
                        InputProps={{
                          startAdornment: '$',
                        }}
                      />

                      <TextField
                        fullWidth
                        id="quantity"
                        name="quantity"
                        label="Stock Quantity"
                        type="number"
                        value={values.quantity}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.quantity && Boolean(errors.quantity)}
                        helperText={touched.quantity && errors.quantity}
                        margin="normal"
                        required
                      />

                      <FormControlLabel
                        control={
                          <Switch
                            id="isDeleted"
                            name="isDeleted"
                            checked={values.isDeleted}
                            onChange={(e) => {
                              const isDeleted = e.target.checked;
                              setFieldValue('isDeleted', isDeleted);
                              console.log('isDeleted set to:', isDeleted);
                            }}
                            color="primary"
                          />
                        }
                        label="Inactive"
                        sx={{ mt: 2 }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="h6" gutterBottom>
                        Product Image
                      </Typography>
                      <TextField
                        fullWidth
                        id="image"
                        name="image"
                        label="Image URL"
                        value={values.image}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.image && Boolean(errors.image)}
                        helperText={touched.image && errors.image}
                        margin="normal"
                        required
                      />

                      {values.image && (
                        <Box sx={{ mt: 2, textAlign: 'center' }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Image Preview
                          </Typography>
                          <Box
                            component="img"
                            sx={{
                              height: 200,
                              objectFit: 'contain',
                              border: '1px solid #eee',
                              borderRadius: 1,
                            }}
                            src={values.image}
                            alt={values.name}
                          />
                        </Box>
                      )}
                    </Grid>

                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                        <Button
                          variant="outlined"
                          color="secondary"
                          sx={{ mr: 2 }}
                          onClick={() => navigate('/admin/products')}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                          startIcon={<Save />}
                          disabled={isSubmitting || saveLoading}
                        >
                          {saveLoading ? (
                            <CircularProgress size={24} />
                          ) : (
                            isEditMode ? 'Update Product' : 'Create Product'
                          )}
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Form>
              )}
            </Formik>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default ProductForm; 