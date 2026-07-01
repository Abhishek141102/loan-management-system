const express = require("express");

const {
  getApprovalQueue,
  approveLoan,
  rejectLoan,
} = require("../controllers/approvalController");

const router = express.Router();

router.get("/", getApprovalQueue);

router.post("/approve", approveLoan);

router.post("/reject", rejectLoan);

module.exports = router;