const express = require("express");
const authController = require("../controllers/authController");
const { verifyToken } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/login", authController.loginAdmin);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password/:token", authController.resetPassword);
router.post("/change-password", authController.changePassword);
router.get("/my-permissions", verifyToken, authController.getMyPermissions);

module.exports = router;
