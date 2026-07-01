const db = require("../config/db");
const bcrypt = require("bcryptjs");

const getAllUsers = (req, res) => {
  db.query("SELECT id, name, email, role, status, created_at FROM admin_users ORDER BY id ASC", (err, result) => {
    if (err) return res.status(500).json(err);
    res.status(200).json(result);
  });
};

const getUserById = (req, res) => {
  db.query("SELECT id, name, email, role, status, created_at FROM admin_users WHERE id = ?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.length === 0) return res.status(404).json({ message: "User not found" });
    res.status(200).json(result[0]);
  });
};

const createUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) return res.status(400).json({ message: "All fields required." });
  db.query("SELECT id FROM admin_users WHERE email = ?", [email], async (err, existing) => {
    if (err) return res.status(500).json(err);
    if (existing.length > 0) return res.status(409).json({ message: "Email already exists." });
    const hashedPassword = await bcrypt.hash(password, 10);
    db.query("INSERT INTO admin_users (name, email, password, role, status) VALUES (?, ?, ?, ?, 'Active')",
      [name, email, hashedPassword, role], (err, result) => {
        if (err) return res.status(500).json(err);
        res.status(201).json({ message: "User created successfully", id: result.insertId });
      });
  });
};

const updateUser = (req, res) => {
  const { name, email, role, status } = req.body;
  db.query("UPDATE admin_users SET name = ?, email = ?, role = ?, status = ? WHERE id = ?",
    [name, email, role, status, req.params.id], (err, result) => {
      if (err) return res.status(500).json(err);
      if (result.affectedRows === 0) return res.status(404).json({ message: "User not found" });
      res.status(200).json({ message: "User updated successfully" });
    });
};

const deleteUser = (req, res) => {
  if (parseInt(req.params.id) === req.user.id) return res.status(400).json({ message: "Aap apna account delete nahi kar sakte." });
  db.query("DELETE FROM admin_users WHERE id = ?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.affectedRows === 0) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
  });
};

const getRolePermissions = (req, res) => {
  db.query("SELECT * FROM role_permissions ORDER BY role, module", (err, result) => {
    if (err) return res.status(500).json(err);
    res.status(200).json(result);
  });
};

const updateRolePermissions = (req, res) => {
  const { role, module, can_view, can_create, can_edit, can_delete } = req.body;
  const sql = `INSERT INTO role_permissions (role, module, can_view, can_create, can_edit, can_delete)
    VALUES (?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE can_view=VALUES(can_view), can_create=VALUES(can_create), can_edit=VALUES(can_edit), can_delete=VALUES(can_delete)`;
  db.query(sql, [role, module, can_view, can_create, can_edit, can_delete], (err) => {
    if (err) return res.status(500).json(err);
    res.status(200).json({ message: "Permissions updated successfully" });
  });
};

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser, getRolePermissions, updateRolePermissions };
