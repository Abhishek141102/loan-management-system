import { useEffect, useRef, useState } from "react";
import {
  FaBars,
  FaBell,
  FaSearch,
  FaSignOutAlt,
  FaUserCircle,
  FaEnvelope,
  FaPhoneAlt,
  FaCog,
  FaUserShield,
  FaChevronDown,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// Role ko readable label mein convert karo
const ROLE_LABELS = {
  superadmin: "Super Administrator",
  admin:      "System Administrator",
  manager:    "Manager",
  qa:         "QA User",
};

function Header({ setSidebarOpen, globalSearch, setGlobalSearch }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const adminRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  const handleSettings = () => {
    setAdminOpen(false);
    navigate("/admin/settings");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (adminRef.current && !adminRef.current.contains(event.target)) {
        setAdminOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // AuthContext se real user data
  const displayName  = user?.name  || "User";
  const displayEmail = user?.email || "-";
  const displayRole  = ROLE_LABELS[user?.role] || user?.role || "-";
  const displayRoleRaw = user?.role || "";

  return (
    <header className="admin-header">
      <button
        className="menu-btn"
        type="button"
        onClick={() => setSidebarOpen(true)}
      >
        <FaBars />
      </button>

      <div className="search-box">
        <FaSearch />
        <input
          type="text"
          placeholder="Search..."
          value={globalSearch}
          onChange={(e) => setGlobalSearch(e.target.value)}
        />
      </div>

      <div className="header-actions">
        <div className="notification-wrapper">
          <button
            className="notification-btn"
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <FaBell />
            <span>4</span>
          </button>

          {showNotifications && (
            <div className="notification-dropdown">
              <h4>Notifications</h4>
              <div className="notification-item">
                <p>New loan enquiry received from Rahul Sharma</p>
                <small>2 min ago</small>
              </div>
              <div className="notification-item">
                <p>Document verification pending for LOAN-502</p>
                <small>10 min ago</small>
              </div>
              <div className="notification-item">
                <p>Loan approved for Priya Deshmukh</p>
                <small>30 min ago</small>
              </div>
              <div className="notification-item">
                <p>Customer uploaded Aadhaar document</p>
                <small>1 hour ago</small>
              </div>
            </div>
          )}
        </div>

        {/* Admin Profile Section */}
        <div className="admin-profile-wrapper" ref={adminRef}>
          <button
            type="button"
            className={`admin-user ${adminOpen ? "active" : ""}`}
            onClick={() => setAdminOpen(!adminOpen)}
          >
            <FaUserCircle className="admin-avatar-icon" />
            <div className="admin-user-text">
              <strong>{displayName}</strong>
              <small>I Loan</small>
            </div>
            <FaChevronDown
              className={`admin-chevron ${adminOpen ? "rotate" : ""}`}
            />
          </button>

          {adminOpen && (
            <div className="admin-details-dropdown">
              <div className="admin-details-top">
                <div className="admin-big-avatar">
                  <FaUserCircle />
                </div>
                <div>
                  <h3>{displayName}</h3>
                  <p>I Loan Admin Panel</p>
                  <span>Active</span>
                </div>
              </div>

              <div className="admin-details-info">
                <div className="admin-info-row">
                  <FaUserShield />
                  <div>
                    <small>Role</small>
                    <strong>{displayRole}</strong>
                  </div>
                </div>

                <div className="admin-info-row">
                  <FaEnvelope />
                  <div>
                    <small>Email</small>
                    <strong>{displayEmail}</strong>
                  </div>
                </div>

              </div>

              <div className="admin-dropdown-actions">
                <button type="button" onClick={handleSettings}>
                  <FaCog />
                  Settings
                </button>
                <button
                  type="button"
                  className="dropdown-logout-btn"
                  onClick={handleLogout}
                >
                  <FaSignOutAlt />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>

        <button className="logout-btn" type="button" onClick={handleLogout}>
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}

export default Header;