import { useState } from "react";
import { useParams } from "react-router-dom";
import Toast from "../../../../components/notifications/Toast";

function CreateOrder() {
  const { id } = useParams();

  const isEditMode = !!id;

  const [step, setStep] = useState(1);

  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [product, setProduct] = useState({
    productName: "",
    quantity: 1,
    discount: 0,
  });

  const [toast, setToast] = useState({
    message: "",
    type: "success",
  });

  const subtotal = 917;
  const discountAmount = 100;
  const tax = 200;
  const shipping = 300;

  const total = subtotal - discountAmount + tax + shipping;

  const showToast = (message, type = "success") => {
    setToast({
      message,
      type,
    });
  };

  const confirmOrder = () => {
    showToast(
      isEditMode
        ? "Order updated successfully!"
        : "Order created successfully!",
      "success",
    );
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>{isEditMode ? "Edit Order" : "Create Manual Order"}</h2>
      </div>

      <div className="details-card">
        {/* ================= WIZARD STEPS ================= */}

        <div className="wizard-steps">
          <div className={`wizard-step ${step === 1 ? "active" : ""}`}>
            1. Customer
          </div>

          <div className={`wizard-step ${step === 2 ? "active" : ""}`}>
            2. Products
          </div>

          <div className={`wizard-step ${step === 3 ? "active" : ""}`}>
            3. Review
          </div>
        </div>

        {/* ================= STEP 1 ================= */}

        {step === 1 && (
          <div>
            <h3>Select / Create Customer</h3>

            <div className="order-form-grid">
              <input
                type="text"
                placeholder="Customer Name"
                value={customer.name}
                onChange={(e) =>
                  setCustomer({
                    ...customer,
                    name: e.target.value,
                  })
                }
              />

              <input
                type="email"
                placeholder="Customer Email"
                value={customer.email}
                onChange={(e) =>
                  setCustomer({
                    ...customer,
                    email: e.target.value,
                  })
                }
              />

              <input
                type="text"
                placeholder="Phone Number"
                value={customer.phone}
                onChange={(e) =>
                  setCustomer({
                    ...customer,
                    phone: e.target.value,
                  })
                }
              />

              <select>
                <option>Select Existing Customer</option>
                <option>Kunal Patil</option>
                <option>Rahul Sharma</option>
                <option>Sneha Patil</option>
              </select>
            </div>
          </div>
        )}

        {/* ================= STEP 2 ================= */}

        {step === 2 && (
          <div>
            <h3>Select Products</h3>

            <div className="order-form-grid">
              <select
                value={product.productName}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    productName: e.target.value,
                  })
                }
              >
                <option value="">Select Product</option>

                <option>Oud Supreme</option>

                <option>Rose Elixir</option>

                <option>Luxury Gift Set</option>
              </select>

              <input
                type="number"
                placeholder="Quantity"
                value={product.quantity}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    quantity: e.target.value,
                  })
                }
              />

              <input
                type="number"
                placeholder="Discount %"
                value={product.discount}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    discount: e.target.value,
                  })
                }
              />

              <select>
                <option>Shipping Method</option>

                <option>Standard Delivery</option>

                <option>Express Delivery</option>
              </select>
            </div>
          </div>
        )}

        {/* ================= STEP 3 ================= */}

        {step === 3 && (
          <div>
            <h3>Review Order</h3>

            <div className="order-review">
              <p>
                <span>Customer</span>

                <strong>{customer.name || "Kunal Patil"}</strong>
              </p>

              <p>
                <span>Email</span>

                <strong>{customer.email || "kunal@email.com"}</strong>
              </p>

              <p>
                <span>Product</span>

                <strong>{product.productName || "Oud Supreme"}</strong>
              </p>

              <p>
                <span>Quantity</span>

                <strong>{product.quantity}</strong>
              </p>

              <p>
                <span>Discount</span>

                <strong>{product.discount}%</strong>
              </p>

              <hr />

              <p>
                <span>Subtotal</span>

                <strong>₹{subtotal}</strong>
              </p>

              <p>
                <span>Discount</span>

                <strong>₹{discountAmount}</strong>
              </p>

              <p>
                <span>Tax</span>

                <strong>₹{tax}</strong>
              </p>

              <p>
                <span>Shipping</span>

                <strong>₹{shipping}</strong>
              </p>

              <h3>
                <span>Total</span>

                <span>₹{total}</span>
              </h3>
            </div>
          </div>
        )}

        {/* ================= ACTIONS ================= */}

        <div className="wizard-actions">
          {step > 1 ? (
            <button className="btn-secondary" onClick={() => setStep(step - 1)}>
              Back
            </button>
          ) : (
            <div></div>
          )}

          {step < 3 ? (
            <button className="btn-primary" onClick={() => setStep(step + 1)}>
              Next Step
            </button>
          ) : (
            <button className="btn-primary" onClick={confirmOrder}>
              {isEditMode ? "Update Order" : "Confirm Order"}
            </button>
          )}
        </div>
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

export default CreateOrder;
