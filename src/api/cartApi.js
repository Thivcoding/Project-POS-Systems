import axios from "./axios";

// CASHIER CART API

export const createCart = async () => {
  return await axios.post("/cashier/carts");
};

export const getCart = async (cartId) => {
  return await axios.get(`/cashier/carts/${cartId}`);
};

export const addCartItem = async (data) => {
  return await axios.post("/cashier/cart-items", data);
};

export const updateCartItem = async (id, data) => {
  return await axios.put(`/cashier/cart-items/${id}`, data);
};

export const removeCartItem = async (id) => {
  return await axios.delete(`/cashier/cart-items/${id}`);
};

export const checkoutCart = async (cartId) => {
  return await axios.post(`/cashier/carts/${cartId}/checkout`);
};
