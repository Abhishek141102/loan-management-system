import { useState } from "react";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

function SalesReports() {
  const [reportType, setReportType] = useState("Monthly");

  const salesByProduct = [
    { product: "Royal Oud", units: 120, revenue: 119880 },
    { product: "Rose Gold", units: 95, revenue: 85405 },
    { product: "Midnight Musk", units: 80, revenue: 95920 },
    { product: "Fresh Attar", units: 60, revenue: 41940 },
  ];

  const exportExcel = () => {
    const data = salesByProduct.map((item) => ({
      Product: item.product,
      "Units Sold": item.units,
      Revenue: item.revenue,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sales Report");
    XLSX.writeFile(wb, "sales-report.xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("I Rasa Sales Report", 14, 15);

    autoTable(doc, {
      startY: 25,
      head: [["Product", "Units Sold", "Revenue"]],
      body: salesByProduct.map((item) => [
        item.product,
        item.units,
        `₹${item.revenue}`,
      ]),
      headStyles: { fillColor: [212, 175, 55], textColor: [0, 0, 0] },
    });

    doc.save("sales-report.pdf");
  };

  const trendData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Sales",
        data: [42000, 52000, 68000, 74000, 86000, 112000],
        borderColor: "#d4af37",
        backgroundColor: "rgba(212,175,55,0.18)",
        tension: 0.35,
      },
    ],
  };

  const categoryData = {
    labels: ["Men", "Women", "Unisex", "Attars & Oils"],
    datasets: [
      {
        data: [45, 30, 15, 10],
        backgroundColor: ["#d4af37", "#4caf50", "#2196f3", "#ff9800"],
      },
    ],
  };

  const topProductData = {
    labels: salesByProduct.map((p) => p.product),
    datasets: [
      {
        label: "Revenue",
        data: salesByProduct.map((p) => p.revenue),
        backgroundColor: "#d4af37",
        borderRadius: 8,
      },
    ],
  };

  return (
    <div className="reports-page">
      <div className="reports-header">
        <div>
          <h1>Sales Reports</h1>
          <p>Daily, weekly, monthly, quarterly and annual sales performance.</p>
        </div>

        <div className="report-actions">
          <button className="btn-primary" onClick={exportExcel}>
            Export Excel
          </button>
          <button className="btn-secondary" onClick={exportPDF}>
            Export PDF
          </button>
        </div>
      </div>

      <div className="report-filters">
        <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
          <option>Daily</option>
          <option>Weekly</option>
          <option>Monthly</option>
          <option>Quarterly</option>
          <option>Annual</option>
        </select>

        <input type="date" />
        <input type="date" />
      </div>

      <div className="report-summary-grid">
        <div className="report-card">
          <p>Total Sales</p>
          <h3>₹3,43,145</h3>
          <span>+18% Growth</span>
        </div>

        <div className="report-card">
          <p>Order Count</p>
          <h3>355</h3>
          <span>{reportType} Report</span>
        </div>

        <div className="report-card">
          <p>Avg Order Value</p>
          <h3>₹967</h3>
          <span>Healthy AOV</span>
        </div>

        <div className="report-card">
          <p>Growth %</p>
          <h3>18%</h3>
          <span>Compared to last period</span>
        </div>
      </div>

      <div className="report-section">
        <h3>Sales Trend Line Chart</h3>
        <Line data={trendData} />
      </div>

      <div className="report-grid-2">
        <div className="report-section">
          <h3>Top Selling Products</h3>
          <Bar data={topProductData} />
        </div>

        <div className="report-section">
          <h3>Sales by Category Breakdown</h3>
          <Doughnut data={categoryData} />
        </div>
      </div>

      <div className="report-section">
        <h3>Sales by Product</h3>

        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Units Sold</th>
                <th>Revenue</th>
              </tr>
            </thead>

            <tbody>
              {salesByProduct.map((item, index) => (
                <tr key={index}>
                  <td>{item.product}</td>
                  <td>{item.units}</td>
                  <td>₹{item.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default SalesReports;