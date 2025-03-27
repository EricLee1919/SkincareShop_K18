import api from "./axiosInstance";

const ProductAPI = {
  getProduct() {
    return api.get("/api/product");
  },

  searchProducts(query) {
    return api.get(`/api/products/search?q=${encodeURIComponent(query)}`);
  },
};

export default ProductAPI;
