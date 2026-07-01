import { useState, useEffect } from "react";
import {
  FaEdit,
  FaEnvelope,
  FaEye,
  FaPlus,
  FaTimes,
  FaHistory,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaInfoCircle,
} from "react-icons/fa";
import API from "../../../../services/api";
import PaginationControls from "../../../../components/PaginationControls";

const STATUS_COLORS = {
  Draft: { bg: "rgba(100,100,100,0.18)", color: "#aaa" },
  Submitted: { bg: "rgba(33,150,243,0.18)", color: "#42a5f5" },
  "Under Review": { bg: "rgba(255,152,0,0.18)", color: "#ffb74d" },
  Approved: { bg: "rgba(76,175,80,0.18)", color: "#81c784" },
  Rejected: { bg: "rgba(244,67,54,0.18)", color: "#ef5350" },
  Disbursed: { bg: "rgba(156,39,176,0.18)", color: "#ce93d8" },
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

  const borderMap = {
    success: "#4caf50",
    error: "#f44336",
    warning: "#ffc107",
    info: "#2196f3",
  };

  const colorMap = {
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
        minWidth: 280,
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        background: bgMap[toast.type],
        border: `1px solid ${borderMap[toast.type]}`,
      }}
    >
      <span style={{ color: colorMap[toast.type], fontSize: 18 }}>
        {icons[toast.type]}
      </span>

      <span
        style={{
          color: "#f1f1f1",
          flex: 1,
          fontSize: 14,
          fontWeight: 600,
        }}
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

function FieldGroup({ label, value }) {
  return (
    <div
      style={{
        borderBottom: "1px solid rgba(212,175,55,0.1)",
        paddingBottom: 10,
      }}
    >
      <div
        style={{
          color: "var(--gold)",
          fontSize: 11,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: 1,
          marginBottom: 3,
        }}
      >
        {label}
      </div>

      <div
        style={{
          color: "var(--text-primary)",
          fontSize: 14,
        }}
      >
        {value || "—"}
      </div>
    </div>
  );
}

