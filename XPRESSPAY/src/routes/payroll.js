const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const payrollController = require("../controllers/payrollController");
const { protect, authorize } = require("../middleware/authMiddleware");

// All routes in this file are protected and for authorized personnel only
router.use(protect, authorize("admin", "payroll_manager"));

// --- Payroll Period Routes ---
router.get("/periods", payrollController.getPayrollPeriods);
router.post(
  "/periods",
  [
    body("period_name", "Period name is required").not().isEmpty(),
    body("date_start", "Start date must be a valid date").isISO8601().toDate(),
    body("date_end", "End date must be a valid date").isISO8601().toDate(),
    body("frequency", "Frequency is required").isIn(['weekly', 'biweekly', 'monthly', 'custom']),
  ],
  payrollController.createPayrollPeriod
);

// --- Payroll Run Routes ---
router.get("/periods/:periodId/runs", payrollController.getPayrollRuns);
router.post("/runs", [body("period_id", "Period ID is required").isInt()], payrollController.createPayrollRun);
router.get("/runs/:runId", payrollController.getPayrollRunDetails);
router.patch(
  "/runs/:runId/status",
  [body("status", "Invalid status").isIn(['calculated', 'reviewed', 'approved', 'locked'])],
  payrollController.updatePayrollRunStatus
);

// --- Payroll Action Routes ---
router.post("/runs/:runId/apply-meals", payrollController.runMealDeductions);

module.exports = router;
