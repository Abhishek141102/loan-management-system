import { useState, useEffect } from "react";

import {
  FaIdCard,
  FaFileExport,
  FaSearch,
  FaTimes,
  FaFileExcel,
  FaFilePdf,
} from "react-icons/fa";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

import "./CustomersList.css";

import PaginationControls from "../../../../components/PaginationControls";

function formatCustomerDate(value) {
  if (!value || value === "N/A") return value || "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(date);
}

function ProfileField({ label, value }) {
  return (
    <div className="customer-profile-field">
      <span>{label}</span>
      <strong>{value || "—"}</strong>
    </div>
  );
}

function CustomersList({ globalSearch = "" }) {
  const [customers, setCustomers] = useState([]);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("");

  const [loanTypeFilter, setLoanTypeFilter] = useState("");

  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  // BACKEND PAGINATION
  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  const [totalRecords, setTotalRecords] = useState(0);

  const limit = 10;

  useEffect(() => {
    fetchCustomers();
  }, [page, search, statusFilter, loanTypeFilter, globalSearch]);

  useEffect(() => {
    setPage(1);
  }, [globalSearch]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);

      
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const response = await fetch(
  `${API_BASE}/customers?page=${page}&limit=${limit}&search=${encodeURIComponent(globalSearch.trim() || search.trim())}&status=${encodeURIComponent(statusFilter)}&loanType=${encodeURIComponent(loanTypeFilter)}`
);


      const res = await response.json();

      // SAFE RESPONSE
      const rows = res.data || res || [];

      const formattedCustomers = rows.map((customer) => ({
        id: customer.id || "N/A",

        name: customer.full_name || "N/A",

        mobile: customer.mobile || "N/A",

        dob: formatCustomerDate(customer.dob),

        address: customer.address || "N/A",

        loanType: customer.loan_type || "N/A",

        approvedAmount: customer.approved_amount
          ? `₹${Number(customer.approved_amount).toLocaleString("en-IN")}`
          : "N/A",

        emi: customer.emi_amount
          ? `₹${Number(customer.emi_amount).toLocaleString("en-IN")}`
          : "N/A",

        status: customer.status || "Pending",

        loans: [
          {
            loanId: customer.customer_code || customer.id,

            type: customer.loan_type || "N/A",

            amount: customer.approved_amount
              ? `₹${Number(customer.approved_amount).toLocaleString("en-IN")}`
              : "N/A",

            status: customer.status || "Pending",
          },
        ],

      }));

      setCustomers(formattedCustomers);

      // SAFE PAGINATION
      setTotalPages(res.pagination?.totalPages || 1);

      setTotalRecords(res.pagination?.total || rows.length);
    } catch (error) {
      console.log("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  const exportCustomers = async (format) => {
    try {
      setExporting(true);
      const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      const params = new URLSearchParams({
        page: "1",
        limit: String(Math.max(totalRecords, 1)),
        search: globalSearch.trim() || search.trim(),
        status: statusFilter,
        loanType: loanTypeFilter,
      });
      const response = await fetch(`${API_BASE}/customers?${params.toString()}`);
      if (!response.ok) throw new Error("Could not fetch customers for export");

      const result = await response.json();
      const rows = (result.data || []).map((customer) => [
        customer.id,
        customer.full_name || "",
        customer.mobile || "",
        customer.loan_type || "",
        customer.approved_amount ?? "",
        customer.emi_amount ?? "",
        customer.status || "",
      ]);
      const data = [
        ["Customer ID", "Name", "Mobile", "Loan Type", "Approved Amount", "EMI", "Status"],
        ...rows,
      ];

      if (format === "excel") {
        const worksheet = XLSX.utils.aoa_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Customers");
        XLSX.writeFile(workbook, "customers.xlsx");
      } else if (format === "pdf") {
        const doc = new jsPDF({ orientation: "landscape" });
        autoTable(doc, {
          head: [data[0]],
          body: data.slice(1),
          styles: { fontSize: 8 },
          headStyles: { fillColor: [180, 145, 45] },
        });
        doc.save("customers.pdf");
      } else {
        const csv = data
          .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","))
          .join("\r\n");
        const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "customers.csv";
        link.click();
        window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      }
    } catch (error) {
      console.error("Customer export failed:", error);
      alert("Customer export failed. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>Customer Records</h2>

          <p>
            View customer details, loan information and account status.
          </p>
        </div>

        <div className="export-actions">
          <button disabled={exporting || loading} onClick={() => exportCustomers("excel")}>
            <FaFileExcel />
            {exporting ? "Exporting..." : "Excel"}
          </button>

          <button disabled={exporting || loading} onClick={() => exportCustomers("pdf")}>
            <FaFilePdf />
            {exporting ? "Exporting..." : "PDF"}
          </button>

          <button disabled={exporting || loading} onClick={() => exportCustomers("csv")}>
            <FaFileExport />
            {exporting ? "Exporting..." : "Export Customers"}
          </button>
        </div>
      </div>

      {/* FILTERS */}

      <div className="filter-box">
        <div className="customer-search-filter">
          <FaSearch />
          <input
            placeholder="Search name, mobile, loan type..."
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => {
            setPage(1);

            setStatusFilter(e.target.value);
          }}
        >
          <option value="">All Status</option>

          <option value="Active">Active</option>

          <option value="Approved">Approved</option>

          <option value="Disbursed">Disbursed</option>

          <option value="Pending">Pending</option>
        </select>

        <select
          value={loanTypeFilter}
          onChange={(e) => {
            setPage(1);

            setLoanTypeFilter(e.target.value);
          }}
        >
          <option value="">All Loan Types</option>

          <option value="Home Loan">Home Loan</option>

          <option value="Personal Loan">Personal Loan</option>

          <option value="Business Loan">Business Loan</option>

          <option value="Education Loan">Education Loan</option>

          <option value="Vehicle Loan">Vehicle Loan</option>
        </select>

        {(search || statusFilter || loanTypeFilter) && (
          <button
            className="customer-filter-clear"
            onClick={() => {
              setPage(1);
              setSearch("");
              setStatusFilter("");
              setLoanTypeFilter("");
            }}
          >
            <FaTimes /> Clear
          </button>
        )}
      </div>

      {/* TABLE */}

      <div className="table-wrapper table card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Customer ID</th>

              <th>Name</th>

              <th>Mobile</th>

              <th>Loan Type</th>

              <th>Approved Amount</th>

              <th>EMI</th>

              <th>Status</th>

              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8">Loading customers...</td>
              </tr>
            ) : customers.length === 0 ? (
              <tr>
                <td colSpan="8">No customers found</td>
              </tr>
            ) : (
              customers.map((customer, index) => (
                <tr key={`${customer.id}-${index}`}>
                  <td>{customer.id}</td>

                  <td>{customer.name}</td>

                  <td>{customer.mobile}</td>

                  <td>{customer.loanType}</td>

                  <td>{customer.approvedAmount}</td>

                  <td>{customer.emi}</td>

                  <td>
                    <span
                      className={`status-badge ${customer.status.toLowerCase()}`}
                    >
                      {customer.status}
                    </span>
                  </td>

                  <td className="action-cell">
                    <button
                      className="icon-btn view"
                      onClick={() => setSelectedCustomer(customer)}
                    >
                      <FaIdCard />
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

      {/* MODAL */}

      {selectedCustomer && (
        <div className="customer-modal-overlay">
          <div className="customer-modal">
            <div className="modal-header">
              <h3>Customer Full Profile</h3>

              <button onClick={() => setSelectedCustomer(null)}>
                <FaTimes />
              </button>
            </div>

            <div className="modal-grid">
              <section className="customer-profile-section">
                <h4>Personal Details</h4>
                <div className="customer-profile-fields">
                  <ProfileField label="Customer ID" value={selectedCustomer.id} />
                  <ProfileField label="Name" value={selectedCustomer.name} />
                  <ProfileField label="Date of Birth" value={selectedCustomer.dob} />
                  <ProfileField label="Mobile" value={selectedCustomer.mobile} />
                  <ProfileField label="Address" value={selectedCustomer.address} />
                </div>
              </section>

              <section className="customer-profile-section">
                <h4>Loan Details</h4>
                <div className="customer-profile-fields">
                  <ProfileField label="Loan Type" value={selectedCustomer.loanType} />
                  <ProfileField label="Approved Amount" value={selectedCustomer.approvedAmount} />
                  <ProfileField label="EMI" value={selectedCustomer.emi} />
                  <ProfileField label="Status" value={selectedCustomer.status} />
                </div>
              </section>
            </div>

            <section className="customer-loans-section">
              <h4>Linked Loans</h4>
              <div className="customer-loans-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Loan ID</th>
                      <th>Type</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedCustomer.loans.map((loan, i) => (
                      <tr key={`${loan.loanId}-${i}`}>
                        <td>{loan.loanId}</td>
                        <td>{loan.type}</td>
                        <td>{loan.amount}</td>
                        <td>{loan.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomersList;
