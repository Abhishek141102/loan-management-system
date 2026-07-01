import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

function OTPVerification() {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [error, setError] = useState("");
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const { login } = useAuth();
  const email = localStorage.getItem("email");

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalOtp = otp.join("");

    try {

    await axios.post(
      "http://localhost:5000/api/auth/verify-otp",
      {
        email,
        otp: finalOtp,
      }
    );

    login("real-token");

    navigate("/admin/dashboard");

  } catch (err) {

    setError(
      err.response?.data?.message || "Invalid OTP"
    );

  }
  };

  const resendOtp = async () => {

  try {

    await axios.post(
      "http://localhost:5000/api/auth/resend-otp",
      { email }
    );

    setTimer(60);

    setOtp(["", "", "", ""]);

    setError("");

    inputRefs.current[0]?.focus();

  } catch (err) {

    setError("Failed to resend OTP");

  }
};

  return (
    <div className="auth-page">
      <div className="auth-bg-glow"></div>

      <div className="auth-card otp-card">
        <div className="auth-brand">
          <h1>I Rasa</h1>
          <span>Perfumes Admin</span>
        </div>

        <div className="auth-heading">
          <p className="auth-label">EMAIL VERIFICATION</p>
          <h2>Verify Your Email</h2>
          <p>We sent a 4-digit code to <strong>{email}</strong></p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="otp-inputs">
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputRefs.current[i] = el)}
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e.target.value, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                inputMode="numeric"
              />
            ))}
          </div>

          <button className="auth-submit" type="submit">Verify OTP</button>
        </form>

        <p className="auth-switch">
          Didn't receive it?{" "}
          <button className="link-btn" disabled={timer > 0} onClick={resendOtp} type="button">
            {timer > 0 ? `Resend in ${timer}s` : "Resend OTP"}
          </button>
        </p>

        <p className="auth-switch"><Link to="/auth/register">← Back to Registration</Link></p>
      </div>
    </div>
  );
}

export default OTPVerification;
