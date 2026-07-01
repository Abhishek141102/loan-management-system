import React, { useEffect } from "react";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaTimes,
} from "react-icons/fa";

function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  const getIcon = () => {
    if (type === "success") return <FaCheckCircle />;
    if (type === "error") return <FaTimesCircle />;
    if (type === "warning") return <FaExclamationTriangle />;
    return <FaInfoCircle />;
  };

  return (
    <div className={`toast-box ${type}`}>
      <div className="toast-icon">{getIcon()}</div>

      <p>{message}</p>

      <button className="toast-close" onClick={onClose}>
        <FaTimes />
      </button>
    </div>
  );
}

export default Toast;