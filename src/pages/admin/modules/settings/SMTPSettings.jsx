import { useState } from "react";
import {
  FaEnvelope,
  FaSave,
  FaPaperPlane,
  FaEye,
  FaEyeSlash,
  FaUndo,
  FaServer,
  FaLock,
} from "react-icons/fa";

function SMTPSettings() {
  const defaultSMTP = {
    smtpServer: "smtp.gmail.com",
    port: "587",
    emailFrom: "noreply@irasaperfumes.in",
    displayName: "I Rasa Perfumes",
    username: "your-email@gmail.com",
    password: "",
    tls: true,
    ssl: false,
    testEmail: "",
  };

  const [smtp, setSmtp] = useState(defaultSMTP);
  const [savedSMTP, setSavedSMTP] = useState(defaultSMTP);
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState("");
  const [testStatus, setTestStatus] = useState("");

  const showToast = (message) => {
    setToast(message);

    setTimeout(() => {
      setToast("");
    }, 2300);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setSmtp({
      ...smtp,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handlePortChange = (e) => {
    const selectedPort = e.target.value;

    setSmtp({
      ...smtp,
      port: selectedPort,
      tls: selectedPort === "587",
      ssl: selectedPort === "465",
    });
  };

  const handleSave = (e) => {
    e.preventDefault();

    if (!smtp.smtpServer || !smtp.port || !smtp.emailFrom || !smtp.username) {
      showToast("Please fill all required fields");
      return;
    }

    setSavedSMTP(smtp);
    showToast("SMTP settings saved successfully!");
  };

  const handleReset = () => {
    const confirmReset = window.confirm("Reset SMTP settings to default?");

    if (confirmReset) {
      setSmtp(defaultSMTP);
      setSavedSMTP(defaultSMTP);
      setTestStatus("");
      showToast("SMTP settings reset successfully!");
    }
  };

  const sendTestEmail = () => {
    if (!smtp.testEmail) {
      setTestStatus("Please enter test email address first.");
      showToast("Enter test email address");
      return;
    }

    if (!smtp.smtpServer || !smtp.username || !smtp.password) {
      setTestStatus(
        "SMTP details incomplete. Please add username and app password.",
      );
      showToast("SMTP details incomplete");
      return;
    }

    setTestStatus("Sending test email...");

    setTimeout(() => {
      setTestStatus(`Test email sent successfully to ${smtp.testEmail}`);
      showToast("Test email sent successfully!");
    }, 1200);
  };

  return (
    <div className="smtp-settings-page">
      <div className="smtp-page-header">
        <div>
          <h1>SMTP Email Configuration</h1>
          <p>
            Configure SMTP details for OTP, order confirmation, password reset
            and email notifications.
          </p>
        </div>

        <button className="btn-danger" onClick={handleReset}>
          <FaUndo /> Reset
        </button>
      </div>

      <form onSubmit={handleSave}>
        <div className="smtp-grid">
          {/* SMTP FORM */}
          <div className="smtp-card">
            <h3>
              <FaServer /> SMTP Configuration Form
            </h3>

            <div className="smtp-form-grid">
              <div className="smtp-input-group">
                <label>SMTP Server</label>
                <input
                  type="text"
                  name="smtpServer"
                  value={smtp.smtpServer}
                  onChange={handleChange}
                  placeholder="smtp.gmail.com"
                  required
                />
              </div>

              <div className="smtp-input-group">
                <label>Port</label>
                <select
                  name="port"
                  value={smtp.port}
                  onChange={handlePortChange}
                >
                  <option value="587">587 - TLS</option>
                  <option value="465">465 - SSL</option>
                  <option value="25">25 - Default</option>
                </select>
              </div>

              <div className="smtp-input-group">
                <label>Email From</label>
                <input
                  type="email"
                  name="emailFrom"
                  value={smtp.emailFrom}
                  onChange={handleChange}
                  placeholder="noreply@irasaperfumes.in"
                  required
                />
              </div>

              <div className="smtp-input-group">
                <label>Display Name</label>
                <input
                  type="text"
                  name="displayName"
                  value={smtp.displayName}
                  onChange={handleChange}
                  placeholder="I Rasa Perfumes"
                  required
                />
              </div>

              <div className="smtp-input-group">
                <label>Username</label>
                <input
                  type="email"
                  name="username"
                  value={smtp.username}
                  onChange={handleChange}
                  placeholder="your-email@gmail.com"
                  required
                />
              </div>

              <div className="smtp-input-group">
                <label>App Password</label>

                <div className="password-field">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={smtp.password}
                    onChange={handleChange}
                    placeholder="App Password — masked"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
            </div>

            <div className="smtp-toggle-row">
              <label className="smtp-toggle">
                <input
                  type="checkbox"
                  name="tls"
                  checked={smtp.tls}
                  onChange={handleChange}
                />
                <span></span>
                TLS
              </label>

              <label className="smtp-toggle">
                <input
                  type="checkbox"
                  name="ssl"
                  checked={smtp.ssl}
                  onChange={handleChange}
                />
                <span></span>
                SSL
              </label>
            </div>

            <div className="smtp-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={sendTestEmail}
              >
                <FaPaperPlane /> Send Test Email
              </button>

              <button type="submit" className="btn-primary">
                <FaSave /> Save Settings
              </button>
            </div>
          </div>

          {/* TEST EMAIL */}
          <div className="smtp-card">
            <h3>
              <FaEnvelope /> Test Email
            </h3>

            <div className="smtp-input-group">
              <label>Send test email to</label>
              <input
                type="email"
                name="testEmail"
                value={smtp.testEmail}
                onChange={handleChange}
                placeholder="example@gmail.com"
              />
            </div>

            <button
              type="button"
              className="btn-primary test-btn"
              onClick={sendTestEmail}
            >
              <FaPaperPlane /> Send Test Email
            </button>

            {testStatus && (
              <div
                className={
                  testStatus.includes("successfully")
                    ? "smtp-test-status success"
                    : "smtp-test-status warning"
                }
              >
                {testStatus}
              </div>
            )}

            <div className="smtp-help-box">
              <FaLock />
              <p>
                For Gmail SMTP, use an App Password instead of your normal Gmail
                password.
              </p>
            </div>
          </div>

          {/* ENV PREVIEW */}
          <div className="smtp-card smtp-env-card">
            <h3>Environment Variables Preview</h3>

            <pre>{`VITE_SMTP_HOST=${savedSMTP.smtpServer}
VITE_SMTP_PORT=${savedSMTP.port}
VITE_SMTP_USER=${savedSMTP.username}
VITE_SMTP_FROM=${savedSMTP.emailFrom}
VITE_SMTP_FROM_NAME=${savedSMTP.displayName}`}</pre>
          </div>

          {/* SAVED PREVIEW */}
          <div className="smtp-card">
            <h3>Saved SMTP Settings</h3>

            <div className="smtp-preview-list">
              <p>
                <strong>SMTP Server:</strong> {savedSMTP.smtpServer}
              </p>
              <p>
                <strong>Port:</strong> {savedSMTP.port}
              </p>
              <p>
                <strong>Email From:</strong> {savedSMTP.emailFrom}
              </p>
              <p>
                <strong>Display Name:</strong> {savedSMTP.displayName}
              </p>
              <p>
                <strong>Username:</strong> {savedSMTP.username}
              </p>
              <p>
                <strong>TLS:</strong> {savedSMTP.tls ? "ON" : "OFF"}
              </p>
              <p>
                <strong>SSL:</strong> {savedSMTP.ssl ? "ON" : "OFF"}
              </p>
            </div>
          </div>
        </div>
      </form>

      {toast && <div className="settings-toast">{toast}</div>}
    </div>
  );
}

export default SMTPSettings;
