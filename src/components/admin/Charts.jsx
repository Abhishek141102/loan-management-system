import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

function Charts() {
  const monthlyApplications = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Loan Applications",
        data: [18, 26, 22, 34, 41, 38],
        backgroundColor: ["#c9a84c", "#e0bb6a", "#b88a35", "#d6b45a", "#a07830", "#f0d488"],
        borderRadius: 8,
        barThickness: 30,
      },
    ],
  };

  const loanStatusData = {
    labels: ["Approved", "Rejected", "Pending", "Under Review"],
    datasets: [
      {
        data: [42, 12, 28, 18],
        backgroundColor: ["#28a745", "#dc3545", "#fd7e14", "#17a2b8"],
        borderWidth: 2,
        borderColor: "#0a1628",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: { legend: { labels: { color: "#e8eaf0" } } },
    scales: {
      x: { ticks: { color: "#8a99b5" }, grid: { color: "#1e3060" } },
      y: { ticks: { color: "#8a99b5" }, grid: { color: "#1e3060" } },
    },
  };

  return (
    <div className="charts-grid">
      <div className="chart-card">
        <h3>Monthly Applications</h3>
        <Bar data={monthlyApplications} options={options} />
      </div>

      <div className="chart-card">
        <h3>Loan Status Breakdown</h3>
        <Doughnut data={loanStatusData} />
      </div>
    </div>
  );
}

export default Charts;
