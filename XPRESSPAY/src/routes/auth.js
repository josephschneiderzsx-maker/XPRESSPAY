const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { register, login } = require("../controllers/authController");

// POST /api/auth/register
router.post(
  "/register",
  [
    body("email", "Please include a valid email").isEmail(),
    body("password", "Password must be at least 6 characters").isLength({ min: 6 }),
    body("username", "Username is required").not().isEmpty(),
  ],
  register
);

// POST /api/auth/login
router.post("/login", login);

module.exports = router;
