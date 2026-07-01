import { useState } from "react";
import {
  FaEnvelopeOpenText,
  FaSave,
  FaUndo,
  FaEye,
  FaPlus,
  FaCopy,
} from "react-icons/fa";

const templateVariables = [
  "{company_name}",
  "{user_name}",
  "{order_id}",
  "{otp_code}",
  "{order_total}",
  "{payment_id}",
  "{tracking_number}",
  "{delivery_date}",
  "{reset_link}",
  "{invoice_link}",
  "{expiry_time}",
  "{website_url}",
];

const defaultTemplates = [
  {
    id: 1,
    name: "OTP Verification",
    trigger: "On registration",
    subject: "Verify Your I Rasa Account — OTP: {otp_code}",
    body: `Hello {user_name},

Your OTP verification code is:

{otp_code}

This code will expire in {expiry_time}.

If you did not request this, please ignore this email.

Regards,
{company_name}
{website_url}`,
  },
  {
    id: 2,
    name: "Welcome Email",
    trigger: "After OTP verified",
    subject: "Welcome to {company_name}!",
    body: `Hello {user_name},

Welcome to {company_name}.

Your account has been created successfully. We are happy to have you with us.

Start exploring premium perfumes and luxury fragrances today.

Visit: {website_url}

Regards,
{company_name}`,
  },
  {
    id: 3,
    name: "Order Confirmation",
    trigger: "On order placed",
    subject: "Order Confirmed — Order #{order_id}",
    body: `Hello {user_name},

Your order #{order_id} has been confirmed successfully.

Order Total: {order_total}

You will receive shipping updates soon.

Invoice: {invoice_link}

Regards,
{company_name}`,
  },
  {
    id: 4,
    name: "Payment Verified",
    trigger: "After payment approved",
    subject: "Payment Confirmed — Payment #{payment_id}",
    body: `Hello {user_name},

Your payment has been verified successfully.

Payment ID: {payment_id}
Order ID: {order_id}
Amount: {order_total}

Thank you for shopping with {company_name}.

Regards,
{company_name}`,
  },
  {
    id: 5,
    name: "Shipment Update",
    trigger: "On order shipped",
    subject: "Your Order #{order_id} Has Been Shipped",
    body: `Hello {user_name},

Good news! Your order #{order_id} has been shipped.

Tracking Number: {tracking_number}
Expected Delivery: {delivery_date}

Track your order from your account dashboard.

Regards,
{company_name}`,
  },
  {
    id: 6,
    name: "Delivery Confirmation",
    trigger: "On order delivered",
    subject: "Your Order #{order_id} Has Been Delivered",
    body: `Hello {user_name},

Your order #{order_id} has been delivered successfully.

We hope you enjoy your fragrance.

Thank you for choosing {company_name}.

Regards,
{company_name}`,
  },
  {
    id: 7,
    name: "Password Reset",
    trigger: "On forgot password request",
    subject: "Reset Your {company_name} Password",
    body: `Hello {user_name},

We received a request to reset your password.

Click the link below to reset your password:
{reset_link}

This link will expire in {expiry_time}.

If you did not request this, please ignore this email.

Regards,
{company_name}`,
  },
];

