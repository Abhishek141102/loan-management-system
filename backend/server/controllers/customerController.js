const db = require("../config/db");

// GET CUSTOMERS WITH BACKEND OFFSET PAGINATION

const getCustomers = (req, res) => {

  const page =
    parseInt(req.query.page) || 1;

  const limit =
    parseInt(req.query.limit) || 10;

  const offset =
    (page - 1) * limit;

  const search =
    req.query.search || "";

  const status =
    req.query.status || "";

  const loanType =
    req.query.loanType || "";

  let sql = `
    SELECT
      c.id,
      c.customer_code,
      c.full_name,
      COALESCE(NULLIF(c.mobile, ''), le.mobile) AS mobile,
      c.email,
      c.dob,
      c.address,
      c.status,
      cl.loan_type,
      cl.approved_amount,
      cl.emi_amount

    FROM customers c

    INNER JOIN customer_loans cl
      ON c.id = cl.customer_id

    LEFT JOIN loan_applications la
      ON cl.application_id = la.id

    LEFT JOIN loan_enquiries le
      ON la.enquiry_id = le.id

    WHERE 1=1
  `;

  let countSql = `
    SELECT COUNT(*) AS total

    FROM customers c

    INNER JOIN customer_loans cl
      ON c.id = cl.customer_id

    WHERE 1=1
  `;

  const params = [];
  const countParams = [];

  // SEARCH
  if (search) {

    sql += `
      AND (
        c.full_name LIKE ?
        OR c.mobile LIKE ?
        OR cl.loan_type LIKE ?
        OR c.status LIKE ?
      )
    `;

    countSql += `
      AND (
        c.full_name LIKE ?
        OR c.mobile LIKE ?
        OR cl.loan_type LIKE ?
        OR c.status LIKE ?
      )
    `;

    const searchValue =
      `%${search}%`;

    params.push(
      searchValue,
      searchValue,
      searchValue,
      searchValue
    );

    countParams.push(
      searchValue,
      searchValue,
      searchValue,
      searchValue
    );
  }

  // STATUS FILTER
  if (status) {

    sql += `
      AND c.status = ?
    `;

    countSql += `
      AND c.status = ?
    `;

    params.push(status);

    countParams.push(status);
  }

  // LOAN TYPE FILTER
  if (loanType) {

    sql += `
      AND cl.loan_type = ?
    `;

    countSql += `
      AND cl.loan_type = ?
    `;

    params.push(
      loanType
    );

    countParams.push(
      loanType
    );
  }

  // PAGINATION
  sql += `
    ORDER BY c.id DESC
    LIMIT ?
    OFFSET ?
  `;

  params.push(
    limit,
    offset
  );

  db.query(
    sql,
    params,

    (err, result) => {

      if (err) {

        console.log(err);

        return res
          .status(500)
          .json(err);
      }

      db.query(
        countSql,
        countParams,

        (
          countErr,
          countResult
        ) => {

          if (countErr) {

            console.log(
              countErr
            );

            return res
              .status(500)
              .json(countErr);
          }

          const total =
            countResult[0]
              .total;

          res.status(200).json({

            data: result,

            pagination: {

              total,

              page,

              limit,

              totalPages:
                Math.ceil(
                  total / limit
                ),
            },
          });
        }
      );
    }
  );
};

// GET SINGLE CUSTOMER

const getSingleCustomer =
  (req, res) => {

    const { id } =
      req.params;

    db.query(
      `
      SELECT *
      FROM customers
      WHERE id = ?
      `,
      [id],

      (err, result) => {

        if (err) {

          console.log(
            "SINGLE CUSTOMER ERROR:",
            err
          );

          return res
            .status(500)
            .json(err);
        }

        res
          .status(200)
          .json(result[0]);
      }
    );
  };

module.exports = {
  getCustomers,
  getSingleCustomer,
};