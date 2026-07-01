import { useState } from "react";
import {
  FaFileExcel,
  FaFilePdf,
  FaFileCsv,
  FaEnvelope,
  FaClock,
  FaDownload,
  FaTrash,
} from "react-icons/fa";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function ExportReports() {
  const [reportType, setReportType] = useState("Sales Report");
  const [frequency, setFrequency] = useState("Daily");
  const [email, setEmail] = useState("admin@irasaperfumes.in");
  const [scheduleStatus, setScheduleStatus] = useState("");
  const [toast, setToast] = useState("");

  const [history, setHistory] = useState([
    {
      id: 1,
      file: "sales-report.xlsx",
      type: "Excel",
      report: "Sales Report",
      date: "2026-05-06",
      status: "Completed",
    },
    {
      id: 2,
      file: "payment-report.pdf",
      type: "PDF",
      report: "Payment Report",
      date: "2026-05-05",
      status: "Completed",
    },
  ]);

  const sampleData = [
    ["Report Type", "Order ID", "Customer", "Amount", "Status"],
    [reportType, "ORD-001", "Sneha Patil", "₹999", "Delivered"],
    [reportType, "ORD-002", "Rahul Sharma", "₹899", "Pending"],
    [reportType, "ORD-003", "Priya Deshmukh", "₹1199", "Shipped"],
  ];

  const showToast = (message) => {
    setToast(message);

    setTimeout(() => {
      setToast("");
    }, 2200);
  };

  const addExportHistory = (type, filename) => {
    setHistory([
      {
        id: Date.now(),
        file: filename,
        type,
        report: reportType,
        date: new Date().toISOString().slice(0, 10),
        status: "Completed",
      },
      ...history,
    ]);
  };

  const exportExcel = () => {
    const worksheet = XLSX.utils.aoa_to_sheet(sampleData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, reportType);

    const filename = `${reportType.toLowerCase().replaceAll(" ", "-")}.xlsx`;

    XLSX.writeFile(workbook, filename);
    addExportHistory("Excel", filename);
    showToast("Excel report exported successfully!");
  };

  const exportPDF = () => {
    const doc = new jsPDF();

    doc.text(`I Rasa Perfumes - ${reportType}`, 14, 15);

    autoTable(doc, {
      startY: 25,
      head: [sampleData[0]],
      body: sampleData.slice(1),
      theme: "grid",
      headStyles: {
        fillColor: [212, 175, 55],
        textColor: [0, 0, 0],
      },
    });

    const filename = `${reportType.toLowerCase().replaceAll(" ", "-")}.pdf`;

    doc.save(filename);
    addExportHistory("PDF", filename);
    showToast("PDF report exported successfully!");
  };

  const exportCSV = () => {
    const csvContent = sampleData.map((row) => row.join(",")).join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const filename = `${reportType.toLowerCase().replaceAll(" ", "-")}.csv`;

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();

    URL.revokeObjectURL(link.href);

    addExportHistory("CSV", filename);
    showToast("CSV report exported successfully!");
  };

  const scheduleExport = () => {
    if (!email.trim()) {
      showToast("Please enter email address");
      return;
    }

    setScheduleStatus(
      `${frequency} ${reportType} auto-export scheduled for ${email}`
    );

    showToast("Auto-export scheduled successfully!");
  };

  const downloadHistoryFile = (item) => {
    showToast(`${item.file} download started`);

    if (item.type === "Excel") {
      exportExcel();
    } else if (item.type === "PDF") {
      exportPDF();
    } else {
      exportCSV();
    }
  };

  const deleteHistory = (id) => {
    const confirmDelete = window.confirm("Delete this export history?");

    if (confirmDelete) {
      setHistory(history.filter((item) => item.id !== id));
      showToast("Export history deleted");
    }
  };

  return (
    <div className="reports-page">
      <div className="reports-header">
        <div>
          <h1>Export Reports</h1>
          <p>
            Export reports in Excel, PDF, CSV and manage scheduled email
            delivery.
          </p>
        </div>
      </div>

      <div className="report-filters">
        <select
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
        >
          <option>Sales Report</option>
          <option>Payment Report</option>
          <option>Inventory Report</option>
          <option>Lead Conversion Report</option>
          <option>Customer Report</option>
        </select>

        <select
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
        >
          <option>Daily</option>
          <option>Weekly</option>
        </select>

        <input
          type="email"
          value={email}
          placeholder="Email delivery address"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="report-summary-grid">
        <div className="report-card">
          <p>Excel Export</p>
          <h3>✅</h3>
          <span>.xlsx supported</span>
        </div>

        <div className="report-card">
          <p>PDF Export</p>
          <h3>✅</h3>
          <span>PDF supported</span>
        </div>

        <div className="report-card">
          <p>CSV Export</p>
          <h3>✅</h3>
          <span>.csv supported</span>
        </div>

        <div className="report-card">
          <p>Auto Exports</p>
          <h3>{scheduleStatus ? "ON" : "OFF"}</h3>
          <span>Daily / Weekly</span>
        </div>
      </div>

      <div className="report-grid-2">
        <div className="report-section">
          <h3>Manual Export</h3>

          <div className="report-actions">
            <button className="btn-primary" onClick={exportExcel}>
              <FaFileExcel /> Export Excel
            </button>

            <button className="btn-secondary" onClick={exportPDF}>
              <FaFilePdf /> Export PDF
            </button>

            <button className="btn-secondary" onClick={exportCSV}>
              <FaFileCsv /> Export CSV
            </button>
          </div>
        </div>

        <div className="report-section">
          <h3>Scheduled Auto-Exports</h3>

          <div className="schedule-box">
            <p>
              <FaEnvelope /> Reports will be delivered to:
              <strong> {email || "No email selected"}</strong>
            </p>

            <p>
              <FaClock /> Frequency:
              <strong> {frequency}</strong>
            </p>

            <p>
              Report Type:
              <strong> {reportType}</strong>
            </p>

            <button
              className="btn-primary schedule-export-btn"
              onClick={scheduleExport}
            >
              <FaClock /> Schedule Export
            </button>

            {scheduleStatus && (
              <div className="schedule-status">{scheduleStatus}</div>
            )}
          </div>
        </div>
      </div>

      <div className="report-section">
        <h3>Export History Log</h3>

        <div className="export-history-list">
          {history.length === 0 ? (
            <p style={{ color: "var(--text-secondary)" }}>
              No export history available.
            </p>
          ) : (
            history.map((item) => (
              <div className="export-history-item" key={item.id}>
                <div>
                  <p>{item.file}</p>
                  <small>
                    {item.report} • {item.type} • {item.date}
                  </small>
                </div>

                <div className="export-history-actions">
                  <span className="report-badge success">{item.status}</span>

                  <button
                    className="icon-btn view"
                    onClick={() => downloadHistoryFile(item)}
                    title="Download"
                  >
                    <FaDownload />
                  </button>

                  <button
                    className="icon-btn delete"
                    onClick={() => deleteHistory(item.id)}
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {toast && <div className="settings-toast">{toast}</div>}
    </div>
  );
}

export default ExportReports;