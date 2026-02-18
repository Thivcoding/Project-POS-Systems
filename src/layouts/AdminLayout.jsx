import React, { useContext } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import "../style/admin.css"; // 👈 add custom css

const AdminLayout = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="admin-wrapper">

      {/* Sidebar */}
      <div className="admin-sidebar">
        <h4 className="sidebar-title">
          <i className="bi bi-cpu-fill me-2"></i>
          POS Admin
        </h4>

        <Nav className="flex-column">

          <NavLink to="/admin" end className="sidebar-link">
            <i className="bi bi-speedometer2 me-2"></i>
            Dashboard
          </NavLink>

          <NavLink to="/admin/users" className="sidebar-link">
            <i className="bi bi-people me-2"></i>
            Users
          </NavLink>

          <NavLink to="/admin/products" className="sidebar-link">
            <i className="bi bi-box-seam me-2"></i>
            Products
          </NavLink>

          <NavLink to="/admin/orders" className="sidebar-link">
            <i className="bi bi-cart-check me-2"></i>
            Orders
          </NavLink>

          <NavLink to="/admin/reports" className="sidebar-link">
            <i className="bi bi-bar-chart-line me-2"></i>
            Reports
          </NavLink>

          <NavLink to="/admin/settings" className="sidebar-link">
            <i className="bi bi-gear me-2"></i>
            Settings
          </NavLink>

        </Nav>
      </div>

      {/* Main Content */}
      <div className="admin-main">

        {/* Top Navbar */}
        <Navbar className="admin-navbar">
          <Container fluid>

            <Navbar.Brand className="fw-bold text-white">
              <i className="bi bi-grid-1x2-fill me-2"></i>
              Admin Dashboard
            </Navbar.Brand>

            <div className="d-flex align-items-center text-white">

              <div className="me-4">
                <i className="bi bi-person-circle me-1"></i>
                {user?.email || "Admin"}
              </div>

              <Button
                variant="light"
                size="sm"
                onClick={logout}
              >
                <i className="bi bi-box-arrow-right me-1"></i>
                Logout
              </Button>

            </div>

          </Container>
        </Navbar>

        {/* Page Content */}
        <div className="admin-content">
          <Outlet />
        </div>

      </div>

    </div>
  );
};

export default AdminLayout;
