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

function ApprovalQueue({ globalSearch = "" }) {
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
      const res = await API.get(
        `/approvals?page=${page}&limit=${limit}&search=${encodeURIComponent(globalSearch.trim())}`,
      );

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

      setSelectedLoan((currentSelected) => {
        if (!formatted.length) return null;
        return formatted.find(
          (item) => item.application_id === currentSelected?.application_id,
        ) || formatted[0];
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, [page, globalSearch]);

  useEffect(() => {
    setPage(1);
  }, [globalSearch]);

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
    <div className="page-container approval-queue-page">
      <div className="page-header">
        <div>
          <h2>Loan Approval Queue</h2>

          <p>Final approval stage for applications.</p>
        </div>
      </div>

      <div className="table-wrapper table card approval-queue-table-wrapper">
        <div className="approval-mobile-cards">
          {approvals.length === 0 ? (
            <p className="approval-mobile-empty">No approvals found.</p>
          ) : approvals.map((item, index) => (
            <article
              className={`approval-mobile-card${selectedLoan?.application_id === item.application_id ? " selected" : ""}`}
              key={`mobile-${item.application_id}-${index}`}
              tabIndex={0}
              role="group"
              aria-label={`Select loan ${item.loanId}`}
              onClick={() => setSelectedLoan(item)}
              onKeyDown={(event) => {
                if (event.target !== event.currentTarget) return;
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setSelectedLoan(item);
                }
              }}
            >
              <div className="approval-mobile-card-header">
                <div><span>Loan ID</span><strong>{item.loanId || "—"}</strong></div>
                <span className="approval-mobile-status">{item.status || "Ready"}</span>
              </div>
              <div className="approval-mobile-fields">
                <div className="approval-mobile-applicant"><span>Applicant Name</span><strong>{item.applicant || "—"}</strong></div>
                <div><span>Loan Type</span><strong>{item.loanType || "—"}</strong></div>
                <div><span>Amount</span><strong>{item.amount ?? "—"}</strong></div>
                <div><span>CIBIL Score</span><strong>{item.cibil ?? "—"}</strong></div>
                <div><span>Income/EMI Ratio</span><strong>{item.ratio || "—"}</strong></div>
                <div><span>Documents</span><strong>{item.docs || "—"}</strong></div>
              </div>
              <div className="approval-mobile-actions" aria-label={`Approval actions for ${item.loanId}`}>
                <button className="icon-btn success" aria-label={`Approve ${item.loanId}`} title="Approve" onClick={() => handleApprove(item)}>
                  <FaCheckCircle />
                </button>
                <button className="icon-btn danger" aria-label={`Reject ${item.loanId}`} title="Reject" onClick={() => handleReject(item)}>
                  <FaTimesCircle />
                </button>
                <button className="icon-btn info" aria-label={`Request information for ${item.loanId}`} title="Request Info" onClick={() => handleRequestInfo(item)}>
                  <FaInfoCircle />
                </button>
                <button className="icon-btn disbursed" aria-label={`Mark ${item.loanId} disbursed`} title="Mark Disbursed" onClick={() => handleDisbursed(item)}>
                  <FaMoneyBillWave />
                </button>
              </div>
            </article>
          ))}
        </div>

        <table className="admin-table approval-desktop-table">
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
        className="approval-queue-pagination"
      />

      {selectedLoan && (
        <>
          <div className="split-view approval-application-details">
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

          <div className="details-card approval-internal-remarks">
            <h3>Internal Remarks</h3>

            <textarea
              className="remarks-box"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />

            <button className="save-remark-btn" onClick={handleSaveRemark}>
              <FaCheckCircle className="save-remark-icon" /> Save Remark
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
