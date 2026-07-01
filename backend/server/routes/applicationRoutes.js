const express = require("express");

const {
  getApplications,
  getSingleApplication,
  updateApplication,
  createApplication,
} = require("../controllers/applicationController");

const router = express.Router();

router.get("/", getApplications);
router.get("/:id", getSingleApplication);
router.put("/:id", updateApplication);
router.post("/", createApplication);  

module.exports = router;