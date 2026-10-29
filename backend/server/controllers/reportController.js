const db = require("../config/db");

// GET REPORT DATA (with filters)
const getReportData = (req, res) => {
  const { loan_type, status, from_date, to_date, search } = req.query;
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.max(1, parseInt(req.query.limit, 10) || 10);
  const offset = (page - 1) * limit;

  const baseSql = `
    FROM loan_applications la
    LEFT JOIN loan_approval_actions lap
      ON la.id = lap.application_id
  `;
  const conditions = [];
  const values = [];

  if (loan_type && loan_type !== "All") {
    conditions.push("la.loan_type = ?");
    values.push(loan_type);
  }

  if (status && status !== "All") {
    conditions.push("IFNULL(lap.action, la.status) = ?");
    values.push(status);
  }

  if (from_date) {
    conditions.push("la.application_date >= ?");
    values.push(from_date);
  }

  if (to_date) {
    conditions.push("la.application_date < DATE_ADD(?, INTERVAL 1 DAY)");
    values.push(to_date);
  }

  if (search) {
    conditions.push(`(
      la.loan_code LIKE ? OR
      la.applicant_name LIKE ? OR
      la.loan_type LIKE ? OR
      IFNULL(lap.action, la.status) LIKE ?
    )`);
    const value = `%${search}%`;
    values.push(value, value, value, value);
  }

  const whereSql = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const sql = `
    SELECT
      la.id,
      la.loan_code AS loan_id,
      la.applicant_name AS name,
      la.loan_type,
      la.loan_amount AS amount,
      IFNULL(lap.action, la.status) AS status,
      DATE_FORMAT(la.application_date, '%Y-%m-%d') AS date,
      IFNULL(lap.remarks, '-') AS remarks
    ${baseSql}
    ${whereSql}
    ORDER BY la.application_date DESC, la.id DESC
    LIMIT ? OFFSET ?
  `;
  const countSql = `SELECT COUNT(*) AS total ${baseSql} ${whereSql}`;

  db.query(sql, [...values, limit, offset], (err, result) => {
    if (err) {
      console.log("REPORT ERROR:", err);
      return res.status(500).json(err);
    }

    db.query(countSql, values, (countErr, countResult) => {
      if (countErr) {
        console.log("REPORT COUNT ERROR:", countErr);
        return res.status(500).json(countErr);
      }

      const total = countResult[0].total;
      res.status(200).json({
        data: result,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      });
    });
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
