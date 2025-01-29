const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  prefix:{type:String,required:true},//prefix
  uid: { type: String, required: true, unique: true }, // Firebase UID
  name: { type: String, required: true }, // First name
  surname: { type: String, required: true }, // Last name
  email: { type: String, required: true, unique: true }, // Added `unique: true`
  role: { type: String, enum: ["mentor", "mentee"], required: true },
  expertise: { type: String, required: function() { return this.role === "mentor"; } }, // Only required for mentors
  experience: { type: Number, required: function() { return this.role === "mentor"; } }, // Only required for mentors
});

const User = mongoose.model("User", userSchema);
module.exports = User;
