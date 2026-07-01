import React, { useState } from "react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

function OrderTable() {
  const [orders, setOrders] = useState([
    {
      id: "ORD-001",
      customer: "Sneha Patil",
      amount: "₹999",
      payment: "Verified",
      status: "Delivered",
      phone: "9876543210",
      address: "Nashik, Maharashtra",
    },
    {
      id: "ORD-002",
      customer: "Rahul Sharma",
      amount: "₹899",
      payment: "Pending",
      status: "Processing",
      phone: "9876543211",
      address: "Pune, Maharashtra",
    },
    {
      id: "ORD-003",
      customer: "Priya Deshmukh",
      amount: "₹1199",
      payment: "Verified",
      status: "Shipped",
      phone: "9876543212",
      address: "Mumbai, Maharashtra",
    },
  ]);

  const [modalType, setModalType] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [formData, setFormData] = useState({
    customer: "",
    amount: "",
    payment: "",
    status: "",
    phone: "",
    address: "",
  });

  const openViewModal = (order) => {
    setSelectedOrder(order);
    setModalType("view");
  };

  const openEditModal = (order) => {
    setSelectedOrder(order);
    setFormData({
      customer: order.customer,
      amount: order.amount,
      payment: order.payment,
      status: order.status,
      phone: order.phone,
      address: order.address,
    });
    setModalType("edit");
  };

  const closeModal = () => {
    setModalType("");
    setSelectedOrder(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateOrder = (e) => {
    e.preventDefault();

    setOrders(
      orders.map((order) =>
        order.id === selectedOrder.id ? { ...order, ...formData } : order
      )
    );

    closeModal();
  };

  const handleDeleteOrder = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this order?"
    );

    if (confirmDelete) {
      setOrders(orders.filter((order) => order.id !== id));
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Delivered":
        return "status delivered";
      case "Processing":
        return "status processing";
      case "Shipped":
        return "status shipped";
      default:
        return "status processing";
    }
  };

  const getPaymentClass = (payment) => {
    return payment === "Verified" ? "payment verified" : "payment pending";
  };

  return (
    <>
      <div className="table-card">
        <div className="section-header">
          <h3>Orders Management</h3>
        </div>

        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.customer}</td>
                  <td>{order.amount}</td>

                  <td>
                    <span className={getPaymentClass(order.payment)}>
                      {order.payment}
                    </span>
                  </td>

                  <td>
                    <span className={getStatusClass(order.status)}>
                      {order.status}
                    </span>
                  </td>

                  <td>
                    <button
                      className="icon-btn view"
                      onClick={() => openViewModal(order)}
                    >
                      <FaEye />
                    </button>

                    <button
                      className="icon-btn edit"
                      onClick={() => openEditModal(order)}
                    >
                      <FaEdit />
                    </button>

                    <button
                      className="icon-btn delete"
                      onClick={() => handleDeleteOrder(order.id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalType === "view" && selectedOrder && (
        <div className="modal-overlay">
          <div className="admin-modal product-modal">
            <h3>Order Details</h3>

            <div className="product-details">
              <p><strong>Order ID:</strong> {selectedOrder.id}</p>
              <p><strong>Customer:</strong> {selectedOrder.customer}</p>
              <p><strong>Phone:</strong> {selectedOrder.phone}</p>
              <p><strong>Address:</strong> {selectedOrder.address}</p>
              <p><strong>Amount:</strong> {selectedOrder.amount}</p>
              <p><strong>Payment:</strong> {selectedOrder.payment}</p>
              <p><strong>Status:</strong> {selectedOrder.status}</p>
            </div>

            <div className="modal-actions">
              <button className="btn-secondary" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {modalType === "edit" && selectedOrder && (
        <div className="modal-overlay">
          <div className="admin-modal product-modal">
            <h3>Edit Order</h3>

            <form className="admin-form product-form" onSubmit={handleUpdateOrder}>
              <input
                type="text"
                name="customer"
                placeholder="Customer Name"
                value={formData.customer}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="amount"
                placeholder="Amount e.g. ₹999"
                value={formData.amount}
                onChange={handleChange}
                required
              />

              <select name="payment" value={formData.payment} onChange={handleChange}>
                <option value="Verified">Verified</option>
                <option value="Pending">Pending</option>
              </select>

              <select name="status" value={formData.status} onChange={handleChange}>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={closeModal}>
                  Cancel
                </button>

                <button type="submit" className="btn-primary">
                  Update Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default OrderTable;