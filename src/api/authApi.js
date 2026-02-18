import axios from "./axios";

export const login = async (data) => {
  return await axios.post("/login", data);
};

export const register = async (data) => {
  return await axios.post("/register", data);
};

export const logout = async () => {
  localStorage.removeItem("token");
  localStorage.removeItem("users");
};

