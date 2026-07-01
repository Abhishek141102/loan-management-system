import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../../../context/AuthContext";

const API = "http://localhost:5000/api";
const ROLES = ["superadmin", "admin", "manager", "qa"];

// Role ke liye module permissions define (SQL se match karta hai)
const ROLE_PERMISSIONS = {
  superadmin: {
    dashboard: { view: true, create: true, edit: true, delete: true },
    enquiries: { view: true, create: true, edit: true, delete: true },
    applications: { view: true, create: true, edit: true, delete: true },
    documents: { view: true, create: true, edit: true, delete: true },
    approval: { view: true, create: true, edit: true, delete: true },
    customers: { view: true, create: true, edit: true, delete: true },
    reports: { view: true, create: true, edit: true, delete: true },
    settings: { view: true, create: true, edit: true, delete: true },
    user_management: { view: true, create: true, edit: true, delete: true },
  },
  admin: {
    dashboard: { view: true, create: true, edit: true, delete: false },
    enquiries: { view: true, create: true, edit: true, delete: true },
    applications: { view: true, create: true, edit: true, delete: true },
    documents: { view: true, create: true, edit: true, delete: true },
    approval: { view: true, create: true, edit: true, delete: false },
    customers: { view: true, create: true, edit: true, delete: false },
    reports: { view: true, create: false, edit: false, delete: false },
    settings: { view: true, create: true, edit: true, delete: false },
    user_management: { view: false, create: false, edit: false, delete: false },
  },
  manager: {
    dashboard: { view: true, create: false, edit: false, delete: false },
    enquiries: { view: true, create: true, edit: true, delete: false },
    applications: { view: true, create: true, edit: true, delete: false },
    documents: { view: true, create: true, edit: false, delete: false },
    approval: { view: true, create: false, edit: false, delete: false },
    customers: { view: true, create: true, edit: true, delete: false },
    reports: { view: true, create: false, edit: false, delete: false },
    settings: { view: false, create: false, edit: false, delete: false },
    user_management: { view: false, create: false, edit: false, delete: false },
  },
  qa: {
    dashboard: { view: true, create: false, edit: false, delete: false },
    enquiries: { view: false, create: false, edit: false, delete: false },
    applications: { view: false, create: false, edit: false, delete: false },
    documents: { view: true, create: false, edit: false, delete: false },
    approval: { view: false, create: false, edit: false, delete: false },
    customers: { view: false, create: false, edit: false, delete: false },
    reports: { view: true, create: false, edit: false, delete: false },
    settings: { view: false, create: false, edit: false, delete: false },
    user_management: { view: false, create: false, edit: false, delete: false },
  },
};

const MODULE_LABELS = {
  dashboard: "Dashboard",
  enquiries: "Loan Enquiries",
  applications: "Applications",
  documents: "Documents",
  approval: "Loan Approval",
  customers: "Customers",
  reports: "Reports",
  settings: "Settings",
  user_management: "User Management",
};

const ROLE_COLORS = {
  superadmin: { bg: "#7c3aed", light: "#f5f3ff", border: "#ddd6fe" },
  admin:      { bg: "#2563eb", light: "#eff6ff", border: "#bfdbfe" },
  manager:    { bg: "#059669", light: "#ecfdf5", border: "#a7f3d0" },
  qa:         { bg: "#d97706", light: "#fffbeb", border: "#fde68a" },
};

