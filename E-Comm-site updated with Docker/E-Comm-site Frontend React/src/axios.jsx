import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/API",
});
delete API.defaults.headers.common["Authorization"];
export default API;
