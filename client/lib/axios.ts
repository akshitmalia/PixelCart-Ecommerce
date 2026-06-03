import axios from "axios";

const api = axios.create({
  baseURL: "https://renewed-blessing-production-644a.up.railway.app/api",
  withCredentials: true,
});

export default api; 