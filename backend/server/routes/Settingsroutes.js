const express = require("express");
const {
  getGeneralSettings,
  saveGeneralSettings,
  getSmtpSettings,
  saveSmtpSettings,
  getEmailTemplates,
  saveEmailTemplate,
  resetEmailTemplates,
} = require("../controllers/settingsController");

const router = express.Router();

// General Settings
router.get("/general",    getGeneralSettings);
router.put("/general",    saveGeneralSettings);

// SMTP Settings
router.get("/smtp",       getSmtpSettings);
router.put("/smtp",       saveSmtpSettings);

// Email Templates
router.get("/templates",               getEmailTemplates);
router.put("/templates/reset",         resetEmailTemplates);
router.put("/templates/:template_key", saveEmailTemplate);

module.exports = router;