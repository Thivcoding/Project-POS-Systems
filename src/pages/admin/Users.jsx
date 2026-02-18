import React, { useState } from "react";
import {
  Card,
  Table,
  Button,
  Row,
  Col,
  Form,
  Modal
} from "react-bootstrap";

const Users = () => {

  const [show, setShow] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // ✅ SEARCH STATE

  const [users, setUsers] = useState([
    { id: 1, name: "John Doe", email: "john@example.com", role: "Admin", status: "Active" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Cashier", status: "Inactive" },
  ]);

  const [formData, setFormData] = useState({
    id: null,
    name: "",
    email: "",
    role: "Cashier",
    status: "Active"
  });

  const handleClose = () => {
    setShow(false);
    setIsEdit(false);
    setFormData({ id: null, name: "", email: "", role: "Cashier", status: "Active" });
  };

  const handleShowAdd = () => {
    setIsEdit(false);
    setShow(true);
  };

  const handleShowEdit = (user) => {
    setIsEdit(true);
    setFormData(user);
    setShow(true);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEdit) {
      setUsers(users.map(u => u.id === formData.id ? formData : u));
    } else {
      setUsers([...users, { ...formData, id: Date.now() }]);
    }

    handleClose();
  };

  const handleDelete = (id) => {
    setUsers(users.filter(u => u.id !== id));
  };

  // ✅ FILTER USERS BASED ON SEARCH
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>

      {/* Header */}
      <Row className="mb-4 align-items-center">
        <Col>
          <h3 className="fw-bold">User Management</h3>
        </Col>
        <Col md="auto">
          <Button variant="primary" onClick={handleShowAdd}>
            + Add User
          </Button>
        </Col>
      </Row>

      {/* 🔎 Search Input */}
      <Row className="mb-3">
        <Col md={4}>
          <Form.Control
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
      </Row>

      {/* Users Table */}
      <Card className="shadow-sm border-0">
        <Card.Body>
          <Table striped hover responsive>
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>

              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <tr key={user.id}>
                    <td>{index + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      <span className={`badge ${user.status === "Active" ? "bg-success" : "bg-secondary"}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="text-center">
                      <Button
                        variant="outline-warning"
                        size="sm"
                        className="me-2"
                        onClick={() => handleShowEdit(user)}
                      >
                        Edit
                      </Button>

                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(user.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center text-muted py-3">
                    No users found
                  </td>
                </tr>
              )}

            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Add/Edit Modal */}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {isEdit ? "Edit User" : "Add User"}
          </Modal.Title>
        </Modal.Header>

        <Form onSubmit={handleSubmit}>
          <Modal.Body>

            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option>Admin</option>
                <option>Cashier</option>
              </Form.Select>
            </Form.Group>

            <Form.Group>
              <Form.Label>Status</Form.Label>
              <Form.Select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option>Active</option>
                <option>Inactive</option>
              </Form.Select>
            </Form.Group>

          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {isEdit ? "Update" : "Save"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

    </div>
  );
};

export default Users;
