const { poolXpressPay } = require("../config/db");
const { validationResult } = require("express-validator");

// Helper: parse int avec fallback
const toInt = (v, def) => {
  const n = parseInt(v, 10);
  return Number.isNaN(n) ? def : n;
};

// --- Payroll Period Management ---

exports.getPayrollPeriods = async (req, res) => {
  try {
    const [periods] = await poolXpressPay.query(
      "SELECT * FROM payroll_periods ORDER BY date_start DESC"
    );
    res.json(periods);
  } catch (err) {
    console.error("❌ Error fetching payroll periods:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.createPayrollPeriod = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { period_name, date_start, date_end, frequency } = req.body;
  try {
    const [result] = await poolXpressPay.query(
      "INSERT INTO payroll_periods (period_name, date_start, date_end, frequency) VALUES (?, ?, ?, ?)",
      [period_name, date_start, date_end, frequency]
    );
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (err) {
    console.error("❌ Error creating payroll period:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// --- Payroll Run Management ---

exports.getPayrollRuns = async (req, res) => {
  const { periodId } = req.params;
  try {
    const [runs] = await poolXpressPay.query(
      "SELECT * FROM payroll_runs WHERE period_id = ? ORDER BY created_at DESC",
      [periodId]
    );
    res.json(runs);
  } catch (err) {
    console.error("❌ Error fetching payroll runs:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.createPayrollRun = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { period_id } = req.body;
  const conn = await poolXpressPay.getConnection();
  try {
    await conn.beginTransaction();

    const [runResult] = await conn.query(
      "INSERT INTO payroll_runs (period_id, status, created_by) VALUES (?, 'calculated', ?)",
      [period_id, req.user.id]
    );
    const run_id = runResult.insertId;

    const [employees] = await conn.query(
      "SELECT userid, pay_rate, pay_type FROM v_employee_summary"
    );

    const runItems = employees.map((emp) => {
        const gross_income = emp.pay_type === 'monthly' ? emp.pay_rate : (emp.pay_rate * 80);
        const net_income = gross_income;
        return [run_id, emp.userid, gross_income, 0, 0, net_income, null];
    });

    if (runItems.length > 0) {
        await conn.query(
            'INSERT INTO payroll_run_items (run_id, userid, gross_income, total_deductions, meal_deductions, net_income, details_json) VALUES ?',
            [runItems]
        );
    }

    await conn.commit();
    res.status(201).json({ message: "Payroll run created successfully", run_id });

  } catch (err) {
    await conn.rollback();
    console.error("❌ Error creating payroll run:", err.message);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    conn.release();
  }
};


exports.getPayrollRunDetails = async (req, res) => {
    const { runId } = req.params;
    try {
        const [items] = await poolXpressPay.query(
            `SELECT pri.*, ves.full_name, ves.department
             FROM payroll_run_items pri
             JOIN v_employee_summary ves ON pri.userid = ves.userid
             WHERE pri.run_id = ?`,
            [runId]
        );
        res.json(items);
    } catch (err) {
        console.error("❌ Error fetching payroll run details:", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.updatePayrollRunStatus = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { runId } = req.params;
    const { status } = req.body;
    try {
        await poolXpressPay.query(
            "UPDATE payroll_runs SET status = ? WHERE id = ?",
            [status, runId]
        );
        res.json({ message: `Payroll run status updated to ${status}` });
    } catch (err) {
        console.error("❌ Error updating payroll run status:", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
};


exports.runMealDeductions = async (req, res) => {
    const { runId } = req.params;
    try {
        await poolXpressPay.query("CALL sp_apply_meal_deductions(?)", [runId]);
        res.json({ message: "Meal deductions applied successfully." });
    } catch (err) {
        console.error("❌ Error applying meal deductions:", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
