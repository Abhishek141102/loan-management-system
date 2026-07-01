const db = require("../config/db");

const getDocuments = (req, res) => {
  const page   = parseInt(req.query.page)  || 1;
  const limit  = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  const search = req.query.search || "";
  const status = req.query.status || "";
  const type   = req.query.type   || "";

  let sql = `
    SELECT ld.*, la.loan_code, la.applicant_name AS customer, la.loan_type
    FROM loan_documents ld
    LEFT JOIN loan_applications la ON ld.application_id = la.id
    WHERE 1=1
  `;
  let countSql = `
    SELECT COUNT(*) AS total
    FROM loan_documents ld
    LEFT JOIN loan_applications la ON ld.application_id = la.id
    WHERE 1=1
  `;

  const params = [];
  const countParams = [];

  if (search) {
    const clause = ` AND (la.loan_code LIKE ? OR la.applicant_name LIKE ? OR ld.document_name LIKE ?)`;
    sql      += clause;
    countSql += clause;
    const v = `%${search}%`;
    params.push(v, v, v);
    countParams.push(v, v, v);
  }
  if (status) {
    sql      += ` AND ld.status = ?`;
    countSql += ` AND ld.status = ?`;
    params.push(status);
    countParams.push(status);
  }
  if (type) {
    sql      += ` AND ld.document_type = ?`;
    countSql += ` AND ld.document_type = ?`;
    params.push(type);
    countParams.push(type);
  }

  sql += ` ORDER BY ld.uploaded_at DESC LIMIT ? OFFSET ?`;
  params.push(limit, offset);

  db.query(sql, params, (err, result) => {
    if (err) return res.status(500).json(err);

    db.query(countSql, countParams, (countErr, countResult) => {
      if (countErr) return res.status(500).json(countErr);

      const total = countResult[0].total;

      // ─── Status counts (global, unfiltered) ───────────────
      const statusCountSql = `
        SELECT status, COUNT(*) AS count
        FROM loan_documents
        GROUP BY status
      `;

      db.query(statusCountSql, [], (countErr2, statusResult) => {
        if (countErr2) return res.status(500).json(countErr2);

        const status_counts = {
          "Pending": 0, "Uploaded": 0, "Under Verification": 0,
          "Verified": 0, "Rejected": 0,
        };
        statusResult.forEach((row) => {
          if (row.status in status_counts) status_counts[row.status] = row.count;
        });

        res.status(200).json({
          data: result,
          pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
          status_counts,
        });
      });
    });
  });
};

const createDocument = (req, res) => {
  const { application_id, document_name, document_type, file_name, file_type } = req.body;

  const filePath = `/uploads/${file_name}`;

  // Pehle check karo — same application_id + document_name ki Pending row exist karti hai kya
  db.query(
    `SELECT id FROM loan_documents
     WHERE application_id = ? AND document_name = ? AND uploaded = 'No' AND status = 'Pending'
     LIMIT 1`,
    [Number(application_id), document_name],
    (err, existingRows) => {
      if (err) { console.log(err); return res.status(500).json(err); }

      if (existingRows.length > 0) {
        // Existing pending row UPDATE karo — naya INSERT mat karo
        db.query(
          `UPDATE loan_documents
           SET file_name = ?, file_path = ?, file_type = ?, document_type = ?,
               uploaded = 'Yes', status = 'Uploaded', uploaded_at = NOW()
           WHERE id = ?`,
          [file_name, filePath, file_type, document_type, existingRows[0].id],
          (err) => {
            if (err) { console.log(err); return res.status(500).json(err); }
            res.status(201).json({ message: "Document uploaded successfully" });
          }
        );
      } else {
        // Pending row nahi — fresh INSERT karo
        db.query(
          `INSERT INTO loan_documents
           (application_id, document_name, document_type, file_name, file_path, file_type, uploaded, status, rejection_reason, uploaded_at)
           VALUES (?, ?, ?, ?, ?, ?, 'Yes', 'Uploaded', '', NOW())`,
          [Number(application_id), document_name, document_type, file_name, filePath, file_type],
          (err) => {
            if (err) { console.log(err); return res.status(500).json(err); }
            res.status(201).json({ message: "Document added successfully" });
          }
        );
      }
    }
  );
};

const verifyDocument = (req, res) => {
  const { id } = req.params;

  db.query(
    `
    UPDATE loan_documents
    SET status = ?, rejection_reason = ?, verified_at = NOW()
    WHERE id = ?
    `,
    ["Verified", "", id],
    (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json(err);
      }

      res.status(200).json({
        message: "Verified successfully",
      });
    },
  );
};

const rejectDocument = (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  db.query(
    `
    UPDATE loan_documents
    SET status = ?, rejection_reason = ?, verified_at = NOW()
    WHERE id = ?
    `,
    ["Rejected", reason, id],
    (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json(err);
      }

      res.status(200).json({
        message: "Rejected successfully",
      });
    },
  );
};

module.exports = {
  getDocuments,
  createDocument,
  verifyDocument,
  rejectDocument,
};