import { FaExchangeAlt, FaFileSignature, FaEnvelope } from "react-icons/fa";

import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import API from "../../../../services/api.js";

function EnquiryDetails() {
  const [enquiry, setEnquiry] = useState(null);

  const { id } = useParams();

  // FETCH SINGLE ENQUIRY

  const fetchEnquiry = async () => {
    try {
      const res = await API.get(`/enquiries/${id}`);

      setEnquiry(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchEnquiry();
  }, []);

  // LOADING

  if (!enquiry) {
    return <h2>Loading...</h2>;
  }

  const updateStatus = async (newStatus) => {
    try {
      await API.put(`/enquiries/${id}`, {
        status: newStatus,
      });

      fetchEnquiry();
    } catch (err) {
      console.log(err);
    }
  };

  const handleConvertApplication = async () => {

  try {

    await API.post(`/enquiries/${id}/convert`);

    alert("Enquiry Converted To Application");

    fetchEnquiry();

  } catch (err) {
    console.log(err);
  }
};
const handleSendEmail = async () => {
  try {
    await API.post(`/enquiries/${id}/send-email`);

    alert("Follow-up email sent successfully");
  } catch (err) {
    console.log(err);
    alert("Email sending failed");
  }
};



  return (
    <div className="page-container">
      {/* HEADER */}

      <div className="page-header">
        <div>
          <p className="page-eyebrow">Enquiry Details</p>

          <h2>
            {enquiry.id} — {enquiry.full_name}
          </h2>

          <p>Full enquiry details, customer information and quick actions.</p>
        </div>
      </div>

      {/* DETAILS */}

      <div className="details-grid">
        {/* CUSTOMER INFO */}

        <div className="details-card">
          <h3>Customer Information</h3>

          <div className="detail-item">
            <span>Name</span>
            <strong>{enquiry.full_name}</strong>
          </div>

          <div className="detail-item">
            <span>Mobile</span>
            <strong>{enquiry.mobile}</strong>
          </div>

          <div className="detail-item">
            <span>Email</span>
            <strong>{enquiry.email}</strong>
          </div>

          <div className="detail-item">
            <span>City</span>
            <strong>{enquiry.city}</strong>
          </div>
        </div>

        {/* LOAN INFO */}

        <div className="details-card">
          <h3>Loan Requirement</h3>

          <div className="detail-item">
            <span>Loan Type</span>
            <strong>{enquiry.loan_type}</strong>
          </div>

          <div className="detail-item">
            <span>Amount</span>
            <strong>{enquiry.loan_amount}</strong>
          </div>

          <div className="detail-item">
            <span>Status</span>

            <strong>{enquiry.status}</strong>
          </div>

          <div className="detail-item">
            <span>Message</span>

            <strong>{enquiry.message}</strong>
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS */}

      <div className="quick-actions">
        <h3>Quick Actions</h3>

        <div className="actions-grid">
          <button className="action-btn" onClick={() => updateStatus("In Progress")}>
            <FaExchangeAlt />
            Change Status
          </button>

          <button className="action-btn" onClick={handleConvertApplication}>
            <FaFileSignature />
            Convert to Application
          </button>

          <button className="action-btn" onClick={handleSendEmail}>
  <FaEnvelope />
  Send Follow-up Email
</button>
        </div>
      </div>
    </div>
  );
}

export default EnquiryDetails;
