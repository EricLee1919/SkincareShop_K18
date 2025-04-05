import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  OutlinedInput,
  Chip,
} from "@mui/material";
import { ArrowBack, Save } from "@mui/icons-material";
import { Formik, Form } from "formik";
import * as Yup from "yup";

const skinTypes = ["OILY", "DRY", "COMBINATION", "SENSITIVE", "NORMAL"];

const productValidationSchema = Yup.object({
  name: Yup.string().required("Product name is required"),
  description: Yup.string(),
  price: Yup.number()
    .positive("Price must be positive")
    .required("Price is required"),
  quantity: Yup.number()
    .integer("Stock must be an integer")
    .min(0, "Stock cannot be negative")
    .required("Stock is required"),
  categoryId: Yup.number().required("Category is required"),
  image: Yup.string().required("Image URL is required"),
  code: Yup.string()
    .matches(/PD\d{5}/, "Code must follow pattern 'PDxxxxx' (e.g., PD00001)")
    .required("Product code is required"),
  suitableTypes: Yup.array()
    .of(Yup.string())
    .min(1, "Select at least one skin type"),
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
    name: "",
    description: "",
    price: "",
    quantity: "",
    categoryId: "",
    image: "",
    code: isEditMode ? "" : "PD",
    isDeleted: false,
    suitableTypes: [],
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8080/api/category", {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }

        const data = await response.json();
        setCategories(data);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to fetch categories. Please try again.");
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!isEditMode) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:8080/api/product/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch product details");
        }
        const data = await response.json();

        setProduct({
          name: data.name,
          description: data.description || "",
          price: data.price,
          quantity: data.quantity,
          categoryId: data.category.id,
          image: data.image,
          code: data.code,
          isDeleted: data.isDeleted,
          suitableTypes: Array.isArray(data.suitableTypes)
            ? [...new Set(data.suitableTypes)]
            : [],
        });

        setLoading(false);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to fetch product details. Please try again.");
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, isEditMode]);

  useEffect(() => {
    const checkAdmin = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          if (userData.roleEnum !== "MANAGER") {
            navigate("/");
          }
        } catch {
          navigate("/login");
        }
      } else {
        navigate("/login");
      }
    };

    checkAdmin();
  }, [navigate]);

  const initialValues = useMemo(() => product, [product]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setSaveLoading(true);
      setError(null);
      setSuccess(null);

      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token is missing");

      const productData = {
        ...values,
        id: isEditMode ? Number(id) : 0,
      };

      const response = await fetch(
        isEditMode
          ? `http://localhost:8080/api/product/${id}`
          : "http://localhost:8080/api/product",
        {
          method: isEditMode ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(productData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save product");
      }

      const savedProduct = await response.json();
      setSuccess(
        isEditMode
          ? `Product "${values.name}" updated successfully!`
          : `Product "${values.name}" created successfully with ID ${savedProduct.id}!`
      );

      setTimeout(() => navigate("/admin/products"), 2000);
    } catch (err) {
      setError(err.message || "Failed to save product. Please try again.");
    } finally {
      setSaveLoading(false);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex" }}>
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: "100%" }}>
        <Container maxWidth="lg">
          <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
            <IconButton
              sx={{ mr: 2 }}
              onClick={() => navigate("/admin/products")}
            >
              <ArrowBack />
            </IconButton>
            <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
              {isEditMode ? "Edit Product" : "Add New Product"}
            </Typography>
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
              initialValues={initialValues}
              validationSchema={productValidationSchema}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                isSubmitting,
                setFieldValue,
              }) => (
                <Form>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                      <Typography variant="h6" gutterBottom>
                        Product Information
                      </Typography>

                      <TextField
                        fullWidth
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
                        name="description"
                        label="Description"
                        value={values.description}
                        onChange={handleChange}
                        onBlur={handleBlur}
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
                          name="categoryId"
                          value={values.categoryId}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        >
                          {categories.map((cat) => (
                            <MenuItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </MenuItem>
                          ))}
                        </Select>
                        <FormHelperText>
                          {touched.categoryId && errors.categoryId}
                        </FormHelperText>
                      </FormControl>

                      <TextField
                        fullWidth
                        name="code"
                        label="Product Code (PDxxxxx)"
                        value={values.code}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.code && Boolean(errors.code)}
                        helperText={touched.code && errors.code}
                        margin="normal"
                        required
                        disabled={isEditMode}
                      />

                      <FormControl
                        fullWidth
                        margin="normal"
                        error={
                          touched.suitableTypes && Boolean(errors.suitableTypes)
                        }
                      >
                        <InputLabel>Suitable Skin Types</InputLabel>
                        <Select
                          multiple
                          name="suitableTypes"
                          value={values.suitableTypes || []}
                          onChange={(e) => {
                            const selected = e.target.value;
                            const unique = [...new Set(selected)];
                            setFieldValue("suitableTypes", unique);
                          }}
                          input={<OutlinedInput label="Suitable Skin Types" />}
                          renderValue={(selected) => (
                            <Box
                              sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 0.5,
                              }}
                            >
                              {selected.map((val) => (
                                <Chip key={val} label={val} />
                              ))}
                            </Box>
                          )}
                        >
                          {skinTypes.map((type) => (
                            <MenuItem key={type} value={type}>
                              {type}
                            </MenuItem>
                          ))}
                        </Select>
                        <FormHelperText>
                          {touched.suitableTypes && errors.suitableTypes}
                        </FormHelperText>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <Typography variant="h6" gutterBottom>
                        Product Details
                      </Typography>

                      <TextField
                        fullWidth
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
                        InputProps={{ startAdornment: "$" }}
                      />

                      <TextField
                        fullWidth
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
                            name="isDeleted"
                            checked={values.isDeleted}
                            onChange={handleChange}
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
                        <Box sx={{ mt: 2, textAlign: "center" }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Image Preview
                          </Typography>
                          <Box
                            component="img"
                            sx={{
                              height: 200,
                              objectFit: "contain",
                              border: "1px solid #eee",
                              borderRadius: 1,
                            }}
                            src={values.image}
                            alt={values.name}
                          />
                        </Box>
                      )}
                    </Grid>

                    <Grid item xs={12}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          mt: 3,
                        }}
                      >
                        <Button
                          variant="outlined"
                          color="secondary"
                          sx={{ mr: 2 }}
                          onClick={() => navigate("/admin/products")}
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
                          ) : isEditMode ? (
                            "Update Product"
                          ) : (
                            "Create Product"
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
