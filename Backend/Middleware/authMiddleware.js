const admin = require("../config/firebase");
const User = require("../models/User");


// Middleware to authenticate user using Firebase ID token


const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  console.log("Token:", token);
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const user = await User.findOne({ uid: decodedToken.uid });

    if (!user) return res.status(404).json({ error: "User not found" });

    req.user = user;
    next();
  } catch (error) {
    res.status(403).json({ error: "Invalid Token" });
  }
};

module.exports = authenticate;
