import { useEffect, useState } from "react";
import Charts from "../../components/admin/Charts";

function AdminAnalytics() {
  const [data, setData] = useState(null);
  const [filter, setFilter] = useState("monthly");

  useEffect(() => {
    loadAnalytics();
  }, [filter]);

  const loadAnalytics = () => {
    // dummy data (baad me API aayega)
    const analyticsData = {
      revenueData: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May"],
        datasets: [
          {
            label: "Revenue",
            data: [12000, 18000, 15000, 24000, 32500],
            backgroundColor: ["#d4af37"],
          },
        ],
      },

      orderStatusData: {
        labels: ["Pending", "Shipped", "Delivered", "Cancelled"],
        datasets: [
          {
            data: [18, 35, 120, 8],
            backgroundColor: ["#ff9800", "#2196f3", "#4caf50", "#f44336"],
          },  
        ],
      },
    };

    setData(analyticsData);
  };

  if (!data) return <p>Loading Analytics...</p>;

  return (
    <div>
      <h2>Analytics</h2>

      {/* 🔽 Filter */}
      <select value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value="weekly">Last 7 Days</option>
        <option value="monthly">Last 30 Days</option>
        <option value="yearly">Last Year</option>
      </select>

      {/* 📊 Charts */}
      <Charts
        revenueData={data.revenueData}
        orderStatusData={data.orderStatusData}
      />
    </div>
  );
}

export default AdminAnalytics;