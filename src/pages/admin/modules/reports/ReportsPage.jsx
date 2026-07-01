import React, { useEffect, useMemo, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./ReportsPage.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
);

const API_BASE = "http://localhost:5000/api";

function ReportsPage() {
  const [reportRows, setReportRows] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    search: "",
    reportType: "All Reports",
    loanType: "All",
    status: "All",
    fromDate: "",
    toDate: "",
  });

  // Fetch table data from backend with filters
  const fetchReportData = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.loanType !== "All")
        params.append("loan_type", filters.loanType);
      if (filters.status !== "All") params.append("status", filters.status);
      if (filters.fromDate) params.append("from_date", filters.fromDate);
      if (filters.toDate) params.append("to_date", filters.toDate);
      if (filters.search) params.append("search", filters.search);

      const res = await fetch(`${API_BASE}/reports?${params.toString()}`);
      const data = await res.json();
      setReportRows(data);
    } catch (err) {
      console.error("Failed to fetch report data:", err);
    }
  };

  // Fetch chart summary once on mount
  const fetchSummary = async () => {
    try {
      const res = await fetch(`${API_BASE}/reports/summary`);
      const data = await res.json();
      setSummary(data);
    } catch (err) {
      console.error("Failed to fetch summary:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  useEffect(() => {
    fetchReportData();
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      reportType: "All Reports",
      loanType: "All",
      status: "All",
      fromDate: "",
      toDate: "",
    });
  };

  // ─── CHART DATA (from API or fallback) ────────────────────────────────────

  const monthlyApplications = useMemo(() => {
    if (!summary?.monthly?.length) {
      return {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
          {
            label: "Applications",
            data: [0, 0, 0, 0, 0, 0],
            backgroundColor: "#c9a84c",
            borderColor: "#e0bb6a",
            borderWidth: 1,
            borderRadius: 8,
          },
        ],
      };
    }
    return {
      labels: summary.monthly.map((m) => m.month),
      datasets: [
        {
          label: "Applications",
          data: summary.monthly.map((m) => m.total),
          backgroundColor: "#c9a84c",
          borderColor: "#e0bb6a",
          borderWidth: 1,
          borderRadius: 8,
        },
      ],
    };
  }, [summary]);

  const loanStatusData = useMemo(() => {
    if (!summary?.statusBreakdown?.length) {
      return {
        labels: ["No Data"],

        datasets: [
          {
            data: [1],

            backgroundColor: ["#8a99b5"],

            borderColor: "#162040",

            borderWidth: 4,
          },
        ],
      };
    }

    return {
      labels: summary.statusBreakdown.map((item) => item.status),

      datasets: [
        {
          data: summary.statusBreakdown.map((item) => item.total),

          backgroundColor: [
            "#28a745",
            "#dc3545",
            "#ffc107",
            "#17a2b8",
            "#6f42c1",
            "#20c997",
            "#fd7e14",
          ],

          borderColor: "#162040",

          borderWidth: 4,

          hoverOffset: 10,
        },
      ],
    };
  }, [summary]);

  const loanTypeData = useMemo(() => {
    if (!summary?.loanTypes?.length) {
      return {
        labels: ["No Data"],
        datasets: [
          {
            data: [1],
            backgroundColor: ["#8a99b5"],
            borderColor: "#162040",
            borderWidth: 4,
          },
        ],
      };
    }
    const colors = [
      "#c9a84c",
      "#17a2b8",
      "#6f42c1",
      "#fd7e14",
      "#20c997",
      "#e83e8c",
    ];
    return {
      labels: summary.loanTypes.map((lt) => lt.loan_type),
      datasets: [
        {
          data: summary.loanTypes.map((lt) => lt.total),
          backgroundColor: summary.loanTypes.map(
            (_, i) => colors[i % colors.length],
          ),
          borderColor: "#162040",
          borderWidth: 4,
          hoverOffset: 10,
        },
      ],
    };
  }, [summary]);

  const documentRateData = useMemo(() => {
    if (!summary?.docVerification?.length) {
      return {
        labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
        datasets: [
          {
            label: "Verified Documents",
            data: [0, 0, 0, 0],
            tension: 0.4,
            borderColor: "#c9a84c",
            backgroundColor: "rgba(201, 168, 76, 0.18)",
            pointBackgroundColor: "#e0bb6a",
            pointBorderColor: "#ffffff",
            pointRadius: 5,
            fill: true,
          },
        ],
      };
    }
    return {
      labels: summary.docVerification.map((_, i) => `Week ${i + 1}`),
      datasets: [
        {
          label: "Verified Documents",
          data: summary.docVerification.map((d) => d.verified),
          tension: 0.4,
          borderColor: "#c9a84c",
          backgroundColor: "rgba(201, 168, 76, 0.18)",
          pointBackgroundColor: "#e0bb6a",
          pointBorderColor: "#ffffff",
          pointRadius: 5,
          fill: true,
        },
      ],
    };
  }, [summary]);

  const turnaroundData = useMemo(() => {
    if (!summary?.turnaround?.length) {
      return {
        labels: ["No Data"],
        datasets: [
          {
            label: "Avg Days",
            data: [0],
            backgroundColor: "#17a2b8",
            borderColor: "#5eead4",
            borderWidth: 1,
            borderRadius: 8,
          },
        ],
      };
    }
    return {
      labels: summary.turnaround.map((t) => t.loan_type),
      datasets: [
        {
          label: "Avg Days",
          data: summary.turnaround.map((t) => t.avg_days),
          backgroundColor: "#17a2b8",
          borderColor: "#5eead4",
          borderWidth: 1,
          borderRadius: 8,
        },
      ],
    };
  }, [summary]);

  // ─── EXPORTS ──────────────────────────────────────────────────────────────

  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(reportRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Loan Reports");
    XLSX.writeFile(workbook, "loan-reports.xlsx");
  };

  const exportCSV = () => {
    const worksheet = XLSX.utils.json_to_sheet(reportRows);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "loan-reports.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("I Loan Management System - Reports", 14, 15);
    autoTable(doc, {
      startY: 25,
      head: [["Loan ID", "Name", "Loan Type", "Amount", "Status", "Date"]],
      body: reportRows.map((row) => [
        row.loan_id,
        row.name,
        row.loan_type,
        `Rs. ${Number(row.amount).toLocaleString("en-IN")}`,
        row.status,
        row.date,
      ]),
    });
    doc.save("loan-reports.pdf");
  };

  // ─── CHART OPTIONS ────────────────────────────────────────────────────────

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "#dbe4ff",
          font: { size: 13, weight: "600" },
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
    },
    scales: {
      x: {
        ticks: { color: "#8a99b5" },
        grid: { color: "rgba(255,255,255,0.06)" },
      },
      y: {
        ticks: { color: "#8a99b5" },
        grid: { color: "rgba(255,255,255,0.06)" },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "62%",
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#dbe4ff",
          padding: 18,
          font: { size: 13, weight: "600" },
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        backgroundColor: "#0f1f3d",
        titleColor: "#ffffff",
        bodyColor: "#dbe4ff",
        borderColor: "#c9a84c",
        borderWidth: 1,
      },
    },
  };

  // ─── RENDER ───────────────────────────────────────────────────────────────

  return (
    <div className="reports-page">
      <div className="reports-header">
        <div>
          <p className="page-label">Reports & Analytics</p>
          <h2>Loan Reports Dashboard</h2>
          <p className="page-subtitle">
            Track enquiries, applications, documents, approvals and loan status.
          </p>
        </div>
        <div className="report-actions">
          <button onClick={exportExcel}>Export Excel</button>
          <button onClick={exportPDF}>Export PDF</button>
          <button onClick={exportCSV}>Export CSV</button>
        </div>
      </div>

      <div className="report-filters">
        <input
          type="text"
          name="search"
          placeholder="Search by loan ID, name, status..."
          value={filters.search}
          onChange={handleFilterChange}
        />

        <select
          name="reportType"
          value={filters.reportType}
          onChange={handleFilterChange}
        >
          <option>All Reports</option>
          <option>Enquiry Report</option>
          <option>Application Status Report</option>
          <option>Document Verification Report</option>
          <option>Approved Loans Report</option>
          <option>Rejected Loans Report</option>
        </select>

        <select
          name="loanType"
          value={filters.loanType}
          onChange={handleFilterChange}
        >
          <option>All</option>
          <option>Home Loan</option>
          <option>Personal Loan</option>
          <option>Business Loan</option>
          <option>Education Loan</option>
          <option>Vehicle Loan</option>
        </select>

        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
        >
          <option>All</option>
          <option>Approved</option>
          <option>Pending</option>
          <option>Rejected</option>
        </select>

        <input
          type="date"
          name="fromDate"
          value={filters.fromDate}
          onChange={handleFilterChange}
        />
        <input
          type="date"
          name="toDate"
          value={filters.toDate}
          onChange={handleFilterChange}
        />

        <button className="reset-btn" onClick={resetFilters}>
          Reset
        </button>
      </div>

      {loading ? (
        <div style={{ color: "#dbe4ff", textAlign: "center", padding: "40px" }}>
          Loading charts...
        </div>
      ) : (
        <div className="reports-grid">
          <div className="report-card wide">
            <h3>Monthly Applications</h3>
            <div className="chart-box">
              <Bar data={monthlyApplications} options={chartOptions} />
            </div>
          </div>

          <div className="report-card">
            <h3>Loan Status Breakdown</h3>

            <div
              className="chart-box"
              style={{
                height: "320px",
                width: "100%",
              }}
            >
              <Doughnut data={loanStatusData} options={doughnutOptions} />
            </div>
          </div>

          <div className="report-card">
            <h3>Loan Type Distribution</h3>
            <div className="chart-box">
              <Doughnut data={loanTypeData} options={doughnutOptions} />
            </div>
          </div>

          <div className="report-card wide">
            <h3>Document Verification Rate</h3>
            <div className="chart-box">
              <Line data={documentRateData} options={chartOptions} />
            </div>
          </div>

          <div className="report-card wide">
            <h3>Approval Turnaround Time</h3>
            <div className="chart-box">
              <Bar data={turnaroundData} options={chartOptions} />
            </div>
          </div>
        </div>
      )}

      <div className="report-table-card">
        <div className="table-title-row">
          <h3>Report Preview</h3>
          <span>{reportRows.length} Records Found</span>
        </div>

        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Loan ID</th>
                <th>Applicant</th>
                <th>Loan Type</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {reportRows.length > 0 ? (
                reportRows.map((row, index) => (
                  <tr key={`${row.loan_id}-${index}`}>
                    <td>{row.loan_id}</td>
                    <td>{row.name}</td>
                    <td>{row.loan_type}</td>
                    <td>₹{Number(row.amount).toLocaleString("en-IN")}</td>
                    
                    <td>{row.date}</td>
                    <td>{row.remarks}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="empty-data">
                    No report data found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ReportsPage;
