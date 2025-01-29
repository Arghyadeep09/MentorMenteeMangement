const admin = require("../config/firebase");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign({ email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: "24h" });
};

// Signup Route logic
const signup = async (req, res) => {
  console.log(req.body);
  const { prefix,name, surname, email, password, role, expertise, experience } = req.body;

  if (!email || !password || !role || !name || !surname) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    let userRecord;

    // Check if user already exists in Firebase
    try {
      userRecord = await admin.auth().getUserByEmail(email);
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        // Create user in Firebase if not found
        userRecord = await admin.auth().createUser({
          email,
          password,
          displayName: `${name} ${surname}`,
        });
      } else {
        throw error; // Other errors should be handled
      }
    }

    // Check if user exists in MongoDB
    let user = await User.findOne({ uid: userRecord.uid });

    if (!user) {
      // Store user in MongoDB
      user = new User({ uid: userRecord.uid,prefix, name, surname, email, role,...(role === "mentor" && { expertise, experience }), // Store mentor-specific fields 
       });
      await user.save();
    }

    // Generate JWT token
    const token = generateToken(user);

    res.status(201).json({ message: "User created successfully", token, role });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ error: "Signup failed. Try again later." });
  }
};

// Login Route logic
const login = async (req, res) => {
  const { token } = req.body;

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const user = await User.findOne({ uid: decodedToken.uid });

    if (!user) return res.status(404).json({ error: "User not found" });

    // Generate a JWT token for the user
    const generatedToken = generateToken(user);

    console.log(generatedToken);
    res.json({
      message: "Login successful",
      token: generatedToken,
      user

    });
    
  } catch (error) {
    console.error("Login Error:", error);
    res.status(400).json({ error: "Invalid Token" });
  }
};

module.exports = { signup, login };
