import React from "react";

function ConfirmModal({ title, message, onCancel, onConfirm }) {
  return (
    <div className="modal-overlay">
      <div className="admin-modal">
        <h3>{title}</h3>
        <p>{message}</p>

        <div className="modal-actions">
          <button className="btn-secondary" onClick={onCancel}>Cancel</button>
          <button className="btn-danger" onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;