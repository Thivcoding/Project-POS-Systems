import React, { useEffect, useState, useMemo } from "react";
import {
  Card,
  Table,
  Button,
  Row,
  Col,
  Form,
  Modal,
  Pagination,
  Spinner
} from "react-bootstrap";

import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from "../../api/productApi";
import { getCategories } from "../../api/categoryApi";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [show, setShow] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [search, setSearch] = useState("");
  const [categorySearch, setCategorySearch] = useState("");

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5;

  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    id: null,
    category_id: "",
    product_code: "",
    product_name: "",
    sizes: [{ size_id: "", price: "", stock_qty: "" }],
    image: null,
    previewImage: null, // preview new or current image
    currentImage: null  // current image for edit
  });

  // ===============================
  // Fetch Products & Categories
  // ===============================
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await getProducts();
      setProducts(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await getCategories();
      setCategories(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // ===============================
  // Modal
  // ===============================
  const handleClose = () => {
    setShow(false);
    setIsEdit(false);
    setFormData({
      id: null,
      category_id: "",
      product_code: "",
      product_name: "",
      sizes: [{ size_id: "", price: "", stock_qty: "" }],
      image: null,
      previewImage: null,
      currentImage: null
    });
  };

  const handleShowAdd = () => {
    setIsEdit(false);
    setShow(true);
  };

  const handleShowEdit = (product) => {
    setIsEdit(true);
    setFormData({
      id: product.product_id,
      category_id: product.category_id?.toString() || "",
      product_code: product.product_code,
      product_name: product.product_name,
      sizes: product.sizes.map((s) => ({
        size_id: s.pivot.size_id,
        price: s.pivot.price,
        stock_qty: s.pivot.stock_qty
      })),
      image: null,
      previewImage: product.image, // show existing image first
      currentImage: product.image
    });
    setShow(true);
  };

  // ===============================
  // Form Change
  // ===============================
  const handleChange = (e) => {
    if (e.target.name === "image") {
      const file = e.target.files[0];
      setFormData({
        ...formData,
        image: file,
        previewImage: file ? URL.createObjectURL(file) : formData.currentImage
      });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSizeChange = (index, e) => {
    const updatedSizes = [...formData.sizes];
    updatedSizes[index][e.target.name] = e.target.value;
    setFormData({ ...formData, sizes: updatedSizes });
  };

  const addSize = () => {
    setFormData({
      ...formData,
      sizes: [...formData.sizes, { size_id: "", price: "", stock_qty: "" }]
    });
  };

  // ===============================
  // Submit
  // ===============================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = new FormData();
      data.append("category_id", formData.category_id || "");
      data.append("product_name", formData.product_name || "");
      data.append("product_code", formData.product_code || "");

      formData.sizes.forEach((size, index) => {
        data.append(`sizes[${index}][size_id]`, size.size_id || "");
        data.append(`sizes[${index}][price]`, size.price || "");
        data.append(`sizes[${index}][stock_qty]`, size.stock_qty || "");
      });

      if (formData.image instanceof File) {
        data.append("image", formData.image);
      }

      // 🔹 debug FormData
      for (let pair of data.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }

      if (isEdit && formData.id) {
        await updateProduct(formData.id, data);
      } else {
        await createProduct(data);
      }

      fetchProducts();
      handleClose();
    } catch (error) {
      console.error(error.response?.data);
    } finally {
      setIsLoading(false);
    }
  };

  // ===============================
  // Delete
  // ===============================
  const handleDelete = async (id) => {
    if (window.confirm("Delete this product?")) {
      setIsLoading(true);
      try {
        await deleteProduct(id);
        fetchProducts();
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // ===============================
  // Filter + Pagination
  // ===============================
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const nameMatch = p.product_name
        ?.toLowerCase()
        .includes(search.toLowerCase());
      const categoryMatch = p.category?.category_name
        ?.toLowerCase()
        .includes(categorySearch.toLowerCase());
      return nameMatch && categoryMatch;
    });
  }, [products, search, categorySearch]);

  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // ===============================
  // Helpers
  // ===============================
  const getTotalStock = (sizes) => {
    return sizes?.reduce((total, s) => total + Number(s.pivot.stock_qty), 0);
  };

  const getPriceRange = (sizes) => {
    if (!sizes?.length) return "-";
    const prices = sizes.map((s) => Number(s.pivot.price));
    return `$${Math.min(...prices)} - $${Math.max(...prices)}`;
  };

  // ===============================
  // Render
  // ===============================
  return (
    <div>
      <Row className="mb-4 align-items-center">
        <Col>
          <h3 className="fw-bold">Product Management</h3>
        </Col>
        <Col md="auto">
          <Button onClick={handleShowAdd} disabled={isLoading}>
            + Add Product
          </Button>
        </Col>
      </Row>

      {/* SEARCH */}
      <Row className="mb-3">
        <Col md={4}>
          <Form.Control
            placeholder="Search product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            disabled={isLoading}
          />
        </Col>
        <Col md={4}>
          <Form.Control
            placeholder="Search category..."
            value={categorySearch}
            onChange={(e) => setCategorySearch(e.target.value)}
            disabled={isLoading}
          />
        </Col>
      </Row>

      <Card className="shadow-sm border-0">
        <Card.Body>
          {isLoading && (
            <div className="text-center my-3">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          )}

          {!isLoading && (
            <>
              <Table hover responsive>
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Code</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Image</th>
                    <th>Price</th>
                    <th>Total Stock</th>
                    <th>Sizes</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody className="align-middle">
                  {currentProducts.map((p, index) => (
                    <tr key={p.product_id}>
                      <td>{indexOfFirst + index + 1}</td>
                      <td>{p.product_code}</td>
                      <td>{p.product_name}</td>
                      <td>{p.category?.category_name}</td>
                      <td>
                        <img
                          src={p.image}
                          alt={p.product_name}
                          className="img-thumbnail"
                          style={{ height: "80px", width: "80px" }}
                        />
                      </td>
                      <td>{getPriceRange(p.sizes)}</td>
                      <td>{getTotalStock(p.sizes)}</td>
                      <td>{p.sizes?.length}</td>
                      <td>
                        <Button
                          size="sm"
                          variant="warning"
                          className="me-2"
                          onClick={() => handleShowEdit(p)}
                          disabled={isLoading}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleDelete(p.product_id)}
                          disabled={isLoading}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <Pagination className="justify-content-center">
                {[...Array(totalPages)].map((_, index) => (
                  <Pagination.Item
                    key={index}
                    active={index + 1 === currentPage}
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </Pagination.Item>
                ))}
              </Pagination>
            </>
          )}
        </Card.Body>
      </Card>

      {/* MODAL */}
      <Modal show={show} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? "Edit Product" : "Add Product"}</Modal.Title>
        </Modal.Header>

        <Form onSubmit={handleSubmit} encType="multipart/form-data">
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Select Category --</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.category_id.toString()}>
                        {c.category_name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Product Code</Form.Label>
                  <Form.Control
                    name="product_code"
                    value={formData.product_code}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                name="product_name"
                value={formData.product_name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <hr />
            <h6>Sizes</h6>

            {formData.sizes.map((size, index) => (
              <Row key={index} className="mb-2">
                <Col>
                  <Form.Control
                    placeholder="Size ID"
                    name="size_id"
                    value={size.size_id}
                    onChange={(e) => handleSizeChange(index, e)}
                    required
                  />
                </Col>
                <Col>
                  <Form.Control
                    placeholder="Price"
                    name="price"
                    value={size.price}
                    onChange={(e) => handleSizeChange(index, e)}
                    required
                  />
                </Col>
                <Col>
                  <Form.Control
                    placeholder="Stock"
                    name="stock_qty"
                    value={size.stock_qty}
                    onChange={(e) => handleSizeChange(index, e)}
                    required
                  />
                </Col>
              </Row>
            ))}

            <Button size="sm" onClick={addSize}>
              + Add Size
            </Button>

            <hr />

            <Form.Group>
              <Form.Label>Product Image</Form.Label>
              <Form.Control
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                disabled={isLoading}
              />
              {formData.previewImage && (
                <img
                  src={formData.previewImage}
                  alt="preview"
                  className="img-thumbnail mt-2"
                  style={{ height: "100px", width: "100px" }}
                />
              )}
            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isEdit ? "Update" : "Save"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default Products;
