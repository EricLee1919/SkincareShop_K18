import api from "./axiosinstance";

function getOrder() {
  return api.get("/api/orders");
}
const OrderAPI = { getOrder };
export default OrderAPI;
