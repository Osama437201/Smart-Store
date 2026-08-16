import api from "./axios";

export const getCategories = async () => {
  const response = await api.get("/api/Categories");
  return response.data;
};