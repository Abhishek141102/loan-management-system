import { useState, useEffect } from "react";

import {
  FaEnvelope,
  FaIdCard,
  FaFileExport,
  FaTimes,
  FaFileExcel,
  FaFilePdf,
} from "react-icons/fa";

import "./CustomersList.css";

import PaginationControls from "../../../../components/PaginationControls";

function CustomersList() {
  const [customers, setCustomers] = useState([]);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("");

  const [loanTypeFilter, setLoanTypeFilter] = useState("");

  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [loading, setLoading] = useState(true);

  // BACKEND PAGINATION
  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  const [totalRecords, setTotalRecords] = useState(0);

  const limit = 10;

  useEffect(() => {
    fetchCustomers();
  }, [page, search, statusFilter, loanTypeFilter]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `http://localhost:5000/api/customers?page=${page}&limit=${limit}&search=${search}&status=${statusFilter}&loanType=${loanTypeFilter}`,
      );

      const res = await response.json();

      // SAFE RESPONSE
      const rows = res.data || res || [];

      const formattedCustomers = rows.map((customer) => ({
        id: customer.id || "N/A",

        name: customer.full_name || "N/A",

        mobile: customer.mobile || "N/A",

        dob: customer.dob || "N/A",

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

        communication: [
          "Loan record fetched from database",

          "Customer profile available",
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

  const resendEmail = (c) => {
    alert(`Email resent to ${c.name}`);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>Customer Records</h2>

          <p>
            Complete customer profiles with KYC status, loan history and
            communication log.
          </p>
        </div>

        <div className="export-actions">
          <button onClick={() => alert("Customer data exported as Excel")}>
            <FaFileExcel />
            Excel
          </button>

          <button onClick={() => alert("Customer data exported as PDF")}>
            <FaFilePdf />
            PDF
          </button>

          <button>
            <FaFileExport />
            Export Customers
          </button>
        </div>
      </div>

      {/* FILTERS */}

      <div className="filter-box">
        <input
          placeholder="Search name, mobile, loan type, status..."
          value={search}
          onChange={(e) => {
            setPage(1);

            setSearch(e.target.value);
          }}
        />

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

                    <button
                      className="icon-btn"
                      onClick={() => resendEmail(customer)}
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
              <div>
                <h4>Personal Details</h4>

                <p>
                  <strong>ID:</strong> {selectedCustomer.id}
                </p>

                <p>
                  <strong>Name:</strong> {selectedCustomer.name}
                </p>

                <p>
                  <strong>DOB:</strong> {selectedCustomer.dob}
                </p>

                <p>
                  <strong>Mobile:</strong> {selectedCustomer.mobile}
                </p>

                <p>
                  <strong>Address:</strong> {selectedCustomer.address}
                </p>
              </div>

              <div>
                <h4>Loan Details</h4>

                <p>
                  <strong>Loan Type:</strong> {selectedCustomer.loanType}
                </p>

                <p>
                  <strong>Approved Amount:</strong>{" "}
                  {selectedCustomer.approvedAmount}
                </p>

                <p>
                  <strong>EMI:</strong> {selectedCustomer.emi}
                </p>

                <p>
                  <strong>Status:</strong> {selectedCustomer.status}
                </p>
              </div>
            </div>

            <h4>All Linked Loans</h4>

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

            <h4>Communication Log</h4>

            {selectedCustomer.communication.map((log, i) => (
              <div className="customer-log-item" key={i}>
                {log}

                <button onClick={() => resendEmail(selectedCustomer)}>
                  Resend Email
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomersList;
