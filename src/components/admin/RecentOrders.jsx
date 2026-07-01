import React from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "../tables/DataTable";

function RecentOrders() {
  const navigate = useNavigate();

  const columns = ["Order ID", "Customer", "Amount", "Payment", "Status"];

  const data = [
    {
      orderId: "ORD-001",
      customer: "Sneha Patil",
      amount: "₹999",
      payment: "Verified",
      status: "Delivered",
    },
    {
      orderId: "ORD-002",
      customer: "Rahul Sharma",
      amount: "₹899",
      payment: "Pending",
      status: "Processing",
    },
    {
      orderId: "ORD-003",
      customer: "Priya Deshmukh",
      amount: "₹1199",
      payment: "Verified",
      status: "Shipped",
    },
  ];

  return (
    <div className="recent-orders">
      <div className="section-header">
        <h3>Recent Orders</h3>

        <button onClick={() => navigate("/admin/orders")}>
          View All
        </button>
      </div>

      <DataTable columns={columns} data={data} />
    </div>
  );
}

export default RecentOrders;