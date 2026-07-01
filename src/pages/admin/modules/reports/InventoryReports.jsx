function InventoryReports() {
  const inventory = [
    {
      sku: "SKU-001",
      product: "Royal Oud",
      stock: 120,
      threshold: 20,
      status: "Available",
      aging: "20 days",
    },
    {
      sku: "SKU-002",
      product: "Rose Gold",
      stock: 8,
      threshold: 15,
      status: "Low Stock",
      aging: "45 days",
    },
    {
      sku: "SKU-003",
      product: "Midnight Musk",
      stock: 0,
      threshold: 10,
      status: "Out of Stock",
      aging: "60 days",
    },
  ];

  return (
    <div className="reports-page">
      <div className="reports-header">
        <div>
          <h1>Inventory Reports</h1>
          <p>Current stock, low stock, overstock, movement history and inventory aging.</p>
        </div>
      </div>

      <div className="report-summary-grid">
        <div className="report-card">
          <p>Total Stock</p>
          <h3>128</h3>
          <span>All SKUs</span>
        </div>

        <div className="report-card">
          <p>Low Stock</p>
          <h3>1</h3>
          <span>Needs reorder</span>
        </div>

        <div className="report-card">
          <p>Out of Stock</p>
          <h3>1</h3>
          <span>Critical</span>
        </div>

        <div className="report-card">
          <p>Overstock</p>
          <h3>2</h3>
          <span>High inventory</span>
        </div>
      </div>

      <div className="report-section">
        <h3>Current Stock Levels Per SKU</h3>

        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Product</th>
                <th>Stock</th>
                <th>Threshold</th>
                <th>Status</th>
                <th>Aging</th>
              </tr>
            </thead>

            <tbody>
              {inventory.map((item, index) => (
                <tr key={index}>
                  <td>{item.sku}</td>
                  <td>{item.product}</td>
                  <td>{item.stock}</td>
                  <td>{item.threshold}</td>
                  <td>
                    <span
                      className={
                        item.status === "Available"
                          ? "report-badge success"
                          : item.status === "Low Stock"
                          ? "report-badge warning"
                          : "report-badge danger"
                      }
                    >
                      {item.status}
                    </span>
                  </td>
                  <td>{item.aging}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="report-section">
        <h3>Stock Movement History</h3>

        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>SKU</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Reason</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>2026-05-01</td>
                <td>SKU-001</td>
                <td>IN</td>
                <td>50</td>
                <td>New purchase</td>
              </tr>
              <tr>
                <td>2026-05-02</td>
                <td>SKU-002</td>
                <td>OUT</td>
                <td>12</td>
                <td>Customer orders</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default InventoryReports;