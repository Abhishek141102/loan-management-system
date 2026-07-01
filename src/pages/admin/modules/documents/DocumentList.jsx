// DocumentList.jsx
import { useState, useEffect } from "react";
import API from "../../../../services/api";
import {
  FaCheck,
  FaDownload,
  FaTimes,
  FaUpload,
  FaFilePdf,
  FaFileImage,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaClipboardList,
  FaEnvelope,
} from "react-icons/fa";
import PaginationControls from "../../../../components/PaginationControls";

const RECORDS_PER_PAGE = 10;

const CHECKLISTS = {
  "Home Loan": [
    "Aadhaar Card",
    "PAN Card",
    "Passport / Voter ID",
    "Bank Statements (6 months)",
    "Salary Slips (3 months)",
    "ITR / Form 16",
    "Property Documents",
    "Photograph",
  ],
  "Personal Loan": [
    "Aadhaar Card",
    "PAN Card",
    "Bank Statements (6 months)",
    "Salary Slips (3 months)",
    "Photograph",
  ],
  "Business Loan": [
    "Aadhaar Card",
    "PAN Card",
    "Bank Statements (6 months)",
    "ITR / Form 16",
    "Business Registration",
    "Photograph",
  ],
  "Education Loan": [
    "Aadhaar Card",
    "PAN Card",
    "Bank Statements (6 months)",
    "Admission Letter / Fee Receipt",
    "Photograph",
  ],
  "Vehicle Loan": [
    "Aadhaar Card",
    "PAN Card",
    "Bank Statements (6 months)",
    "Salary Slips (3 months)",
    "Vehicle Quotation",
    "Photograph",
  ],
};

const LOAN_TYPES = Object.keys(CHECKLISTS);

const DOC_TYPES_ALL = [
  "Aadhaar Card",
  "PAN Card",
  "Passport / Voter ID",
  "Bank Statements (6 months)",
  "Salary Slips (3 months)",
  "ITR / Form 16",
  "Property Documents",
  "Business Registration",
  "Admission Letter / Fee Receipt",
  "Vehicle Quotation",
  "Photograph",
];

const STATUS_COLORS = {
  Pending: { bg: "rgba(100,100,100,0.18)", color: "#aaa" },
  Uploaded: { bg: "rgba(33,150,243,0.18)", color: "#42a5f5" },
  "Under Verification": { bg: "rgba(255,152,0,0.18)", color: "#ffb74d" },
  Verified: { bg: "rgba(76,175,80,0.18)", color: "#81c784" },
  Rejected: { bg: "rgba(244,67,54,0.18)", color: "#ef5350" },
};

function StatusBadge({ status }) {
  const s = STATUS_COLORS[status] || {
    bg: "rgba(255,255,255,0.1)",
    color: "#fff",
  };
  return (
    <span
      style={{
        padding: "5px 12px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 700,
        background: s.bg,
        color: s.color,
        whiteSpace: "nowrap",
      }}
    >
      {status}
    </span>
  );
}

function Toast({ toast, onClose }) {
  if (!toast) return null;
  const icons = {
    success: <FaCheckCircle />,
    error: <FaTimesCircle />,
    warning: <FaExclamationTriangle />,
    info: <FaInfoCircle />,
  };
  const bgMap = {
    success: "linear-gradient(135deg,#1a3a1a,#1f4a1f)",
    error: "linear-gradient(135deg,#3a1a1a,#4a1f1f)",
    warning: "linear-gradient(135deg,#3a2e00,#4a3a00)",
    info: "linear-gradient(135deg,#0a2040,#0d2d5a)",
  };
  const bMap = {
    success: "#4caf50",
    error: "#f44336",
    warning: "#ffc107",
    info: "#2196f3",
  };
  const cMap = {
    success: "#4caf50",
    error: "#f44336",
    warning: "#ffc107",
    info: "#42a5f5",
  };
  return (
    <div
      style={{
        position: "fixed",
        top: 20,
        right: 20,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "14px 20px",
        borderRadius: 12,
        minWidth: 300,
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        background: bgMap[toast.type],
        border: `1px solid ${bMap[toast.type]}`,
      }}
    >
      <span style={{ color: cMap[toast.type], fontSize: 18 }}>
        {icons[toast.type]}
      </span>
      <span
        style={{ color: "#f1f1f1", flex: 1, fontSize: 14, fontWeight: 600 }}
      >
        {toast.message}
      </span>
      <button
        onClick={onClose}
        style={{
          background: "none",
          border: "none",
          color: "#aaa",
          cursor: "pointer",
        }}
      >
        <FaTimes />
      </button>
    </div>
  );
}

