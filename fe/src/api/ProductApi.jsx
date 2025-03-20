import api from "./axiosinstance";

function getProduct() {
  return api.get("/api/product");
}
const ProductAPI = { getProduct };
export default ProductAPI;
