const express = require("express");
const router = express.Router();
const { getSettings, updateSettings } = require("../controllers/settingsController");
const { protect, authorize } = require("../middleware/authMiddleware");

// GET /api/settings - Protected
router.get("/", protect, authorize("admin", "payroll_manager"), getSettings);

// PUT /api/settings - Admin only
router.put("/", protect, authorize("admin"), updateSettings);

module.exports = router;
