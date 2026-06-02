import axios from "axios";

const api = axios.create({
  baseURL: "https://pixelcart-backend-6069.onrender.com/api",
  withCredentials: true,
});

export default api;

//Render Deploy Link added to the /clinet/lib/axios.ts