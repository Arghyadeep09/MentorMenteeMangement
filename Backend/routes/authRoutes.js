const express = require("express");
const { signup, login } = require("../Controllers/authController");  // Import controller

const router = express.Router();

// Use controller functions for routes
router.post("/signup", signup);
router.post("/login", login);

module.exports = router;
