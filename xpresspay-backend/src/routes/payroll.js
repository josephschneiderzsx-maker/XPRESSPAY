const express = require("express");
const router = express.Router();
const { poolXpressPay } = require("../config/db");

// Liste des périodes de paie
router.get("/periods", async (req, res) => {
  try {
    const [rows] = await poolXpressPay.query(
      "SELECT id, period_name, date_start, date_end, frequency, is_open FROM payroll_periods ORDER BY date_start DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching payroll periods:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Une période spécifique
router.get("/periods/:id", async (req, res) => {
  try {
    const [rows] = await poolXpressPay.query("SELECT * FROM payroll_periods WHERE id = ?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: "Not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error("❌ Error fetching payroll period:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
