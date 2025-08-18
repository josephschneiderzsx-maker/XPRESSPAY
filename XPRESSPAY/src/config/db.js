const mysql = require("mysql2/promise");
require("dotenv").config();

const poolXpressPay = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME_XPRESSPAY
});

const poolIngress = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME_INGRESS
});

module.exports = { poolXpressPay, poolIngress };
