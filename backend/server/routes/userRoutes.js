const express = require("express");
const router = express.Router();
const { verifyToken, requireRole } = require("../middleware/authMiddleware");
const userController = require("../controllers/userController");

router.use(verifyToken);
router.use(requireRole(["superadmin"]));

router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.post("/", userController.createUser);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);
router.get("/permissions/all", userController.getRolePermissions);
router.post("/permissions/update", userController.updateRolePermissions);

module.exports = router;
