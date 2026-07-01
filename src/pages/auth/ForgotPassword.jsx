import { useState } from "react";
import { Link } from "react-router-dom";
import { FaEnvelope } from "react-icons/fa";
import API from "../../services/api";


function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      const res = await API.post(
        "/auth/forgot-password",
        { email },
      );

      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg-glow"></div>

      <div className="auth-card">
        <div className="auth-brand">
          <h1>I LOAN</h1>
          <span>Loan Management System</span>
        </div>

        <div className="auth-heading">
          <p className="auth-label">PASSWORD HELP</p>
          <h2>Forgot Password?</h2>
          <p>Enter your email and we will send a reset link.</p>
        </div>

        {message && <div className="auth-success">{message}</div>}
        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-input-group">
            <FaEnvelope />
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button className="auth-submit" type="submit">
            Send Reset Link
          </button>
        </form>

        <p className="auth-switch">
          Remember password? <Link to="/auth/login">Back to Login</Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
