const { poolXpressPay } = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET || "your_default_secret";
if (JWT_SECRET === "your_default_secret") {
  console.warn(
    "⚠️ Warning: JWT_SECRET is not set in .env file. Using a default, insecure secret."
  );
}

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password, role_id = 2 } = req.body;

  try {
    const conn = await poolXpressPay.getConnection();
    try {
      const [existing] = await conn.query(
        "SELECT id FROM users WHERE username = ? OR email = ?",
        [username, email]
      );
      if (existing.length > 0) {
        return res.status(409).json({ error: "User already exists." });
      }

      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(password, salt);

      const [result] = await conn.query(
        "INSERT INTO users (username, email, password_hash, role_id) VALUES (?, ?, ?, ?)",
        [username, email, password_hash, role_id]
      );
      const newUserId = result.insertId;

      return res.status(201).json({
        message: "User registered successfully.",
        userId: newUserId
      });
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error("❌ Error registering user:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required." });
  }

  try {
    const conn = await poolXpressPay.getConnection();
    try {
      const [users] = await conn.query(
        `SELECT u.id, u.username, u.password_hash, r.name as role
         FROM users u
         JOIN roles r ON u.role_id = r.id
         WHERE u.username = ? AND u.active = 1`,
        [username]
      );

      if (users.length === 0) {
        return res.status(401).json({ error: "Invalid credentials." });
      }
      const user = users[0];

      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid credentials." });
      }

      const payload = {
        user: {
          id: user.id,
          username: user.username,
          role: user.role
        }
      };

      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

      return res.json({ token });
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error("❌ Error logging in:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};
