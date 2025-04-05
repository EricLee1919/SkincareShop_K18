import { createSlice } from '@reduxjs/toolkit';

// === Storage Helpers ===
const loadFromStorage = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`Error loading ${key} from storage:`, error);
    return [];
  }
};

const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${key} to storage:`, error);
  }
};

// === Initial State ===
const initialState = {
  items: loadFromStorage('cartItems'),
  wishlist: loadFromStorage('wishlistItems'),
  loading: false,
  error: null,
};

// === Slice ===
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Cart actions
    addToCart: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.items.find(item => item.id === newItem.id);
      if (!existingItem) {
        state.items.push({ ...newItem, quantity: 1 });
        saveToStorage('cartItems', state.items);
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      saveToStorage('cartItems', state.items);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);
      if (item) {
        item.quantity = Math.max(1, quantity);
        saveToStorage('cartItems', state.items);
      }
    },
    clearCart: (state) => {
      state.items = [];
      saveToStorage('cartItems', state.items);
    },

    // Wishlist actions
    addToWishlist: (state, action) => {
      const item = action.payload;
      const exists = state.wishlist.find(w => w.id === item.id);
      if (!exists) {
        state.wishlist.push(item);
        saveToStorage('wishlistItems', state.wishlist);
      }
    },
    removeFromWishlist: (state, action) => {
      state.wishlist = state.wishlist.filter(item => item.id !== action.payload);
      saveToStorage('wishlistItems', state.wishlist);
    },
    clearWishlist: (state) => {
      state.wishlist = [];
      saveToStorage('wishlistItems', state.wishlist);
    },
  },
});

// === Export Actions ===
export const {
  addToCart, removeFromCart, updateQuantity, clearCart,
  addToWishlist, removeFromWishlist, clearWishlist
} = cartSlice.actions;

// === Selectors ===
export const selectCartItems = (state) => state.cart.items;
export const selectCartTotal = (state) =>
  state.cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
export const selectCartItemCount = (state) =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0);

export const selectWishlistItems = (state) => state.cart.wishlist;
export const selectWishlistCount = (state) => state.cart.wishlist.length;

export default cartSlice.reducer;
