import { useState } from "react";

import {
  useParams,
  useNavigate,
  Link,
} from "react-router-dom";

import API from "../../services/api";

import {
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

function ResetPassword() {

  const { token } = useParams();

  const navigate = useNavigate();

  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");
    setMessage("");

    try {

      const res = await API.post(
        `/auth/reset-password/${token}`,
        { password }
      );

      setMessage(res.data.message);

      setTimeout(() => {
        navigate("/auth/login");
      }, 2000);

    } catch (err) {

      setError(
        err.response?.data?.message ||
        "Reset failed"
      );

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
          <p className="auth-label">
            RESET PASSWORD
          </p>

          <h2>Create New Password</h2>

          <p>
            Enter your new secure password.
          </p>
        </div>

        {message && (
          <div className="auth-success">
            {message}
          </div>
        )}

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >

          <div className="auth-input-group password-field">

            <FaLock />

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }

              placeholder="Enter new password"

              value={password}

              onChange={(e) =>
                setPassword(e.target.value)
              }

              required
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(!showPassword)
              }
            >
              {showPassword
                ? <FaEyeSlash />
                : <FaEye />}
            </button>

          </div>

          <button
            className="auth-submit"
            type="submit"
          >
            Reset Password
          </button>

        </form>

        <p className="auth-switch">
          <Link to="/auth/login">
            ← Back to Login
          </Link>
        </p>

      </div>

    </div>
  );
}

export default ResetPassword;