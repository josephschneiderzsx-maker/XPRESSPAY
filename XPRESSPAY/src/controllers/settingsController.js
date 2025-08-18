const { poolXpressPay } = require("../config/db");

// GET - Lire les settings (1 seul enregistrement)
async function getSettings(req, res) {
  try {
    const [rows] = await poolXpressPay.query("SELECT * FROM payroll_settings LIMIT 1");
    if (rows.length === 0) {
      return res.status(404).json({ error: "No settings found" });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error("❌ Error fetching settings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// PUT - Mettre à jour les settings
async function updateSettings(req, res) {
  try {
    const {
      default_ot_multiplier,
      currency,
      locale,
      rounding_rule,
      meal_price_breakfast,
      meal_price_lunch_std,
      meal_price_lunch_premium
    } = req.body;

    // Basic validation
    if (
      default_ot_multiplier === undefined ||
      currency === undefined ||
      locale === undefined ||
      rounding_rule === undefined ||
      meal_price_breakfast === undefined ||
      meal_price_lunch_std === undefined ||
      meal_price_lunch_premium === undefined
    ) {
      return res.status(400).json({ error: "All setting fields are required." });
    }

    await poolXpressPay.query(
      `UPDATE payroll_settings
       SET default_ot_multiplier = ?, currency = ?, locale = ?, rounding_rule = ?,
           meal_price_breakfast = ?, meal_price_lunch_std = ?, meal_price_lunch_premium = ?, updated_at = NOW()
       WHERE id = 1`,
      [
        default_ot_multiplier,
        currency,
        locale,
        rounding_rule,
        meal_price_breakfast,
        meal_price_lunch_std,
        meal_price_lunch_premium
      ]
    );

    res.json({ message: "Settings updated successfully ✅" });
  } catch (error) {
    console.error("❌ Error updating settings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { getSettings, updateSettings };
