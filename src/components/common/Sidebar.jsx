import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaBars, FaChartBar, FaCheckCircle, FaCog,
  FaEnvelopeOpenText, FaFileAlt, FaHome,
  FaTimes, FaUsers, FaWallet, FaUserShield,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const [collapsed, setCollapsed] = useState(false);
  const { canView, user } = useAuth();

  const closeMobileSidebar = () => { if (setSidebarOpen) setSidebarOpen(false); };

  const allMenuItems = [
    { path: "/admin/dashboard",    label: "Dashboard",       icon: <FaHome />,             module: "dashboard" },
    { path: "/admin/enquiries",    label: "Loan Enquiries",  icon: <FaEnvelopeOpenText />, module: "enquiries" },
    { path: "/admin/applications", label: "Applications",    icon: <FaWallet />,           module: "applications" },
    { path: "/admin/documents",    label: "Documents",       icon: <FaFileAlt />,          module: "documents" },
    { path: "/admin/approval",     label: "Loan Approval",   icon: <FaCheckCircle />,      module: "approval" },
    { path: "/admin/customers",    label: "Customers",       icon: <FaUsers />,            module: "customers" },
    { path: "/admin/reports",      label: "Reports",         icon: <FaChartBar />,         module: "reports" },
    { path: "/admin/settings",     label: "Settings",        icon: <FaCog />,              module: "settings" },
    { path: "/admin/users",        label: "User Management", icon: <FaUserShield />,       module: "user_management" },
  ];

  const visibleItems = allMenuItems.filter((item) => canView(item.module));

  return (
    <aside className={`admin-sidebar ${sidebarOpen ? "active" : ""} ${collapsed ? "collapsed" : ""}`}>
      <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>
        <FaTimes />
      </button>

      <div className="sidebar-logo">
        <h2>{collapsed ? "IL" : "I LOAN"}</h2>
        <button type="button" className="sidebar-collapse-btn" onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}>
          <FaBars />
        </button>
      </div>

      {!collapsed && user?.role && (
        <div style={{ padding:"6px 16px", marginBottom:"8px", fontSize:"11px", color:"#aaa", textTransform:"uppercase", letterSpacing:"1px" }}>
          🔐 {user.role}
        </div>
      )}

      <nav className="sidebar-menu">
        {visibleItems.map((item) => (
          <NavLink key={item.path} to={item.path} title={item.label}
            className={({ isActive }) => (isActive ? "active-link" : "")}
            onClick={closeMobileSidebar}>
            {item.icon}
            <span className="sidebar-text">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
