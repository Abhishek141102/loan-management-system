// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const db = require("../config/db");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access denied. No token provided." });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};

const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Not authenticated." });
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: `Access denied. Required: ${allowedRoles.join(" or ")}` });
    }
    next();
  };
};

const requirePermission = (module, action = "can_view") => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Not authenticated." });
    const sql = `SELECT ${action} FROM role_permissions WHERE role = ? AND module = ?`;
    db.query(sql, [req.user.role, module], (err, result) => {
      if (err) return res.status(500).json({ message: "Permission check failed." });
      if (result.length === 0 || result[0][action] !== 1) {
        return res.status(403).json({ message: `Access denied. No '${action}' on '${module}'.` });
      }
      next();
    });
  };
};

module.exports = { verifyToken, requireRole, requirePermission };
