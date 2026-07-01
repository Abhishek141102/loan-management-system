import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FaEnvelope, FaPlus, FaBan, FaArrowLeft } from "react-icons/fa";
import "./CustomerProfile.css";

function CustomerProfile() {
  const { id } = useParams();

  const [blocked, setBlocked] = useState(false);
  const [note, setNote] = useState("");
  const [toast, setToast] = useState("");

  const [notes, setNotes] = useState([
    "Customer requested EMI details by email.",
    "KYC verified by admin.",
  ]);

  const customer = {
    id,
    name: "Priya Deshmukh",
    dob: "12 March 1995",
    email: "priya@email.com",
    phone: "9977886655",
    status: blocked ? "Blocked" : "Active",
    address: "Flat 402, College Road, Nashik, Maharashtra",

    kyc: {
      aadhaar: "Verified",
      pan: "Verified",
      bankStatement: "Verified",
      salarySlip: "Pending",
    },

    loanApplications: [
      {
        loanId: "LOAN-501",
        loanType: "Business Loan",
        amount: "₹10,00,000",
        status: "Approved",
      },
      {
        loanId: "LOAN-489",
        loanType: "Personal Loan",
        amount: "₹3,00,000",
        status: "Rejected",
      },
    ],

    approvedLoan: {
      loanId: "LOAN-501",
      amount: "₹10,00,000",
      tenure: "36 Months",
      emi: "₹31,800",
      disbursedDate: "10 May 2026",
      status: "Disbursed",
    },

    documentHistory: [
      "PAN Card uploaded on 02 May 2026",
      "Aadhaar Card uploaded on 02 May 2026",
      "Bank Statement verified on 04 May 2026",
      "Salary Slip pending verification",
    ],

    communicationLog: [
      "Approval email sent on 08 May 2026",
      "Sanction letter email sent on 09 May 2026",
      "Disbursement confirmation email sent on 10 May 2026",
    ],
  };

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 2200);
  };

  const sendMessage = () => {
    showToast(`Message sent to ${customer.email}`);
  };

  const addNote = () => {
    if (!note.trim()) {
      showToast("Please write a note first");
      return;
    }

    setNotes([note, ...notes]);
    setNote("");
    showToast("Note added successfully");
  };

  const blockAccount = () => {
    const confirmBlock = window.confirm(
      blocked ? "Unblock this customer?" : "Block this customer?"
    );

    if (confirmBlock) {
      setBlocked(!blocked);
      showToast(blocked ? "Customer unblocked" : "Customer blocked");
    }
  };

  return (
    <div className="customer-profile-page">
      <div className="customers-header">
        <div>
          <Link to="/admin/customers" className="back-link">
            <FaArrowLeft /> Back to Customers
          </Link>

          <h1>Customer Profile</h1>
          <p>
            Complete customer profile with KYC status, loan history, approved
            loan details, documents and communication log.
          </p>
        </div>

        <div className="profile-actions">
          <button className="btn-secondary" onClick={sendMessage}>
            <FaEnvelope /> Send Message
          </button>

          <button className="btn-danger" onClick={blockAccount}>
            <FaBan /> {blocked ? "Unblock Account" : "Block Account"}
          </button>
        </div>
      </div>

      <div className="customer-profile-grid">
        <div className="customer-card">
          <h3>Personal Details</h3>
          <p><strong>Name:</strong> {customer.name}</p>
          <p><strong>DOB:</strong> {customer.dob}</p>
          <p><strong>Email:</strong> {customer.email}</p>
          <p><strong>Phone:</strong> {customer.phone}</p>
          <p><strong>Address:</strong> {customer.address}</p>
          <p><strong>Status:</strong> {customer.status}</p>
        </div>

        <div className="customer-card">
          <h3>KYC Document Status</h3>
          <p><strong>Aadhaar:</strong> {customer.kyc.aadhaar}</p>
          <p><strong>PAN:</strong> {customer.kyc.pan}</p>
          <p><strong>Bank Statement:</strong> {customer.kyc.bankStatement}</p>
          <p><strong>Salary Slip:</strong> {customer.kyc.salarySlip}</p>
        </div>

        <div className="customer-card">
          <h3>Approved Loan Details</h3>
          <p><strong>Loan ID:</strong> {customer.approvedLoan.loanId}</p>
          <p><strong>Amount:</strong> {customer.approvedLoan.amount}</p>
          <p><strong>Tenure:</strong> {customer.approvedLoan.tenure}</p>
          <p><strong>EMI:</strong> {customer.approvedLoan.emi}</p>
          <p><strong>Disbursed Date:</strong> {customer.approvedLoan.disbursedDate}</p>
          <p><strong>Status:</strong> {customer.approvedLoan.status}</p>
        </div>
      </div>

      <div className="customer-section">
        <h3>All Loan Applications</h3>

        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Loan ID</th>
                <th>Loan Type</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {customer.loanApplications.map((loan) => (
                <tr key={loan.loanId}>
                  <td>{loan.loanId}</td>
                  <td>{loan.loanType}</td>
                  <td>{loan.amount}</td>
                  <td>
                    <span className={`status-badge ${loan.status.toLowerCase()}`}>
                      {loan.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="customer-profile-grid">
        <div className="customer-card">
          <h3>Document History</h3>

          {customer.documentHistory.map((doc, index) => (
            <div className="customer-log-item" key={index}>
              {doc}
            </div>
          ))}
        </div>

        <div className="customer-card">
          <h3>Communication Log</h3>

          {customer.communicationLog.map((log, index) => (
            <div className="customer-log-item" key={index}>
              {log}
            </div>
          ))}
        </div>
      </div>

      <div className="customer-card">
        <h3>Customer Notes</h3>

        <textarea
          placeholder="Write customer note..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        ></textarea>

        <button className="btn-primary" onClick={addNote}>
          <FaPlus /> Add Note
        </button>

        <div className="notes-list">
          {notes.map((item, index) => (
            <div className="customer-log-item" key={index}>
              {item}
            </div>
          ))}
        </div>
      </div>

      {toast && <div className="settings-toast">{toast}</div>}
    </div>
  );
}

export default CustomerProfile;