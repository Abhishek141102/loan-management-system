import { useState } from "react";

import { FaCheckCircle, FaTimesCircle, FaEnvelope } from "react-icons/fa";

import receiptImg from "../../../../assets/receipt.jpg";
import Toast from "../../../../components/notifications/Toast";
function VerifyPayment() {
  const [notes, setNotes] = useState("");

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

  const approvePayment = () => {
    showToast("Payment approved successfully!", "success");
  };

  const rejectPayment = () => {
    showToast("Payment rejected!", "error");
  };

  const requestInfo = () => {
    showToast("Request for more information sent!", "success");
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Verify Payment</h2>
      </div>

      <div className="payment-details-grid">
        {/* LEFT */}

        <div className="details-card">
          <h3>Payment Details</h3>

          <p>
            <strong>Payment ID:</strong> PAY-001
          </p>

          <p>
            <strong>Order ID:</strong> ORD-001
          </p>

          <p>
            <strong>Customer:</strong> Kunal Patil
          </p>

          <p>
            <strong>Amount:</strong> ₹1,500
          </p>

          <p>
            <strong>Method:</strong> Card
          </p>

          <p>
            <strong>Date:</strong> 2026-05-01
          </p>

          <p>
            <strong>Transaction ID:</strong> TXN-12345
          </p>
        </div>

        {/* RIGHT */}

        <div className="details-card">
          <h3>Receipt Proof</h3>

          <img src={receiptImg} alt="Receipt" className="receipt-preview" />
        </div>
      </div>

      {/* VERIFICATION */}

      <div className="details-card">
        <h3>Verification Action</h3>

        <textarea
          className="verification-textarea"
          placeholder="Enter verification notes..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <div className="verify-actions">
          <button className="btn-success" onClick={approvePayment}>
            <FaCheckCircle />
            Approve
          </button>

          <button className="btn-danger" onClick={rejectPayment}>
            <FaTimesCircle />
            Reject
          </button>

          <button className="btn-secondary" onClick={requestInfo}>
            <FaEnvelope />
            Request More Info
          </button>
        </div>
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

export default VerifyPayment;
