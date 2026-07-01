import { useState } from "react";
import { FaSave, FaTrash } from "react-icons/fa";
import Toast from "../../../../components/notifications/Toast";

function Pricing() {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Royal Oud",
      price: 999,
      discount: 10,
      tax: 18,
      history: ["₹899 → ₹999 on 2026-05-01"],
    },
    {
      id: 2,
      name: "Rose Gold",
      price: 899,
      discount: 5,
      tax: 18,
      history: ["₹799 → ₹899 on 2026-05-02"],
    },
    {
      id: 3,
      name: "Midnight Musk",
      price: 1199,
      discount: 15,
      tax: 18,
      history: ["₹999 → ₹1199 on 2026-05-03"],
    },
  ]);

  const [discountRules, setDiscountRules] = useState([
    "Buy 2 → Get 10% off",
    "Buy 5 → Get 15% off",
    "Seasonal offer → Get 20% off",
  ]);

  const [currency, setCurrency] = useState("INR ₹");
  const [tax, setTax] = useState(18);
  const [newRule, setNewRule] = useState("");
  const [toast, setToast] = useState({
    message: "",
    type: "success",
  });

  const showToast = (message, type = "success") => {
    setToast({
      message,
      type,
    });
  };

  const updatePrice = (id, field, value) => {
    setProducts(
      products.map((p) =>
        p.id === id
          ? {
              ...p,
              [field]: value,
              history:
                field === "price"
                  ? [
                      `Price updated to ₹${value} on ${new Date()
                        .toISOString()
                        .slice(0, 10)}`,
                      ...p.history,
                    ]
                  : p.history,
            }
          : p,
      ),
    );
  };

  const finalPrice = (product) => {
    const price = Number(product.price);
    const discountAmount = (price * Number(product.discount)) / 100;
    const taxAmount = (price * Number(product.tax)) / 100;

    return Math.round(price - discountAmount + taxAmount);
  };

  const addDiscountRule = () => {
    if (!newRule.trim()) {
      showToast("Please enter discount rule", "error");

      return;
    }

    setDiscountRules([...discountRules, newRule]);

    showToast("Discount rule added successfully!", "success");

    setNewRule("");
  };

  const deleteRule = (index) => {
    setDiscountRules(discountRules.filter((_, i) => i !== index));

    showToast("Discount rule deleted successfully!", "success");
  };

  return (
    <div className="master-page">
      <div className="section-header">
        <div>
          <h1>Pricing Management</h1>
          <p>Bulk update prices, discount rules, tax and currency settings.</p>
        </div>
      </div>

      <div className="pricing-settings">
        <div className="settings-card">
          <h3>Tax & Currency</h3>

          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            <option>INR ₹</option>
            <option>USD $</option>
          </select>

          <input
            type="number"
            value={tax}
            onChange={(e) => setTax(e.target.value)}
            placeholder="Global Tax %"
          />

          <button
            className="btn-primary"
            onClick={() =>
              setProducts(products.map((p) => ({ ...p, tax: Number(tax) })))
            }
          >
            <FaSave /> Apply Tax To All
          </button>
        </div>

        <div className="settings-card">
          <h3>Discount Rules</h3>

          {discountRules.map((rule, index) => (
            <div className="discount-rule-row" key={index}>
              <p className="discount-rule">{rule}</p>
              <button className="btn-danger" onClick={() => deleteRule(index)}>
                <FaTrash />
              </button>
            </div>
          ))}

          <div className="rule-input-row">
            <input
              type="text"
              value={newRule}
              placeholder="Example: Buy 3 → Get 12% off"
              onChange={(e) => setNewRule(e.target.value)}
            />
            <button className="btn-primary" onClick={addDiscountRule}>
              Add Rule
            </button>
          </div>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Selling Price</th>
              <th>Discount %</th>
              <th>Tax %</th>
              <th>Final Price</th>
              <th>Price History</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>

                <td>
                  <input
                    className="table-input"
                    type="number"
                    value={product.price}
                    onChange={(e) =>
                      updatePrice(product.id, "price", e.target.value)
                    }
                  />
                </td>

                <td>
                  <input
                    className="table-input"
                    type="number"
                    value={product.discount}
                    onChange={(e) =>
                      updatePrice(product.id, "discount", e.target.value)
                    }
                  />
                </td>

                <td>
                  <input
                    className="table-input"
                    type="number"
                    value={product.tax}
                    onChange={(e) =>
                      updatePrice(product.id, "tax", e.target.value)
                    }
                  />
                </td>

                <td>
                  {currency}
                  {finalPrice(product)}
                </td>

                <td>{product.history[0]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() =>
          setToast({
            message: "",
            type: "success",
          })
        }
      />
    </div>
  );
}

export default Pricing;
