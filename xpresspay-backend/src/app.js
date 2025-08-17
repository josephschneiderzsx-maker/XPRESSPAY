const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const employeeRoutes = require("./routes/employees");
app.use("/api/employees", employeeRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("✅ XpressPay Backend is running...");
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
