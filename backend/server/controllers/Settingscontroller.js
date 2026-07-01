const db = require("../config/db");

// ─────────────────────────────────────────────
// GENERAL SETTINGS
// ─────────────────────────────────────────────

const getGeneralSettings = (req, res) => {
  const sql = `
    SELECT *
    FROM general_settings
    WHERE id = 1
  `;

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    if (result.length === 0) {
      return res.status(404).json({
        message: "Settings not found",
      });
    }

    res.status(200).json(result[0]);
  });
};

const saveGeneralSettings = (req, res) => {
  const { system_name, contact_email, default_interest_rate, currency_symbol } =
    req.body;

  const sql = `
    UPDATE general_settings

    SET
      system_name = ?,
      contact_email = ?,
      default_interest_rate = ?,
      currency_symbol = ?

    WHERE id = 1
  `;

  db.query(
    sql,
    [system_name, contact_email, default_interest_rate, currency_symbol],

    (err) => {
      if (err) {
        return res.status(500).json(err);
      }

      res.status(200).json({
        message: "General settings saved successfully",
      });
    },
  );
};

// ─────────────────────────────────────────────
// SMTP SETTINGS
// ─────────────────────────────────────────────

const getSmtpSettings = (req, res) => {
  const sql = "SELECT * FROM smtp_settings WHERE id = 1";

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.length === 0) {
      return res.status(404).json({ message: "SMTP settings not found" });
    }

    // Password hide karo response mein
    const smtp = { ...result[0] };
    smtp.password = smtp.password ? "••••••••" : "";

    res.status(200).json(smtp);
  });
};

const saveSmtpSettings = (req, res) => {
  const { smtp_host, smtp_port, username, password, from_name, from_email } =
    req.body;

  // Agar password "••••••••" aaye toh update mat karo (user ne change nahi kiya)
  const isPasswordChanged = password && password !== "••••••••";

  let sql, values;

  if (isPasswordChanged) {
    sql = `
      UPDATE smtp_settings
      SET smtp_host = ?, smtp_port = ?, username = ?, password = ?, from_name = ?, from_email = ?
      WHERE id = 1
    `;
    values = [smtp_host, smtp_port, username, password, from_name, from_email];
  } else {
    sql = `
      UPDATE smtp_settings
      SET smtp_host = ?, smtp_port = ?, username = ?, from_name = ?, from_email = ?
      WHERE id = 1
    `;
    values = [smtp_host, smtp_port, username, from_name, from_email];
  }

  db.query(sql, values, (err) => {
    if (err) return res.status(500).json(err);
    res.status(200).json({ message: "SMTP settings saved successfully" });
  });
};

// ─────────────────────────────────────────────
// EMAIL TEMPLATES
// ─────────────────────────────────────────────

const getEmailTemplates = (req, res) => {
  const sql = "SELECT * FROM email_templates ORDER BY id ASC";

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.status(200).json(result);
  });
};

const saveEmailTemplate = (req, res) => {
  const { template_key } = req.params;
  const { template_name, trigger_event, subject, body } = req.body;

  const sql = `
    UPDATE email_templates
    SET template_name = ?, trigger_event = ?, subject = ?, body = ?
    WHERE template_key = ?
  `;

  db.query(
    sql,
    [template_name, trigger_event, subject, body, template_key],
    (err, result) => {
      if (err) return res.status(500).json(err);

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Template not found" });
      }

      res.status(200).json({ message: "Template saved successfully" });
    },
  );
};

const resetEmailTemplates = (req, res) => {
  const defaultTemplates = [
    {
      key: "enquiry",
      name: "Enquiry Received",
      trigger: "New enquiry submitted",
      subject: "We received your loan enquiry — I Loan",
      body: "Hello {customer_name},\n\nThank you for your enquiry for a {loan_type} of ₹{loan_amount}.\nOur team will contact you within 24–48 hours.\n\nRegards,\nI Loan Management System",
    },
    {
      key: "application",
      name: "Application Submitted",
      trigger: "Loan application created",
      subject: "Loan Application #{loan_id} Submitted — I Loan",
      body: "Hello {customer_name},\n\nYour loan application (ID: #{loan_id}) has been submitted successfully.\nPlease upload the required documents to proceed.\n\nRegards,\nI Loan Management System",
    },
    {
      key: "documentRejected",
      name: "Document Rejected",
      trigger: "Document fails verification",
      subject: "Document Rejected — Action Required",
      body: "Hello {customer_name},\n\nYour document was rejected.\nReason: {rejection_reason}\n\nPlease re-upload the correct document.\n\nRegards,\nI Loan Management System",
    },
    {
      key: "allDocumentsVerified",
      name: "All Documents Verified",
      trigger: "All docs approved",
      subject: "All Documents Verified — I Loan",
      body: "Hello {customer_name},\n\nAll required documents for your loan application #{loan_id} have been verified.\nYour application is now moved to approval process.\n\nRegards,\nI Loan Management System",
    },
    {
      key: "loanApproved",
      name: "Loan Approved",
      trigger: "Final approval granted",
      subject: "Congratulations! Your Loan is Approved — I Loan",
      body: "Hello {customer_name},\n\nYour {loan_type} of ₹{loan_amount} has been APPROVED.\nEMI Amount: ₹{emi_amount}\nTenure: {tenure} months\n\nRegards,\nI Loan Management System",
    },
    {
      key: "loanRejected",
      name: "Loan Rejected",
      trigger: "Final rejection",
      subject: "Loan Application Update — I Loan",
      body: "Hello {customer_name},\n\nAfter review, your loan application #{loan_id} could not be approved.\nReason: {rejection_reason}\n\nYou may reapply after 90 days.\n\nRegards,\nI Loan Management System",
    },
    {
      key: "sanctionLetter",
      name: "Sanction Letter",
      trigger: "Sent with approval",
      subject: "Sanction Letter for Loan #{loan_id} — I Loan",
      body: "Hello {customer_name},\n\nYour sanction letter for {loan_type} of ₹{loan_amount} is ready.\nDisbursement Date: {disbursement_date}\n\nRegards,\nI Loan Management System",
    },
    {
      key: "passwordReset",
      name: "Password Reset",
      trigger: "Admin forgot password",
      subject: "Password Reset Request — I Loan Admin",
      body: "Hello Admin,\n\nPlease use the below link to reset your password:\n\n{reset_link}\n\nThis link will expire soon.\n\nRegards,\nI Loan Management System",
    },
  ];

  const sql = `
    UPDATE email_templates
    SET template_name = ?, trigger_event = ?, subject = ?, body = ?
    WHERE template_key = ?
  `;

  const queries = defaultTemplates.map((t) => {
    return new Promise((resolve, reject) => {
      db.query(sql, [t.name, t.trigger, t.subject, t.body, t.key], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  });

  Promise.all(queries)
    .then(() =>
      res.status(200).json({ message: "All templates reset to default" }),
    )
    .catch((err) => res.status(500).json(err));
};

module.exports = {
  getGeneralSettings,
  saveGeneralSettings,
  getSmtpSettings,
  saveSmtpSettings,
  getEmailTemplates,
  saveEmailTemplate,
  resetEmailTemplates,
};
