const db = require("../config/db");
const transporter = require("../config/mail");

// GET ALL ENQUIRIES
const getEnquiries = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  const search = req.query.search || "";
  const loanType = req.query.loanType || "";
  const status = req.query.status || "";

  let sql = `SELECT * FROM loan_enquiries WHERE 1=1`;
  let countSql = `SELECT COUNT(*) AS total FROM loan_enquiries WHERE 1=1`;
  const params = [];
  const countParams = [];

  if (search) {
    sql += ` AND (full_name LIKE ? OR mobile LIKE ? OR city LIKE ?)`;
    countSql += ` AND (full_name LIKE ? OR mobile LIKE ? OR city LIKE ?)`;
    const s = `%${search}%`;
    params.push(s, s, s);
    countParams.push(s, s, s);
  }
  if (loanType) {
    sql += ` AND loan_type = ?`;
    countSql += ` AND loan_type = ?`;
    params.push(loanType);
    countParams.push(loanType);
  }
  if (status) {
    sql += ` AND status = ?`;
    countSql += ` AND status = ?`;
    params.push(status);
    countParams.push(status);
  }

  sql += ` ORDER BY id DESC LIMIT ? OFFSET ?`;
  params.push(limit, offset);

  db.query(sql, params, (err, result) => {
    if (err) return res.status(500).json(err);
    db.query(countSql, countParams, (countErr, countResult) => {
      if (countErr) return res.status(500).json(countErr);
      res.json({
        data: result,
        pagination: {
          total: countResult[0].total,
          page,
          limit,
          totalPages: Math.ceil(countResult[0].total / limit),
        },
      });
    });
  });
};

// GET SINGLE ENQUIRY
const getSingleEnquiry = (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM loan_enquiries WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.length === 0) return res.status(404).json({ message: "Enquiry not found" });
    res.status(200).json(result[0]);
  });
};

// CREATE ENQUIRY
const createEnquiry = (req, res) => {
  const { full_name, mobile, email, loan_type, loan_amount, city, message } = req.body;
  const enquiryCode = "ENQ-" + Math.floor(100 + Math.random() * 900);

  db.query(
    `INSERT INTO loan_enquiries
     (enquiry_code, full_name, mobile, email, loan_type, loan_amount, city, message, status, enquiry_date)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'New', NOW())`,
    [enquiryCode, full_name, mobile, email, loan_type, loan_amount, city, message],
    (err) => {
      if (err) { console.log(err); return res.status(500).json(err); }
      res.status(201).json({ message: "Enquiry created successfully" });
    }
  );
};

// UPDATE STATUS
const updateEnquiryStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  db.query("UPDATE loan_enquiries SET status = ? WHERE id = ?", [status, id], (err) => {
    if (err) return res.status(500).json(err);
    res.status(200).json({ message: "Status updated successfully" });
  });
};

// DELETE ENQUIRY
const deleteEnquiry = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM loan_enquiries WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json(err);
    res.status(200).json({ message: "Enquiry deleted successfully" });
  });
};

