import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
const API = axios.create({
  baseURL: `${apiBaseUrl}/API`,
});
delete API.defaults.headers.common["Authorization"];
export default API;
