import { useState } from "react";
import {
  FaSearch,
  FaTruck,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";

function ShipmentTracking() {
  const [query, setQuery] = useState("");
  const [shipment, setShipment] = useState(null);
  const [toast, setToast] = useState("");

  const shipments = [
    {
      orderId: "ORD-001",
      trackingNumber: "TRK123456",
      customer: "Sneha Patil",
      carrier: "BlueDart",
      status: "In Transit",
      estimatedDelivery: "2026-05-12",
      location: "Pune Hub",
      failedReason: "",
      timeline: [
        "Order packed",
        "Picked by carrier",
        "Reached Pune Hub",
        "Out for next transit",
      ],
    },
    {
      orderId: "ORD-002",
      trackingNumber: "TRK987654",
      customer: "Rahul Sharma",
      carrier: "Delhivery",
      status: "Failed Delivery",
      estimatedDelivery: "2026-05-10",
      location: "Nashik",
      failedReason: "Customer unavailable",
      timeline: ["Order packed", "Out for delivery", "Delivery failed"],
    },
  ];

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  };

  const searchShipment = () => {
    const found = shipments.find(
      (item) =>
        item.orderId.toLowerCase() === query.toLowerCase() ||
        item.trackingNumber.toLowerCase() === query.toLowerCase()
    );

    if (found) {
      setShipment(found);
      showToast("Shipment found successfully!");
    } else {
      setShipment(null);
      showToast("No shipment found!");
    }
  };

  const markReattempt = () => {
    if (!shipment) return;

    setShipment({
      ...shipment,
      status: "Reattempt Scheduled",
      failedReason: "",
      timeline: ["Reattempt scheduled", ...shipment.timeline],
    });

    showToast("Delivery reattempt scheduled!");
  };

  const markReturned = () => {
    if (!shipment) return;

    setShipment({
      ...shipment,
      status: "RTO Processing",
      timeline: ["RTO process started", ...shipment.timeline],
    });

    showToast("Shipment moved to RTO processing!");
  };

  const getDaysLeft = (date) => {
    const today = new Date();
    const deliveryDate = new Date(date);
    const diff = deliveryDate - today;
    return Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)), 0);
  };

  return (
    <div className="shipping-page">
      <div className="shipping-header">
        <div>
          <h1>Shipment Tracking</h1>
          <p>
            Search shipments by Order ID or Tracking Number and manage delivery
            workflow.
          </p>
        </div>
      </div>

      <div className="shipping-search-box">
        <div className="shipping-search-input">
          <FaSearch />
          <input
            type="text"
            placeholder="Enter Order ID or Tracking Number e.g. ORD-001 / TRK123456"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <button className="btn-primary" onClick={searchShipment}>
          Track Shipment
        </button>
      </div>

      {shipment && (
        <>
          <div className="shipment-summary-grid">
            <div className="shipment-card">
              <FaTruck />
              <p>Status</p>
              <h3>{shipment.status}</h3>
            </div>

            <div className="shipment-card">
              <FaClock />
              <p>Estimated Delivery</p>
              <h3>{getDaysLeft(shipment.estimatedDelivery)} Days Left</h3>
            </div>

            <div className="shipment-card">
              <FaCheckCircle />
              <p>Carrier</p>
              <h3>{shipment.carrier}</h3>
            </div>

            <div className="shipment-card">
              <FaExclamationTriangle />
              <p>Current Location</p>
              <h3>{shipment.location}</h3>
            </div>
          </div>

          <div className="shipment-detail-grid">
            <div className="shipping-section">
              <h3>Shipment Details</h3>

              <p>
                <strong>Order ID:</strong> {shipment.orderId}
              </p>
              <p>
                <strong>Tracking Number:</strong> {shipment.trackingNumber}
              </p>
              <p>
                <strong>Customer:</strong> {shipment.customer}
              </p>
              <p>
                <strong>Carrier:</strong> {shipment.carrier}
              </p>
              <p>
                <strong>Status:</strong> {shipment.status}
              </p>
              <p>
                <strong>Estimated Delivery:</strong>{" "}
                {shipment.estimatedDelivery}
              </p>

              {shipment.failedReason && (
                <p>
                  <strong>Failed Reason:</strong> {shipment.failedReason}
                </p>
              )}

              {shipment.status === "Failed Delivery" && (
                <div className="shipping-actions">
                  <button className="btn-primary" onClick={markReattempt}>
                    Schedule Reattempt
                  </button>

                  <button className="btn-danger" onClick={markReturned}>
                    Start RTO
                  </button>
                </div>
              )}
            </div>

            <div className="shipping-section">
              <h3>Shipment Timeline</h3>

              <div className="shipment-timeline">
                {shipment.timeline.map((item, index) => (
                  <div className="timeline-item" key={index}>
                    <span></span>
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {toast && <div className="settings-toast">{toast}</div>}
    </div>
  );
}

export default ShipmentTracking;