function EmailTemplates() {
  const [templates, setTemplates] = useState(defaultTemplates);
  const [selectedTemplateId, setSelectedTemplateId] = useState(1);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [toast, setToast] = useState("");

  const selectedTemplate = templates.find(
    (template) => template.id === Number(selectedTemplateId)
  );

  const showToast = (message) => {
    setToast(message);

    setTimeout(() => {
      setToast("");
    }, 2200);
  };

  const handleTemplateSelect = (id) => {
    setSelectedTemplateId(Number(id));
  };

  const updateTemplate = (field, value) => {
    setTemplates(
      templates.map((template) =>
        template.id === selectedTemplate.id
          ? { ...template, [field]: value }
          : template
      )
    );
  };

  const insertVariable = (variable) => {
    updateTemplate("body", selectedTemplate.body + ` ${variable}`);
    showToast(`${variable} inserted`);
  };

  const copyVariable = async (variable) => {
    try {
      await navigator.clipboard.writeText(variable);
      showToast(`${variable} copied`);
    } catch {
      showToast("Copy failed");
    }
  };

  const saveTemplate = () => {
    if (!selectedTemplate.subject.trim() || !selectedTemplate.body.trim()) {
      showToast("Subject and body are required");
      return;
    }

    showToast("Email template saved successfully!");
  };

  const resetTemplate = () => {
    const confirmReset = window.confirm("Reset this template to default?");

    if (!confirmReset) return;

    const defaultTemplate = defaultTemplates.find(
      (template) => template.id === selectedTemplate.id
    );

    setTemplates(
      templates.map((template) =>
        template.id === selectedTemplate.id ? defaultTemplate : template
      )
    );

    showToast("Template reset successfully!");
  };

  const previewBody = selectedTemplate.body
    .replaceAll("{company_name}", "I Rasa Perfumes")
    .replaceAll("{user_name}", "Samadhan Patil")
    .replaceAll("{order_id}", "ORD-001")
    .replaceAll("{otp_code}", "4826")
    .replaceAll("{order_total}", "₹999")
    .replaceAll("{payment_id}", "PAY-001")
    .replaceAll("{tracking_number}", "TRK123456")
    .replaceAll("{delivery_date}", "10 May 2026")
    .replaceAll("{reset_link}", "https://irasaperfumes.in/reset-password")
    .replaceAll("{invoice_link}", "https://irasaperfumes.in/invoice/ORD-001")
    .replaceAll("{expiry_time}", "15 minutes")
    .replaceAll("{website_url}", "https://irasaperfumes.in");

  const previewSubject = selectedTemplate.subject
    .replaceAll("{company_name}", "I Rasa Perfumes")
    .replaceAll("{user_name}", "Samadhan Patil")
    .replaceAll("{order_id}", "ORD-001")
    .replaceAll("{otp_code}", "4826")
    .replaceAll("{order_total}", "₹999")
    .replaceAll("{payment_id}", "PAY-001")
    .replaceAll("{tracking_number}", "TRK123456")
    .replaceAll("{delivery_date}", "10 May 2026")
    .replaceAll("{reset_link}", "https://irasaperfumes.in/reset-password")
    .replaceAll("{invoice_link}", "https://irasaperfumes.in/invoice/ORD-001")
    .replaceAll("{expiry_time}", "15 minutes")
    .replaceAll("{website_url}", "https://irasaperfumes.in");

  return (
    <div className="email-template-page">
      <div className="email-template-header">
        <div>
          <h1>Email Templates</h1>
          <p>
            Manage automated email templates for OTP, orders, payments,
            shipment, delivery and password reset.
          </p>
        </div>

        <div className="email-template-actions">
          <button className="btn-secondary" onClick={() => setPreviewOpen(true)}>
            <FaEye /> Preview
          </button>

          <button className="btn-danger" onClick={resetTemplate}>
            <FaUndo /> Reset
          </button>

          <button className="btn-primary" onClick={saveTemplate}>
            <FaSave /> Save Template
          </button>
        </div>
      </div>

      <div className="email-template-grid">
        {/* Template List */}
        <div className="email-template-card template-list-card">
          <h3>
            <FaEnvelopeOpenText /> Available Templates
          </h3>

          <div className="template-list">
            {templates.map((template) => (
              <button
                key={template.id}
                className={
                  selectedTemplate.id === template.id
                    ? "template-list-item active"
                    : "template-list-item"
                }
                onClick={() => handleTemplateSelect(template.id)}
              >
                <span>{template.name}</span>
                <small>{template.trigger}</small>
              </button>
            ))}
          </div>
        </div>

        {/* Template Editor */}
        <div className="email-template-card template-editor-card">
          <h3>{selectedTemplate.name}</h3>

          <div className="template-editor-info">
            <p>
              <strong>Trigger:</strong> {selectedTemplate.trigger}
            </p>
          </div>

          <div className="template-input-group">
            <label>Email Subject</label>
            <input
              type="text"
              value={selectedTemplate.subject}
              onChange={(e) => updateTemplate("subject", e.target.value)}
              placeholder="Email subject"
            />
          </div>

          <div className="template-input-group">
            <label>Email Body</label>
            <textarea
              value={selectedTemplate.body}
              onChange={(e) => updateTemplate("body", e.target.value)}
              rows="15"
              placeholder="Email body"
            ></textarea>
          </div>

          <div className="editor-bottom-actions">
            <button className="btn-secondary" onClick={() => setPreviewOpen(true)}>
              <FaEye /> Preview Template
            </button>

            <button className="btn-primary" onClick={saveTemplate}>
              <FaSave /> Save Template
            </button>
          </div>
        </div>

        {/* Variables */}
        <div className="email-template-card variables-card">
          <h3>
            <FaPlus /> Template Variables
          </h3>

          <p>
            Click variable to insert it into email body. Use copy icon to copy
            variable.
          </p>

          <div className="variables-list">
            {templateVariables.map((variable) => (
              <div className="variable-chip" key={variable}>
                <button onClick={() => insertVariable(variable)}>
                  {variable}
                </button>

                <button
                  className="copy-variable"
                  onClick={() => copyVariable(variable)}
                >
                  <FaCopy />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {previewOpen && (
        <div className="modal-overlay">
          <div className="email-preview-modal">
            <h3>Email Preview</h3>

            <div className="email-preview-box">
              <p className="preview-subject">
                <strong>Subject:</strong> {previewSubject}
              </p>

              <div className="preview-body">
                {previewBody.split("\n").map((line, index) => (
                  <p key={index}>{line || "\u00A0"}</p>
                ))}
              </div>
            </div>

            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={() => setPreviewOpen(false)}
              >
                Close
              </button>

              <button className="btn-primary" onClick={saveTemplate}>
                <FaSave /> Save Template
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="settings-toast">{toast}</div>}
    </div>
  );
}

export default EmailTemplates;