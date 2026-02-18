import React from "react";
import { Row, Col, Card, Table } from "react-bootstrap";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const AdminDashboard = () => {

  // Sample sales data
  const salesData = [
    { name: "Mon", sales: 1200 },
    { name: "Tue", sales: 2100 },
    { name: "Wed", sales: 1800 },
    { name: "Thu", sales: 2400 },
    { name: "Fri", sales: 3000 },
    { name: "Sat", sales: 2800 },
    { name: "Sun", sales: 3500 },
  ];

  return (
    <div>
      <h3 className="mb-4 fw-bold">Admin Dashboard</h3>

      {/* Stats Cards */}
      <Row className="g-4 mb-4">
        <Col md={3}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <h6 className="text-muted">Total Sales</h6>
              <h4 className="fw-bold text-primary">$12,450</h4>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <h6 className="text-muted">Total Orders</h6>
              <h4 className="fw-bold text-success">320</h4>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <h6 className="text-muted">Products</h6>
              <h4 className="fw-bold text-warning">85</h4>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <h6 className="text-muted">Users</h6>
              <h4 className="fw-bold text-danger">12</h4>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Sales Chart */}
      <Card className="shadow-sm border-0 mb-4">
        <Card.Body>
          <h5 className="mb-4">Weekly Sales Overview</h5>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#0d6efd"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>

        </Card.Body>
      </Card>

      {/* Recent Orders */}
      <Card className="shadow-sm border-0">
        <Card.Body>
          <h5 className="mb-3">Recent Orders</h5>
          <Table striped hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>John Doe</td>
                <td>$120</td>
                <td><span className="badge bg-success">Completed</span></td>
                <td>2026-02-17</td>
              </tr>
              <tr>
                <td>2</td>
                <td>Jane Smith</td>
                <td>$85</td>
                <td><span className="badge bg-warning text-dark">Pending</span></td>
                <td>2026-02-16</td>
              </tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>

    </div>
  );
};

export default AdminDashboard;
