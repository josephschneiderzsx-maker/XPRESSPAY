const express = require("express");
const router = express.Router();
const { getCompanyInfo } = require("../controllers/companyController");
const { protect, authorize } = require("../middleware/authMiddleware");

// GET : infos entreprise (Read-only)
// Protected route, accessible by admin and payroll_manager
router.get("/", protect, authorize("admin", "payroll_manager"), getCompanyInfo);

module.exports = router;