function VerifyModal({ doc, onClose, onVerify }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="admin-modal"
        style={{ width: 440 }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ marginBottom: 10 }}>Verify Document</h3>
        <p style={{ marginBottom: 16 }}>
          Mark <strong style={{ color: "var(--gold)" }}>{doc.document}</strong>{" "}
          for <strong style={{ color: "var(--gold)" }}>{doc.customer}</strong>{" "}
          as <strong style={{ color: "#81c784" }}>Verified</strong>?
        </p>
        <div
          style={{
            background: "rgba(76,175,80,0.08)",
            border: "1px solid rgba(76,175,80,0.2)",
            borderRadius: 10,
            padding: 12,
            color: "var(--text-secondary)",
            fontSize: 13,
          }}
        >
          This will update the document status and advance it toward the
          approval queue.
        </div>
        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn-success"
            onClick={() => {
              onVerify(doc.id);
              onClose();
            }}
          >
            Confirm Verify
          </button>
        </div>
      </div>
    </div>
  );
}

function RejectModal({ doc, onClose, onReject, showToast }) {
  const [reason, setReason] = useState(doc.rejectionReason || "");
  const [sending, setSending] = useState(false);
  const handleReject = () => {
    if (!reason.trim()) return;
    setSending(true);
    setTimeout(() => {
      onReject(doc.id, reason);
      onClose();
      showToast(
        `Rejection email sent to ${doc.customer} (SMTP simulated)`,
        "warning",
      );
    }, 900);
  };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="admin-modal"
        style={{ width: 480 }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ marginBottom: 10 }}>Reject Document</h3>
        <p style={{ marginBottom: 16 }}>
          Rejecting{" "}
          <strong style={{ color: "var(--gold)" }}>{doc.document}</strong> for{" "}
          <strong style={{ color: "var(--gold)" }}>{doc.customer}</strong>. A
          rejection email (SMTP) will be sent automatically.
        </p>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            marginBottom: 16,
          }}
        >
          <label
            style={{ color: "var(--gold)", fontSize: 12, fontWeight: 700 }}
          >
            Rejection Reason *
          </label>
          <textarea
            className="verification-textarea"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
            placeholder="Describe why the document is being rejected (e.g. illegible, mismatch, expired)..."
          />
        </div>
        <div
          style={{
            background: "rgba(255,152,0,0.08)",
            border: "1px solid rgba(255,152,0,0.25)",
            borderRadius: 10,
            padding: 12,
            display: "flex",
            gap: 10,
            alignItems: "flex-start",
          }}
        >
          <FaEnvelope
            style={{ color: "#ffb74d", marginTop: 2, flexShrink: 0 }}
          />
          <span style={{ color: "var(--text-secondary)", fontSize: 13 }}>
            An email with the rejection reason will be dispatched via SMTP to
            the customer. In this demo, SMTP delivery is simulated with a toast
            notification.
          </span>
        </div>
        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn-danger"
            onClick={handleReject}
            disabled={!reason.trim() || sending}
          >
            {sending ? "Sending..." : "Reject & Notify"}
          </button>
        </div>
      </div>
    </div>
  );
}

