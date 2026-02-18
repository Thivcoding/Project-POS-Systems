import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import CashierLayout from "../layouts/CashierLayout";
import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import PrivateRoute from "./PrivateRoute";
import CashierDashboard from "../pages/cashier/CashierDashboard";
import Users from "../pages/admin/Users";
import Products from "../pages/admin/Products";

export default function AppRoutes() {
  return (
      <Routes>
        {/* Auth routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Cashier routes protected by role */}
        <Route element={<PrivateRoute allowedRoles={["cashier"]} />}>
          <Route element={<CashierLayout />}>
            <Route path="/cashier" element={<CashierDashboard/>} />
            <Route path="/cashier/orders" element={<div>Orders Page</div>} />
            <Route path="/cashier/products" element={<div>Products Page</div>} />
          </Route>
        </Route>

        {/* Admin routes protected by role */}
        <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<Users/>} />
            <Route path="/admin/products" element={<Products/>} />
            <Route path="/admin/reports" element={<div>Reports Page</div>} />
          </Route>
        </Route>

        {/* Redirect unknown routes to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
  );
}
