import React from "react";
import { Outlet } from "react-router-dom";
import "../style/auth.css";

export default function AuthLayout() {
  return (
    <div className="auth-wrapper">
      <div className="auth-card">

        <div className="text-center mb-4">
          <h3 className="fw-bold">POS System</h3>
          <p className="text-muted small mb-0">
            Welcome back 👋
          </p>
        </div>

        {/* Login / Register page renders here */}
        <Outlet />

      </div>
    </div>
  );
}
