const db = require("../config/db");

// GET APPROVAL QUEUE WITH BACKEND OFFSET PAGINATION

const getApprovalQueue = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  const search = req.query.search || "";
  const status = req.query.status || "";
  const loanType = req.query.loanType || "";

  let sql = `
    SELECT
      la.id AS application_id,
      la.loan_code,
      la.applicant_name,
      la.loan_type,
      la.loan_amount,
      la.monthly_income,
      IFNULL(lap.cibil_score, 750) AS cibil_score,
      IFNULL(lap.income_emi_ratio, 25) AS income_emi_ratio,
      IFNULL(lap.action, 'Ready') AS approval_status
    FROM loan_applications la
    LEFT JOIN loan_approval_actions lap ON la.id = lap.application_id
    WHERE 1=1
  `;

  let countSql = `
    SELECT COUNT(*) AS total
    FROM loan_applications la
    LEFT JOIN loan_approval_actions lap ON la.id = lap.application_id
    WHERE 1=1
  `;

  const params = [];
  const countParams = [];

  if (search) {
    const clause = ` AND (la.loan_code LIKE ? OR la.applicant_name LIKE ? OR la.loan_type LIKE ?)`;
    sql += clause;
    countSql += clause;
    const v = `%${search}%`;
    params.push(v, v, v);
    countParams.push(v, v, v);
  }

  if (status) {
    const clause = ` AND IFNULL(lap.action, 'Ready') = ?`;
    sql += clause;
    countSql += clause;
    params.push(status);
    countParams.push(status);
  }

  if (loanType) {
    const clause = ` AND la.loan_type = ?`;
    sql += clause;
    countSql += clause;
    params.push(loanType);
    countParams.push(loanType);
  }

  sql += ` ORDER BY la.created_at DESC LIMIT ? OFFSET ?`;
  params.push(limit, offset);

  db.query(sql, params, (err, result) => {
    if (err) { console.log(err); return res.status(500).json(err); }

    db.query(countSql, countParams, (countErr, countResult) => {
      if (countErr) { console.log(countErr); return res.status(500).json(countErr); }

      res.status(200).json({
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

// APPROVE LOAN

const approveLoan = (req, res) => {
  const { application_id, cibil_score, income_emi_ratio, remarks } = req.body;

  // Step 0 — Already approved check
  db.query(
    `SELECT id FROM loan_approval_actions WHERE application_id = ? AND action = 'Approved' LIMIT 1`,
    [application_id],
    (err, existingResult) => {
      if (err) { console.log(err); return res.status(500).json(err); }
      if (existingResult.length > 0) {
        return res.status(400).json({ message: "Application already approved" });
      }
      proceedApproval();
    }
  );

  function proceedApproval() {

    // Step 1 — Application fetch
    db.query(
      `SELECT * FROM loan_applications WHERE id = ?`,
      [application_id],
      (err, appResult) => {
        if (err) { console.log(err); return res.status(500).json(err); }
        if (appResult.length === 0) return res.status(404).json({ message: "Application not found" });

        const app = appResult[0];
        const emiAmount = Math.round(Number(app.loan_amount) / Number(app.tenure_months || 12));
        const calculatedRatio = income_emi_ratio ? Number(income_emi_ratio) : Number(((emiAmount / Number(app.monthly_income || 1)) * 100).toFixed(2));
        const calculatedCibil = cibil_score ? Number(cibil_score) : 750;

        // Step 2 — Insert approval action
        db.query(
          `INSERT INTO loan_approval_actions (application_id, cibil_score, income_emi_ratio, action, remarks, rejection_reason, action_by, action_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
          [Number(application_id), calculatedCibil, calculatedRatio, "Approved", remarks || "Loan Approved", "", "1"],
          (err) => {
            if (err) { console.log("APPROVE ERROR:", err); return res.status(500).json(err); }

            // Step 3 — Update application status
            db.query(
              `UPDATE loan_applications SET status = 'Approved' WHERE id = ?`,
              [application_id],
              (err) => {
                if (err) { console.log("STATUS UPDATE ERROR:", err); return res.status(500).json(err); }

                // Step 4 — Timeline entry
                db.query(
                  `INSERT INTO application_timeline (application_id, status, note, action_date)
                   VALUES (?, ?, ?, NOW())`,
                  [application_id, "Approved", remarks || "Loan Approved by admin"],
                  (timelineErr) => {
                    if (timelineErr) console.log("TIMELINE ERROR:", timelineErr);

                    // Step 5 — Customer create
                    const customerCode = `CUST-${Date.now()}`;
                    db.query(
                      `INSERT INTO customers (customer_code, full_name, mobile, email, dob, address, status, created_at)
                       VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
                      [customerCode, app.applicant_name, app.mobile || "", app.email || "", app.dob || null, app.address || "", "Approved"],
                      (err, customerResult) => {
                        if (err) { console.log("CUSTOMER INSERT ERROR:", err); return res.status(500).json(err); }

                        const customerId = customerResult.insertId;

                        // Step 6 — Customer loan create
                        db.query(
                          `INSERT INTO customer_loans (customer_id, application_id, loan_type, approved_amount, emi_amount, tenure_months, loan_status, created_at)
                           VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
                          [customerId, app.id, app.loan_type, app.loan_amount, emiAmount, app.tenure_months || 12, "Approved"],
                          (err) => {
                            if (err) { console.log("CUSTOMER LOAN ERROR:", err); return res.status(500).json(err); }

                            // Step 7 — Sirf Aadhaar Card ki ek row create karo
                            db.query(
                              `SELECT COUNT(*) AS count FROM loan_documents
                               WHERE application_id = ? AND document_name = 'Aadhaar Card'`,
                              [app.id],
                              (err, docCheckResult) => {
                                if (err) { console.log("DOC CHECK ERROR:", err); return res.status(500).json(err); }

                                if (docCheckResult[0].count > 0) {
                                  // Already exists — skip
                                  return res.status(200).json({
                                    message: "Approved, customer created successfully",
                                  });
                                }

                                // Sirf Aadhaar Card insert karo
                                db.query(
                                  `INSERT INTO loan_documents
                                   (application_id, document_name, document_type, file_name, file_path, file_type, uploaded, status, rejection_reason, uploaded_at)
                                   VALUES (?, 'Aadhaar Card', 'KYC', '', '', '', 'No', 'Pending', '', NOW())`,
                                  [app.id],
                                  (err) => {
                                    if (err) console.log("DOCUMENT INSERT ERROR:", err);

                                    return res.status(200).json({
                                      message: "Approved, customer created, Aadhaar document entry created",
                                    });
                                  }
                                );
                              }
                            );
                          }
                        );
                      }
                    );
                  }
                );
              }
            );
          }
        );
      }
    );
  } // end proceedApproval
};

// REJECT LOAN

const rejectLoan = (req, res) => {
  const { application_id, cibil_score, income_emi_ratio, remarks, rejection_reason } = req.body;

  db.query(
    `INSERT INTO loan_approval_actions (application_id, cibil_score, income_emi_ratio, action, remarks, rejection_reason, action_by, action_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
    [Number(application_id), Number(cibil_score || 650), Number(income_emi_ratio || 40), "Rejected", remarks || "", rejection_reason || "Rejected", "1"],
    (err) => {
      if (err) { console.log("REJECT ERROR:", err); return res.status(500).json(err); }

      db.query(
        `UPDATE loan_applications SET status = 'Rejected' WHERE id = ?`,
        [application_id],
        (err) => {
          if (err) { console.log("REJECT STATUS ERROR:", err); return res.status(500).json(err); }

          db.query(
            `INSERT INTO application_timeline (application_id, status, note, action_date)
             VALUES (?, ?, ?, NOW())`,
            [application_id, "Rejected", rejection_reason || "Loan Rejected by admin"],
            (timelineErr) => {
              if (timelineErr) console.log("TIMELINE ERROR:", timelineErr);

              res.status(200).json({ message: "Rejected successfully" });
            }
          );
        }
      );
    }
  );
};

module.exports = {
  getApprovalQueue,
  approveLoan,
  rejectLoan,
};