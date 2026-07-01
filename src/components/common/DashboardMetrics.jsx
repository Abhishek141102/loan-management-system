import React from "react";
import { FaShoppingCart, FaRupeeSign, FaUsers, FaClock } from "react-icons/fa";
import StatCard from "./StatCard";

function DashboardMetrics() {
  return (
    <div className="metrics-grid">
      <StatCard title="Total Orders" value="245" trend="+12%" icon={<FaShoppingCart />} />
      <StatCard title="Revenue" value="₹82,500" trend="+18%" icon={<FaRupeeSign />} />
      <StatCard title="Customers" value="1,240" trend="+9%" icon={<FaUsers />} />
      <StatCard title="Pending Orders" value="18" trend="Needs Action" icon={<FaClock />} />
    </div>
  );
}

export default DashboardMetrics;