function ViewModal({ app, onClose }) {
  if (!app) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="product-modal-large"
        style={{ width: 680 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <h3 style={{ color: "var(--gold)", margin: 0 }}>
            Application Details — {app.id}
          </h3>

          <StatusBadge status={app.status} />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px 24px",
          }}
        >
          <FieldGroup label="Applicant Name" value={app.applicant} />
          <FieldGroup label="Date of Birth" value={app.dob} />
          <FieldGroup label="PAN Number" value={app.pan} />
          <FieldGroup label="Aadhaar Number" value={app.aadhaar} />
          <FieldGroup label="Employment Type" value={app.employment} />
          <FieldGroup label="Monthly Income" value={app.income} />
          <FieldGroup label="Loan Type" value={app.loanType} />
          <FieldGroup label="Loan Amount" value={app.amount} />
          <FieldGroup label="Tenure" value={app.tenure} />
          <FieldGroup label="Application Date" value={app.applicationDate} />
          <FieldGroup label="Co-Applicant" value={app.coApplicant} />
          <FieldGroup label="Status" value={app.status} />
        </div>

        <div style={{ marginTop: 14 }}>
          <FieldGroup label="Address" value={app.address} />
          <FieldGroup label="Purpose" value={app.purpose} />
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

function TimelineModal({ app, onClose }) {
  if (!app) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="product-modal-large"
        style={{ width: 520 }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ color: "var(--gold)", marginBottom: 6 }}>
          Application Timeline
        </h3>

        <p
          style={{
            color: "var(--text-secondary)",
            marginBottom: 22,
            fontSize: 14,
          }}
        >
          {app.id} — {app.applicant}
        </p>

        <ul className="timeline">
          {app.timeline.map((item, i) => (
            <li key={i}>
              <StatusBadge status={item.status} />

              <div
                style={{
                  marginTop: 6,
                  color: "var(--text-primary)",
                  fontSize: 14,
                }}
              >
                {item.note}
              </div>

              <div
                style={{
                  color: "var(--text-secondary)",
                  fontSize: 12,
                  marginTop: 4,
                }}
              >
                {item.date}
              </div>
            </li>
          ))}
        </ul>

        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function EditModal({ app, onClose, onSave }) {
  const [form, setForm] = useState({
    ...app,
  });

  const handleChange = (field, value) => {
    setForm({
      ...form,
      [field]: value,
    });
  };

  const handleSubmit = () => {
    onSave(form);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="product-modal-large"
        style={{
          width: 700,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <h3
            style={{
              color: "var(--gold)",
              margin: 0,
            }}
          >
            Edit Application
          </h3>

          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "#aaa",
              cursor: "pointer",
              fontSize: 18,
            }}
          >
            <FaTimes />
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 18,
          }}
        >
          <div>
            <label className="form-label">Applicant Name</label>

            <input
              className="form-input"
              value={form.applicant}
              onChange={(e) => handleChange("applicant", e.target.value)}
              placeholder="Applicant Name"
            />
          </div>

          <div>
            <label className="form-label">PAN Number</label>

            <input
              className="form-input"
              value={form.pan}
              onChange={(e) => handleChange("pan", e.target.value)}
              placeholder="PAN Number"
            />
          </div>

          <div>
            <label className="form-label">Aadhaar Number</label>

            <input
              className="form-input"
              value={form.aadhaar}
              onChange={(e) => handleChange("aadhaar", e.target.value)}
              placeholder="Aadhaar Number"
            />
          </div>

          <div>
            <label className="form-label">Monthly Income</label>

            <input
              className="form-input"
              value={form.income}
              onChange={(e) => handleChange("income", e.target.value)}
              placeholder="Monthly Income"
            />
          </div>

          <div>
            <label className="form-label">Loan Amount</label>

            <input
              className="form-input"
              value={form.amount}
              onChange={(e) => handleChange("amount", e.target.value)}
              placeholder="Loan Amount"
            />
          </div>

          <div>
            <label className="form-label">Status</label>

            <select
              className="form-input"
              value={form.status}
              onChange={(e) => handleChange("status", e.target.value)}
            >
              <option>Draft</option>

              <option>Submitted</option>

              <option>Under Review</option>

              <option>Approved</option>

              <option>Rejected</option>

              <option>Disbursed</option>
            </select>
          </div>
        </div>

        <div style={{ marginTop: 18 }}>
          <label className="form-label">Loan Purpose</label>

          <textarea
            className="form-input"
            value={form.purpose}
            onChange={(e) => handleChange("purpose", e.target.value)}
            placeholder="Loan Purpose"
            style={{
              minHeight: 110,
              resize: "vertical",
            }}
          />
        </div>

        <div
          className="modal-actions"
          style={{
            marginTop: 24,
          }}
        >
          <button className="action-btn cancel" onClick={onClose}>
            Cancel
          </button>

          <button className="action-btn save" onClick={handleSubmit}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

function AddModal({ onClose, onAdd }) {
  const [form, setForm] = useState({
    applicant: "",
    dob: "",
    pan: "",
    aadhaar: "",
    address: "",
    employment: "Salaried",
    income: "",
    loanType: "Personal Loan",
    amount: "",
    tenure: "",
    purpose: "",
    coApplicant: "",
    status: "Draft",
  });
  const [errors, setErrors] = useState({});

  const set = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.applicant.trim()) e.applicant = "Applicant Name is required";
    if (!form.dob) e.dob = "Date of Birth is required";
    if (!form.pan.trim()) e.pan = "PAN Number is required";
    else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(form.pan.trim().toUpperCase()))
      e.pan = "PAN must be 10 chars (e.g. ABCDE1234F)";
    if (!form.aadhaar.trim()) e.aadhaar = "Aadhaar Number is required";
    else if (!/^\d{12}$/.test(form.aadhaar.trim()))
      e.aadhaar = "Aadhaar must be exactly 12 digits";
    if (!form.address.trim()) e.address = "Address is required";
    if (!form.income.toString().trim()) e.income = "Monthly Income is required";
    if (!form.amount.toString().trim()) e.amount = "Loan Amount is required";
    if (!form.tenure.toString().trim()) e.tenure = "Tenure is required";
    if (!form.purpose.trim()) e.purpose = "Purpose is required";
    return e;
  };

  const handleAdd = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onAdd({ ...form, pan: form.pan.toUpperCase() });
    onClose();
  };

  const errStyle = {
    color: "#ef5350",
    fontSize: 11,
    marginTop: 3,
    fontWeight: 600,
  };
  const inputStyle = (key) => ({
    border: errors[key] ? "1px solid #ef5350" : undefined,
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="product-modal-large"
        style={{ width: 720 }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ color: "var(--gold)", marginBottom: 20 }}>
          Add New Application
        </h3>
        <div className="product-form">
          <h4>Personal Details</h4>
          <div className="product-form-grid">
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label
                style={{ color: "var(--gold)", fontSize: 12, fontWeight: 700 }}
              >
                Applicant Name *
              </label>
              <input
                type="text"
                value={form.applicant}
                onChange={(e) => set("applicant", e.target.value)}
                placeholder="Applicant Name"
                style={inputStyle("applicant")}
              />
              {errors.applicant && (
                <span style={errStyle}>{errors.applicant}</span>
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label
                style={{ color: "var(--gold)", fontSize: 12, fontWeight: 700 }}
              >
                Date of Birth *
              </label>
              <input
                type="date"
                value={form.dob}
                onChange={(e) => set("dob", e.target.value)}
                style={inputStyle("dob")}
              />
              {errors.dob && <span style={errStyle}>{errors.dob}</span>}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label
                style={{ color: "var(--gold)", fontSize: 12, fontWeight: 700 }}
              >
                PAN Number *{" "}
                <span style={{ color: "#8a99b5", fontWeight: 400 }}>
                  (e.g. ABCDE1234F)
                </span>
              </label>
              <input
                type="text"
                value={form.pan}
                onChange={(e) => set("pan", e.target.value.toUpperCase())}
                placeholder="ABCDE1234F"
                maxLength={10}
                style={{
                  ...inputStyle("pan"),
                  textTransform: "uppercase",
                  letterSpacing: 2,
                }}
              />
              {errors.pan && <span style={errStyle}>{errors.pan}</span>}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label
                style={{ color: "var(--gold)", fontSize: 12, fontWeight: 700 }}
              >
                Aadhaar Number *{" "}
                <span style={{ color: "#8a99b5", fontWeight: 400 }}>
                  (12 digits)
                </span>
              </label>
              <input
                type="text"
                value={form.aadhaar}
                onChange={(e) =>
                  set("aadhaar", e.target.value.replace(/\D/g, "").slice(0, 12))
                }
                placeholder="123456789012"
                maxLength={12}
                style={inputStyle("aadhaar")}
              />
              {errors.aadhaar && <span style={errStyle}>{errors.aadhaar}</span>}
            </div>
          </div>
          <div
            style={{
              marginTop: 12,
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            <label
              style={{ color: "var(--gold)", fontSize: 12, fontWeight: 700 }}
            >
              Address *
            </label>
            <textarea
              value={form.address}
              onChange={(e) => set("address", e.target.value)}
              rows={2}
              placeholder="Full residential address"
              style={inputStyle("address")}
            />
            {errors.address && <span style={errStyle}>{errors.address}</span>}
          </div>
          <h4>Loan Details</h4>
          <div className="product-form-grid">
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label
                style={{ color: "var(--gold)", fontSize: 12, fontWeight: 700 }}
              >
                Employment Type *
              </label>
              <select
                value={form.employment}
                onChange={(e) => set("employment", e.target.value)}
              >
                {[
                  "Salaried",
                  "Self-Employed",
                  "Business Owner",
                  "Student",
                  "Retired",
                ].map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label
                style={{ color: "var(--gold)", fontSize: 12, fontWeight: 700 }}
              >
                Loan Type *
              </label>
              <select
                value={form.loanType}
                onChange={(e) => set("loanType", e.target.value)}
              >
                {[
                  "Home Loan",
                  "Personal Loan",
                  "Business Loan",
                  "Education Loan",
                  "Vehicle Loan",
                ].map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label
                style={{ color: "var(--gold)", fontSize: 12, fontWeight: 700 }}
              >
                Monthly Income *
              </label>
              <input
                type="number"
                value={form.income}
                onChange={(e) => set("income", e.target.value)}
                placeholder="e.g. 50000"
                style={inputStyle("income")}
              />
              {errors.income && <span style={errStyle}>{errors.income}</span>}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label
                style={{ color: "var(--gold)", fontSize: 12, fontWeight: 700 }}
              >
                Loan Amount *
              </label>
              <input
                type="number"
                value={form.amount}
                onChange={(e) => set("amount", e.target.value)}
                placeholder="e.g. 500000"
                style={inputStyle("amount")}
              />
              {errors.amount && <span style={errStyle}>{errors.amount}</span>}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label
                style={{ color: "var(--gold)", fontSize: 12, fontWeight: 700 }}
              >
                Tenure (Months) *
              </label>
              <input
                type="number"
                value={form.tenure}
                onChange={(e) => set("tenure", e.target.value)}
                placeholder="e.g. 36"
                style={inputStyle("tenure")}
              />
              {errors.tenure && <span style={errStyle}>{errors.tenure}</span>}
            </div>
          </div>
          <div
            style={{
              marginTop: 12,
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            <label
              style={{ color: "var(--gold)", fontSize: 12, fontWeight: 700 }}
            >
              Purpose *
            </label>
            <textarea
              value={form.purpose}
              onChange={(e) => set("purpose", e.target.value)}
              rows={2}
              placeholder="Loan purpose / details"
              style={inputStyle("purpose")}
            />
            {errors.purpose && <span style={errStyle}>{errors.purpose}</span>}
          </div>
          <div
            style={{
              marginTop: 12,
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            <label
              style={{ color: "var(--gold)", fontSize: 12, fontWeight: 700 }}
            >
              Co-Applicant{" "}
              <span style={{ color: "#8a99b5", fontWeight: 400 }}>
                (optional)
              </span>
            </label>
            <input
              value={form.coApplicant}
              onChange={(e) => set("coApplicant", e.target.value)}
              placeholder="Name & relation (if any)"
            />
          </div>
        </div>
        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-success" onClick={handleAdd}>
            Add Application
          </button>
        </div>
      </div>
    </div>
  );
}

function EmailModal({ app, onClose, onSend }) {
  const [subject, setSubject] = useState(`Loan Application Status - ${app.id}`);

  const [message, setMessage] = useState(
    `Dear ${app.applicant},

Your loan application status is currently "${app.status}".

Loan ID: ${app.id}
Loan Type: ${app.loanType}
Amount: ${app.amount}

Thank you,
I-Loan Team`,
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="product-modal-large"
        style={{
          width: 680,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <h3
            style={{
              color: "var(--gold)",
              margin: 0,
            }}
          >
            Send Status Email
          </h3>

          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "#aaa",
              cursor: "pointer",
              fontSize: 18,
            }}
          >
            <FaTimes />
          </button>
        </div>

        <div style={{ marginBottom: 18 }}>
          <label className="form-label">Subject</label>

          <input
            className="form-input"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject"
          />
        </div>

        <div>
          <label className="form-label">Email Message</label>

          <textarea
            className="form-input"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{
              minHeight: 240,
              resize: "vertical",
            }}
          />
        </div>

        <div
          className="modal-actions"
          style={{
            marginTop: 24,
          }}
        >
          <button className="action-btn cancel" onClick={onClose}>
            Cancel
          </button>

          <button
            className="action-btn save"
            onClick={() =>
              onSend({
                subject,
                message,
              })
            }
          >
            Send Email
          </button>
        </div>
      </div>
    </div>
  );
}

/* KEEPING ALL YOUR ORIGINAL MODALS SAME */
/* EditModal, AddModal, EmailModal SAME AS YOUR ORIGINAL CODE */

/* ---------- MAIN COMPONENT ---------- */

function LoanApplications({ globalSearch }) {
  const [apps, setApps] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterType, setFilterType] = useState("");
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);

  // BACKEND PAGINATION
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const limit = 10;

  const showToast = (message, type = "success") => {
    setToast({
      message,
      type,
    });

    setTimeout(() => setToast(null), 3500);
  };

  const handleSaveEdit = async (updatedApp) => {
    try {
      await API.put(`/applications/${updatedApp.dbId}`, {
        applicant_name: updatedApp.applicant,

        pan_number: updatedApp.pan,

        aadhaar_number: updatedApp.aadhaar,

        monthly_income: updatedApp.income,

        loan_amount: updatedApp.amount,

        purpose: updatedApp.purpose,

        status: updatedApp.status,
      });

      showToast("Application updated successfully");

      setModal(null);

      fetchApplications();
    } catch (err) {
      console.log(err);

      showToast("Failed to update application", "error");
    }
  };

  const handleSendMail = ({ subject, message }) => {
    console.log("MAIL:", subject, message);

    showToast("Status email sent successfully");

    setModal(null);
  };

  // FETCH APPLICATIONS
  const fetchApplications = async () => {
    try {
      const q = (globalSearch || search || "").toString().trim();

      const res = await API.get(
        `/applications?page=${page}&limit=${limit}&search=${q}&status=${filterStatus}&loanType=${filterType}`,
      );

      const rows = res.data.data || res.data || [];

      const formatted = rows.map((item) => ({
        id: item.loan_code,
        dbId: item.id,
        applicant: item.applicant_name,
        dob: item.dob,
        pan: item.pan_number,
        aadhaar: item.aadhaar_number,
        address: item.address,
        employment: item.employment_type,
        income: item.monthly_income,
        loanType: item.loan_type,
        amount: item.loan_amount,
        tenure: item.tenure_months,
        purpose: item.purpose,
        coApplicant: item.co_applicant_details,
        applicationDate: item.application_date,
        status: item.status,
        timeline: item.timeline || [],
      }));

      setApps(formatted);

      setTotalPages(res.data.pagination?.totalPages || 1);

      setTotalRecords(res.data.pagination?.total || rows.length);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [page, search, filterStatus, filterType, globalSearch]);

  return (
    <div className="page-container">
      <Toast toast={toast} onClose={() => setToast(null)} />

      <div className="page-header">
        <div>
          <h2>Loan Applications</h2>

          <p>
            Create, review and track submitted loan applications with status
            history.
          </p>
        </div>

        <button
          onClick={() =>
            setModal({
              type: "add",
            })
          }
        >
          <FaPlus /> Add Application
        </button>
      </div>

      {/* FILTERS */}

      <div className="filter-box">
        <input
          placeholder="Search applicant, PAN, loan ID..."
          value={search}
          onChange={(e) => {
            setPage(1);

            setSearch(e.target.value);
          }}
          style={{ flex: 2 }}
        />

        <select
          value={filterStatus}
          onChange={(e) => {
            setPage(1);

            setFilterStatus(e.target.value);
          }}
        >
          <option value="">All Statuses</option>

          {[
            "Draft",
            "Submitted",
            "Under Review",
            "Approved",
            "Rejected",
            "Disbursed",
          ].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>

        <select
          value={filterType}
          onChange={(e) => {
            setPage(1);

            setFilterType(e.target.value);
          }}
        >
          <option value="">All Loan Types</option>

          {[
            "Home Loan",
            "Personal Loan",
            "Business Loan",
            "Education Loan",
            "Vehicle Loan",
          ].map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>

        {(search || filterStatus || filterType) && (
          <button
            onClick={() => {
              setPage(1);

              setSearch("");

              setFilterStatus("");

              setFilterType("");
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
            <FaTimes />
            Clear
          </button>
        )}
      </div>

      {/* TABLE */}

      <div className="table-wrapper table card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Loan ID</th>
              <th>Applicant</th>
              <th>PAN</th>
              <th>Loan Type</th>
              <th>Income</th>
              <th>Amount</th>
              <th>Tenure</th>
              <th>App. Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {apps.length === 0 ? (
              <tr>
                <td
                  colSpan={10}
                  style={{
                    textAlign: "center",
                    color: "var(--text-secondary)",
                    padding: 40,
                  }}
                >
                  No applications found.
                </td>
              </tr>
            ) : (
              apps.map((app) => (
                <tr key={app.dbId}>
                  <td
                    style={{
                      color: "var(--gold)",
                      fontWeight: 700,
                    }}
                  >
                    {app.id}
                  </td>

                  <td
                    style={{
                      fontWeight: 600,
                    }}
                  >
                    {app.applicant}
                  </td>

                  <td
                    style={{
                      fontFamily: "monospace",
                      fontSize: 13,
                    }}
                  >
                    {app.pan}
                  </td>

                  <td>{app.loanType}</td>

                  <td>{app.income}</td>

                  <td
                    style={{
                      fontWeight: 700,
                    }}
                  >
                    {app.amount}
                  </td>

                  <td>{app.tenure}</td>

                  <td
                    style={{
                      color: "var(--text-secondary)",
                      fontSize: 13,
                    }}
                  >
                    {app.applicationDate}
                  </td>

                  <td>
                    <StatusBadge status={app.status} />
                  </td>

                  <td className="action-cell">
                    <button
                      className="icon-btn view"
                      title="View Application"
                      onClick={() =>
                        setModal({
                          type: "view",
                          app,
                        })
                      }
                    >
                      <FaEye />
                    </button>

                    <button
                      className="icon-btn"
                      style={{
                        background: "var(--warning)",
                      }}
                      title="Edit Application"
                      onClick={() =>
                        setModal({
                          type: "edit",
                          app,
                        })
                      }
                    >
                      <FaEdit />
                    </button>

                    <button
                      className="icon-btn"
                      style={{
                        background: "rgba(156,39,176,0.7)",
                      }}
                      title="Application Timeline"
                      onClick={() =>
                        setModal({
                          type: "timeline",
                          app,
                        })
                      }
                    >
                      <FaHistory />
                    </button>

                    <button
                      className="icon-btn"
                      style={{
                        background: "rgba(33,150,243,0.7)",
                      }}
                      title="Send Status Email"
                      onClick={() =>
                        setModal({
                          type: "email",
                          app,
                        })
                      }
                    >
                      <FaEnvelope />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* BACKEND PAGINATION */}

      <PaginationControls
        page={page}
        totalPages={totalPages}
        totalRecords={totalRecords}
        limit={limit}
        onPageChange={setPage}
      />

      {/* STATUS CARDS */}

      <div
        style={{
          display: "flex",
          gap: 10,
          marginTop: 16,
          flexWrap: "wrap",
        }}
      >
        {Object.entries(STATUS_COLORS).map(([s, col]) => {
          const count = apps.filter((a) => a.status === s).length;

          return (
            <div
              key={s}
              onClick={() => {
                setPage(1);

                setFilterStatus(filterStatus === s ? "" : s);
              }}
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

      {/* MODALS */}

      {modal?.type === "add" && (
        <AddModal
          onClose={() => setModal(null)}
          onAdd={async (a) => {
            try {
              await API.post("/applications", {
                applicant_name: a.applicant,
                dob: a.dob,
                pan_number: a.pan,
                aadhaar_number: a.aadhaar,
                address: a.address,
                employment_type: a.employment,
                monthly_income: a.income,
                loan_type: a.loanType,
                loan_amount: a.amount,
                tenure_months: a.tenure,
                purpose: a.purpose,
                co_applicant_details: a.coApplicant,
                status: a.status,
              });
              fetchApplications();
              showToast("Application created successfully", "success");
            } catch (err) {
              console.log(err);
              showToast("Failed to create application", "error");
            }
          }}
        />
      )}

      {modal?.type === "view" && (
        <ViewModal app={modal.app} onClose={() => setModal(null)} />
      )}

      {modal?.type === "edit" && (
        <EditModal
          app={modal.app}
          onClose={() => setModal(null)}
          onSave={handleSaveEdit}
        />
      )}

      {modal?.type === "email" && (
        <EmailModal
          app={modal.app}
          onClose={() => setModal(null)}
          onSend={handleSendMail}
        />
      )}

      {modal?.type === "timeline" && (
        <TimelineModal app={modal.app} onClose={() => setModal(null)} />
      )}
    </div>
  );
}

export default LoanApplications;
