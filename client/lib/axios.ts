import axios from "axios";

const api = axios.create({
  baseURL: "https://pixelcart-ecommerce.onrender.com",
  withCredentials: true,
});

export default api; 