import axios from "./axios";

// Admin sales
export const getSales = async () => {
  return await axios.get("/admin/sales");
};

export const getReports = async () => {
  return await axios.get("/admin/reports/sales");
};

// Cashier sales history
export const getCashierSales = async () => {
  return await axios.get("/cashier/sales");
};
