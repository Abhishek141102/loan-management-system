import { useParams } from "react-router-dom";

function OrderDetails() {

  const { id } = useParams();

  return (
    <div className="page-container">

      {/* HEADER */}
      <div className="details-card">

        <h2>Order Details</h2>

        <p><strong>Order ID:</strong> {id}</p>
        <p><strong>Status:</strong> Shipped</p>
        <p><strong>Date:</strong> 2026-05-01</p>
        <p><strong>Payment:</strong> Verified</p>

      </div>

      {/* CUSTOMER */}
      <div className="details-card">

        <h3>Customer</h3>

        <p>Kunal Patil</p>
        <p>kunal@email.com</p>
        <p>+91 9876543210</p>

      </div>

      {/* ADDRESS */}
      <div className="details-card">

        <h3>Shipping Address</h3>

        <p>
          123 Main Street,
          Mumbai,
          Maharashtra 400001
        </p>

      </div>

      {/* ITEMS */}
      <div className="details-card">

        <h3>Order Items</h3>

        <div className="table-wrapper">

          <table className="admin-table">

            <thead>
              <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Discount</th>
                <th>Total</th>
              </tr>
            </thead>

            <tbody>

              <tr>
                <td>Oud Supreme</td>
                <td>2</td>
                <td>₹299</td>
                <td>10%</td>
                <td>₹538</td>
              </tr>

              <tr>
                <td>Rose Elixir</td>
                <td>1</td>
                <td>₹399</td>
                <td>5%</td>
                <td>₹379</td>
              </tr>

            </tbody>

          </table>

        </div>

        <br />

        <p>
          <strong>
            Total: ₹1,317
          </strong>
        </p>

      </div>

      {/* PAYMENT */}
      <div className="details-card">

        <h3>Payment Info</h3>

        <p>Method: Card</p>
        <p>TXN ID: TXN-12345</p>
        <p>Status: Verified</p>

      </div>

      {/* TIMELINE */}
      <div className="details-card">

        <h3>Order Timeline</h3>

        <ul className="timeline">

          <li>Order Placed</li>
          <li>Payment Verified</li>
          <li>Order Confirmed</li>
          <li>Shipped</li>

        </ul>

      </div>

      {/* ACTIONS */}
      <div className="details-card">

        <button>Update Status</button>
        <button>Add Note</button>
        <button>Send Email</button>
        <button>Generate Invoice</button>

      </div>

    </div>
  );
}

export default OrderDetails;