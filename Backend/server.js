require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");

const authRoutes = require('./routes/authRoutes');
const mentorRoutes = require('./routes/mentorRoutes');
const menteeRoutes = require("./routes/menteeRoutes");

const app = express();

const corsOptions = {
    origin: ["https://mentormenteemangement.onrender.com", "https://mentormenteemangement-1.onrender.com"], // Allow these origins
    credentials: true, // Allow cookies to be sent with requests
    allowedHeaders: ["Content-Type", "Authorization"], // Allow these headers
  };
  
  // Apply CORS to all routes
  app.use(cors());
  app.use(express.json());
  app.use(bodyParser.json());

// Routes
app.use("/api/auth", authRoutes);
app.use('/api/mentor', mentorRoutes);
app.use('/api/mentee',menteeRoutes)
app.use("/api/users", userRoutes);


// Start Server
connectDB();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
