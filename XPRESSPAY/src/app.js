const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

// Import des routes
const employeeRoutes = require("./routes/employees");
const attendanceRoutes = require("./routes/attendance");
const payrollRoutes = require("./routes/payroll");
const settingsRoutes = require("./routes/settings");
const companyRoutes = require("./routes/company");
//const auditRoutes = require("./routes/audit");
//const mealsRoutes = require("./routes/meals");

// Montage des routes
app.use("/api/employees", employeeRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/payroll", payrollRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/company", companyRoutes);
//app.use("/api/audit", auditRoutes);
//app.use("/api/meals", mealsRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("✅ XPRESSPAY Backend is running...");
});

// Middleware global d’erreurs
app.use((err, req, res, next) => {
  console.error("🔥 Unhandled error:", err.stack);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
