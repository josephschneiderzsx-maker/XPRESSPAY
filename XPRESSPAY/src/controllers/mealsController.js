const { poolXpressPay } = require("../config/db");

// Helper: parse int avec fallback
const toInt = (v, def) => {
  const n = parseInt(v, 10);
  return Number.isNaN(n) ? def : n;
};

exports.getMealReports = async (req, res) => {
  const page = Math.max(1, toInt(req.query.page, 1));
  const pageSize = Math.min(100, Math.max(1, toInt(req.query.pageSize, 20)));
  const userid = (req.query.userid || "").trim();
  // TODO: Add date range filtering if needed

  let where = "WHERE 1=1";
  const params = [];
  const paramsCount = [];

  if (userid) {
    where += " AND userid = ?";
    params.push(userid);
    paramsCount.push(userid);
  }

  const offset = (page - 1) * pageSize;

  const sqlData = `
    SELECT
      userid,
      full_name,
      department,
      period_start,
      period_end,
      total_breakfast,
      total_lunch_std,
      total_lunch_premium,
      total_meals,
      total_meal_cost
    FROM v_payroll_meal_reports
    ${where}
    ORDER BY full_name ASC, period_start DESC
    LIMIT ? OFFSET ?;
  `;

  const sqlCount = `
    SELECT COUNT(*) AS total
    FROM v_payroll_meal_reports
    ${where};
  `;

  try {
    const conn = await poolXpressPay.getConnection();
    try {
      const [[countRow]] = await conn.query(sqlCount, paramsCount);
      const total = countRow.total || 0;
      const [rows] = await conn.query(sqlData, [...params, pageSize, offset]);

      return res.json({
        data: rows,
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      });
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error("❌ Error fetching meal reports:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};
