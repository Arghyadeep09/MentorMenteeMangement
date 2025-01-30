const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const MentorSlot = require("../models/MentorSlot");
const mongoose = require("mongoose");
const router = express.Router();

// ✅ Mentee Books a Slot
router.post("/book-slot", authMiddleware, async (req, res) => {
  if (req.user.role !== "mentee") {
    return res.status(403).json({ error: "Access Denied" });
  }

  const { mentorId, slot } = req.body; // slot is in the format "4:00 PM - 5:00 PM"
  const [startTime, endTime] = slot.split(" - "); // Split into start and end time

  console.log("mentorId:", mentorId);
  
  console.log("startTime:", startTime);
  try {
    // Search for the slot by mentorId, date, and startTime
    
    const slotObj = await MentorSlot.findOne({ mentorId:mentorId,startTime:startTime,endTime:endTime });
    console.log("slotobj",slotObj);
    if (!slotObj) {
      return res.status(400).json({ error: "Slot does not exist" });
    }

    if (slotObj.booked) {
      console.log("Slot already booked");
      return res.status(400).json({ error: "Slot already booked" });
    }

    // Book the slot
    slotObj.booked = true;
    slotObj.menteeId = req.user._id; // Assign the mentee who is booking
    slotObj.bookedAt = new Date(); // Optionally store when the slot was booked

    console.log("slotObj.booked:", slotObj.booked);
    // Save updated slot
    await slotObj.save();

    res.status(200).json({
      message: "Slot booked successfully",
      slot: {
        mentorName: slotObj.mentorId.name,
        startTime: slotObj.startTime,
        endTime: slotObj.endTime,
        menteeName: req.user.name, // Include mentee name
      },
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});


//view bookings
router.get("/bookings", authMiddleware, async (req, res) => {
  try {
    // Ensure req.user is defined
    if (!req.user || req.user.role !== "mentee") {
      return res.status(403).json({ error: "Access Denied" });
    }

    // Convert menteeId to ObjectId (only if necessary)
    const menteeId = new mongoose.Types.ObjectId(req.user._id);

    // Find bookings where menteeId matches and slot is booked
    const bookings = await MentorSlot.find({ 

      menteeId: menteeId, 
      booked: true 
    }).populate("mentorId", "prefix name "); 

    console.log("MentorId",bookings.mentorId);
    console.log("Bookings:", bookings);

    if (!bookings.length) {
      return res.status(404).json({ message: "No bookings found." });
    }

    res.json(bookings);
    console.log("Bookings:", bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({
      error: "Internal Server Error",
      details: error.message,
    });
  }
});
module.exports = router;
