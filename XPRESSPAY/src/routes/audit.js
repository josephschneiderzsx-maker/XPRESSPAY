const express = require("express");
const router = express.Router();
const { getAuditLogs } = require("../controllers/auditController");
const { protect, authorize } = require("../middleware/authMiddleware");

// GET /api/audit - Protected route, only for admins
router.get("/", protect, authorize("admin"), getAuditLogs);

module.exports = router;