export default function UserManagement() {
  const { token, user: currentUser, fetchPermissions } = useAuth();
  const headers = { Authorization: `Bearer ${token}` };

  const [users, setUsers]               = useState([]);
  const [loading, setLoading]           = useState(true);
  const [showModal, setShowModal]       = useState(false);
  const [showPermModal, setShowPermModal] = useState(false);
  const [permViewRole, setPermViewRole] = useState(null);
  const [editUser, setEditUser]         = useState(null);
  const [form, setForm]                 = useState({ name: "", email: "", password: "", role: "admin", status: "Active" });
  const [msg, setMsg]                   = useState({ text: "", type: "" });
  const [previewRole, setPreviewRole]   = useState("admin");

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    try {
      const res = await axios.get(`${API}/users`, { headers });
      setUsers(res.data);
    } catch (e) {
      setMsg({ text: "Users load karne mein error.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setEditUser(null);
    setForm({ name: "", email: "", password: "", role: "admin", status: "Active" });
    setPreviewRole("admin");
    setShowModal(true);
  };

  const openEdit = (u) => {
    setEditUser(u);
    setForm({ name: u.name, email: u.email, password: "", role: u.role, status: u.status });
    setPreviewRole(u.role);
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (editUser) {
        await axios.put(`${API}/users/${editUser.id}`, form, { headers });
        // Agar current logged-in user ka role change hua, toh permissions refresh karo
        if (editUser.id === currentUser?.id || editUser.email === currentUser?.email) {
          await fetchPermissions(token);
          setMsg({ text: "✅ Aapka role update ho gaya! Permissions refresh ho gayi.", type: "success" });
        } else {
          setMsg({ text: `✅ "${editUser.name}" ka role '${form.role}' ho gaya! Unhe re-login karna hoga nayi permissions ke liye.`, type: "success" });
        }
      } else {
        await axios.post(`${API}/users`, form, { headers });
        setMsg({ text: `✅ User create ho gaya! Role: ${form.role}`, type: "success" });
      }
      setShowModal(false);
      loadUsers();
    } catch (e) {
      setMsg({ text: e.response?.data?.message || "Error aaya.", type: "error" });
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`"${name}" ko delete karein?`)) return;
    try {
      await axios.delete(`${API}/users/${id}`, { headers });
      setMsg({ text: "User delete ho gaya.", type: "success" });
      loadUsers();
    } catch (e) {
      setMsg({ text: e.response?.data?.message || "Delete failed.", type: "error" });
    }
  };

  const openPermView = (role) => {
    setPermViewRole(role);
    setShowPermModal(true);
  };

  const roleBadge = (role, onClick) => {
    const c = ROLE_COLORS[role] || { bg: "#888", light: "#f9f9f9", border: "#ddd" };
    return (
      <span
        onClick={onClick}
        title={onClick ? "Click to see permissions" : ""}
        style={{
          background: c.bg, color: "#fff",
          padding: "3px 10px", borderRadius: "12px",
          fontSize: "12px", fontWeight: "600",
          textTransform: "capitalize",
          cursor: onClick ? "pointer" : "default",
          display: "inline-flex", alignItems: "center", gap: "4px"
        }}
      >
        {role} {onClick && <span style={{ fontSize: "10px", opacity: 0.8 }}>🔍</span>}
      </span>
    );
  };

  // Accessible modules for a role
  const getAccessibleModules = (role) => {
    const perms = ROLE_PERMISSIONS[role] || {};
    return Object.entries(perms)
      .filter(([, p]) => p.view)
      .map(([mod, p]) => ({ mod, ...p }));
  };

  return (
    <div style={{ padding: "24px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "22px", fontWeight: "700" }}>👥 User Management</h1>
          <p style={{ margin: "4px 0 0", color: "#666", fontSize: "14px" }}>
            Manage system users — assign roles • Click on role badge to view permissions
          </p>
        </div>
        <button onClick={openAdd} style={{ background: "#2563eb", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "8px", cursor: "pointer", fontWeight: "600" }}>
          + New User
        </button>
      </div>

      {/* Role Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "12px", marginBottom: "24px" }}>
        {ROLES.map(role => {
          const c = ROLE_COLORS[role];
          const accessible = getAccessibleModules(role);
          return (
            <div key={role} onClick={() => openPermView(role)}
              style={{ background: c.light, border: `1px solid ${c.border}`, borderRadius: "10px", padding: "14px", cursor: "pointer", transition: "transform .15s" }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={e => e.currentTarget.style.transform = ""}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <span style={{ background: c.bg, color: "#fff", padding: "2px 8px", borderRadius: "8px", fontSize: "11px", fontWeight: "700", textTransform: "uppercase" }}>{role}</span>
                <span style={{ fontSize: "18px" }}>
                  {role === "superadmin" ? "👑" : role === "admin" ? "🛡️" : role === "manager" ? "📋" : "🔍"}
                </span>
              </div>
              <div style={{ fontSize: "12px", color: "#555", marginTop: "6px" }}>
                {accessible.length} modules access
              </div>
              <div style={{ fontSize: "11px", color: c.bg, fontWeight: "600", marginTop: "2px" }}>
                Click to view →
              </div>
            </div>
          );
        })}
      </div>

      {/* Alert message */}
      {msg.text && (
        <div style={{
          padding: "12px 16px", borderRadius: "8px", marginBottom: "16px",
          background: msg.type === "success" ? "#d1fae5" : "#fee2e2",
          color: msg.type === "success" ? "#065f46" : "#991b1b",
          fontSize: "14px", display: "flex", justifyContent: "space-between", alignItems: "center"
        }}>
          <span>{msg.text}</span>
          <button onClick={() => setMsg({ text: "", type: "" })} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "16px", opacity: 0.6 }}>✕</button>
        </div>
      )}

      {/* Users Table */}
      {loading ? <p>Loading users...</p> : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {["#", "Name", "Email", "Role & Access", "Status", "Created", "Actions"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontWeight: "600", color: "#374151", borderBottom: "2px solid #e5e7eb" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => {
                const accessible = getAccessibleModules(u.role);
                const isSelf = u.email === currentUser?.email;
                return (
                  <tr key={u.id} style={{ borderBottom: "1px solid #f3f4f6", background: isSelf ? "#fffbeb" : "white" }}>
                    <td style={{ padding: "12px 16px", color: "#9ca3af" }}>{i + 1}</td>
                    <td style={{ padding: "12px 16px", fontWeight: "500" }}>
                      {u.name}
                      {isSelf && <span style={{ marginLeft: "6px", fontSize: "10px", background: "#fef3c7", color: "#92400e", padding: "1px 6px", borderRadius: "8px", fontWeight: "600" }}>YOU</span>}
                    </td>
                    <td style={{ padding: "12px 16px", color: "#6b7280" }}>{u.email}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        {roleBadge(u.role, () => openPermView(u.role))}
                        <div style={{ fontSize: "11px", color: "#6b7280" }}>
                          {accessible.slice(0, 3).map(m => MODULE_LABELS[m.mod]).join(", ")}
                          {accessible.length > 3 && ` +${accessible.length - 3} more`}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ color: u.status === "Active" ? "#059669" : "#dc2626", fontWeight: "500" }}>{u.status}</span>
                    </td>
                    <td style={{ padding: "12px 16px", color: "#9ca3af", fontSize: "12px" }}>{new Date(u.created_at).toLocaleDateString("en-IN")}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <button onClick={() => openEdit(u)} style={{ background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe", padding: "5px 12px", borderRadius: "6px", cursor: "pointer", marginRight: "8px", fontSize: "13px" }}>Edit</button>
                      <button onClick={() => handleDelete(u.id, u.name)} style={{ background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca", padding: "5px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "13px" }}>Delete</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ===== PERMISSIONS VIEW MODAL ===== */}
      {showPermModal && permViewRole && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "#fff", borderRadius: "14px", padding: "28px", width: "640px", maxWidth: "95vw", maxHeight: "85vh", overflow: "auto", boxShadow: "0 24px 80px rgba(0,0,0,0.25)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div>
                <h2 style={{ margin: 0, fontSize: "18px" }}>
                  {permViewRole === "superadmin" ? "👑" : permViewRole === "admin" ? "🛡️" : permViewRole === "manager" ? "📋" : "🔍"} {permViewRole.charAt(0).toUpperCase() + permViewRole.slice(1)} Permissions
                </h2>
                <p style={{ margin: "4px 0 0", color: "#666", fontSize: "13px" }}>This role has access to these modules</p>
              </div>
              <button onClick={() => setShowPermModal(false)} style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#888" }}>✕</button>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                <thead>
                  <tr style={{ background: "#f8fafc" }}>
                    <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: "600", color: "#374151", borderBottom: "2px solid #e5e7eb" }}>Module</th>
                    {["View", "Create", "Edit", "Delete"].map(a => (
                      <th key={a} style={{ padding: "10px 14px", textAlign: "center", fontWeight: "600", color: "#374151", borderBottom: "2px solid #e5e7eb" }}>{a}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(ROLE_PERMISSIONS[permViewRole] || {}).map(([mod, p]) => (
                    <tr key={mod} style={{ borderBottom: "1px solid #f3f4f6", background: p.view ? "white" : "#fafafa", opacity: p.view ? 1 : 0.5 }}>
                      <td style={{ padding: "10px 14px", fontWeight: p.view ? "500" : "400", color: p.view ? "#1f2937" : "#9ca3af" }}>
                        {MODULE_LABELS[mod]}
                      </td>
                      {[p.view, p.create, p.edit, p.delete].map((val, idx) => (
                        <td key={idx} style={{ padding: "10px 14px", textAlign: "center" }}>
                          {val
                            ? <span style={{ color: "#059669", fontSize: "16px" }}>✅</span>
                            : <span style={{ color: "#d1d5db", fontSize: "16px" }}>—</span>
                          }
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: "16px", padding: "10px 14px", background: "#f0fdf4", borderRadius: "8px", fontSize: "12px", color: "#065f46" }}>
              💡 To change these permissions, update in <strong>Role Management</strong> or the <strong>backend role_permissions table.</strong>
            </div>
          </div>
        </div>
      )}

      {/* ===== ADD / EDIT USER MODAL ===== */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }}>
          <div style={{ background: "#fff", borderRadius: "12px", padding: "28px", width: "520px", maxWidth: "95vw", maxHeight: "90vh", overflow: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            <h2 style={{ margin: "0 0 20px", fontSize: "18px" }}>{editUser ? "✏️ Edit User" : "➕ New User"}</h2>

            {/* Name, Email, Password fields */}
            {[
              { label: "Full Name", key: "name", type: "text" },
              { label: "Email", key: "email", type: "email" },
              { label: editUser ? "New Password" : "Password", key: "password", type: "password" }
            ].map(({ label, key, type }) => (
              <div key={key} style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>{label}</label>
                <input type={type} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  style={{ width: "100%", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "14px", boxSizing: "border-box" }} />
              </div>
            ))}

            {/* Role selector */}
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>Role</label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px", marginBottom: "12px" }}>
                {ROLES.map(r => {
                  const c = ROLE_COLORS[r];
                  const selected = form.role === r;
                  return (
                    <div key={r} onClick={() => { setForm({ ...form, role: r }); setPreviewRole(r); }}
                      style={{
                        border: `2px solid ${selected ? c.bg : c.border}`,
                        background: selected ? c.light : "#fff",
                        borderRadius: "8px", padding: "10px 12px",
                        cursor: "pointer", display: "flex", alignItems: "center", gap: "8px",
                        transition: "all .15s"
                      }}>
                      <span style={{ fontSize: "16px" }}>
                        {r === "superadmin" ? "👑" : r === "admin" ? "🛡️" : r === "manager" ? "📋" : "🔍"}
                      </span>
                      <div>
                        <div style={{ fontWeight: "600", fontSize: "13px", color: selected ? c.bg : "#374151", textTransform: "capitalize" }}>{r}</div>
                        <div style={{ fontSize: "11px", color: "#6b7280" }}>{getAccessibleModules(r).length} modules</div>
                      </div>
                      {selected && <span style={{ marginLeft: "auto", color: c.bg, fontSize: "14px" }}>✓</span>}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Permission preview for selected role */}
            {previewRole && (
              <div style={{ marginBottom: "16px", background: "#f8fafc", borderRadius: "10px", padding: "14px", border: "1px solid #e5e7eb" }}>
                <div style={{ fontSize: "12px", fontWeight: "600", color: "#374151", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  📋 {previewRole} — Accessible Modules
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {Object.entries(ROLE_PERMISSIONS[previewRole] || {}).map(([mod, p]) => (
                    <div key={mod} style={{
                      padding: "4px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "500",
                      background: p.view ? "#dcfce7" : "#f3f4f6",
                      color: p.view ? "#166534" : "#9ca3af",
                      display: "flex", alignItems: "center", gap: "4px"
                    }}>
                      {p.view ? "✅" : "🚫"} {MODULE_LABELS[mod]}
                      {p.view && (
                        <span style={{ opacity: 0.7 }}>
                          {[p.create && "C", p.edit && "E", p.delete && "D"].filter(Boolean).join("")}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                {editUser && form.role !== editUser.role && (
                  <div style={{ marginTop: "10px", padding: "8px 10px", background: "#fef3c7", borderRadius: "6px", fontSize: "11px", color: "#92400e" }}>
                    ⚠️ Role change hone ke baad user ko <strong>re-login</strong> karna hoga nayi permissions activate hone ke liye.
                  </div>
                )}
              </div>
            )}

            {/* Status (edit only) */}
            {editUser && (
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                  style={{ width: "100%", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "14px", boxSizing: "border-box" }}>
                  <option>Active</option><option>Inactive</option>
                </select>
              </div>
            )}

            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
              <button onClick={() => setShowModal(false)} style={{ padding: "10px 20px", border: "1px solid #d1d5db", borderRadius: "8px", cursor: "pointer", background: "#fff" }}>Cancel</button>
              <button onClick={handleSave} style={{ padding: "10px 20px", background: "#2563eb", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600" }}>
                {editUser ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
