import { useState, useEffect } from "react";

import "./ApprovalQueue.css";

import API from "../../../../services/api";

import PaginationControls from "../../../../components/PaginationControls";

import {
  FaCheckCircle,
  FaInfoCircle,
  FaTimesCircle,
  FaMoneyBillWave,
} from "react-icons/fa";

function ApprovalQueue() {
  const [approvals, setApprovals] = useState([]);

  const [selectedLoan, setSelectedLoan] = useState(null);

  const [remarks, setRemarks] = useState("");

  const [auditTrail, setAuditTrail] = useState([]);

  // BACKEND PAGINATION
  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  const [totalRecords, setTotalRecords] = useState(0);

  const limit = 10;

  const fetchApprovals = async () => {
    try {
      const res = await API.get(`/approvals?page=${page}&limit=${limit}`);

      // SAFE RESPONSE
      const rows = res.data.data || res.data || [];

      const formatted = rows.map((item) => ({
        application_id: item.application_id,

        loanId: item.loan_code,

        applicant: item.applicant_name,

        loanType: item.loan_type,

        amount: item.loan_amount,

        cibil: item.cibil_score,

        ratio: item.income_emi_ratio + "%",

        status: item.approval_status,

        docs: "Verified",
      }));

      setApprovals(formatted);

      // SAFE PAGINATION
      setTotalPages(res.data.pagination?.totalPages || 1);

      setTotalRecords(res.data.pagination?.total || rows.length);

      if (formatted.length > 0 && !selectedLoan) {
        setSelectedLoan(formatted[0]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, [page]);

  const addAudit = (message) => {
    const time = new Date().toLocaleString();

    setAuditTrail((prev) => [...prev, `${message} - ${time}`]);
  };

  const handleApprove = async (loan) => {
    try {
      await API.post("/approvals/approve", {
        application_id: loan.application_id,

        cibil_score: loan.cibil,

        income_emi_ratio: parseFloat(loan.ratio),

        remarks: remarks,
      });

      addAudit(`${loan.loanId} approved`);

      alert(`${loan.loanId} approved successfully`);

      fetchApprovals();
    } catch (err) {
      console.log(err);
    }
  };

  const handleReject = async (loan) => {
    const reason = prompt("Enter rejection reason:");

    if (!reason) return;

    try {
      await API.post("/approvals/reject", {
        application_id: loan.application_id,

        cibil_score: loan.cibil,

        income_emi_ratio: parseFloat(loan.ratio),

        remarks: remarks,

        rejection_reason: reason,
      });

      addAudit(`${loan.loanId} rejected`);

      alert(`${loan.loanId} rejected`);

      fetchApprovals();
    } catch (err) {
      console.log(err);
    }
  };

  const handleRequestInfo = (loan) => {
    setSelectedLoan(loan);

    addAudit(`${loan.loanId} requested more info`);

    alert(`More information requested`);
  };

  const handleDisbursed = (loan) => {
    addAudit(`${loan.loanId} marked disbursed`);

    alert(`${loan.loanId} marked as disbursed`);
  };

  const handleSaveRemark = () => {
    if (!remarks.trim()) {
      alert("Enter remarks first");

      return;
    }

    addAudit(`Remark added for ${selectedLoan.loanId}`);

    alert("Remark saved");

    setRemarks("");
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>Loan Approval Queue</h2>

          <p>Final approval stage for applications.</p>
        </div>
      </div>

      <div className="table-wrapper table card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Loan ID</th>
              <th>Applicant</th>
              <th>Loan Type</th>
              <th>Amount</th>
              <th>CIBIL</th>
              <th>Docs</th>
              <th>Income/EMI</th>
              
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {approvals.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  style={{
                    textAlign: "center",
                    padding: 30,
                  }}
                >
                  No approvals found
                </td>
              </tr>
            ) : (
              approvals.map((item, index) => (
                <tr key={`${item.application_id}-${index}`}>
                  <td>{item.loanId}</td>

                  <td>{item.applicant}</td>

                  <td>{item.loanType}</td>

                  <td>{item.amount}</td>

                  <td>{item.cibil}</td>

                  <td>{item.docs}</td>

                  <td>{item.ratio}</td>

                  

                  <td className="action-cell">
                    <button
                      className="icon-btn success"
                      onClick={() => handleApprove(item)}
                    >
                      <FaCheckCircle />
                    </button>

                    <button
                      className="icon-btn danger"
                      onClick={() => handleReject(item)}
                    >
                      <FaTimesCircle />
                    </button>

                    <button
                      className="icon-btn info"
                      onClick={() => handleRequestInfo(item)}
                    >
                      <FaInfoCircle />
                    </button>

                    <button
                      className="icon-btn disbursed"
                      onClick={() => handleDisbursed(item)}
                    >
                      <FaMoneyBillWave />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}

      <PaginationControls
        page={page}
        totalPages={totalPages}
        totalRecords={totalRecords}
        limit={limit}
        onPageChange={setPage}
      />

      {selectedLoan && (
        <>
          <div className="split-view">
            <div className="split-card">
              <h3>Application Details</h3>

              <p>
                <strong>Loan ID:</strong> {selectedLoan.loanId}
              </p>

              <p>
                <strong>Applicant:</strong> {selectedLoan.applicant}
              </p>

              <p>
                <strong>Loan Type:</strong> {selectedLoan.loanType}
              </p>

              <p>
                <strong>Amount:</strong> {selectedLoan.amount}
              </p>

              <p>
                <strong>CIBIL:</strong> {selectedLoan.cibil}
              </p>

              <p>
                <strong>Income/EMI:</strong> {selectedLoan.ratio}
              </p>
            </div>
          </div>

          <div className="details-card">
            <h3>Internal Remarks</h3>

            <textarea
              className="remarks-box"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />

            <button className="save-remark-btn" onClick={handleSaveRemark}>
              Save Remark
            </button>
          </div>

          <div className="details-card">
            <h3>Approval Audit Trail</h3>

            {auditTrail.length === 0 ? (
              <p>No actions recorded yet.</p>
            ) : (
              <ul className="audit-list">
                {auditTrail.map((log, index) => (
                  <li key={index}>{log}</li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default ApprovalQueue;
