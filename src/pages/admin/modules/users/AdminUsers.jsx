import { useState } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaKey,
  FaEnvelope,
} from "react-icons/fa";

function AdminUsers() {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Samadhan Patil",
      email: "samadhan@irasaperfumes.in",
      role: "Super Admin",
      status: "Active",
      phone: "9876543210",
      logs: [
        "Logged in at 10:30 AM",
        "Updated product Royal Oud",
        "Exported sales report",
      ],
    },
    {
      id: 2,
      name: "Rahul Sharma",
      email: "rahul@irasaperfumes.in",
      role: "Sales Manager",
      status: "Active",
      phone: "9876543211",
      logs: ["Viewed orders", "Updated lead status"],
    },
    {
      id: 3,
      name: "Priya Deshmukh",
      email: "priya@irasaperfumes.in",
      role: "Support Staff",
      status: "Inactive",
      phone: "9876543212",
      logs: ["Viewed enquiry list"],
    },
  ]);

  const emptyForm = {
    name: "",
    email: "",
    phone: "",
    role: "Admin",
    status: "Active",
  };

  const [form, setForm] = useState(emptyForm);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalType, setModalType] = useState("");
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  };

  const openAdd = () => {
    setForm(emptyForm);
    setSelectedUser(null);
    setModalType("form");
  };

  const openEdit = (user) => {
    setSelectedUser(user);
    setForm({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
    });
    setModalType("form");
  };

  const openLogs = (user) => {
    setSelectedUser(user);
    setModalType("logs");
  };

  const closeModal = () => {
    setModalType("");
    setSelectedUser(null);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const saveUser = (e) => {
    e.preventDefault();

    if (selectedUser) {
      setUsers(
        users.map((user) =>
          user.id === selectedUser.id ? { ...user, ...form } : user
        )
      );
      showToast("Admin user updated successfully!");
    } else {
      setUsers([
        ...users,
        {
          id: Date.now(),
          ...form,
          logs: ["Invite email sent"],
        },
      ]);
      showToast("New admin user added and invite email sent!");
    }

    closeModal();
  };

  const toggleStatus = (id) => {
    setUsers(
      users.map((user) =>
        user.id === id
          ? {
              ...user,
              status: user.status === "Active" ? "Inactive" : "Active",
            }
          : user
      )
    );

    showToast("User status updated!");
  };

  const resetPassword = (user) => {
    const confirmReset = window.confirm(
      `Send password reset email to ${user.email}?`
    );

    if (confirmReset) {
      showToast("Password reset email sent!");
    }
  };

  const deleteUser = (id) => {
    const confirmDelete = window.confirm("Delete this admin user?");

    if (confirmDelete) {
      setUsers(users.filter((user) => user.id !== id));
      showToast("Admin user deleted!");
    }
  };

  return (
    <div className="users-page">
      <div className="users-header">
        <div>
          <h1>Admin Users</h1>
          <p>Manage admin users, roles, status and activity logs.</p>
        </div>

        <button className="btn-primary" onClick={openAdd}>
          <FaPlus /> Add Admin User
        </button>
      </div>

      <div className="table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.role}</td>
                <td>
                  <button
                    className={`status-toggle ${user.status.toLowerCase()}`}
                    onClick={() => toggleStatus(user.id)}
                  >
                    {user.status}
                  </button>
                </td>
                <td>
                  <button
                    className="icon-btn view"
                    onClick={() => openLogs(user)}
                    title="View Logs"
                  >
                    <FaEye />
                  </button>

                  <button
                    className="icon-btn edit"
                    onClick={() => openEdit(user)}
                    title="Edit"
                  >
                    <FaEdit />
                  </button>

                  <button
                    className="icon-btn view"
                    onClick={() => resetPassword(user)}
                    title="Reset Password"
                  >
                    <FaKey />
                  </button>

                  <button
                    className="icon-btn delete"
                    onClick={() => deleteUser(user.id)}
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalType === "form" && (
        <div className="modal-overlay">
          <div className="admin-modal users-modal">
            <h3>{selectedUser ? "Edit Admin User" : "Add Admin User"}</h3>

            <form className="admin-form users-form" onSubmit={saveUser}>
              <div className="users-form-grid">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />

                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={handleChange}
                  required
                />

                <input
                  type="text"
                  name="phone"
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={handleChange}
                  required
                />

                <select name="role" value={form.role} onChange={handleChange}>
                  <option>Super Admin</option>
                  <option>Admin</option>
                  <option>Sales Manager</option>
                  <option>Support Staff</option>
                  <option>Viewer</option>
                </select>

                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>

              <div className="invite-info">
                <FaEnvelope />
                <p>
                  New admin user ko invite email send hoga. Password setup link
                  email me jayega.
                </p>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button type="submit" className="btn-primary">
                  {selectedUser ? "Update User" : "Add & Send Invite"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalType === "logs" && selectedUser && (
        <div className="modal-overlay">
          <div className="admin-modal users-modal">
            <h3>{selectedUser.name} Activity Logs</h3>

            <div className="activity-log-list">
              {selectedUser.logs.map((log, index) => (
                <div className="activity-log-item" key={index}>
                  {log}
                </div>
              ))}
            </div>

            <div className="modal-actions">
              <button className="btn-secondary" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="settings-toast">{toast}</div>}
    </div>
  );
}

export default AdminUsers;