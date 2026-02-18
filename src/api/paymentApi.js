import axios from "./axios";

export const createPayment = async (data) => {
  return await axios.post("/cashier/payments", data);
};

export const checkBakongPayment = async (paymentId) => {
  return await axios.get(`/cashier/payments/bakong/${paymentId}/check`);
};

export const cancelPayment = async (paymentId) => {
  return await axios.post(`/cashier/payments/${paymentId}/cancel`);
};
