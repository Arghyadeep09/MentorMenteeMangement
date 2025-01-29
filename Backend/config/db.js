const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    console.log("MongoDB URI:", process.env.MONGODB_URI); // Debugging Line
    await mongoose.connect(process.env.MONGODB_URI, );
    mongoose.connection.on("error", (err) => console.error("MongoDB Connection Error:", err));

    console.log('MongoDB Connected...');
  } catch (error) {
    console.error('MongoDB Connection Failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
