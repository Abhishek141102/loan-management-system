const express = require("express");

const { getReportData, getReportSummary } = require("../controllers/reportController");

const router = express.Router();

// GET /api/reports?loan_type=&status=&from_date=&to_date=&search=
router.get("/", getReportData);

// GET /api/reports/summary
router.get("/summary", getReportSummary);

module.exports = router;