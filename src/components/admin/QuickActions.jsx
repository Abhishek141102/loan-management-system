import { useNavigate } from "react-router-dom";
import {
  FaPlus,
  FaFileSignature,
  FaStamp,
  FaEnvelope,
  FaUsers,
  FaFileExport,
} from "react-icons/fa";
import "./QuickActions.css";

function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      icon: <FaPlus />,
      label: "Add Application",
      path: "/admin/applications",
    },
    {
      icon: <FaFileSignature />,
      label: "Verify Documents",
      path: "/admin/documents",
    },
    {
      icon: <FaStamp />,
      label: "Approval Queue",
      path: "/admin/approval",
    },
    {
      icon: <FaEnvelope />,
      label: "Send Email",
      path: "/admin/settings",
    },
    {
      icon: <FaUsers />,
      label: "Customers",
      path: "/admin/customers",
    },
    {
      icon: <FaFileExport />,
      label: "Export Report",
      path: "/admin/reports",
    },
  ];

  return (
    <div className="quick-actions-grid">
      {actions.map((action, index) => (
        <div
          key={index}
          className="quick-action-card"
          onClick={() => navigate(action.path)}
          style={{ cursor: "pointer" }}
        >
          <div className="quick-action-icon">{action.icon}</div>
          <h4>{action.label}</h4>
        </div>
      ))}
    </div>
  );
}

export default QuickActions;