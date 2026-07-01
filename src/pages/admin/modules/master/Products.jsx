import { useMemo, useState } from "react";
import { FaEye, FaEdit, FaTrash, FaPlus, FaUpload } from "react-icons/fa";
import Toast from "../../../../components/notifications/Toast";

function Products() {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Royal Oud",
      sku: "SKU-001",
      category: "Men",
      type: "Perfume",
      description: "Rich bold fragrance with luxury notes.",
      costPrice: 500,
      sellingPrice: 999,
      discount: 10,
      tax: 18,
      stock: 25,
      lowStock: 5,
      reorderPoint: 10,
      status: "Active",
      featured: "Yes",
      image: "",
      gallery: [],
      alt: "Royal Oud Perfume",
      dateAdded: "2026-05-01",
      deleted: false,
    },
    {
      id: 2,
      name: "Rose Gold",
      sku: "SKU-002",
      category: "Women",
      type: "Perfume",
      description: "Elegant floral fragrance for special moments.",
      costPrice: 450,
      sellingPrice: 899,
      discount: 5,
      tax: 18,
      stock: 18,
      lowStock: 5,
      reorderPoint: 8,
      status: "Active",
      featured: "No",
      image: "",
      gallery: [],
      alt: "Rose Gold Perfume",
      dateAdded: "2026-05-02",
      deleted: false,
    },
  ]);

  const emptyForm = {
    name: "",
    sku: `SKU-${Date.now().toString().slice(-4)}`,
    category: "",
    type: "Perfume",
    description: "",
    costPrice: "",
    sellingPrice: "",
    discount: 0,
    tax: 18,
    stock: "",
    lowStock: "",
    reorderPoint: "",
    status: "Active",
    featured: "No",
    image: "",
    gallery: [],
    alt: "",
    dateAdded: new Date().toISOString().slice(0, 10),
    deleted: false,
  };

  const [form, setForm] = useState(emptyForm);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalType, setModalType] = useState("");

  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [dateAdded, setDateAdded] = useState("");

  const [page, setPage] = useState(1);
  const perPage = 5;

  const [toast, setToast] = useState({
    message: "",
    type: "success",
  });

  const showToast = (message, type = "success") => {
    setToast({
      message,
      type,
    });
  };

  const finalPrice =
    Number(form.sellingPrice || 0) -
    (Number(form.sellingPrice || 0) * Number(form.discount || 0)) / 100 +
    (Number(form.sellingPrice || 0) * Number(form.tax || 0)) / 100;

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => !p.deleted)
      .filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.sku.toLowerCase().includes(search.toLowerCase()) ||
          p.category.toLowerCase().includes(search.toLowerCase())
      )
      .filter((p) => filterCategory === "All" || p.category === filterCategory)
      .filter((p) => filterStatus === "All" || p.status === filterStatus)
      .filter((p) => !minPrice || Number(p.sellingPrice) >= Number(minPrice))
      .filter((p) => !maxPrice || Number(p.sellingPrice) <= Number(maxPrice))
      .filter((p) => !dateAdded || p.dateAdded === dateAdded);
  }, [products, search, filterCategory, filterStatus, minPrice, maxPrice, dateAdded]);

  const totalPages = Math.ceil(filteredProducts.length / perPage) || 1;

  const paginatedProducts = filteredProducts.slice(
    (page - 1) * perPage,
    page * perPage
  );

  const openAddModal = () => {
    setForm({
      ...emptyForm,
      sku: `SKU-${Date.now().toString().slice(-4)}`,
    });
    setSelectedProduct(null);
    setModalType("form");
  };

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setForm(product);
    setModalType("form");
  };

  const openViewModal = (product) => {
    setSelectedProduct(product);
    setModalType("view");
  };

  const closeModal = () => {
    setModalType("");
    setSelectedProduct(null);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image" && files[0]) {
      setForm({ ...form, image: URL.createObjectURL(files[0]) });
      showToast("Product image selected successfully!", "info");
      return;
    }

    if (name === "gallery" && files.length > 0) {
      const galleryImages = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );

      setForm({ ...form, gallery: galleryImages });
      showToast("Product gallery images selected successfully!", "info");
      return;
    }

    setForm({ ...form, [name]: value });
  };

  const saveProduct = (e) => {
    e.preventDefault();

    if (selectedProduct) {
      setProducts(
        products.map((product) =>
          product.id === selectedProduct.id
            ? { ...form, id: selectedProduct.id }
            : product
        )
      );

      showToast("Product updated successfully!", "success");
    } else {
      setProducts([
        ...products,
        {
          ...form,
          id: Date.now(),
        },
      ]);

      showToast("Product added successfully!", "success");
    }

    closeModal();
  };

  const softDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (confirmDelete) {
      setProducts(
        products.map((product) =>
          product.id === id ? { ...product, deleted: true } : product
        )
      );

      showToast("Product deleted successfully!", "success");
    }
  };

  const toggleStatus = (id) => {
    setProducts(
      products.map((product) =>
        product.id === id
          ? {
              ...product,
              status: product.status === "Active" ? "Inactive" : "Active",
            }
          : product
      )
    );

    showToast("Product status updated successfully!", "info");
  };

  const handleCSVUpload = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    showToast(`CSV file selected: ${file.name}`, "info");
  };

  const clearFilters = () => {
    setSearch("");
    setFilterCategory("All");
    setFilterStatus("All");
    setMinPrice("");
    setMaxPrice("");
    setDateAdded("");
    setPage(1);

    showToast("Product filters cleared!", "info");
  };

  return (
    <>
      <div className="product-management">
        <div className="product-page-header">
          <div>
            <h2>Products Management</h2>
            <p>Manage product listing, pricing, stock, media and status.</p>
          </div>

          <div className="product-header-actions">
            <label className="csv-upload-btn">
              <FaUpload /> Bulk CSV
              <input type="file" accept=".csv" hidden onChange={handleCSVUpload} />
            </label>

            <button className="btn-primary" onClick={openAddModal}>
              <FaPlus /> Add Product
            </button>
          </div>
        </div>

        <div className="product-filters">
          <input
            type="text"
            placeholder="Search by name, SKU, category..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />

          <select
            value={filterCategory}
            onChange={(e) => {
              setFilterCategory(e.target.value);
              setPage(1);
            }}
          >
            <option>All</option>
            <option>Men</option>
            <option>Women</option>
            <option>Unisex</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setPage(1);
            }}
          >
            <option>All</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>

          <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />

          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />

          <input
            type="date"
            value={dateAdded}
            onChange={(e) => setDateAdded(e.target.value)}
          />

          <button className="btn-secondary" onClick={clearFilters}>
            Clear
          </button>
        </div>

        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>SKU</th>
                <th>Name</th>
                <th>Category</th>
                <th>Type</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan="10" style={{ textAlign: "center" }}>
                    No products found
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((product) => (
                  <tr key={product.id}>
                    <td>
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.alt}
                          className="product-thumb"
                        />
                      ) : (
                        <div className="product-no-img">No Image</div>
                      )}
                    </td>

                    <td>{product.sku}</td>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>{product.type}</td>
                    <td>₹{product.sellingPrice}</td>
                    <td>{product.stock}</td>

                    <td>
                      <button
                        className={`status-toggle ${product.status.toLowerCase()}`}
                        onClick={() => toggleStatus(product.id)}
                      >
                        {product.status}
                      </button>
                    </td>

                    <td>{product.featured}</td>

                    <td>
                      <button
                        className="icon-btn view"
                        onClick={() => openViewModal(product)}
                      >
                        <FaEye />
                      </button>

                      <button
                        className="icon-btn edit"
                        onClick={() => openEditModal(product)}
                      >
                        <FaEdit />
                      </button>

                      <button
                        className="icon-btn delete"
                        onClick={() => softDelete(product.id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>
            Previous
          </button>

          <span>
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      </div>

      {modalType === "form" && (
        <div className="modal-overlay">
          <div className="admin-modal product-modal-large">
            <h3>{selectedProduct ? "Edit Product" : "Add Product"}</h3>

            <form className="admin-form product-form" onSubmit={saveProduct}>
              <h4>Product Information</h4>

              <div className="product-form-grid">
                <input
                  type="text"
                  name="name"
                  placeholder="Product Name *"
                  value={form.name}
                  onChange={handleChange}
                  required
                />

                <input
                  type="text"
                  name="sku"
                  placeholder="SKU *"
                  value={form.sku}
                  onChange={handleChange}
                  required
                />

                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Category *</option>
                  <option>Men</option>
                  <option>Women</option>
                  <option>Unisex</option>
                </select>

                <select name="type" value={form.type} onChange={handleChange}>
                  <option>Perfume</option>
                  <option>Attar</option>
                  <option>Oil</option>
                </select>
              </div>

              <textarea
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleChange}
              ></textarea>

              <h4>Pricing</h4>

              <div className="product-form-grid">
                <input
                  type="number"
                  name="costPrice"
                  placeholder="Cost Price *"
                  value={form.costPrice}
                  onChange={handleChange}
                  required
                />

                <input
                  type="number"
                  name="sellingPrice"
                  placeholder="Selling Price *"
                  value={form.sellingPrice}
                  onChange={handleChange}
                  required
                />

                <input
                  type="number"
                  name="discount"
                  placeholder="Discount %"
                  value={form.discount}
                  onChange={handleChange}
                />

                <input
                  type="number"
                  name="tax"
                  placeholder="Tax %"
                  value={form.tax}
                  onChange={handleChange}
                />

                <input value={`Final Price ₹${Math.round(finalPrice)}`} readOnly />
              </div>

              <h4>Inventory</h4>

              <div className="product-form-grid">
                <input
                  type="number"
                  name="stock"
                  placeholder="Stock Quantity *"
                  value={form.stock}
                  onChange={handleChange}
                  required
                />

                <input
                  type="number"
                  name="lowStock"
                  placeholder="Low Stock Alert Level"
                  value={form.lowStock}
                  onChange={handleChange}
                />

                <input
                  type="number"
                  name="reorderPoint"
                  placeholder="Reorder Point"
                  value={form.reorderPoint}
                  onChange={handleChange}
                />
              </div>

              <h4>Media</h4>

              <div className="product-form-grid">
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                />

                <input
                  type="text"
                  name="alt"
                  placeholder="Image Alt Text"
                  value={form.alt}
                  onChange={handleChange}
                />
              </div>

              <h4>Status</h4>

              <div className="product-form-grid">
                <select name="status" value={form.status} onChange={handleChange}>
                  <option>Active</option>
                  <option>Inactive</option>
                </select>

                <select
                  name="featured"
                  value={form.featured}
                  onChange={handleChange}
                >
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={closeModal}>
                  Cancel
                </button>

                <button type="submit" className="btn-primary">
                  {selectedProduct ? "Update Product" : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalType === "view" && selectedProduct && (
        <div className="modal-overlay">
          <div className="admin-modal product-modal-large">
            <h3>Product Details</h3>

            <div className="product-view">
              {selectedProduct.image ? (
                <img src={selectedProduct.image} alt={selectedProduct.alt} />
              ) : (
                <div className="product-view-no-img">No Image</div>
              )}

              <div>
                <p><strong>Name:</strong> {selectedProduct.name}</p>
                <p><strong>SKU:</strong> {selectedProduct.sku}</p>
                <p><strong>Category:</strong> {selectedProduct.category}</p>
                <p><strong>Type:</strong> {selectedProduct.type}</p>
                <p><strong>Description:</strong> {selectedProduct.description}</p>
                <p><strong>Cost Price:</strong> ₹{selectedProduct.costPrice}</p>
                <p><strong>Selling Price:</strong> ₹{selectedProduct.sellingPrice}</p>
                <p><strong>Discount:</strong> {selectedProduct.discount}%</p>
                <p><strong>Tax:</strong> {selectedProduct.tax}%</p>
                <p><strong>Stock:</strong> {selectedProduct.stock}</p>
                <p><strong>Low Stock:</strong> {selectedProduct.lowStock}</p>
                <p><strong>Reorder Point:</strong> {selectedProduct.reorderPoint}</p>
                <p><strong>Status:</strong> {selectedProduct.status}</p>
                <p><strong>Featured:</strong> {selectedProduct.featured}</p>
                <p><strong>Date Added:</strong> {selectedProduct.dateAdded}</p>
              </div>
            </div>

            {selectedProduct.gallery?.length > 0 && (
              <div className="gallery-preview">
                {selectedProduct.gallery.map((img, index) => (
                  <img src={img} key={index} alt="Gallery" />
                ))}
              </div>
            )}

            <div className="modal-actions">
              <button className="btn-secondary" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "success" })}
      />
    </>
  );
}

export default Products;