function UploadModal({ onClose, onUpload }) {
  const [form, setForm] = useState({
    loanId: "",
    customer: "",
    loanType: "Home Loan",
    document: "Aadhaar Card",
    type: "KYC",
    applicationId: null,
  });
  const [applications, setApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    API.get("/applications")
      .then((res) => {
        const list = Array.isArray(res.data)
          ? res.data
          : (res.data.data ?? res.data.applications ?? []);
        setApplications(list);
      })
      .catch((err) => {
        console.error("Failed to load applications:", err);
        setApplications([]);
      })
      .finally(() => setLoadingApps(false));
  }, []);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleLoanSelect = (e) => {
    const selectedLoanCode = e.target.value;
    const app = applications.find((a) => a.loan_code === selectedLoanCode);
    if (app) {
      setForm((f) => ({
        ...f,
        loanId: app.loan_code,
        customer: app.applicant_name,
        loanType: app.loan_type || "Home Loan",
        applicationId: app.id,
      }));
    } else {
      setForm((f) => ({
        ...f,
        loanId: "",
        customer: "",
        loanType: "Home Loan",
        applicationId: null,
      }));
    }
  };

  const handleUpload = () => {
    if (!form.loanId || !form.customer || !selectedFile) return;
    onUpload({ ...form, file: selectedFile });
    onClose();
  };

  const canUpload = form.loanId && form.customer && selectedFile;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="product-modal-large"
        style={{ width: 560 }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ color: "var(--gold)", marginBottom: 20 }}>
          Upload Document
        </h3>
        <div className="product-form">
          <div className="product-form-grid">
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label
                style={{ color: "var(--gold)", fontSize: 12, fontWeight: 700 }}
              >
                Loan ID *
              </label>
              {loadingApps ? (
                <select disabled>
                  <option>Loading...</option>
                </select>
              ) : (
                <select value={form.loanId} onChange={handleLoanSelect}>
                  <option value="">— Select Loan ID —</option>
                  {applications.map((a) => (
                    <option key={a.id} value={a.loan_code}>
                      {a.loan_code} — {a.applicant_name}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label
                style={{ color: "var(--gold)", fontSize: 12, fontWeight: 700 }}
              >
                Customer Name *
              </label>
              <input
                value={form.customer}
                readOnly
                placeholder="Auto-filled on loan selection"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  cursor: "not-allowed",
                  color: form.customer
                    ? "var(--text-primary)"
                    : "var(--text-secondary)",
                }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label
                style={{ color: "var(--gold)", fontSize: 12, fontWeight: 700 }}
              >
                Loan Type
              </label>
              <select
                value={form.loanType}
                onChange={(e) => set("loanType", e.target.value)}
              >
                {LOAN_TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label
                style={{ color: "var(--gold)", fontSize: 12, fontWeight: 700 }}
              >
                Document
              </label>
              <select
                value={form.document}
                onChange={(e) => set("document", e.target.value)}
              >
                {DOC_TYPES_ALL.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>
          <div
            style={{
              marginTop: 16,
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            <label
              style={{ color: "var(--gold)", fontSize: 12, fontWeight: 700 }}
            >
              Upload File *
            </label>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => setSelectedFile(e.target.files[0] || null)}
            />
            {selectedFile && (
              <p style={{ color: "#81c784", fontSize: 12, marginTop: 4 }}>
                ✓ {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)}{" "}
                KB)
              </p>
            )}
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: 12,
                marginTop: 2,
              }}
            >
              Accepted: PDF, JPG, PNG — max 5MB
            </p>
          </div>
        </div>
        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn-success"
            onClick={handleUpload}
            disabled={!canUpload}
            style={{ opacity: !canUpload ? 0.5 : 1 }}
          >
            Upload Document
          </button>
        </div>
      </div>
    </div>
  );
}

function ChecklistModal({ loanType, docs, onClose }) {
  const required = CHECKLISTS[loanType] || [];
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="product-modal-large"
        style={{ width: 520 }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ color: "var(--gold)", marginBottom: 6 }}>
          Document Checklist
        </h3>
        <p
          style={{
            color: "var(--text-secondary)",
            marginBottom: 20,
            fontSize: 14,
          }}
        >
          {loanType} — Required documents
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {required.map((docName) => {
            const found = docs.find(
              (d) => d.document === docName && d.loanType === loanType,
            );
            const status = found?.status || "Not Uploaded";
            const col = STATUS_COLORS[status] || {
              bg: "rgba(100,100,100,0.12)",
              color: "#888",
            };
            return (
              <div
                key={docName}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(212,175,55,0.1)",
                  borderRadius: 10,
                  padding: "12px 16px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {status === "Verified" ? (
                    <FaCheckCircle style={{ color: "#81c784" }} />
                  ) : status === "Rejected" ? (
                    <FaTimesCircle style={{ color: "#ef5350" }} />
                  ) : (
                    <div
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: "50%",
                        border: "2px solid #555",
                      }}
                    />
                  )}
                  <span style={{ color: "var(--text-primary)", fontSize: 14 }}>
                    {docName}
                  </span>
                </div>
                <span
                  style={{
                    padding: "4px 10px",
                    borderRadius: 999,
                    fontSize: 11,
                    fontWeight: 700,
                    background: col.bg,
                    color: col.color,
                    whiteSpace: "nowrap",
                  }}
                >
                  {status}
                </span>
              </div>
            );
          })}
        </div>
        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────── */
