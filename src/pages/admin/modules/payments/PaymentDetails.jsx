import { Link, useParams } from "react-router-dom";

function PaymentDetails() {

  const { id } = useParams();

  return (
    <div className="page-container">

      <div className="page-header">

        <h2>Payment Details</h2>

      </div>

      <div className="details-card">

        <p><strong>Payment ID:</strong> {id}</p>

        <p><strong>Order ID:</strong> ORD-001</p>

        <p><strong>Customer:</strong> Kunal Patil</p>

        <p><strong>Method:</strong> Card</p>

        <p><strong>Status:</strong> Verified</p>

        <p><strong>Transaction ID:</strong> TXN-12345</p>

      </div>

      <div className="details-card">

        <h3>Associated Order</h3>

        <Link
          to="/admin/orders/ORD-001"
          className="primary-btn"
        >
          View Order
        </Link>

      </div>

      <div className="details-card">

        <h3>Refund History</h3>

        <ul className="timeline">

          <li>
            2026-05-01 → Payment Verified
          </li>

          <li>
            2026-05-02 → Refund Requested
          </li>

        </ul>

      </div>

    </div>
  );
}

export default PaymentDetails;