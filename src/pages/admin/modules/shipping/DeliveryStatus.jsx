import { useState } from "react";
import { FaUndo, FaTruck, FaCheckCircle } from "react-icons/fa";

function DeliveryStatus() {
  const [filter, setFilter] = useState("All");
  const [toast, setToast] = useState("");

  const [shipments, setShipments] = useState([
    {
      id: 1,
      orderId: "ORD-001",
      trackingNumber: "TRK123456",
      customer: "Sneha Patil",
      carrier: "BlueDart",
      status: "Delivered",
      date: "2026-05-08",
    },
    {
      id: 2,
      orderId: "ORD-002",
      trackingNumber: "TRK987654",
      customer: "Rahul Sharma",
      carrier: "Delhivery",
      status: "In Transit",
      date: "2026-05-09",
    },
    {
      id: 3,
      orderId: "ORD-003",
      trackingNumber: "TRK456789",
      customer: "Priya Deshmukh",
      carrier: "DTDC",
      status: "Failed Delivery",
      date: "2026-05-10",
    },
  ]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  };

  const updateStatus = (id, status) => {
    setShipments(
      shipments.map((shipment) =>
        shipment.id === id ? { ...shipment, status } : shipment
      )
    );

    showToast("Delivery status updated!");
  };

  const processRTO = (id) => {
    const confirmRto = window.confirm("Start Return/RTO process?");

    if (confirmRto) {
      updateStatus(id, "RTO Processing");
      showToast("RTO process started!");
    }
  };

  const filteredShipments =
    filter === "All"
      ? shipments
      : shipments.filter((shipment) => shipment.status === filter);

  return (
    <div className="shipping-page">
      <div className="shipping-header">
        <div>
          <h1>Delivery Status</h1>
          <p>
            View shipments by status, update delivery status and manage
            return/RTO processing.
          </p>
        </div>
      </div>

      <div className="shipping-filter-box">
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option>All</option>
          <option>Pending</option>
          <option>In Transit</option>
          <option>Out for Delivery</option>
          <option>Delivered</option>
          <option>Failed Delivery</option>
          <option>RTO Processing</option>
        </select>
      </div>

      <div className="table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Tracking No.</th>
              <th>Customer</th>
              <th>Carrier</th>
              <th>Status</th>
              <th>Date</th>
              <th>Manual Update</th>
              <th>RTO</th>
            </tr>
          </thead>

          <tbody>
            {filteredShipments.map((shipment) => (
              <tr key={shipment.id}>
                <td>{shipment.orderId}</td>
                <td>{shipment.trackingNumber}</td>
                <td>{shipment.customer}</td>
                <td>{shipment.carrier}</td>
                <td>
                  <span
                    className={
                      shipment.status === "Delivered"
                        ? "report-badge success"
                        : shipment.status === "Failed Delivery"
                        ? "report-badge danger"
                        : shipment.status === "RTO Processing"
                        ? "report-badge warning"
                        : "report-badge info"
                    }
                  >
                    {shipment.status}
                  </span>
                </td>
                <td>{shipment.date}</td>
                <td>
                  <select
                    className="table-input"
                    value={shipment.status}
                    onChange={(e) => updateStatus(shipment.id, e.target.value)}
                  >
                    <option>Pending</option>
                    <option>In Transit</option>
                    <option>Out for Delivery</option>
                    <option>Delivered</option>
                    <option>Failed Delivery</option>
                    <option>RTO Processing</option>
                  </select>
                </td>
                <td>
                  <button
                    className="icon-btn edit"
                    onClick={() => processRTO(shipment.id)}
                  >
                    <FaUndo />
                  </button>

                  <button
                    className="icon-btn view"
                    onClick={() => updateStatus(shipment.id, "Delivered")}
                  >
                    <FaCheckCircle />
                  </button>

                  <button
                    className="icon-btn view"
                    onClick={() => updateStatus(shipment.id, "In Transit")}
                  >
                    <FaTruck />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {toast && <div className="settings-toast">{toast}</div>}
    </div>
  );
}

export default DeliveryStatus;