import React, { useEffect, useState } from "react";
import "./SettingsPage.css";
import { useNavigate } from "react-router-dom";
import API from "../../../../services/api";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const API_BASE = "http://localhost:5000/api/settings";

function SettingsPage() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("general");

  const [message, setMessage] = useState({
    text: "",
    type: "success",
  });

  const [loading, setLoading] = useState(true);

  const [generalSettings, setGeneralSettings] = useState({
    system_name: "I Loan Management System",
    contact_email: "admin@iloan.in",
    default_interest_rate: "9.5",
    currency_symbol: "₹ INR",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const showToast = (text, type = "success") => {
    setMessage({ text, type });

    setTimeout(() => {
      setMessage({
        text: "",
        type: "success",
      });
    }, 2800);
  };

  useEffect(() => {
    const fetchGeneral = async () => {
      try {
        const res = await fetch(`${API_BASE}/general`);

        const gen = await res.json();

        setGeneralSettings({
          system_name: gen.system_name || "I Loan Management System",

          contact_email: gen.contact_email || "admin@iloan.in",

          default_interest_rate: gen.default_interest_rate || "9.5",

          currency_symbol: gen.currency_symbol || "₹ INR",
        });
      } catch (err) {
        console.error(err);

        showToast("Failed to load settings", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchGeneral();
  }, []);

  const handleGeneralChange = (e) => {
    setGeneralSettings({
      ...generalSettings,

      [e.target.name]: e.target.value,
    });
  };

  const saveGeneralSettings = async () => {
    try {
      const res = await fetch(`${API_BASE}/general`, {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(generalSettings),
      });

      const data = await res.json();

      showToast(data.message || "Settings saved");
    } catch {
      showToast("Failed to save settings", "error");
    }
  };

  const resetGeneralSettings = () => {
    setGeneralSettings({
      system_name: "I Loan Management System",

      contact_email: "admin@iloan.in",

      default_interest_rate: "9.5",

      currency_symbol: "₹ INR",
    });

    showToast("Settings reset");
  };

  const handlePasswordChange = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/change-password",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: localStorage.getItem("adminEmail"),

            currentPassword: passwordForm.currentPassword,

            newPassword: passwordForm.newPassword,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        showToast(data.message || "Password update failed", "error");

        return;
      }

      showToast("Password updated successfully");

      setTimeout(() => {
        localStorage.clear();

        navigate("/auth/login");
      }, 1500);
    } catch (error) {
      console.log(error);

      showToast("Server error", "error");
    }
  };
  if (loading) {
    return (
      <div className="settings-page">
        <div
          style={{
            color: "#dbe4ff",
            textAlign: "center",
            padding: "60px",
          }}
        >
          Loading settings...
        </div>
      </div>
    );
  }

  return (
    <div className="settings-page">
      {message.text && (
        <div
          className={`settings-toast ${
            message.type === "error" ? "error" : ""
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="settings-header">
        <div>
          <h2>Admin Configuration Panel</h2>

          <p>Manage system preferences.</p>
        </div>
      </div>

      <div className="settings-tabs">
        <button
          className={activeTab === "general" ? "active" : ""}
          onClick={() => setActiveTab("general")}
        >
          General Settings
        </button>

        <button
          className={activeTab === "password" ? "active" : ""}
          onClick={() => setActiveTab("password")}
        >
          Change Password
        </button>
      </div>

      {/* GENERAL SETTINGS */}

      {activeTab === "general" && (
        <div className="settings-card">
          <div className="settings-card-header">
            <div>
              <h3>General Settings</h3>

              <p>Update system configuration.</p>
            </div>
          </div>

          <div className="settings-form-grid">
            <div className="form-group">
              <label>System Name</label>

              <input
                type="text"
                name="system_name"
                value={generalSettings.system_name}
                onChange={handleGeneralChange}
              />
            </div>

            <div className="form-group">
              <label>Contact Email</label>

              <input
                type="email"
                name="contact_email"
                value={generalSettings.contact_email}
                onChange={handleGeneralChange}
              />
            </div>

            <div className="form-group">
              <label>Default Interest Rate</label>

              <input
                type="number"
                name="default_interest_rate"
                value={generalSettings.default_interest_rate}
                onChange={handleGeneralChange}
              />
            </div>

            <div className="form-group">
              <label>Currency Symbol</label>

              <select
                name="currency_symbol"
                value={generalSettings.currency_symbol}
                onChange={handleGeneralChange}
              >
                <option value="₹ INR">₹ INR</option>

                <option value="$ USD">$ USD</option>

                <option value="€ EUR">€ EUR</option>

                <option value="£ GBP">£ GBP</option>
              </select>
            </div>
          </div>

          <div className="settings-actions">
            <button className="primary-btn" onClick={saveGeneralSettings}>
              Save Settings
            </button>

            <button className="secondary-btn" onClick={resetGeneralSettings}>
              Reset
            </button>
          </div>
        </div>
      )}

      {/* CHANGE PASSWORD */}

      {/* CHANGE PASSWORD */}

      {activeTab === "password" && (
        <div className="settings-card">
          <div className="settings-card-header">
            <div>
              <h3>Change Password</h3>

              <p>Update your admin password securely.</p>
            </div>
          </div>

          <div className="settings-form-grid">
            {/* CURRENT PASSWORD */}

            <div className="form-group">
              <label>Current Password</label>

              <div
                style={{
                  position: "relative",
                }}
              >
                <input
                  type={showPasswords.current ? "text" : "password"}
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,

                      currentPassword: e.target.value,
                    })
                  }
                  style={{
                    paddingRight: 45,
                  }}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords({
                      ...showPasswords,

                      current: !showPasswords.current,
                    })
                  }
                  style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",

                    background: "none",
                    border: "none",
                    color: "#9aa4c7",
                    cursor: "pointer",
                    fontSize: 16,
                  }}
                >
                  {showPasswords.current ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* NEW PASSWORD */}

            <div className="form-group">
              <label>New Password</label>

              <div
                style={{
                  position: "relative",
                }}
              >
                <input
                  type={showPasswords.new ? "text" : "password"}
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,

                      newPassword: e.target.value,
                    })
                  }
                  style={{
                    paddingRight: 45,
                  }}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords({
                      ...showPasswords,

                      new: !showPasswords.new,
                    })
                  }
                  style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",

                    background: "none",
                    border: "none",
                    color: "#9aa4c7",
                    cursor: "pointer",
                    fontSize: 16,
                  }}
                >
                  {showPasswords.new ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* CONFIRM PASSWORD */}

            <div className="form-group">
              <label>Confirm Password</label>

              <div
                style={{
                  position: "relative",
                }}
              >
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,

                      confirmPassword: e.target.value,
                    })
                  }
                  style={{
                    paddingRight: 45,
                  }}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords({
                      ...showPasswords,

                      confirm: !showPasswords.confirm,
                    })
                  }
                  style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",

                    background: "none",
                    border: "none",
                    color: "#9aa4c7",
                    cursor: "pointer",
                    fontSize: 16,
                  }}
                >
                  {showPasswords.confirm ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
          </div>

          <div className="settings-actions">
            <button
              type="button"
              className="primary-btn"
              onClick={() => {
                console.log(passwordForm);

                handlePasswordChange();
              }}
            >
              Update Password
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SettingsPage;
