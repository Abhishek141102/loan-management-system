function LeadStatusTracker() {

  const funnel = [
    { status: "New", count: 45 },
    { status: "Contacted", count: 28 },
    { status: "Interested", count: 16 },
    { status: "Converted", count: 9 },
  ];

  return (
    <div className="page-container">

      <h2>Lead Status Tracker</h2>

      <div className="metrics-grid">

        {funnel.map((item, index) => (

          <div className="stat-card" key={index}>

            <h3>{item.status}</h3>

            <p>{item.count} Leads</p>

          </div>

        ))}

      </div>

    </div>
  );
}

export default LeadStatusTracker;