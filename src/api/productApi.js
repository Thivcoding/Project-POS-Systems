import axios from "./axios";

export const getProducts = async () => {
  return await axios.get("/admin/products");
};

export const createProduct = async (data) => {
  return await axios.post("/admin/products", data);
};

export const updateProduct = async (id, data) => {
  return await axios.put(`/admin/products/${id}`, data);
};

export const deleteProduct = async (id) => {
  return await axios.delete(`/admin/products/${id}`);
};
