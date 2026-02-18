import React, { useContext } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import "../style/cashier.css";

const CashierLayout = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="cashier-wrapper">

      {/* Sidebar */}
      <div className="cashier-sidebar">
        <h4 className="sidebar-title">
          <i className="bi bi-cash-coin me-2"></i>
          POS Cashier
        </h4>

        <Nav className="flex-column">

          <NavLink to="/cashier" end className="sidebar-link">
            <i className="bi bi-speedometer2 me-2"></i>
            Dashboard
          </NavLink>

          <NavLink to="/cashier/orders" className="sidebar-link">
            <i className="bi bi-cart-check me-2"></i>
            Orders
          </NavLink>

          <NavLink to="/cashier/products" className="sidebar-link">
            <i className="bi bi-box-seam me-2"></i>
            Products
          </NavLink>

          <NavLink to="/cashier/reports" className="sidebar-link">
            <i className="bi bi-bar-chart-line me-2"></i>
            Reports
          </NavLink>

          <NavLink to="/cashier/settings" className="sidebar-link">
            <i className="bi bi-gear me-2"></i>
            Settings
          </NavLink>

        </Nav>
      </div>

      {/* Main Area */}
      <div className="cashier-main">

        {/* Top Navbar */}
        <Navbar className="cashier-navbar">
          <Container fluid>

            <Navbar.Brand className="fw-bold text-white">
              <i className="bi bi-layout-text-window-reverse me-2"></i>
              Cashier Panel
            </Navbar.Brand>

            <div className="d-flex align-items-center text-white">
              <div className="me-4">
                <i className="bi bi-person-circle me-1"></i>
                {user?.email || "Cashier"}
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
        <div className="cashier-content">
          <Outlet />
        </div>

      </div>
    </div>
  );
};

export default CashierLayout;