// CONVERT TO APPLICATION
const convertToApplication = (req, res) => {
  const { id } = req.params;

  // Step 1 — Enquiry fetch karo
  db.query("SELECT * FROM loan_enquiries WHERE id = ?", [id], (err, enquiryResult) => {
    if (err) { console.log(err); return res.status(500).json(err); }
    if (enquiryResult.length === 0) return res.status(404).json({ message: "Enquiry not found" });

    const enquiry = enquiryResult[0];
    const loanCode = "LOAN-" + Math.floor(Math.random() * 100000);

    // Step 2 — loan_applications insert
    db.query(
      `INSERT INTO loan_applications
       (loan_code, enquiry_id, applicant_name, loan_type, loan_amount, application_date, status)
       VALUES (?, ?, ?, ?, ?, NOW(), 'Submitted')`,
      [loanCode, enquiry.id, enquiry.full_name, enquiry.loan_type, enquiry.loan_amount],
      (err, appResult) => {
        if (err) { console.log(err); return res.status(500).json(err); }

        const newApplicationId = appResult.insertId;
        const customerCode = "CUST-" + Date.now();

        // Step 3 — customers table: email se check karo pehle se hai ya nahi
        db.query(
          "SELECT id FROM customers WHERE email = ? OR mobile = ?",
          [enquiry.email, enquiry.mobile],
          (err, existingCustomer) => {
            if (err) console.log("CUSTOMER CHECK ERROR:", err);

            if (existingCustomer && existingCustomer.length > 0) {
              // Already exists — sirf mobile update karo agar missing hai
              const customerId = existingCustomer[0].id;
              db.query(
                "UPDATE customers SET mobile = ? WHERE id = ? AND (mobile IS NULL OR mobile = '')",
                [enquiry.mobile, customerId],
                (err) => { if (err) console.log("CUSTOMER UPDATE ERROR:", err); }
              );
              insertCustomerLoan(customerId, enquiry, newApplicationId, id, res);
            } else {
              // Naya customer banao
              db.query(
                `INSERT INTO customers (customer_code, full_name, mobile, email, status)
                 VALUES (?, ?, ?, ?, 'Active')`,
                [customerCode, enquiry.full_name, enquiry.mobile, enquiry.email],
                (err, custResult) => {
                  if (err) { console.log("CUSTOMER INSERT ERROR:", err); }
                  const customerId = custResult?.insertId;
                  insertCustomerLoan(customerId, enquiry, newApplicationId, id, res);
                }
              );
            }
          }
        );
      }
    );
  });
};

// Helper — customer_loans + timeline + document + enquiry status update
const insertCustomerLoan = (customerId, enquiry, newApplicationId, enquiryId, res) => {
  // customer_loans insert
  if (customerId) {
    db.query(
      `INSERT INTO customer_loans (customer_id, loan_type, approved_amount, emi_amount)
       VALUES (?, ?, ?, 0)`,
      [customerId, enquiry.loan_type, enquiry.loan_amount],
      (err) => { if (err) console.log("CUSTOMER LOAN INSERT ERROR:", err); }
    );
  }

  // Timeline entry
  db.query(
    `INSERT INTO application_timeline (application_id, status, note, action_date)
     VALUES (?, 'Submitted', 'Application created from enquiry', NOW())`,
    [newApplicationId],
    (err) => {
      if (err) console.log("TIMELINE ERROR:", err);

      // Document row
      db.query(
        `INSERT INTO loan_documents
         (application_id, document_name, document_type, file_name, file_path, file_type, uploaded, status, rejection_reason, uploaded_at)
         VALUES (?, 'Aadhaar Card', 'KYC', '', '', '', 'No', 'Pending', '', NOW())`,
        [newApplicationId],
        (err) => {
          if (err) console.log("DOC INSERT ERROR:", err);

          // Enquiry status Converted
          db.query(
            "UPDATE loan_enquiries SET status = 'Converted' WHERE id = ?",
            [enquiryId],
            (err) => {
              if (err) { console.log(err); return res.status(500).json(err); }
              res.status(200).json({ message: "Enquiry converted successfully" });
            }
          );
        }
      );
    }
  );
};

// SEND FOLLOWUP EMAIL
const sendFollowupEmail = (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM loan_enquiries WHERE id = ?", [id], async (err, result) => {
    if (err) { console.log(err); return res.status(500).json(err); }
    if (result.length === 0) return res.status(404).json({ message: "Enquiry not found" });

    const enquiry = result[0];
    try {
      await transporter.sendMail({
        from: "tarlemayuri74@gmail.com",
        to: enquiry.email,
        subject: "Loan Follow-up",
        html: `<h2>Hello ${enquiry.full_name}</h2>
               <p>We are following up regarding your ${enquiry.loan_type} enquiry.</p>
               <p>Our team will contact you shortly.</p>`,
      });
      res.status(200).json({ message: "Follow-up email sent successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Email sending failed" });
    }
  });
};

module.exports = {
  getEnquiries,
  getSingleEnquiry,
  createEnquiry,
  updateEnquiryStatus,
  deleteEnquiry,
  convertToApplication,
  sendFollowupEmail,
};
