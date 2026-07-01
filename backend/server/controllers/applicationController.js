const db = require("../config/db");

// GET ALL APPLICATIONS WITH BACKEND OFFSET PAGINATION

const getApplications = (req, res) => {
  const page = parseInt(req.query.page) || 1;

  const limit = parseInt(req.query.limit) || 10;

  const offset = (page - 1) * limit;

  const search = req.query.search || "";

  const status = req.query.status || "";

  const loanType = req.query.loanType || "";

  let sql = `
    SELECT *
    FROM loan_applications
    WHERE 1=1
  `;

  let countSql = `
    SELECT COUNT(*) AS total
    FROM loan_applications
    WHERE 1=1
  `;

  const params = [];
  const countParams = [];

  // SEARCH
  if (search) {
    sql += `
      AND (
        loan_code LIKE ?
        OR applicant_name LIKE ?
        OR pan_number LIKE ?
      )
    `;

    countSql += `
      AND (
        loan_code LIKE ?
        OR applicant_name LIKE ?
        OR pan_number LIKE ?
      )
    `;

    const searchValue = `%${search}%`;

    params.push(searchValue, searchValue, searchValue);

    countParams.push(searchValue, searchValue, searchValue);
  }

  // STATUS FILTER
  if (status) {
    sql += `
      AND status = ?
    `;

    countSql += `
      AND status = ?
    `;

    params.push(status);

    countParams.push(status);
  }

  // LOAN TYPE FILTER
  if (loanType) {
    sql += `
      AND loan_type = ?
    `;

    countSql += `
      AND loan_type = ?
    `;

    params.push(loanType);

    countParams.push(loanType);
  }

  // PAGINATION
  sql += `
    ORDER BY created_at DESC
    LIMIT ?
    OFFSET ?
  `;

  params.push(limit, offset);

  db.query(
    sql,
    params,

    (err, result) => {
      if (err) {
        console.log(err);

        return res.status(500).json(err);
      }

      const applications = result;

      const timelineSQL = `
        SELECT
          application_id,
          status,
          note,
          DATE_FORMAT(
            action_date,
            '%Y-%m-%d'
          ) AS date

        FROM application_timeline

        ORDER BY action_date ASC
      `;

      db.query(
        timelineSQL,

        (timelineErr, timelineResult) => {
          if (timelineErr) {
            console.log(timelineErr);

            return res.status(500).json(timelineErr);
          }

          const formattedApps = applications.map((app) => {
            const timeline = timelineResult.filter(
              (t) => t.application_id === app.id,
            );

            return {
              ...app,
              timeline,
            };
          });

          // COUNT QUERY
          db.query(
            countSql,
            countParams,

            (countErr, countResult) => {
              if (countErr) {
                console.log(countErr);

                return res.status(500).json(countErr);
              }

              const total = countResult[0].total;

              res.status(200).json({
                data: formattedApps,

                pagination: {
                  total,

                  page,

                  limit,

                  totalPages: Math.ceil(total / limit),
                },
              });
            },
          );
        },
      );
    },
  );
};

// GET SINGLE APPLICATION

const getSingleApplication = (req, res) => {
  const { id } = req.params;

  const sql = `
      SELECT *
      FROM loan_applications
      WHERE id = ?
    `;

  db.query(
    sql,
    [id],

    (err, result) => {
      if (err) {
        console.log(err);

        return res.status(500).json(err);
      }

      if (result.length === 0) {
        return res.status(404).json({
          message: "Application not found",
        });
      }

      res.status(200).json(result[0]);
    },
  );
};

// UPDATE APPLICATION

const updateApplication = (req, res) => {
  const { id } = req.params;

  const {
    applicant_name,
    dob,
    pan_number,
    aadhaar_number,
    address,
    employment_type,
    monthly_income,
    loan_type,
    loan_amount,
    tenure_months,
    purpose,
    co_applicant_details,
    status,
  } = req.body;

  const sql = `
      UPDATE loan_applications
      SET
        applicant_name = ?,
        dob = ?,
        pan_number = ?,
        aadhaar_number = ?,
        address = ?,
        employment_type = ?,
        monthly_income = ?,
        loan_type = ?,
        loan_amount = ?,
        tenure_months = ?,
        purpose = ?,
        co_applicant_details = ?,
        status = ?
      WHERE id = ?
    `;

  const values = [
    applicant_name,
    dob,
    pan_number,
    aadhaar_number,
    address,
    employment_type,
    monthly_income,
    loan_type,
    loan_amount,
    tenure_months,
    purpose,
    co_applicant_details,
    status,
    id,
  ];

  db.query(
    sql,
    values,

    (err) => {
      if (err) {
        console.log(err);

        return res.status(500).json(err);
      }

      const timelineSQL = `
          INSERT INTO application_timeline
          (
            application_id,
            status,
            note,
            action_date
          )
          VALUES (?, ?, ?, NOW())
        `;

      db.query(
        timelineSQL,

        [id, status, `Application status changed to ${status}`],

        (timelineErr) => {
          if (timelineErr) {
            console.log(timelineErr);
          }

          res.status(200).json({
            message: "Application updated successfully",
          });
        },
      );
    },
  );
};

// CREATE APPLICATION
const createApplication = (req, res) => {
  const {
    applicant_name,
    dob,
    pan_number,
    aadhaar_number,
    address,
    employment_type,
    monthly_income,
    loan_type,
    loan_amount,
    tenure_months,
    purpose,
    co_applicant_details,
    status,
  } = req.body;

  // Unique loan_code generate करतो: LOAN-XXXXXX
  const loan_code = "LOAN-" + Date.now().toString().slice(-6);

  const sql = `
    INSERT INTO loan_applications
    (
      loan_code,
      applicant_name,
      dob,
      pan_number,
      aadhaar_number,
      address,
      employment_type,
      monthly_income,
      loan_type,
      loan_amount,
      tenure_months,
      purpose,
      co_applicant_details,
      status,
      application_date,
      created_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
  `;

  const values = [
    loan_code,
    applicant_name,
    dob,
    pan_number,
    aadhaar_number,
    address,
    employment_type,
    monthly_income,
    loan_type,
    loan_amount,
    tenure_months,
    purpose,
    co_applicant_details || "",
    status || "Draft",
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }

    const newId = result.insertId;

    // Timeline entry add करतो
    db.query(
      `INSERT INTO application_timeline (application_id, status, note, action_date)
       VALUES (?, ?, ?, NOW())`,
      [newId, status || "Draft", "Application created"],
      (timelineErr) => {
        if (timelineErr) console.log(timelineErr);

        res.status(201).json({
          message: "Application created successfully",
          id: newId,
          loan_code,
        });
      }
    );
  });
};

module.exports = {
  getApplications,
  getSingleApplication,
  updateApplication,
  createApplication,
};
