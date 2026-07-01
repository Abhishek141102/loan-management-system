import { useState } from "react";
import {
  FaBell,
  FaEnvelope,
  FaSave,
  FaUndo,
  FaEye,
  FaClock,
  FaExclamationTriangle,
} from "react-icons/fa";

function NotificationSettings() {
  const defaultSettings = {
    notifications: {
      otpVerification: true,
      welcomeEmail: true,
      orderConfirmation: true,
      paymentVerified: true,
      shipmentUpdate: true,
      deliveryConfirmation: true,
      passwordReset: true,
      lowStockAlert: true,
      promotionalOffers: false,
    },
    thresholds: {
      lowStockLimit: 10,
      pendingPaymentHours: 24,
      failedLoginAttempts: 5,
    },
    quietHours: {
      enabled: true,
      from: "22:00",
      to: "07:00",
    },
    frequency: "Instant",
  };

  const [settings, setSettings] = useState(defaultSettings);
  const [savedSettings, setSavedSettings] = useState(defaultSettings);
  const [toast, setToast] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);

  const showToast = (message) => {
    setToast(message);

    setTimeout(() => {
      setToast("");
    }, 2200);
  };

  const handleToggle = (name) => {
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [name]: !settings.notifications[name],
      },
    });
  };

  const handleThresholdChange = (e) => {
    const { name, value } = e.target;

    setSettings({
      ...settings,
      thresholds: {
        ...settings.thresholds,
        [name]: value,
      },
    });
  };

  const handleQuietHoursChange = (e) => {
    const { name, value, type, checked } = e.target;

    setSettings({
      ...settings,
      quietHours: {
        ...settings.quietHours,
        [name]: type === "checkbox" ? checked : value,
      },
    });
  };

  const handleSave = () => {
    setSavedSettings(settings);
    showToast("Notification settings saved successfully!");
  };

  const handleReset = () => {
    const confirmReset = window.confirm(
      "Are you sure you want to reset notification settings?"
    );

    if (confirmReset) {
      setSettings(defaultSettings);
      setSavedSettings(defaultSettings);
      showToast("Notification settings reset successfully!");
    }
  };

  const notificationItems = [
    {
      key: "otpVerification",
      title: "OTP Verification",
      desc: "Send OTP email when user registers.",
    },
    {
      key: "welcomeEmail",
      title: "Welcome Email",
      desc: "Send welcome email after OTP verification.",
    },
    {
      key: "orderConfirmation",
      title: "Order Confirmation",
      desc: "Send email when order is placed.",
    },
    {
      key: "paymentVerified",
      title: "Payment Verified",
      desc: "Send email after payment approval.",
    },
    {
      key: "shipmentUpdate",
      title: "Shipment Update",
      desc: "Send email when order is shipped.",
    },
    {
      key: "deliveryConfirmation",
      title: "Delivery Confirmation",
      desc: "Send email when order is delivered.",
    },
    {
      key: "passwordReset",
      title: "Password Reset",
      desc: "Send reset link for forgot password request.",
    },
    {
      key: "lowStockAlert",
      title: "Low Stock Alert",
      desc: "Send alert when inventory stock is low.",
    },
    {
      key: "promotionalOffers",
      title: "Promotional Offers",
      desc: "Send offers and discount campaigns.",
    },
  ];

  return (
    <div className="notification-settings-page">
      <div className="notification-header">
        <div>
          <h1>Notification Settings</h1>
          <p>
            Control email alerts, thresholds, quiet hours and notification
            frequency for I Rasa Perfumes.
          </p>
        </div>

        <div className="notification-header-actions">
          <button className="btn-secondary" onClick={() => setPreviewOpen(true)}>
            <FaEye /> Preview
          </button>

          <button className="btn-danger" onClick={handleReset}>
            <FaUndo /> Reset
          </button>

          <button className="btn-primary" onClick={handleSave}>
            <FaSave /> Save Settings
          </button>
        </div>
      </div>

      <div className="notification-grid">
        {/* Email Notification Toggles */}
        <div className="notification-card notification-main-card">
          <h3>
            <FaBell /> Email Notifications
          </h3>

          <div className="notification-toggle-list">
            {notificationItems.map((item) => (
              <div className="notification-toggle-item" key={item.key}>
                <div>
                  <h4>{item.title}</h4>
                  <p>{item.desc}</p>
                </div>

                <label className="notification-switch">
                  <input
                    type="checkbox"
                    checked={settings.notifications[item.key]}
                    onChange={() => handleToggle(item.key)}
                  />
                  <span></span>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Alert Threshold */}
        <div className="notification-card">
          <h3>
            <FaExclamationTriangle /> Alert Thresholds
          </h3>

          <div className="notification-input-group">
            <label>Low Stock Alert Limit</label>
            <input
              type="number"
              name="lowStockLimit"
              value={settings.thresholds.lowStockLimit}
              onChange={handleThresholdChange}
            />
          </div>

          <div className="notification-input-group">
            <label>Pending Payment Alert After Hours</label>
            <input
              type="number"
              name="pendingPaymentHours"
              value={settings.thresholds.pendingPaymentHours}
              onChange={handleThresholdChange}
            />
          </div>

          <div className="notification-input-group">
            <label>Failed Login Attempts Limit</label>
            <input
              type="number"
              name="failedLoginAttempts"
              value={settings.thresholds.failedLoginAttempts}
              onChange={handleThresholdChange}
            />
          </div>
        </div>

        {/* Quiet Hours */}
        <div className="notification-card">
          <h3>
            <FaClock /> Quiet Hours
          </h3>

          <div className="quiet-toggle-box">
            <div>
              <h4>Enable Quiet Hours</h4>
              <p>No alerts will be sent during this time.</p>
            </div>

            <label className="notification-switch">
              <input
                type="checkbox"
                name="enabled"
                checked={settings.quietHours.enabled}
                onChange={handleQuietHoursChange}
              />
              <span></span>
            </label>
          </div>

          <div className="quiet-hours-grid">
            <div className="notification-input-group">
              <label>From</label>
              <input
                type="time"
                name="from"
                value={settings.quietHours.from}
                onChange={handleQuietHoursChange}
                disabled={!settings.quietHours.enabled}
              />
            </div>

            <div className="notification-input-group">
              <label>To</label>
              <input
                type="time"
                name="to"
                value={settings.quietHours.to}
                onChange={handleQuietHoursChange}
                disabled={!settings.quietHours.enabled}
              />
            </div>
          </div>
        </div>

        {/* Frequency */}
        <div className="notification-card">
          <h3>
            <FaEnvelope /> Notification Frequency
          </h3>

          <div className="frequency-options">
            {["Instant", "Daily Digest", "Weekly Digest"].map((freq) => (
              <label
                key={freq}
                className={
                  settings.frequency === freq
                    ? "frequency-option active"
                    : "frequency-option"
                }
              >
                <input
                  type="radio"
                  name="frequency"
                  value={freq}
                  checked={settings.frequency === freq}
                  onChange={(e) =>
                    setSettings({ ...settings, frequency: e.target.value })
                  }
                />
                <span>{freq}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Email System Overview */}
        <div className="notification-card email-system-card">
          <h3>Email System Overview</h3>

          <div className="email-overview-grid">
            <div className="email-overview-box">
              <h4>OTP Verification Email</h4>
              <p>
                <strong>Subject:</strong> Verify Your I Rasa Account — OTP: XXXX
              </p>
              <pre>{`Hello {user_name},

Your OTP verification code is:

┌───────────────┐
│  X  X  X  X  │
└───────────────┘

This code expires in 15 minutes.

Best regards,
I Rasa Perfumes Team
support@irasaperfumes.in`}</pre>
            </div>

            <div className="email-overview-box">
              <h4>Order Confirmation Email</h4>
              <p>
                <strong>Subject:</strong> Order Confirmed — Order #{"{order_id}"}
              </p>
              <pre>{`Hello {user_name},
Your order #{order_id} placed on {order_date} has been confirmed.

Items: {product_list}
Total: {order_total}

Track your order: {tracking_link}`}</pre>
            </div>

            <div className="email-overview-box">
              <h4>Password Reset Email</h4>
              <p>
                <strong>Subject:</strong> Reset Your I Rasa Password
              </p>
              <pre>{`Hello {user_name},

Click below to reset your password (link expires in 1 hour):
{reset_link}`}</pre>
            </div>
          </div>
        </div>
      </div>

      {previewOpen && (
        <div className="modal-overlay">
          <div className="notification-preview-modal">
            <h3>Saved Notification Preview</h3>

            <div className="notification-preview-list">
              <p>
                <strong>Frequency:</strong> {settings.frequency}
              </p>
              <p>
                <strong>Quiet Hours:</strong>{" "}
                {settings.quietHours.enabled
                  ? `${settings.quietHours.from} to ${settings.quietHours.to}`
                  : "Disabled"}
              </p>
              <p>
                <strong>Low Stock Limit:</strong>{" "}
                {settings.thresholds.lowStockLimit}
              </p>
              <p>
                <strong>Pending Payment Alert:</strong>{" "}
                {settings.thresholds.pendingPaymentHours} hours
              </p>
              <p>
                <strong>Failed Login Limit:</strong>{" "}
                {settings.thresholds.failedLoginAttempts}
              </p>
            </div>

            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={() => setPreviewOpen(false)}
              >
                Close
              </button>

              <button className="btn-primary" onClick={handleSave}>
                <FaSave /> Save Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="settings-toast">{toast}</div>}

      <div className="saved-notification-preview">
        <h3>Saved Settings</h3>
        <p>
          <strong>Frequency:</strong> {savedSettings.frequency}
        </p>
        <p>
          <strong>Quiet Hours:</strong>{" "}
          {savedSettings.quietHours.enabled
            ? `${savedSettings.quietHours.from} to ${savedSettings.quietHours.to}`
            : "Disabled"}
        </p>
        <p>
          <strong>Low Stock Alert Limit:</strong>{" "}
          {savedSettings.thresholds.lowStockLimit}
        </p>
      </div>
    </div>
  );
}

export default NotificationSettings;