const mongoose = require("mongoose");

const mentorSlotSchema = new mongoose.Schema(
  {
    
    date: {
      type: String, // Keeping date as a String for flexibility (e.g., "2025-01-27")
      required: true,
    },
    startTime: {
      type: String, // Example: "09:00 AM"
      required: true,
    },
    endTime: {
      type: String, // Example: "10:00 AM"
      required: true,
    },
    booked: {
      type: Boolean,
      default: false, // Initially, slots are unbooked
    },
    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // Reference to mentor
    },
    menteeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assigned when a mentee books the slot
      default: null,
    },
  },
  {
    timestamps: true, // Auto adds `createdAt` & `updatedAt`
  }
);

// ✅ Prevent Duplicate Slots for the Same Mentor
mentorSlotSchema.index({ mentorId: 1, date: 1, startTime: 1 }, { unique: true });

// Model
const MentorSlot = mongoose.model("MentorSlot", mentorSlotSchema);

module.exports = MentorSlot;
