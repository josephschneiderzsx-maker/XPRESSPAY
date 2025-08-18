// src/routes/employees.js
const express = require("express");
const router = express.Router();
const {
  getEmployees,
  getEmployeeById
} = require("../controllers/employeesController");

// GET /api/employees?search=&department=&page=1&pageSize=20
router.get("/", getEmployees);

// GET /api/employees/:userid
router.get("/:userid", getEmployeeById);

module.exports = router;