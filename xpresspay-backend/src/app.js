const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Import des routes
const employeeRoutes = require("./routes/employees");
const attendanceRoutes = require("./routes/attendance");
const payrollRoutes = require("./routes/payroll");

// Montage des routes
app.use("/api/employees", employeeRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/payroll", payrollRoutes);

// Test routes
app.get("/", (req, res) => {
  res.send("✅ XpressPay Backend is running...");
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
