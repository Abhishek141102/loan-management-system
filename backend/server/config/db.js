
const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 3306,

  ssl:
  process.env.DB_SSL === "true"
    ? {
        
ca: require("fs").readFileSync(
  process.env.DB_SSL_CA_PATH ||
    require("path").join(__dirname, "ca.pem"),
  "utf8"
),

        rejectUnauthorized: true,
      }
    : undefined,
});

db.connect((err) => {
  if (err) {
    console.error("Database Connection Failed:", err.message);
  } else {
    console.log("MySQL Connected Successfully");
  }
});

module.exports = db;
