import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as authApi from "../api/authApi";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Login function
  const login = async (data) => {
    const res = await authApi.login(data);

    // console.log(res);
    
    const { token, users } = res.data;

    localStorage.setItem("token", token);
    localStorage.setItem("users", JSON.stringify(users));

    setUser(users);
    return users;
  };

  // Register function
  const register = async (data) => {
    const res = await authApi.register(data);
    return res.data;
  };

  // Logout function
  const logout = () => {
    authApi.logout();
    setUser(null);
    navigate("/login");
  };

  // Load user from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }

    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
