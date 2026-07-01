import { useState, useEffect } from "react";

import API from "../../../../services/api.js";

import { Link } from "react-router-dom";

import {
  FaEnvelope,
  FaEye,
  FaFileExport,
  FaPlus,
  FaSearch,
} from "react-icons/fa";

import "./EnquiriesList.css";

import PaginationControls from "../../../../components/PaginationControls";

function EnquiriesList() {

  const [searchTerm,
    setSearchTerm] =
    useState("");

  const [loanFilter,
    setLoanFilter] =
    useState("");

  const [statusFilter,
    setStatusFilter] =
    useState("");

  const [enquiries,
    setEnquiries] =
    useState([]);

  const [showModal,
    setShowModal] =
    useState(false);

  const [toast,
    setToast] =
    useState(false);

  // BACKEND PAGINATION
  const [page,
    setPage] =
    useState(1);

  const [totalPages,
    setTotalPages] =
    useState(1);

  const [totalRecords,
    setTotalRecords] =
    useState(0);

  const limit = 10;

  const [formData,
    setFormData] =
    useState({
      name: "",
      mobile: "",
      email: "",
      loanType: "",
      amount: "",
      city: "",
    });

  // FETCH ENQUIRIES
  const fetchEnquiries =
    async () => {

      try {

        const res =
          await API.get(
            `/enquiries?page=${page}&limit=${limit}&search=${searchTerm}&loanType=${loanFilter}&status=${statusFilter}`
          );

        setEnquiries(
          res.data.data
        );

        setTotalPages(
          res.data.pagination
            .totalPages
        );

        setTotalRecords(
          res.data.pagination
            .total
        );

      } catch (err) {

        console.log(err);
      }
    };

  useEffect(() => {

    fetchEnquiries();

  }, [
    page,
    searchTerm,
    loanFilter,
    statusFilter,
  ]);

  // HANDLE INPUT
  const handleChange =
    (e) => {

      setFormData({
        ...formData,
        [e.target.name]:
          e.target.value,
      });
    };

  // ADD ENQUIRY
  const handleAddEnquiry =
    async () => {

      try {

        await API.post(
          "/enquiries",
          {
            full_name:
              formData.name,

            mobile:
              formData.mobile,

            email:
              "customer@gmail.com",

            loan_type:
              formData.loanType,

            loan_amount:
              formData.amount,

            city:
              formData.city,

            message:
              "New enquiry from admin",
          }
        );

        fetchEnquiries();

        setShowModal(
          false
        );

        setFormData({
          name: "",
          mobile: "",
      email: "",
          loanType: "",
          amount: "",
          city: "",
        });

        setToast(true);

        setTimeout(
          () =>
            setToast(
              false
            ),
          3000
        );

      } catch (err) {

        console.log(err);
      }
    };

  // EXPORT CSV
  const handleExport =
    () => {

      const headers = [
        "ID",
        "Customer",
        "Mobile",
        "Loan Type",
        "Amount",
        "City",
        "Status",
      ];

      const rows =
        enquiries.map(
          (e) => [
            e.id,
            e.full_name,
            e.mobile,
            e.loan_type,
            e.loan_amount,
            e.city,
            e.status,
          ]
        );

      const csvContent =
        [headers, ...rows]
          .map((row) =>
            row.join(",")
          )
          .join("\n");

      const blob =
        new Blob(
          [csvContent],
          {
            type:
              "text/csv;charset=utf-8;",
          }
        );

      const link =
        document.createElement(
          "a"
        );

      link.href =
        URL.createObjectURL(
          blob
        );

      link.download =
        "loan-enquiries.csv";

      link.click();
    };

  return (
    <div className="page-container">

      {/* HEADER */}
      <div className="page-header">

        <div>
          <h2>
            Loan Enquiries
          </h2>

          <p>
            Capture customer
            enquiries and
            convert genuine
            leads into
            applications.
          </p>
        </div>

        <div className="header-btns">

          <button
            className="primary-btn"
            onClick={() =>
              setShowModal(
                true
              )
            }
          >
            <FaPlus /> Add
            Enquiry
          </button>

          <button
            className="secondary-btn"
            onClick={
              handleExport
            }
          >
            <FaFileExport />{" "}
            Export
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="stats-grid">

        <div className="stats-card">
          <h3>
            {
              totalRecords
            }
          </h3>

          <p>
            Total Enquiries
          </p>
        </div>

        <div className="stats-card">
          <h3>
            {
              enquiries.filter(
                (e) =>
                  e.status ===
                  "In Progress"
              ).length
            }
          </h3>

          <p>
            In Progress
          </p>
        </div>

        <div className="stats-card">
          <h3>
            {
              enquiries.filter(
                (e) =>
                  e.status ===
                  "Converted"
              ).length
            }
          </h3>

          <p>
            Converted
          </p>
        </div>

        <div className="stats-card">
          <h3>
            {
              enquiries.filter(
                (e) =>
                  e.status ===
                  "Rejected"
              ).length
            }
          </h3>

          <p>
            Rejected
          </p>
        </div>
      </div>

      {/* FILTERS */}
      <div className="filter-box">

        <div className="search-box">

          <FaSearch />

          <input
            type="search"
            placeholder="Search by name, mobile, city..."
            autoComplete="off"
            value={
              searchTerm
            }
            onChange={(
              e
            ) => {
              setPage(1);

              setSearchTerm(
                e.target
                  .value
              );
            }}
          />
        </div>

        <select
          value={
            loanFilter
          }
          onChange={(
            e
          ) => {

            setPage(1);

            setLoanFilter(
              e.target
                .value
            );
          }}
        >
          <option value="">
            Loan Type
          </option>

          <option value="Home Loan">
            Home Loan
          </option>

          <option value="Personal Loan">
            Personal Loan
          </option>

          <option value="Business Loan">
            Business Loan
          </option>

          <option value="Education Loan">
            Education Loan
          </option>

          <option value="Vehicle Loan">
            Vehicle Loan
          </option>
        </select>

        <select
          value={
            statusFilter
          }
          onChange={(
            e
          ) => {

            setPage(1);

            setStatusFilter(
              e.target
                .value
            );
          }}
        >
          <option value="">
            Status
          </option>

          <option value="New">
            New
          </option>

          <option value="In Progress">
            In Progress
          </option>

          <option value="Converted">
            Converted
          </option>

          <option value="Rejected">
            Rejected
          </option>
        </select>

        <input type="date" />
        <input type="date" />
      </div>

      {/* TABLE */}
      <div className="table-wrapper card">

        <table className="admin-table">

          <thead>
            <tr>
              <th>ID</th>
              <th>
                Customer
              </th>
              <th>
                Mobile
              </th>
              <th>
                Loan Type
              </th>
              <th>
                Amount
              </th>
              <th>City</th>
              <th>
                Status
              </th>
              <th>
                Actions
              </th>
            </tr>
          </thead>

          <tbody>

            {enquiries.length ===
            0 ? (

              <tr>
                <td
                  colSpan={8}
                  style={{
                    textAlign:
                      "center",
                    padding: 40,
                    color:
                      "#94a3b8",
                  }}
                >
                  No enquiries
                  found.
                </td>
              </tr>

            ) : (

              enquiries.map(
                (item) => (

                  <tr
                    key={
                      item.id
                    }
                  >
                    <td>
                      {
                        item.id
                      }
                    </td>

                    <td>
                      {
                        item.full_name
                      }
                    </td>

                    <td>
                      {
                        item.mobile
                      }
                    </td>

                    <td>
                      {
                        item.loan_type
                      }
                    </td>

                    <td>
                      {
                        item.loan_amount
                      }
                    </td>

                    <td>
                      {
                        item.city
                      }
                    </td>

                    <td>

                      <span
                        className={`status-badge ${item.status
                          .toLowerCase()
                          .replaceAll(
                            " ",
                            "-"
                          )}`}
                      >
                        {
                          item.status
                        }
                      </span>
                    </td>

                    <td className="action-cell">

                      <Link
                        to={`/admin/enquiries/${item.id}`}
                        className="icon-btn view"
                      >
                        <FaEye />
                      </Link>

                      <button className="icon-btn mail">
                        <FaEnvelope />
                      </button>
                    </td>
                  </tr>
                )
              )
            )}
          </tbody>
        </table>

        {/* PAGINATION */}
        <PaginationControls
          page={page}
          totalPages={
            totalPages
          }
          totalRecords={
            totalRecords
          }
          limit={limit}
          onPageChange={
            setPage
          }
        />
      </div>

      {/* TOAST */}
      {toast && (
        <div className="custom-toast">
          Enquiry Added
          Successfully
        </div>
      )}

      {/* MODAL */}
      {showModal && (

        <div className="custom-modal-overlay">

          <div className="custom-modal">

            <h3>
              Add New
              Enquiry
            </h3>

            <p className="modal-subtitle">
              Enter customer
              enquiry details
              below.
            </p>

            <input
              type="text"
              name="name"
              placeholder="Customer Name"
              value={
                formData.name
              }
              onChange={
                handleChange
              }
            />

            <input
              type="text"
              name="mobile"
              placeholder="Mobile Number"
              value={
                formData.mobile
              }
              onChange={
                handleChange
              }
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={
                formData.email
              }
              onChange={
                handleChange
              }
            />

            <select
              name="loanType"
              value={
                formData.loanType
              }
              onChange={
                handleChange
              }
            >
              <option value="">
                Select Loan
                Type
              </option>

              <option value="Home Loan">
                Home Loan
              </option>

              <option value="Personal Loan">
                Personal Loan
              </option>

              <option value="Business Loan">
                Business Loan
              </option>

              <option value="Education Loan">
                Education Loan
              </option>

              <option value="Vehicle Loan">
                Vehicle Loan
              </option>
            </select>

            <input
              type="text"
              name="amount"
              placeholder="Loan Amount"
              value={
                formData.amount
              }
              onChange={
                handleChange
              }
            />

            <input
              type="text"
              name="city"
              placeholder="City"
              value={
                formData.city
              }
              onChange={
                handleChange
              }
            />

            <div className="modal-actions">

              <button
                className="secondary-btn"
                onClick={() =>
                  setShowModal(
                    false
                  )
                }
              >
                Cancel
              </button>

              <button
                className="primary-btn"
                onClick={
                  handleAddEnquiry
                }
              >
                Add Enquiry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EnquiriesList;