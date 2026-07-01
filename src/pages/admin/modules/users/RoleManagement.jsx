import { useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaUsers } from "react-icons/fa";

function RoleManagement() {
  const [roles, setRoles] = useState([
    {
      id: 1,
      name: "Super Admin",
      description: "All permissions — full system access",
      users: 1,
      type: "Predefined",
    },
    {
      id: 2,
      name: "Admin",
      description: "Full access except user management",
      users: 2,
      type: "Predefined",
    },
    {
      id: 3,
      name: "Sales Manager",
      description: "Enquiries, orders, reports",
      users: 3,
      type: "Predefined",
    },
    {
      id: 4,
      name: "Support Staff",
      description: "Limited: enquiries and order view/edit",
      users: 4,
      type: "Predefined",
    },
    {
      id: 5,
      name: "Viewer",
      description: "Read-only across all modules",
      users: 6,
      type: "Predefined",
    },
  ]);

  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Samadhan Patil",
      assignedRoles: ["Super Admin"],
    },
    {
      id: 2,
      name: "Rahul Sharma",
      assignedRoles: ["Sales Manager"],
    },
  ]);

  const emptyRole = {
    name: "",
    description: "",
    users: 0,
    type: "Custom",
  };

  const [form, setForm] = useState(emptyRole);
  const [selectedRole, setSelectedRole] = useState(null);
  const [modalType, setModalType] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(1);
  const [roleToAssign, setRoleToAssign] = useState("Admin");
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  };

  const openAdd = () => {
    setForm(emptyRole);
    setSelectedRole(null);
    setModalType("form");
  };

  const openEdit = (role) => {
    setSelectedRole(role);
    setForm({
      name: role.name,
      description: role.description,
      users: role.users,
      type: role.type,
    });
    setModalType("form");
  };

  const closeModal = () => {
    setModalType("");
    setSelectedRole(null);
  };

  const saveRole = (e) => {
    e.preventDefault();

    if (selectedRole) {
      setRoles(
        roles.map((role) =>
          role.id === selectedRole.id ? { ...role, ...form } : role
        )
      );
      showToast("Role updated successfully!");
    } else {
      setRoles([...roles, { id: Date.now(), ...form }]);
      showToast("Custom role created successfully!");
    }

    closeModal();
  };

  const deleteRole = (id, type) => {
    if (type === "Predefined") {
      showToast("Predefined role delete nahi kar sakte!");
      return;
    }

    const confirmDelete = window.confirm("Delete this custom role?");

    if (confirmDelete) {
      setRoles(roles.filter((role) => role.id !== id));
      showToast("Role deleted!");
    }
  };

  const assignRole = () => {
    setUsers(
      users.map((user) =>
        user.id === Number(selectedUserId)
          ? {
              ...user,
              assignedRoles: user.assignedRoles.includes(roleToAssign)
                ? user.assignedRoles
                : [...user.assignedRoles, roleToAssign],
            }
          : user
      )
    );

    showToast("Role assigned successfully!");
  };

  return (
    <div className="users-page">
      <div className="users-header">
        <div>
          <h1>Role Management</h1>
          <p>Create custom roles and assign multiple roles to admin users.</p>
        </div>

        <button className="btn-primary" onClick={openAdd}>
          <FaPlus /> Create Custom Role
        </button>
      </div>

      <div className="role-grid">
        {roles.map((role) => (
          <div className="role-card" key={role.id}>
            <div className="role-top">
              <div>
                <h3>{role.name}</h3>
                <span>{role.type}</span>
              </div>

              <FaUsers />
            </div>

            <p>{role.description}</p>

            <div className="role-footer">
              <small>{role.users} users assigned</small>

              <div>
                <button className="icon-btn edit" onClick={() => openEdit(role)}>
                  <FaEdit />
                </button>

                <button
                  className="icon-btn delete"
                  onClick={() => deleteRole(role.id, role.type)}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="assign-role-box">
        <h3>Assign Multiple Roles</h3>

        <div className="assign-role-grid">
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
          >
            {users.map((user) => (
              <option value={user.id} key={user.id}>
                {user.name}
              </option>
            ))}
          </select>

          <select
            value={roleToAssign}
            onChange={(e) => setRoleToAssign(e.target.value)}
          >
            {roles.map((role) => (
              <option key={role.id}>{role.name}</option>
            ))}
          </select>

          <button className="btn-primary" onClick={assignRole}>
            Assign Role
          </button>
        </div>

        <div className="assigned-users-list">
          {users.map((user) => (
            <div className="assigned-user-item" key={user.id}>
              <strong>{user.name}</strong>
              <span>{user.assignedRoles.join(", ")}</span>
            </div>
          ))}
        </div>
      </div>

      {modalType === "form" && (
        <div className="modal-overlay">
          <div className="admin-modal users-modal">
            <h3>{selectedRole ? "Edit Role" : "Create Custom Role"}</h3>

            <form className="admin-form users-form" onSubmit={saveRole}>
              <input
                type="text"
                placeholder="Role Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />

              <textarea
                placeholder="Role Description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                rows="4"
                required
              ></textarea>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button type="submit" className="btn-primary">
                  Save Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && <div className="settings-toast">{toast}</div>}
    </div>
  );
}

export default RoleManagement;