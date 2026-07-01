import { Link } from "react-router-dom";
import { FaEye, FaEdit, FaFileInvoice, FaTrash } from "react-icons/fa";
import { useState } from "react";

import Toast from "../../../../components/notifications/Toast";

function OrdersList() {
  const orders = [
    {
      id: "ORD-001",
      date: "2026-05-01",
      customer: "Kunal Patil",
      items: 3,
      amount: "₹1,317",
      payment: "Verified",
      status: "Shipped",
    },

    {
      id: "ORD-002",
      date: "2026-05-02",
      customer: "Rahul Sharma",
      items: 2,
      amount: "₹899",
      payment: "Pending",
      status: "Pending",
    },
  ];

  const [toast, setToast] = useState({
    message: "",
    type: "success",
  });

  const showToast = (message, type = "success") => {
    setToast({
      message,
      type,
    });
  };

  const deleteOrder = (id) => {
    if (window.confirm("Delete this order?")) {
      showToast("Order deleted successfully!", "success");
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Orders Management</h2>

        <Link to="/admin/orders/create" className="primary-btn">
          + Create Order
        </Link>
      </div>

      {/* FILTERS */}
      <div className="filter-box">
        <select>
          <option>Order Status</option>
          <option>Pending</option>
          <option>Confirmed</option>
          <option>Shipped</option>
          <option>Delivered</option>
        </select>

        <select>
          <option>Payment Status</option>
          <option>Pending</option>
          <option>Verified</option>
          <option>Failed</option>
        </select>

        <input type="number" placeholder="₹ From" />
        <input type="number" placeholder="₹ To" />

        <input type="date" />
        <input type="date" />
      </div>

      {/* TABLE */}
      <div className="table-wrapper table-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Amount</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="order-id">{order.id}</td>
                <td>{order.date}</td>
                <td>{order.customer}</td>
                <td>{order.items}</td>
                <td className="amount-text">{order.amount}</td>

                <td>
                  <span
                    className={`status-badge status-${order.payment.toLowerCase()}`}
                  >
                    {order.payment}
                  </span>
                </td>

                <td>
                  <span
                    className={`status-badge status-${order.status.toLowerCase()}`}
                  >
                    {order.status}
                  </span>
                </td>

                <td>
                  <div className="table-actions">
                    <Link
                      to={`/admin/orders/${order.id}`}
                      className="icon-btn view"
                      title="View Order"
                    >
                      <FaEye />
                    </Link>

                    <Link
                      to={`/admin/orders/edit/${order.id}`}
                      className="icon-btn edit"
                    >
                      <FaEdit />
                    </Link>

                    <button
                      className="icon-btn invoice"
                      title="Generate Invoice"
                    >
                      <FaFileInvoice />
                    </button>

                    <button
                      className="icon-btn delete"
                      title="Delete Order"
                      onClick={() => deleteOrder(order.id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() =>
          setToast({
            message: "",
            type: "success",
          })
        }
      />
    </div>
  );
}

export default OrdersList;
