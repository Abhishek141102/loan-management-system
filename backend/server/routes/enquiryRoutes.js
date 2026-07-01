const express = require("express");

const {
  getEnquiries,
  getSingleEnquiry,
  createEnquiry,
  updateEnquiryStatus,
  deleteEnquiry,
  convertToApplication,
  sendFollowupEmail,
} = require("../controllers/enquiryController");

const router = express.Router();

router.get("/", getEnquiries);

router.get("/:id", getSingleEnquiry);

router.post("/", createEnquiry);

router.put("/:id", updateEnquiryStatus);

router.delete("/:id", deleteEnquiry);

router.post("/:id/convert", convertToApplication);

router.post("/:id/send-email", sendFollowupEmail);

module.exports = router;