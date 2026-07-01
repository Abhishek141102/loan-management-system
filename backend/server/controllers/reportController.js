const db = require("../config/db");

// GET REPORT DATA (with filters)
const getReportData = (req, res) => {
  const { loan_type, status, from_date, to_date, search } = req.query;

  let sql = `
    SELECT
      la.id,
      la.loan_code AS loan_id,
      la.applicant_name AS name,
      la.loan_type,
      la.loan_amount AS amount,
      IFNULL(lap.action, la.status) AS status,
      DATE_FORMAT(la.application_date, '%Y-%m-%d') AS date,
      IFNULL(lap.remarks, '-') AS remarks
    FROM loan_applications la
    LEFT JOIN loan_approval_actions lap
      ON la.id = lap.application_id
    WHERE 1=1
  `;

  const values = [];

  if (loan_type && loan_type !== "All") {
    sql += " AND la.loan_type = ?";
    values.push(loan_type);
  }

  if (status && status !== "All") {
    sql += " AND IFNULL(lap.action, la.status) = ?";
    values.push(status);
  }

  if (from_date) {
    sql += " AND la.application_date >= ?";
    values.push(from_date);
  }

  if (to_date) {
    sql += " AND la.application_date <= ?";
    values.push(to_date);
  }

  if (search) {
    sql += ` AND (
      la.loan_code LIKE ? OR
      la.applicant_name LIKE ? OR
      la.loan_type LIKE ? OR
      IFNULL(lap.action, la.status) LIKE ?
    )`;
    const s = `%${search}%`;
    values.push(s, s, s, s);
  }

  sql += " ORDER BY la.application_date DESC";

  db.query(sql, values, (err, result) => {
    if (err) {
      console.log("REPORT ERROR:", err);
      return res.status(500).json(err);
    }
    res.status(200).json(result);
  });
};

// GET CHART DATA (summary for charts)
const getReportSummary = (req, res) => {
  const monthlySQL = `
    SELECT
      DATE_FORMAT(application_date, '%b') AS month,
      COUNT(*) AS total
    FROM loan_applications
    WHERE application_date >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
    GROUP BY DATE_FORMAT(application_date, '%Y-%m'), DATE_FORMAT(application_date, '%b')
    ORDER BY DATE_FORMAT(application_date, '%Y-%m') ASC
  `;

  const statusSQL = `
  SELECT
    status,
    COUNT(*) AS total
  FROM loan_applications
  GROUP BY status
`;

  const loanTypeSQL = `
    SELECT loan_type, COUNT(*) AS total
    FROM loan_applications
    GROUP BY loan_type
  `;

  const turnaroundSQL = `
    SELECT
      la.loan_type,
      ROUND(AVG(DATEDIFF(lap.action_at, la.application_date)), 1) AS avg_days
    FROM loan_applications la
    INNER JOIN loan_approval_actions lap ON la.id = lap.application_id
    GROUP BY la.loan_type
  `;

  const docVerificationSQL = `
    SELECT
      WEEK(uploaded_at) AS week_num,
      COUNT(*) AS verified
    FROM loan_documents
    WHERE uploaded_at >= DATE_SUB(NOW(), INTERVAL 4 WEEK)
    GROUP BY WEEK(uploaded_at)
    ORDER BY WEEK(uploaded_at) ASC
  `;

  const results = {};

  db.query(monthlySQL, (err, monthly) => {
    if (err) return res.status(500).json(err);
    results.monthly = monthly;

    db.query(statusSQL, (err, statusData) => {
      if (err) return res.status(500).json(err);
      results.statusBreakdown = statusData;

      db.query(loanTypeSQL, (err, loanTypes) => {
        if (err) return res.status(500).json(err);
        results.loanTypes = loanTypes;

        db.query(turnaroundSQL, (err, turnaround) => {
          if (err) return res.status(500).json(err);
          results.turnaround = turnaround;

          db.query(docVerificationSQL, (err, docData) => {
            if (err) return res.status(500).json(err);
            results.docVerification = docData;

            res.status(200).json(results);
          });
        });
      });
    });
  });
};

module.exports = {
  getReportData,
  getReportSummary,
};
