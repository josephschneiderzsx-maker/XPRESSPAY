const express = require("express");
const router = express.Router();
const { poolXpressPay, poolIngress } = require("../config/db");

// Employés (depuis Ingress)
router.get("/", async (req, res) => {
  try {
    const [rows] = await poolIngress.query(`
      SELECT userid, CONCAT(Name, ' ', lastname) AS full_name, User_Group AS department
      FROM user
      LIMIT 20
    `);
    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching employees:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Company info (depuis XpressPay → vue v_company_info)
router.get("/company", async (req, res) => {
  try {
    const [rows] = await poolXpressPay.query("SELECT * FROM v_company_info LIMIT 1");
    res.json(rows[0] || {});
  } catch (err) {
    console.error("❌ Error fetching company info:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
