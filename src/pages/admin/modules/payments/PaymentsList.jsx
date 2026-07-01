import { Link } from "react-router-dom";
import { useState } from "react";

import Toast from "../../../../components/notifications/Toast";
import { FaEye, FaCheck, FaFileInvoice } from "react-icons/fa";

function PaymentsList() {
  const payments = [
    {
      id: "PAY-001",
      orderId: "ORD-001",
      customer: "Kunal Patil",
      amount: "₹1,500",
      method: "Card",
      status: "Verified",
      date: "2026-05-01",
    },

    {
      id: "PAY-002",
      orderId: "ORD-002",
      customer: "Rahul Sharma",
      amount: "₹850",
      method: "UPI",
      status: "Pending",
      date: "2026-05-02",
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

  const verifySelectedPayments = () => {
    showToast("Selected payments verified successfully!", "success");
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Payments Management</h2>

        <button className="primary-btn" onClick={verifySelectedPayments}>
          Verify Selected Payments
        </button>
      </div>

      {/* FILTERS */}

      <div className="filter-box">
        <select>
          <option>Status</option>
          <option>Pending</option>
          <option>Verified</option>
          <option>Failed</option>
          <option>Refunded</option>
        </select>

        <select>
          <option>Method</option>
          <option>Card</option>
          <option>UPI</option>
          <option>Bank Transfer</option>
          <option>Wallet</option>
          <option>COD</option>
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
              <th>
                <input type="checkbox" />
              </th>

              <th>Payment ID</th>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td>
                  <input type="checkbox" />
                </td>

                <td className="order-id">{payment.id}</td>

                <td>{payment.orderId}</td>

                <td>{payment.customer}</td>

                <td className="amount-text">{payment.amount}</td>

                <td>{payment.method}</td>

                <td>
                  <span
                    className={`status-badge status-${payment.status.toLowerCase()}`}
                  >
                    {payment.status}
                  </span>
                </td>

                <td>{payment.date}</td>

                <td>
                  <div className="table-actions">
                    <Link
                      to={`/admin/payments/${payment.id}`}
                      className="icon-btn view"
                    >
                      <FaEye />
                    </Link>

                    <Link to="/admin/payments/verify" className="icon-btn edit">
                      <FaCheck />
                    </Link>

                    <button className="icon-btn invoice">
                      <FaFileInvoice />
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

export default PaymentsList;
