const express = require("express");
const router = express.Router();
const { poolXpressPay, poolIngress } = require("../config/db");


// Liste des présences d'une date donnée
router.get("/", async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ error: "⚠️ Missing ?date=YYYY-MM-DD" });

    const [rows] = await poolXpressPay.query(
      `SELECT userid, full_name, department, designation, date, att_in, att_out, workhour, overtime, undertime
       FROM v_attendance_full
       WHERE date = ?`,
      [date]
    );
    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching attendance:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
