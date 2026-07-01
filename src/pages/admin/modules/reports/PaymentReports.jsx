import { Doughnut, Bar } from "react-chartjs-2";

function PaymentReports() {
  const statusData = {
    labels: ["Verified", "Pending", "Failed", "Refunded"],
    datasets: [
      {
        data: [180, 35, 12, 8],
        backgroundColor: ["#4caf50", "#ff9800", "#f44336", "#2196f3"],
      },
    ],
  };

  const methodData = {
    labels: ["UPI", "Card", "Net Banking", "COD"],
    datasets: [
      {
        label: "Revenue",
        data: [120000, 85000, 54000, 35000],
        backgroundColor: "#d4af37",
        borderRadius: 8,
      },
    ],
  };

  return (
    <div className="reports-page">
      <div className="reports-header">
        <div>
          <h1>Payment Reports</h1>
          <p>Payment status, failed payment analysis and reconciliation reports.</p>
        </div>
      </div>

      <div className="report-summary-grid">
        <div className="report-card">
          <p>Verified Payments</p>
          <h3>180</h3>
          <span>Success</span>
        </div>

        <div className="report-card">
          <p>Pending</p>
          <h3>35</h3>
          <span>Need verification</span>
        </div>

        <div className="report-card">
          <p>Failed</p>
          <h3>12</h3>
          <span>Check gateway</span>
        </div>

        <div className="report-card">
          <p>Refunded</p>
          <h3>8</h3>
          <span>Completed</span>
        </div>
      </div>

      <div className="report-grid-2">
        <div className="report-section">
          <h3>Payment Status Summary</h3>
          <Doughnut data={statusData} />
        </div>

        <div className="report-section">
          <h3>Revenue by Payment Method</h3>
          <Bar data={methodData} />
        </div>
      </div>

      <div className="report-section">
        <h3>Failed Payments Analysis</h3>

        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Method</th>
                <th>Amount Range</th>
                <th>Failures</th>
                <th>Reason</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>UPI</td>
                <td>₹500 - ₹1000</td>
                <td>5</td>
                <td>Timeout</td>
              </tr>
              <tr>
                <td>Card</td>
                <td>₹1000 - ₹2000</td>
                <td>4</td>
                <td>Bank declined</td>
              </tr>
              <tr>
                <td>Net Banking</td>
                <td>₹500 - ₹1500</td>
                <td>3</td>
                <td>Gateway failed</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="report-section">
        <h3>Daily / Weekly Reconciliation</h3>

        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Orders</th>
                <th>Expected</th>
                <th>Received</th>
                <th>Difference</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>2026-05-01</td>
                <td>48</td>
                <td>₹45,000</td>
                <td>₹45,000</td>
                <td>₹0</td>
              </tr>
              <tr>
                <td>2026-05-02</td>
                <td>39</td>
                <td>₹38,500</td>
                <td>₹37,900</td>
                <td>₹600</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default PaymentReports;