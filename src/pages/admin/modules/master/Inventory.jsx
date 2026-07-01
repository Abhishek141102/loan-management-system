import { useState } from "react";
import {
  FaBoxOpen,
  FaExclamationTriangle,
  FaTimesCircle,
} from "react-icons/fa";

function Inventory() {
  const [items, setItems] = useState([
    {
      id: 1,
      product: "Royal Oud",
      total: 120,
      reserved: 20,
      lowStock: 10,
      movement: ["+50 stock added", "-20 reserved for orders"],
    },
    {
      id: 2,
      product: "Rose Gold",
      total: 35,
      reserved: 12,
      lowStock: 10,
      movement: ["+20 stock added", "-12 reserved for orders"],
    },
    {
      id: 3,
      product: "Midnight Musk",
      total: 8,
      reserved: 4,
      lowStock: 10,
      movement: ["-4 stock sold"],
    },
  ]);

  const available = (item) => item.total - item.reserved;

  const totalStock = items.reduce((acc, item) => acc + item.total, 0);
  const lowStockItems = items.filter(
    (item) => available(item) <= item.lowStock && available(item) > 0
  ).length;
  const outOfStock = items.filter((item) => available(item) <= 0).length;

  const adjustStock = (id, value) => {
    const qty = Number(value);

    if (!qty) return;

    setItems(
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              total: item.total + qty,
              movement: [
                `${qty > 0 ? "+" : ""}${qty} manual adjustment`,
                ...item.movement,
              ],
            }
          : item
      )
    );
  };

  const updateReserved = (id, value) => {
    const reservedValue = Number(value);

    setItems(
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              reserved: reservedValue,
              movement: [
                `Reserved quantity updated to ${reservedValue}`,
                ...item.movement,
              ],
            }
          : item
      )
    );
  };

  return (
    <div className="master-page">
      <div className="section-header">
        <div>
          <h1>Inventory Management</h1>
          <p>Track stock levels, reserved quantity, low stock alerts and movement history.</p>
        </div>
      </div>

      <div className="metrics-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <FaBoxOpen />
          </div>
          <div>
            <p>Total Items in Stock</p>
            <h3>{totalStock}</h3>
            <span>Real-time stock</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FaExclamationTriangle />
          </div>
          <div>
            <p>Low Stock Items</p>
            <h3>{lowStockItems}</h3>
            <span>Needs reorder</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FaTimesCircle />
          </div>
          <div>
            <p>Out of Stock</p>
            <h3>{outOfStock}</h3>
            <span>Critical</span>
          </div>
        </div>
      </div>

      <div className="table-wrapper" style={{ marginTop: "25px" }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Total</th>
              <th>Reserved</th>
              <th>Available</th>
              <th>Low Stock Alert</th>
              <th>Status</th>
              <th>Manual Adjustment</th>
              <th>Movement History</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.product}</td>
                <td>{item.total}</td>

                <td>
                  <input
                    className="table-input"
                    type="number"
                    value={item.reserved}
                    onChange={(e) => updateReserved(item.id, e.target.value)}
                  />
                </td>

                <td>{available(item)}</td>
                <td>{item.lowStock}</td>

                <td>
                  {available(item) <= 0 ? (
                    <span className="status processing">Out of Stock</span>
                  ) : available(item) <= item.lowStock ? (
                    <span className="status processing">Low Stock</span>
                  ) : (
                    <span className="status delivered">Available</span>
                  )}
                </td>

                <td>
                  <input
                    className="table-input"
                    type="number"
                    placeholder="+/- Qty"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        adjustStock(item.id, e.target.value);
                        e.target.value = "";
                      }
                    }}
                  />
                </td>

                <td>{item.movement[0]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="inventory-note">
        Tip: Manual Adjustment field me quantity type karo aur Enter press karo.
        Example: `10` stock add karega, `-5` stock reduce karega.
      </p>
    </div>
  );
}

export default Inventory;