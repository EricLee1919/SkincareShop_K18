import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:8080/api";

// Add axios interceptor to include token in all requests
axios.interceptors.request.use(
  (config) => {
    // Don't add token for login and register endpoints
    if (config.url.includes("/login") || config.url.includes("/register")) {
      return config;
    }
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Authentication actions
export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      // Transform the credentials to match what the backend expects
      const backendCredentials = {
        username: credentials.email, // Use email as username
        password: credentials.password,
      };

      const response = await axios.post(`${API_URL}/login`, backendCredentials);
      console.log("Login response:", response.data); // Debug log

      // If login is successful and we have a token, save it
      if (response.data && response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      return response.data;
    } catch (error) {
      console.error("Login error:", error.response?.data); // Debug log
      const errorMessage =
        error.response?.data?.message ||
        "Login failed. Please check your credentials.";
      return rejectWithValue({ message: errorMessage });
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/register`, userData);
      console.log("Registration response:", response.data); // Debug log
      return response.data;
    } catch (error) {
      console.error("Registration error:", error.response?.data); // Debug log
      let errorMessage = "Registration failed";

      if (error.response?.data?.message?.includes("username")) {
        errorMessage = "Username is already taken";
      } else if (error.response?.data?.message?.includes("email")) {
        errorMessage = "Email is already registered";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      return rejectWithValue({ message: errorMessage });
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/users/me`);
      return response.data;
    } catch (error) {
      console.error("Get user error:", error.response?.data); // Debug log
      return rejectWithValue(
        error.response?.data || { message: "Failed to get user data" }
      );
    }
  }
);
//update user
export const updateUser = createAsyncThunk(
  "auth/updateUser",
  async (userData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.put(
        "http://localhost:8080/api/users/update",
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Update user error:", error);

      // Handle different types of errors
      if (error.response) {
        // Server responded with error
        return rejectWithValue(
          error.response.data.message || "Failed to update user data"
        );
      } else if (error.request) {
        // Request made but no response
        return rejectWithValue("Network error. Please check your connection.");
      } else {
        // Something else went wrong
        return rejectWithValue(error.message || "An unexpected error occurred");
      }
    }
  }
);

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem("token");
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Login failed";
        state.isAuthenticated = false;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Registration failed";
        state.isAuthenticated = false;
      })
      // Get Current User
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to get user data";
        state.isAuthenticated = false;
      })
      // Update User
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to update user data";
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
