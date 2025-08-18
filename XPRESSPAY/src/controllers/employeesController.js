// src/controllers/employeesController.js
const { poolXpressPay } = require("../config/db");

// Helper: parse int avec fallback
const toInt = (v, def) => {
  const n = parseInt(v, 10);
  return Number.isNaN(n) ? def : n;
};

exports.getEmployees = async (req, res) => {
  const page = Math.max(1, toInt(req.query.page, 1));
  const pageSize = Math.min(100, Math.max(1, toInt(req.query.pageSize, 20)));
  const search = (req.query.search || "").trim();
  const department = (req.query.department || "").trim();

  let where = "WHERE 1=1";
  const params = [];
  const paramsCount = [];

  if (search) {
    where += " AND (userid LIKE ? OR full_name LIKE ?)";
    params.push(`%${search}%`, `%${search}%`);
    paramsCount.push(`%${search}%`, `%${search}%`);
  }

  if (department) {
    where += " AND department = ?";
    params.push(department);
    paramsCount.push(department);
  }

  const offset = (page - 1) * pageSize;

  const sqlData = `
    SELECT
      userid,
      full_name,
      department,
      designation,
      hire_date,
      pay_rate,
      pay_type,
      last_30d_meal_cost
    FROM xpresspay.v_employee_summary
    ${where}
    ORDER BY full_name ASC
    LIMIT ? OFFSET ?;
  `;

  const sqlCount = `
    SELECT COUNT(*) AS total
    FROM xpresspay.v_employee_summary
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
          totalPages: Math.ceil(total / pageSize)
        }
      });
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error("❌ Error fetching employees:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.getEmployeeById = async (req, res) => {
  const { userid } = req.params;

  const sql = `
    SELECT
      userid,
      full_name,
      department,
      designation,
      hire_date,
      pay_rate,
      pay_type,
      last_30d_meal_cost
    FROM xpresspay.v_employee_summary
    WHERE userid = ?
    LIMIT 1;
  `;

  try {
    const [rows] = await poolXpressPay.query(sql, [userid]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Employee not found" });
    }
    return res.json(rows[0]);
  } catch (err) {
    console.error("❌ Error fetching employee by id:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};
