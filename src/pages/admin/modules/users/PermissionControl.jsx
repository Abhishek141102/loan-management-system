import { useState } from "react";
import { FaSave, FaUndo } from "react-icons/fa";

function PermissionControl() {
  const roles = [
    "Super Admin",
    "Admin",
    "Sales Manager",
    "Support Staff",
    "Viewer",
  ];

  const modules = [
    "Products",
    "Orders",
    "Payments",
    "Enquiries",
    "Users",
    "Reports",
  ];

  const actions = ["view", "create", "edit", "delete"];

  const defaultPermissions = {
    "Super Admin": {
      Products: { view: true, create: true, edit: true, delete: true },
      Orders: { view: true, create: true, edit: true, delete: true },
      Payments: { view: true, create: true, edit: true, delete: true },
      Enquiries: { view: true, create: true, edit: true, delete: true },
      Users: { view: true, create: true, edit: true, delete: true },
      Reports: { view: true, create: true, edit: true, delete: true },
    },
    Admin: {
      Products: { view: true, create: true, edit: true, delete: true },
      Orders: { view: true, create: true, edit: true, delete: false },
      Payments: { view: true, create: false, edit: true, delete: false },
      Enquiries: { view: true, create: true, edit: true, delete: false },
      Users: { view: false, create: false, edit: false, delete: false },
      Reports: { view: true, create: false, edit: false, delete: false },
    },
    "Sales Manager": {
      Products: { view: true, create: false, edit: false, delete: false },
      Orders: { view: true, create: true, edit: true, delete: false },
      Payments: { view: true, create: false, edit: false, delete: false },
      Enquiries: { view: true, create: true, edit: true, delete: false },
      Users: { view: false, create: false, edit: false, delete: false },
      Reports: { view: true, create: false, edit: false, delete: false },
    },
    "Support Staff": {
      Products: { view: true, create: false, edit: false, delete: false },
      Orders: { view: true, create: false, edit: true, delete: false },
      Payments: { view: false, create: false, edit: false, delete: false },
      Enquiries: { view: true, create: true, edit: true, delete: false },
      Users: { view: false, create: false, edit: false, delete: false },
      Reports: { view: false, create: false, edit: false, delete: false },
    },
    Viewer: {
      Products: { view: true, create: false, edit: false, delete: false },
      Orders: { view: true, create: false, edit: false, delete: false },
      Payments: { view: true, create: false, edit: false, delete: false },
      Enquiries: { view: true, create: false, edit: false, delete: false },
      Users: { view: true, create: false, edit: false, delete: false },
      Reports: { view: true, create: false, edit: false, delete: false },
    },
  };

  const [selectedRole, setSelectedRole] = useState("Admin");
  const [permissions, setPermissions] = useState(defaultPermissions);
  const [savedPermissions, setSavedPermissions] = useState(defaultPermissions);
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  };

  const togglePermission = (module, action) => {
    setPermissions({
      ...permissions,
      [selectedRole]: {
        ...permissions[selectedRole],
        [module]: {
          ...permissions[selectedRole][module],
          [action]: !permissions[selectedRole][module][action],
        },
      },
    });
  };

  const savePermissions = () => {
    setSavedPermissions(permissions);
    showToast("Permissions saved successfully!");
  };

  const resetPermissions = () => {
    const confirmReset = window.confirm(
      "Reset permissions to default configuration?"
    );

    if (confirmReset) {
      setPermissions(defaultPermissions);
      setSavedPermissions(defaultPermissions);
      showToast("Permissions reset successfully!");
    }
  };

  return (
    <div className="users-page">
      <div className="users-header">
        <div>
          <h1>Permission Control</h1>
          <p>Configure permission matrix per role using toggle controls.</p>
        </div>

        <div className="permission-actions">
          <button className="btn-danger" onClick={resetPermissions}>
            <FaUndo /> Reset
          </button>

          <button className="btn-primary" onClick={savePermissions}>
            <FaSave /> Save Permissions
          </button>
        </div>
      </div>

      <div className="permission-role-select">
        <label>Select Role</label>
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
        >
          {roles.map((role) => (
            <option key={role}>{role}</option>
          ))}
        </select>
      </div>

      <div className="table-wrapper">
        <table className="admin-table permission-table">
          <thead>
            <tr>
              <th>Module</th>
              <th>View</th>
              <th>Create</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>

          <tbody>
            {modules.map((module) => (
              <tr key={module}>
                <td>{module}</td>

                {actions.map((action) => (
                  <td key={action}>
                    <label className="permission-switch">
                      <input
                        type="checkbox"
                        checked={permissions[selectedRole][module][action]}
                        onChange={() => togglePermission(module, action)}
                      />
                      <span></span>
                    </label>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="saved-permission-preview">
        <h3>Saved Permission Preview</h3>
        <p>
          Current selected role: <strong>{selectedRole}</strong>
        </p>
        <p>
          View Products:{" "}
          <strong>
            {savedPermissions[selectedRole].Products.view ? "Allowed" : "Denied"}
          </strong>
        </p>
        <p>
          Delete Orders:{" "}
          <strong>
            {savedPermissions[selectedRole].Orders.delete ? "Allowed" : "Denied"}
          </strong>
        </p>
      </div>

      {toast && <div className="settings-toast">{toast}</div>}
    </div>
  );
}

export default PermissionControl;