function DocumentList() {
  const [docs, setDocs] = useState([]);
  const [statusCounts, setStatusCounts] = useState({});
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState([]);
  const [toast, setToast] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const totalPages = Math.max(1, Math.ceil(totalRecords / RECORDS_PER_PAGE));

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // ─── Reset page on filter/search change ──────────────────
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterType, filterStatus]);

  // ─── Fetch documents from backend with pagination ─────────
  const fetchDocuments = async (page = currentPage) => {
  try {
    const params = new URLSearchParams({ page, limit: RECORDS_PER_PAGE });
    if (search)       params.append("search", search);
    if (filterType)   params.append("type", filterType);
    if (filterStatus) params.append("status", filterStatus);

    const res = await API.get(`/documents?${params.toString()}`);

    const { data: items, pagination, status_counts } = res.data;

    // ← formatted पहिले define कर, मग setDocs
    const formatted = items.map((item) => ({
      id:              item.id,
      application_id:  item.application_id,
      loanId:          item.loan_code,
      customer:        item.customer,
      loanType:        item.loan_type,
      document:        item.document_name,
      type:            item.document_type,
      uploaded:        item.uploaded,
      fileType:        item.file_type,
      filePath:        item.file_path,
      fileName:        item.file_name,
      status:          item.status,
      rejectionReason: item.rejection_reason,
    }));

    setDocs(formatted);
    setTotalRecords(pagination.total);
    if (status_counts) setStatusCounts(status_counts);

  } catch (err) {
    console.log(err);
  }
};
  useEffect(() => {
    fetchDocuments(currentPage);
  }, [currentPage, search, filterType, filterStatus]);

  // ─── Download ─────────────────────────────────────────────
  const handleDownload = (doc) => {
    if (doc.uploaded !== "Yes" || !doc.filePath) {
      showToast("No file uploaded for this document", "error");
      return;
    }
    const link = document.createElement("a");
    link.href = `http://localhost:5000/api/documents/${doc.id}/download`;
    link.download = doc.fileName || `${doc.document}.${doc.fileType}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Downloading: ${doc.document}`, "info");
  };

  // ─── Verify ───────────────────────────────────────────────
  const handleVerify = async (id) => {
    try {
      await API.put(`/documents/${id}/verify`);
      showToast("Document verified successfully", "success");
      fetchDocuments(currentPage);
    } catch (err) {
      console.log(err);
    }
  };

  // ─── Reject ───────────────────────────────────────────────
  const handleReject = async (id, reason) => {
    try {
      await API.put(`/documents/${id}/reject`, { reason });
      showToast("Document rejected", "warning");
      fetchDocuments(currentPage);
    } catch (err) {
      console.log(err);
    }
  };

  // ─── Upload ───────────────────────────────────────────────
  const handleUpload = async (doc) => {
    try {
      if (!doc.applicationId) {
        showToast("Application not found", "error");
        return;
      }
      const formData = new FormData();
      formData.append("file", doc.file);
      formData.append("application_id", doc.applicationId);
      formData.append("document_name", doc.document);
      formData.append("document_type", doc.type);
      await API.post("/documents", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      showToast("Document uploaded successfully", "success");
      fetchDocuments(currentPage);
    } catch (err) {
      console.log(err);
      showToast("Upload failed", "error");
    }
  };

  // ─── Bulk Verify ──────────────────────────────────────────
  const handleBulkVerify = async () => {
    if (!selected.length) return;
    try {
      for (const id of selected) {
        await API.put(`/documents/${id}/verify`);
      }
      showToast(`${selected.length} document(s) verified`, "success");
      setSelected([]);
      fetchDocuments(currentPage);
    } catch (err) {
      console.log(err);
    }
  };

  // ─── Select helpers ───────────────────────────────────────
  const toggleSelect = (id) =>
    setSelected((p) =>
      p.includes(id) ? p.filter((x) => x !== id) : [...p, id],
    );

  const toggleAll = () =>
    setSelected(
      selected.length === docs.length && docs.length > 0
        ? []
        : docs.map((d) => d.id),
    );

  return (
    <div className="page-container">
      <Toast toast={toast} onClose={() => setToast(null)} />

      <div className="page-header">
        <div>
          <h2>Document Verification</h2>
          <p>
            Upload, download, verify or reject KYC and supporting documents with
            reason.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            style={{
              background: "transparent",
              border: "1px solid var(--gold)",
              color: "var(--gold)",
              padding: "10px 18px",
              borderRadius: 10,
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
            onClick={() => setModal({ type: "checklist" })}
          >
            <FaClipboardList /> Checklist
          </button>
          <button onClick={() => setModal({ type: "upload" })}>
            <FaUpload /> Upload Document
          </button>
        </div>
      </div>

      <div className="filter-box">
        <input
          placeholder="Search loan ID, customer, document..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 2 }}
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="">All Document Types</option>
          {DOC_TYPES_ALL.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">All Statuses</option>
          {[
            "Pending",
            "Uploaded",
            "Under Verification",
            "Verified",
            "Rejected",
          ].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        {(search || filterType || filterStatus) && (
          <button
            onClick={() => {
              setSearch("");
              setFilterType("");
              setFilterStatus("");
            }}
            style={{
              background: "rgba(244,67,54,0.15)",
              border: "1px solid rgba(244,67,54,0.3)",
              color: "#ef5350",
              borderRadius: 10,
              padding: "10px 16px",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <FaTimes /> Clear
          </button>
        )}
      </div>

      {selected.length > 0 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            background: "rgba(212,175,55,0.08)",
            border: "1px solid rgba(212,175,55,0.2)",
            borderRadius: 10,
            padding: "10px 18px",
            marginBottom: 14,
          }}
        >
          <span style={{ color: "var(--gold)", fontWeight: 700 }}>
            {selected.length} selected
          </span>
          <button
            className="btn-success"
            style={{
              padding: "7px 16px",
              borderRadius: 8,
              fontSize: 13,
              border: "none",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
            onClick={handleBulkVerify}
          >
            <FaCheck /> Bulk Verify
          </button>
          <button
            onClick={() => setSelected([])}
            style={{
              background: "none",
              border: "none",
              color: "#aaa",
              cursor: "pointer",
              fontSize: 13,
            }}
          >
            Cancel
          </button>
        </div>
      )}

      <div className="table-wrapper table card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selected.length === docs.length && docs.length > 0}
                  onChange={toggleAll}
                  style={{ cursor: "pointer" }}
                />
              </th>
              <th>Loan ID</th>
              <th>Customer</th>
              <th>Loan Type</th>
              <th>Document</th>
              <th>Type</th>
              <th>Uploaded</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {docs.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  style={{
                    textAlign: "center",
                    color: "var(--text-secondary)",
                    padding: 40,
                  }}
                >
                  No documents found.
                </td>
              </tr>
            ) : (
              docs.map((doc) => (
                <tr key={doc.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selected.includes(doc.id)}
                      onChange={() => toggleSelect(doc.id)}
                      style={{ cursor: "pointer" }}
                    />
                  </td>
                  <td style={{ color: "var(--gold)", fontWeight: 700 }}>
                    {doc.loanId}
                  </td>
                  <td style={{ fontWeight: 600 }}>{doc.customer}</td>
                  <td style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                    {doc.loanType}
                  </td>
                  <td style={{ fontWeight: 600 }}>{doc.document}</td>
                  <td>
                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: 8,
                        fontSize: 11,
                        fontWeight: 700,
                        background: "rgba(212,175,55,0.1)",
                        color: "var(--gold-light)",
                      }}
                    >
                      {doc.type}
                    </span>
                  </td>
                  <td>
                    <span
                      style={{
                        color: doc.uploaded === "Yes" ? "#81c784" : "#ef5350",
                        fontWeight: 700,
                        fontSize: 13,
                      }}
                    >
                      {doc.uploaded === "Yes" ? (
                        doc.fileType === "pdf" ? (
                          <>
                            <FaFilePdf style={{ marginRight: 5 }} />
                            PDF
                          </>
                        ) : (
                          <>
                            <FaFileImage style={{ marginRight: 5 }} />
                            Image
                          </>
                        )
                      ) : (
                        "Not Uploaded"
                      )}
                    </span>
                  </td>
                  <td>
                    <StatusBadge status={doc.status} />
                  </td>
                  <td className="action-cell">
                    {doc.uploaded === "Yes" ? (
                      <button
                        className="icon-btn view"
                        title="Download Document"
                        onClick={() => handleDownload(doc)}
                        style={{ background: "rgba(33,150,243,0.7)" }}
                      >
                        <FaDownload />
                      </button>
                    ) : (
                      <button
                        className="icon-btn view"
                        title="No file uploaded"
                        disabled
                        style={{
                          background: "rgba(100,100,100,0.3)",
                          cursor: "not-allowed",
                          opacity: 0.5,
                        }}
                      >
                        <FaDownload />
                      </button>
                    )}
                    {doc.uploaded === "Yes" && doc.status !== "Verified" && (
                      <button
                        className="icon-btn"
                        style={{ background: "rgba(76,175,80,0.7)" }}
                        title="Verify Document"
                        onClick={() => setModal({ type: "verify", doc })}
                      >
                        <FaCheck />
                      </button>
                    )}
                    {doc.uploaded === "Yes" && doc.status !== "Rejected" && (
                      <button
                        className="icon-btn"
                        style={{ background: "rgba(244,67,54,0.7)" }}
                        title="Reject Document"
                        onClick={() => setModal({ type: "reject", doc })}
                      >
                        <FaTimes />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ─── Status summary pills (global counts from backend) ─── */}
      <div
        style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}
      >
        {Object.entries(STATUS_COLORS).map(([s, col]) => {
          const count = statusCounts[s] ?? 0;
          return (
            <div
              key={s}
              onClick={() => setFilterStatus(filterStatus === s ? "" : s)}
              style={{
                padding: "7px 14px",
                borderRadius: 8,
                background: col.bg,
                border: `1px solid ${col.color}50`,
                color: col.color,
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                opacity: filterStatus && filterStatus !== s ? 0.4 : 1,
                transition: "0.2s",
              }}
            >
              {s} ({count})
            </div>
          );
        })}
      </div>

      {/* ─── Pagination ───────────────────────────────────────── */}
      <PaginationControls
        page={currentPage}
        totalPages={totalPages}
        totalRecords={totalRecords}
        limit={RECORDS_PER_PAGE}
        onPageChange={(page) => setCurrentPage(page)}
      />

      {modal?.type === "verify" && (
        <VerifyModal
          doc={modal.doc}
          onClose={() => setModal(null)}
          onVerify={handleVerify}
        />
      )}
      {modal?.type === "reject" && (
        <RejectModal
          doc={modal.doc}
          onClose={() => setModal(null)}
          onReject={handleReject}
          showToast={showToast}
        />
      )}
      {modal?.type === "upload" && (
        <UploadModal onClose={() => setModal(null)} onUpload={handleUpload} />
      )}
      {modal?.type === "checklist" && (
        <ChecklistModal
          loanType={
            filterType && LOAN_TYPES.includes(filterType)
              ? filterType
              : LOAN_TYPES[0]
          }
          docs={docs}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}

export default DocumentList;
