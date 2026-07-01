import { useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaTruck } from "react-icons/fa";

function Carriers() {
  const [carriers, setCarriers] = useState([
    {
      id: 1,
      name: "BlueDart",
      serviceType: "Express",
      rate: 80,
      coverage: "Pan India",
      status: "Active",
    },
    {
      id: 2,
      name: "Delhivery",
      serviceType: "Standard",
      rate: 60,
      coverage: "Maharashtra, Gujarat, Karnataka",
      status: "Active",
    },
    {
      id: 3,
      name: "DTDC",
      serviceType: "Economy",
      rate: 45,
      coverage: "Metro Cities",
      status: "Inactive",
    },
  ]);

  const emptyForm = {
    name: "",
    serviceType: "Standard",
    rate: "",
    coverage: "",
    status: "Active",
  };

  const [form, setForm] = useState(emptyForm);
  const [selectedCarrier, setSelectedCarrier] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  };

  const openAdd = () => {
    setSelectedCarrier(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (carrier) => {
    setSelectedCarrier(carrier);
    setForm(carrier);
    setShowForm(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const saveCarrier = (e) => {
    e.preventDefault();

    if (selectedCarrier) {
      setCarriers(
        carriers.map((carrier) =>
          carrier.id === selectedCarrier.id
            ? { ...form, id: selectedCarrier.id }
            : carrier
        )
      );

      showToast("Carrier updated successfully!");
    } else {
      setCarriers([...carriers, { ...form, id: Date.now() }]);
      showToast("Carrier added successfully!");
    }

    setShowForm(false);
  };

  const deleteCarrier = (id) => {
    const confirmDelete = window.confirm("Delete this carrier?");

    if (confirmDelete) {
      setCarriers(carriers.filter((carrier) => carrier.id !== id));
      showToast("Carrier deleted successfully!");
    }
  };

  const toggleStatus = (id) => {
    setCarriers(
      carriers.map((carrier) =>
        carrier.id === id
          ? {
              ...carrier,
              status: carrier.status === "Active" ? "Inactive" : "Active",
            }
          : carrier
      )
    );

    showToast("Carrier status updated!");
  };

  return (
    <div className="shipping-page">
      <div className="shipping-header">
        <div>
          <h1>Carriers Management</h1>
          <p>
            Add, edit, delete carriers and configure rates, services and coverage
            areas.
          </p>
        </div>

        <button className="btn-primary" onClick={openAdd}>
          <FaPlus /> Add Carrier
        </button>
      </div>

      <div className="carrier-grid">
        {carriers.map((carrier) => (
          <div className="carrier-card" key={carrier.id}>
            <div className="carrier-top">
              <div>
                <h3>{carrier.name}</h3>
                <p>{carrier.serviceType}</p>
              </div>

              <FaTruck />
            </div>

            <div className="carrier-info">
              <p>
                <strong>Rate:</strong> ₹{carrier.rate}
              </p>
              <p>
                <strong>Coverage:</strong> {carrier.coverage}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <button
                  className={`status-toggle ${carrier.status.toLowerCase()}`}
                  onClick={() => toggleStatus(carrier.id)}
                >
                  {carrier.status}
                </button>
              </p>
            </div>

            <div className="carrier-actions">
              <button className="icon-btn edit" onClick={() => openEdit(carrier)}>
                <FaEdit />
              </button>

              <button
                className="icon-btn delete"
                onClick={() => deleteCarrier(carrier.id)}
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="admin-modal shipping-modal">
            <h3>{selectedCarrier ? "Edit Carrier" : "Add Carrier"}</h3>

            <form className="shipping-form" onSubmit={saveCarrier}>
              <input
                type="text"
                name="name"
                placeholder="Carrier Name"
                value={form.name}
                onChange={handleChange}
                required
              />

              <select
                name="serviceType"
                value={form.serviceType}
                onChange={handleChange}
              >
                <option>Express</option>
                <option>Standard</option>
                <option>Economy</option>
                <option>Same Day</option>
              </select>

              <input
                type="number"
                name="rate"
                placeholder="Carrier Rate ₹"
                value={form.rate}
                onChange={handleChange}
                required
              />

              <textarea
                name="coverage"
                placeholder="Coverage Areas e.g. Pan India, Maharashtra, Pune..."
                value={form.coverage}
                onChange={handleChange}
                required
              ></textarea>

              <select name="status" value={form.status} onChange={handleChange}>
                <option>Active</option>
                <option>Inactive</option>
              </select>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>

                <button type="submit" className="btn-primary">
                  Save Carrier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && <div className="settings-toast">{toast}</div>}
    </div>
  );
}

export default Carriers;