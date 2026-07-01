import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaEye, FaEyeSlash, FaLock, FaPhoneAlt, FaUserAlt } from "react-icons/fa";
import axios from "axios";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const passwordScore = () => {
    let score = 0;
    if (form.password.length >= 8) score++;
    if (/[A-Z]/.test(form.password)) score++;
    if (/[0-9]/.test(form.password)) score++;
    if (/[^A-Za-z0-9]/.test(form.password)) score++;
    return score;
  };

  const score = passwordScore();
  const strengthLabel = ["Weak", "Weak", "Medium", "Good", "Strong"][score];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Password and confirm password do not match.");
      return;
    }

    if (!form.terms) {
      setError("Please accept Terms & Conditions to continue.");
      return;
    }

    try {

    await axios.post(
      "http://localhost:5000/api/auth/register",
      {
        email: form.email,
        password: form.password,
      }
    );

    // save email
    localStorage.setItem("email", form.email);

    navigate("/auth/verify-otp");

  } catch (err) {

    setError(
      err.response?.data?.message || "Registration failed"
    );

  }   
  };

  return (
    <div className="auth-page">
      <div className="auth-bg-glow"></div>

      <div className="auth-card register-card">
        <div className="auth-brand">
          <h1>I Rasa</h1>
          <span>Perfumes Admin</span>
        </div>

        <div className="auth-heading">
          <p className="auth-label">CREATE ACCOUNT</p>
          <h2>Register New Admin</h2>
          <p>Manage orders, payments and luxury perfume products securely.</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-input-group">
            <FaUserAlt />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="auth-input-group">
            <FaEnvelope />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="auth-input-group">
            <FaPhoneAlt />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              pattern="[0-9]{10}"
              title="Enter a valid 10 digit phone number"
            />
          </div>

          <div className="auth-input-group password-field">
            <FaLock />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div className="password-strength">
            <div className="strength-track">
              <span style={{ width: `${score * 25}%` }}></span>
            </div>
            <small>Password Strength: {strengthLabel}</small>
          </div>

          <div className="auth-input-group password-field">
            <FaLock />
            <input
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)}>
              {showConfirm ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <label className="auth-check">
            <input
              type="checkbox"
              name="terms"
              checked={form.terms}
              onChange={handleChange}
            />
            <span>I agree to Terms & Conditions and Privacy Policy.</span>
          </label>

          <button className="auth-submit" type="submit">
            Create Account
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/auth/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
