const express = require("express");

const {
  getCustomers,
  getSingleCustomer,
} = require("../controllers/customerController");

const router = express.Router();

router.get("/", getCustomers);
router.get("/:id", getSingleCustomer);

module.exports = router;