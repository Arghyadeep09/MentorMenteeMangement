// In your backend routes (e.g., userRoutes.js)
const express = require("express");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.get('/users', authMiddleware, async (req, res) => {
    const { email } = req.query; // Get email from query params
    
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
  
    try {
      // Find the user by email in the database
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Send back the user's role and other info
      return res.status(200).json({ role: user.role, name: user.name, email: user.email });
    } catch (error) {
      console.error("Error fetching user:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });
  

module.exports = router;
