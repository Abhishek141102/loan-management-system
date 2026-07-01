import { useState } from "react";
import {
  FaSave,
  FaUndo,
  FaUpload,
  FaEye,
  FaBuilding,
  FaGlobe,
  FaPalette,
} from "react-icons/fa";

function GeneralSettings() {
  const defaultSettings = {
    companyName: "I Rasa Perfumes",
    email: "support@irasaperfumes.in",
    phone: "+91 9823833303",
    address: "Nashik, Maharashtra, India",
    websiteUrl: "https://irasaperfumes.in",
    currency: "INR ₹",
    timezone: "Asia/Kolkata",
    primaryColor: "#d4af37",
    secondaryColor: "#0f0f0f",
    logo: "",
    favicon: "",
  };

  const [settings, setSettings] = useState(defaultSettings);
  const [savedSettings, setSavedSettings] = useState(defaultSettings);
  const [toast, setToast] = useState("");

  const showToast = (message) => {
    setToast(message);

    setTimeout(() => {
      setToast("");
    }, 2200);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if ((name === "logo" || name === "favicon") && files[0]) {
      const imageUrl = URL.createObjectURL(files[0]);

      setSettings({
        ...settings,
        [name]: imageUrl,
      });

      return;
    }

    setSettings({
      ...settings,
      [name]: value,
    });
  };

  const handleSave = (e) => {
    e.preventDefault();

    setSavedSettings(settings);
    showToast("Settings saved successfully!");
  };

  const handleReset = () => {
    const confirmReset = window.confirm(
      "Are you sure you want to reset all settings?"
    );

    if (confirmReset) {
      setSettings(defaultSettings);
      setSavedSettings(defaultSettings);
      showToast("Settings reset successfully!");
    }
  };

  const handlePreview = () => {
    alert(
      `Company: ${settings.companyName}\nWebsite: ${settings.websiteUrl}\nCurrency: ${settings.currency}\nTimezone: ${settings.timezone}`
    );
  };

  return (
    <div className="general-settings-page">
      <div className="settings-page-header">
        <div>
          <h1>General Settings</h1>
          <p>
            Manage company information, website details, branding, currency and
            timezone.
          </p>
        </div>

        <div className="settings-header-actions">
          <button className="btn-secondary" onClick={handlePreview}>
            <FaEye /> Preview
          </button>

          <button className="btn-danger" onClick={handleReset}>
            <FaUndo /> Reset
          </button>
        </div>
      </div>

      <form onSubmit={handleSave}>
        <div className="settings-grid-pro">
          {/* COMPANY INFO */}
          <div className="settings-card-pro">
            <h3>
              <FaBuilding /> Company Information
            </h3>

            <div className="settings-form-grid">
              <div className="settings-input-group">
                <label>Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  value={settings.companyName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="settings-input-group">
                <label>Support Email</label>
                <input
                  type="email"
                  name="email"
                  value={settings.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="settings-input-group">
                <label>Contact Number</label>
                <input
                  type="text"
                  name="phone"
                  value={settings.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="settings-input-group">
                <label>Website URL</label>
                <input
                  type="url"
                  name="websiteUrl"
                  value={settings.websiteUrl}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="settings-input-group full-width">
              <label>Company Address</label>
              <textarea
                name="address"
                value={settings.address}
                onChange={handleChange}
                rows="3"
              ></textarea>
            </div>
          </div>

          {/* REGIONAL SETTINGS */}
          <div className="settings-card-pro">
            <h3>
              <FaGlobe /> Regional Settings
            </h3>

            <div className="settings-form-grid">
              <div className="settings-input-group">
                <label>Currency</label>
                <select
                  name="currency"
                  value={settings.currency}
                  onChange={handleChange}
                >
                  <option>INR ₹</option>
                  <option>USD $</option>
                  <option>EUR €</option>
                  <option>GBP £</option>
                </select>
              </div>

              <div className="settings-input-group">
                <label>Timezone</label>
                <select
                  name="timezone"
                  value={settings.timezone}
                  onChange={handleChange}
                >
                  <option>Asia/Kolkata</option>
                  <option>Asia/Dubai</option>
                  <option>Europe/London</option>
                  <option>America/New_York</option>
                </select>
              </div>
            </div>
          </div>

          {/* BRANDING */}
          <div className="settings-card-pro">
            <h3>
              <FaPalette /> Brand Settings
            </h3>

            <div className="settings-form-grid">
              <div className="settings-input-group">
                <label>Primary Gold Color</label>
                <input
                  type="color"
                  name="primaryColor"
                  value={settings.primaryColor}
                  onChange={handleChange}
                />
              </div>

              <div className="settings-input-group">
                <label>Secondary Black Color</label>
                <input
                  type="color"
                  name="secondaryColor"
                  value={settings.secondaryColor}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div
              className="brand-preview-box"
              style={{
                background: settings.secondaryColor,
                borderColor: settings.primaryColor,
              }}
            >
              <h2 style={{ color: settings.primaryColor }}>
                {settings.companyName}
              </h2>
              <p>Luxury Black & Gold Theme Preview</p>
            </div>
          </div>

          {/* LOGO UPLOAD */}
          <div className="settings-card-pro">
            <h3>
              <FaUpload /> Logo & Favicon Upload
            </h3>

            <div className="upload-grid">
              <div className="upload-box">
                <label>Company Logo</label>

                {settings.logo ? (
                  <img src={settings.logo} alt="Company Logo" />
                ) : (
                  <div className="upload-placeholder">Logo Preview</div>
                )}

                <input
                  type="file"
                  name="logo"
                  accept="image/*"
                  onChange={handleChange}
                />
              </div>

              <div className="upload-box">
                <label>Favicon</label>

                {settings.favicon ? (
                  <img src={settings.favicon} alt="Favicon" />
                ) : (
                  <div className="upload-placeholder">Favicon Preview</div>
                )}

                <input
                  type="file"
                  name="favicon"
                  accept="image/*"
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="settings-bottom-actions">
          <button type="button" className="btn-secondary" onClick={handleReset}>
            Reset All
          </button>

          <button type="submit" className="btn-primary">
            <FaSave /> Save Settings
          </button>
        </div>
      </form>

      {toast && <div className="settings-toast">{toast}</div>}

      <div className="saved-settings-preview">
        <h3>Saved Settings Preview</h3>

        <p>
          <strong>Company:</strong> {savedSettings.companyName}
        </p>
        <p>
          <strong>Email:</strong> {savedSettings.email}
        </p>
        <p>
          <strong>Phone:</strong> {savedSettings.phone}
        </p>
        <p>
          <strong>Website:</strong> {savedSettings.websiteUrl}
        </p>
        <p>
          <strong>Currency:</strong> {savedSettings.currency}
        </p>
        <p>
          <strong>Timezone:</strong> {savedSettings.timezone}
        </p>
      </div>
    </div>
  );
}

export default GeneralSettings;