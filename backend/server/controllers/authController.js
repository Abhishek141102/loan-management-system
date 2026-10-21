const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const resend = require("../config/mail");

// LOGIN — role bhi JWT mein
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM admin_users WHERE email = ? AND status = 'Active'";
  db.query(sql, [email], async (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.length === 0) return res.status(401).json({ message: "Invalid credentials or account inactive." });
    const admin = result[0];
    
const isMatch = await bcrypt.compare(password, admin.password);

console.log("Login password comparison result:", isMatch);

if (!isMatch) {
  return res.status(401).json({ message: "Invalid credentials." });
}

    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role, name: admin.name },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.status(200).json({
      message: "Login successful", token,
      admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role },
    });
  });
};

// GET permissions for logged-in user
const getMyPermissions = (req, res) => {
  const role = req.user.role;
  db.query("SELECT * FROM role_permissions WHERE role = ?", [role], (err, result) => {
    if (err) return res.status(500).json(err);
    res.status(200).json({ role, permissions: result });
  });
};


const forgotPassword = (req, res) => {
  const { email } = req.body;

  db.query(
    "SELECT * FROM admin_users WHERE email = ?",
    [email],
    (err, result) => {
      if (err) {
        console.error("Forgot password DB error:", err.message);
        return res.status(500).json({
          message: "Unable to process password reset."
        });
      }

      if (result.length === 0) {
        return res.status(404).json({
          message: "Email not found."
        });
      }

      const admin = result[0];
      const resetToken = crypto.randomBytes(32).toString("hex");
      const expiry = new Date(Date.now() + 3600000);

      db.query(
        "UPDATE admin_users SET reset_token = ?, reset_token_expiry = ? WHERE id = ?",
        [resetToken, expiry, admin.id],
        async (updateErr) => {
          if (updateErr) {
            console.error("Reset token DB error:", updateErr.message);
            return res.status(500).json({
              message: "Unable to process password reset."
            });
          }

          try {
            const frontendUrl = process.env.FRONTEND_URL;

            if (!frontendUrl || !process.env.RESEND_API_KEY) {
              throw new Error("Email configuration is missing.");
            }

            const resetLink =
              `${frontendUrl.replace(/\/$/, "")}/reset-password/${resetToken}`;

            const { data, error } = await resend.emails.send({
              from: "I Loan <onboarding@resend.dev>",
              to: [admin.email],
              subject: "Reset Your I Loan Password",
              html: `
                <h2>Password Reset</h2>
                <p>Click below to reset your password.</p>
                <p><a href="${resetLink}">Reset Password</a></p>
                <p>This link expires in 1 hour.</p>
              `
            });

            if (error) {
              console.error("Resend email error:", error.message);
              return res.status(502).json({
                message: "Unable to send reset email."
              });
            }

            return res.status(200).json({
              message: "Reset link sent to your email."
            });
          } catch (emailErr) {
            console.error("Email sending failed:", emailErr.message);
            return res.status(500).json({
              message: "Unable to send reset email."
            });
          }
        }
      );
    }
  );
};


const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  db.query("SELECT * FROM admin_users WHERE reset_token = ? AND reset_token_expiry > NOW()", [token], async (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.length === 0) return res.status(400).json({ message: "Invalid or expired token" });
    const admin = result[0];
    const hashedPassword = await bcrypt.hash(password, 10);
    db.query("UPDATE admin_users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?",
      [hashedPassword, admin.id], (err) => {
        if (err) return res.status(500).json(err);
        res.status(200).json({ message: "Password reset successful" });
      });
  });
};

const changePassword = async (req, res) => {
  try {
    const { email, currentPassword, newPassword } = req.body;
    db.query("SELECT * FROM admin_users WHERE email = ?", [email], async (err, result) => {
      if (err) return res.status(500).json(err);
      if (result.length === 0) return res.status(404).json({ message: "Admin not found" });
      const admin = result[0];
      const isMatch = await bcrypt.compare(currentPassword, admin.password);
      if (!isMatch) return res.status(401).json({ message: "Current password incorrect" });
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      db.query("UPDATE admin_users SET password = ? WHERE email = ?", [hashedPassword, email], (err) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json({ message: "Password changed successfully" });
      });
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { loginAdmin, forgotPassword, resetPassword, changePassword, getMyPermissions };
