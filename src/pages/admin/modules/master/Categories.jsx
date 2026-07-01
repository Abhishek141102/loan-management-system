import { useState } from "react";
import { FaEdit, FaTrash, FaPlus, FaImage } from "react-icons/fa";
import Toast from "../../../../components/notifications/Toast";

function Categories() {
  const [categories, setCategories] = useState([
    {
      id: 1,
      name: "Men's Perfumes",
      status: "Active",
      image: "",
      children: ["Oud Collection", "Fresh Scents", "Signature Blend"],
    },
    {
      id: 2,
      name: "Women's Perfumes",
      status: "Active",
      image: "",
      children: ["Floral Collection", "Oriental Scents"],
    },
    {
      id: 3,
      name: "Unisex",
      status: "Active",
      image: "",
      children: [],
    },
    {
      id: 4,
      name: "Attars & Oils",
      status: "Inactive",
      image: "",
      children: [],
    },
  ]);

  const [form, setForm] = useState({
    name: "",
    subcategory: "",
    status: "Active",
    image: "",
  });

  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

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

  const openAdd = () => {
    setEditId(null);
    setForm({
      name: "",
      subcategory: "",
      status: "Active",
      image: "",
    });
    setShowForm(true);
  };

  const openEdit = (cat) => {
    setEditId(cat.id);
    setForm({
      name: cat.name,
      subcategory: cat.children.join(", "),
      status: cat.status,
      image: cat.image,
    });
    setShowForm(true);
  };

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (file) {
      setForm({
        ...form,
        image: URL.createObjectURL(file),
      });

      showToast("Category image selected successfully!", "info");
    }
  };

  const saveCategory = (e) => {
    e.preventDefault();

    const subcategories = form.subcategory
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    if (editId) {
      setCategories(
        categories.map((cat) =>
          cat.id === editId
            ? {
                ...cat,
                name: form.name,
                status: form.status,
                image: form.image,
                children: subcategories,
              }
            : cat
        )
      );

      showToast("Category updated successfully!", "success");
    } else {
      setCategories([
        ...categories,
        {
          id: Date.now(),
          name: form.name,
          status: form.status,
          image: form.image,
          children: subcategories,
        },
      ]);

      showToast("Category added successfully!", "success");
    }

    setShowForm(false);
  };

  const deleteCategory = (id) => {
    if (window.confirm("Delete this category?")) {
      setCategories(categories.filter((cat) => cat.id !== id));

      showToast("Category deleted successfully!", "success");
    }
  };

  const toggleStatus = (id) => {
    setCategories(
      categories.map((cat) =>
        cat.id === id
          ? {
              ...cat,
              status: cat.status === "Active" ? "Inactive" : "Active",
            }
          : cat
      )
    );

    showToast("Category status updated successfully!", "info");
  };

  return (
    <div className="master-page">
      <div className="section-header">
        <div>
          <h1>Categories Management</h1>
          <p>Manage categories, subcategories, image/icon and status.</p>
        </div>

        <button className="btn-primary" onClick={openAdd}>
          <FaPlus /> Add Category
        </button>
      </div>

      <div className="category-tree">
        {categories.map((cat) => (
          <div className="category-card" key={cat.id}>
            <div className="category-main">
              <div className="category-left">
                {cat.image ? (
                  <img src={cat.image} alt={cat.name} />
                ) : (
                  <div className="category-placeholder">
                    <FaImage />
                  </div>
                )}

                <div>
                  <h3>{cat.name}</h3>

                  <button
                    className={`status-toggle ${cat.status.toLowerCase()}`}
                    onClick={() => toggleStatus(cat.id)}
                  >
                    {cat.status}
                  </button>
                </div>
              </div>

              <div className="category-actions">
                <button className="icon-btn edit" onClick={() => openEdit(cat)}>
                  <FaEdit />
                </button>

                <button
                  className="icon-btn delete"
                  onClick={() => deleteCategory(cat.id)}
                >
                  <FaTrash />
                </button>
              </div>
            </div>

            {cat.children.length > 0 && (
              <ul className="subcategory-list">
                {cat.children.map((sub, index) => (
                  <li key={index}>├─ {sub}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="admin-modal product-modal-large">
            <h3>{editId ? "Edit Category" : "Add Category"}</h3>

            <form className="admin-form product-form" onSubmit={saveCategory}>
              <div className="product-form-grid">
                <input
                  type="text"
                  placeholder="Category Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />

                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>

              <textarea
                placeholder="Subcategories separated by comma e.g. Oud Collection, Fresh Scents"
                value={form.subcategory}
                onChange={(e) =>
                  setForm({ ...form, subcategory: e.target.value })
                }
              ></textarea>

              <label className="file-label">Category Image / Icon</label>
              <input type="file" accept="image/*" onChange={handleImage} />

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>

                <button type="submit" className="btn-primary">
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "success" })}
      />
    </div>
  );
}

export default Categories;