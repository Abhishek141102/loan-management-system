import { useState } from "react";
import { FaBullhorn, FaUsers, FaMapMarkerAlt, FaGem } from "react-icons/fa";

function Segmentation() {
  const [selectedSegment, setSelectedSegment] = useState("VIP Customers");
  const [toast, setToast] = useState("");

  const segments = [
    {
      title: "One-time Buyers",
      type: "Purchase Frequency",
      count: 120,
      icon: <FaUsers />,
      description: "Customers who purchased only once.",
    },
    {
      title: "Repeat Customers",
      type: "Purchase Frequency",
      count: 85,
      icon: <FaUsers />,
      description: "Customers with repeated purchases.",
    },
    {
      title: "VIP Customers",
      type: "Purchase Frequency",
      count: 24,
      icon: <FaGem />,
      description: "High-value customers with frequent purchases.",
    },
    {
      title: "Budget Buyers",
      type: "Spending Bracket",
      count: 150,
      icon: <FaUsers />,
      description: "Customers buying lower price range products.",
    },
    {
      title: "Premium Buyers",
      type: "Spending Bracket",
      count: 45,
      icon: <FaGem />,
      description: "Customers buying premium perfumes.",
    },
    {
      title: "Floral Preference",
      type: "Category Preference",
      count: 64,
      icon: <FaBullhorn />,
      description: "Customers interested in floral perfumes.",
    },
    {
      title: "Nashik Customers",
      type: "Geographic Location",
      count: 90,
      icon: <FaMapMarkerAlt />,
      description: "Customers from Nashik region.",
    },
    {
      title: "Highly Engaged",
      type: "Engagement Level",
      count: 39,
      icon: <FaBullhorn />,
      description: "Customers who open emails and interact with campaigns.",
    },
  ];

  const createCampaign = () => {
    setToast(`${selectedSegment} campaign created successfully!`);
    setTimeout(() => setToast(""), 2200);
  };

  return (
    <div className="customers-page">
      <div className="customers-header">
        <div>
          <h1>Customer Segmentation</h1>
          <p>Create targeted marketing campaigns based on customer behavior.</p>
        </div>

        <button className="btn-primary" onClick={createCampaign}>
          <FaBullhorn /> Create Campaign
        </button>
      </div>

      <div className="segmentation-control">
        <label>Select Segment</label>
        <select
          value={selectedSegment}
          onChange={(e) => setSelectedSegment(e.target.value)}
        >
          {segments.map((segment) => (
            <option key={segment.title}>{segment.title}</option>
          ))}
        </select>
      </div>

      <div className="segment-grid">
        {segments.map((segment) => (
          <div
            className={
              selectedSegment === segment.title
                ? "segment-card active"
                : "segment-card"
            }
            key={segment.title}
            onClick={() => setSelectedSegment(segment.title)}
          >
            <div className="segment-icon">{segment.icon}</div>
            <h3>{segment.title}</h3>
            <span>{segment.type}</span>
            <p>{segment.description}</p>
            <strong>{segment.count} Customers</strong>
          </div>
        ))}
      </div>

      {toast && <div className="settings-toast">{toast}</div>}
    </div>
  );
}

export default Segmentation;