const express = require("express");
const router = express.Router();
const { getMealReports } = require("../controllers/mealsController");
const { protect, authorize } = require("../middleware/authMiddleware");

// GET /api/meals - Protected, for admins and payroll managers
router.get(
  "/",
  protect,
  authorize("admin", "payroll_manager"),
  getMealReports
);

module.exports = router;