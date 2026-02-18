import axios from "./axios";

export const getCategories = async () => {
  return await axios.get("/admin/categories");
};

export const createCategory = async (data) => {
  return await axios.post("/admin/categories", data);
};

export const updateCategory = async (id, data) => {
  return await axios.put(`/admin/categories/${id}`, data);
};

export const deleteCategory = async (id) => {
  return await axios.delete(`/admin/categories/${id}`);
};
