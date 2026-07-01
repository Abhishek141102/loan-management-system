import React from "react";

function StatCard({ title, value, icon, trend }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>

      <div>
        <p>{title}</p>
        <h3>{value}</h3>
        <span>{trend}</span>
      </div>
    </div>
  );
}

export default StatCard;