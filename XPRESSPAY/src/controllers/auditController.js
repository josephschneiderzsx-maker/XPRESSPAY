const { poolXpressPay } = require("../config/db");

// Helper: parse int avec fallback
const toInt = (v, def) => {
  const n = parseInt(v, 10);
  return Number.isNaN(n) ? def : n;
};

exports.getAuditLogs = async (req, res) => {
  const page = Math.max(1, toInt(req.query.page, 1));
  const pageSize = Math.min(100, Math.max(1, toInt(req.query.pageSize, 50)));
  const actor = (req.query.actor || "").trim();
  const action = (req.query.action || "").trim();

  let where = "WHERE 1=1";
  const params = [];
  const paramsCount = [];

  if (actor) {
    where += " AND actor_userid LIKE ?";
    params.push(`%${actor}%`);
    paramsCount.push(`%${actor}%`);
  }

  if (action) {
    where += " AND action LIKE ?";
    params.push(`%${action}%`);
    paramsCount.push(`%${action}%`);
  }

  const offset = (page - 1) * pageSize;

  const sqlData = `
    SELECT
      id,
      actor_userid,
      action,
      target,
      payload,
      created_at
    FROM audit_logs
    ${where}
    ORDER BY created_at DESC
    LIMIT ? OFFSET ?;
  `;

  const sqlCount = `
    SELECT COUNT(*) AS total
    FROM audit_logs
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
    console.error("❌ Error fetching audit logs:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};
