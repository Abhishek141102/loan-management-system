function OrderTracking() {

  return (
    <div className="page-container">

      <h2>Order Tracking</h2>

      <div className="details-card">

        <p>
          <strong>Tracking Number:</strong>
          TRK-123456
        </p>

        <p>
          <strong>Carrier:</strong>
          Delhivery
        </p>

        <p>
          <strong>Status:</strong>
          In Transit
        </p>

        <p>
          <strong>Expected Delivery:</strong>
          2026-05-07
        </p>

        <a href="/">
          Track Shipment
        </a>

      </div>

    </div>
  );
}

export default OrderTracking;