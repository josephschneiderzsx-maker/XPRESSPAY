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

// Mise à jour des infos entreprise
const updateCompanyInfo = async (req, res) => {
  try {
    const { CompanyName, Email, Address1, City, Country, phone, timezone } = req.body;

    await poolXpressPay.query(
      `UPDATE company_info
       SET company_name = ?, email = ?, address1 = ?, city = ?, country = ?, phone = ?, timezone = ?
       WHERE id = 1`,
      [CompanyName, Email, Address1, City, Country, phone, timezone]
    );

    res.json({ message: "Company info updated successfully ✅" });
  } catch (err) {
    console.error("❌ Error updating company info:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getCompanyInfo, updateCompanyInfo };
