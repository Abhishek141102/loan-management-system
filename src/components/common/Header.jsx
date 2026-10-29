import { useCallback, useEffect, useRef, useState } from "react";
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
import API from "../../services/api.js";

// Role ko readable label mein convert karo
const ROLE_LABELS = {
  superadmin: "Super Administrator",
  admin:      "System Administrator",
  manager:    "Manager",
  qa:         "QA User",
};

function Header({ setSidebarOpen, globalSearch, setGlobalSearch }) {
  const navigate = useNavigate();
  const { user, logout, permissions, loadingPermissions } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notificationsLoading, setNotificationsLoading] = useState(true);
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

  const loadNotifications = useCallback(async () => {
    const sources = [
      (user?.role === "superadmin" || permissions.enquiries?.can_view === 1) && {
        module: "enquiries",
        path: "/admin/enquiries",
        label: "New enquiry",
        request: API.get("/enquiries?page=1&limit=5&status=New"),
        getMessage: (item) => `${item.full_name || "A customer"} submitted a ${item.loan_type || "loan"} enquiry`,
      },
      (user?.role === "superadmin" || permissions.approval?.can_view === 1) && {
        module: "approval",
        path: "/admin/approval",
        label: "Ready for approval",
        request: API.get("/approvals?page=1&limit=5&status=Ready"),
        getMessage: (item) => `${item.loan_code || "Loan application"} • ${item.applicant_name || "Applicant"}`,
      },
      (user?.role === "superadmin" || permissions.documents?.can_view === 1) && {
        module: "documents",
        path: "/admin/documents",
        label: "Document verification",
        request: API.get("/documents?page=1&limit=5&status=Under Verification"),
        getMessage: (item) => `${item.document_name || "Document"} • ${item.customer || item.loan_code || "Loan"}`,
      },
    ].filter(Boolean);

    if (!sources.length) {
      setNotifications([]);
      setNotificationCount(0);
      setNotificationsLoading(false);
      return;
    }

    setNotificationsLoading(true);
    const results = await Promise.allSettled(sources.map((source) => source.request));
    const nextNotifications = [];
    let nextCount = 0;

    results.forEach((result, index) => {
      if (result.status !== "fulfilled") return;
      const source = sources[index];
      const payload = result.value.data;
      const items = payload.data || [];
      nextCount += Number(payload.pagination?.total ?? items.length);
      items.forEach((item) => {
        nextNotifications.push({
          id: `${source.module}-${item.id || item.application_id || item.loan_code}`,
          path: source.path,
          label: source.label,
          message: source.getMessage(item),
        });
      });
    });

    setNotifications(nextNotifications);
    setNotificationCount(nextCount);
    setNotificationsLoading(false);
  }, [permissions, user?.role]);

  useEffect(() => {
    if (loadingPermissions) return;
    loadNotifications();
    const timer = window.setInterval(loadNotifications, 60000);
    return () => window.clearInterval(timer);
  }, [loadNotifications, loadingPermissions, permissions]);

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
          placeholder="Search this section..."
          value={globalSearch}
          onChange={(e) => setGlobalSearch(e.target.value)}
        />
      </div>

      <div className="header-actions">
        <div className="notification-wrapper">
          <button
            className="notification-btn"
            type="button"
            onClick={() => {
              const opening = !showNotifications;
              setShowNotifications(opening);
              if (opening) loadNotifications();
            }}
          >
            <FaBell />
            {notificationCount > 0 && <span>{notificationCount > 99 ? "99+" : notificationCount}</span>}
          </button>

          {showNotifications && (
            <div className="notification-dropdown">
              <div className="notification-dropdown-heading">
                <h4>Notifications</h4>
                <button type="button" onClick={loadNotifications}>Refresh</button>
              </div>
              {notificationsLoading ? (
                <p className="notification-empty">Loading updates…</p>
              ) : notifications.length ? (
                notifications.map((notification) => (
                  <button
                    className="notification-item"
                    key={notification.id}
                    type="button"
                    onClick={() => {
                      setShowNotifications(false);
                      navigate(notification.path);
                    }}
                  >
                    <p>{notification.message}</p>
                    <small>{notification.label} · Open section</small>
                  </button>
                ))
              ) : (
                <p className="notification-empty">No items need attention right now.</p>
              )}
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
