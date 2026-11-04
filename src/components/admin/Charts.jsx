import { useCallback, useEffect, useMemo, useState } from "react";
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
import API from "../../services/api.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

function Charts() {
  const [isMobile, setIsMobile] = useState(() => window.matchMedia("(max-width: 768px)").matches);
  const [summary, setSummary] = useState({ monthly: [], statusBreakdown: [] });

  const loadSummary = useCallback(async () => {
    try {
      const response = await API.get("/reports/summary");
      setSummary(response.data || { monthly: [], statusBreakdown: [] });
    } catch (error) {
      console.error("Failed to load dashboard chart data:", error);
    }
  }, []);

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 768px)");
    const updateViewport = (event) => setIsMobile(event.matches);
    mobileQuery.addEventListener("change", updateViewport);
    return () => mobileQuery.removeEventListener("change", updateViewport);
  }, []);

  useEffect(() => {
    loadSummary();
    const refreshTimer = window.setInterval(loadSummary, 60000);
    return () => window.clearInterval(refreshTimer);
  }, [loadSummary]);

  const monthlyApplications = useMemo(() => ({
    labels: (summary.monthly || []).map((entry) => entry.month),
    datasets: [
      {
        label: "Loan Applications",
        data: (summary.monthly || []).map((entry) => Number(entry.total) || 0),
        backgroundColor: ["#c9a84c", "#e0bb6a", "#b88a35", "#d6b45a", "#a07830", "#f0d488"],
        borderRadius: 8,
        barThickness: 30,
      },
    ],
  }), [summary]);

  const loanStatusData = useMemo(() => {
    const statuses = summary.statusBreakdown || [];
    const colorForStatus = (status) => {
      const normalized = String(status || "").toLowerCase();
      if (normalized.includes("approv")) return "#28a745";
      if (normalized.includes("reject")) return "#dc3545";
      if (normalized.includes("pending") || normalized.includes("submit")) return "#fd7e14";
      if (normalized.includes("review") || normalized.includes("ready")) return "#17a2b8";
      return "#8a99b5";
    };

    return {
      labels: statuses.map((entry) => entry.status || "Unknown"),
      datasets: [
        {
          data: statuses.map((entry) => Number(entry.total) || 0),
          backgroundColor: statuses.map((entry) => colorForStatus(entry.status)),
          borderWidth: 2,
          borderColor: "#0a1628",
        },
      ],
    };
  }, [summary]);

  const options = {
    responsive: true,
    maintainAspectRatio: !isMobile,
    aspectRatio: isMobile ? 1.2 : 2,
    plugins: {
      legend: {
        labels: {
          color: "#e8eaf0",
          font: { size: isMobile ? 12 : 12 },
          padding: isMobile ? 14 : 10,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: "#8a99b5", font: { size: isMobile ? 12 : 12 }, padding: isMobile ? 8 : 3 },
        grid: { color: "#1e3060" },
      },
      y: {
        ticks: { color: "#8a99b5", font: { size: isMobile ? 12 : 12 }, padding: isMobile ? 8 : 3 },
        grid: { color: "#1e3060" },
      },
    },
  };

  return (
    <div className="charts-grid">
      <div className="chart-card monthly-applications-card">
        <h3>Monthly Applications</h3>
        <div className="monthly-applications-plot">
          <Bar data={monthlyApplications} options={options} />
        </div>
      </div>

      <div className="chart-card">
        <h3>Loan Status Breakdown</h3>
        <Doughnut data={loanStatusData} />
      </div>
    </div>
  );
}

export default Charts;
