import axios from "axios";

const api = axios.create({
  baseURL: "https://tryha.runasp.net/api",
});

export default api;