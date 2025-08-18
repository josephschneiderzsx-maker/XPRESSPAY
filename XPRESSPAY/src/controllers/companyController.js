const { poolXpressPay } = require("../config/db");

// Récupération des infos entreprise (vue v_company_info)
const getCompanyInfo = async (req, res) => {
  try {
    const [rows] = await poolXpressPay.query("SELECT * FROM v_company_info LIMIT 1");
    if (rows.length === 0) {
      return res.status(404).json({ message: "No company info found" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error("❌ Error fetching company info:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getCompanyInfo };
