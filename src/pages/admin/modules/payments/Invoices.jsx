import {
  FaDownload,
  FaEnvelope,
} from "react-icons/fa";

function Invoices() {

  const invoices = [
    {
      id: "INV-001",
      order: "ORD-001",
      customer: "Kunal Patil",
      total: "₹1,500",
      status: "Sent",
    },

    {
      id: "INV-002",
      order: "ORD-002",
      customer: "Rahul Sharma",
      total: "₹850",
      status: "Viewed",
    },
  ];

  return (
    <div className="page-container">

      <div className="page-header">

        <h2>Invoices</h2>

      </div>

      <div className="table-wrapper table-card">

        <table className="admin-table">

          <thead>

            <tr>

              <th>Invoice ID</th>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>

            </tr>

          </thead>

          <tbody>

            {invoices.map((invoice) => (

              <tr key={invoice.id}>

                <td className="order-id">
                  {invoice.id}
                </td>

                <td>{invoice.order}</td>

                <td>{invoice.customer}</td>

                <td className="amount-text">
                  {invoice.total}
                </td>

                <td>

                  <span className="status-badge status-verified">
                    {invoice.status}
                  </span>

                </td>

                <td>

                  <div className="table-actions">

                    <button className="icon-btn view">
                      <FaDownload />
                    </button>

                    <button className="icon-btn invoice">
                      <FaEnvelope />
                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Invoices;