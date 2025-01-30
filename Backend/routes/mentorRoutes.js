const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const MentorSlot = require("../models/MentorSlot");
const User = require("../models/User");

const router = express.Router();

// ✅ Get Mentor's Details
router.get("/details", async (req, res) => {
  const { mentorId } = req.query;

  if (!mentorId) {
    return res.status(400).json({ error: "Mentor ID is required" });
  }

  try {
    const mentor = await User.findOne({ uid: mentorId }); // Searching by UID
    if (!mentor) {
      return res.status(404).json({ error: "Mentor not found" });
    }

    res.json({
      prefix: mentor.prefix,
      name: mentor.name,
      surname: mentor.surname,
      expertise: mentor.expertise,
      experience: mentor.experience
    });
  } catch (error) {
    console.error("Error fetching mentor details:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Create Available Slots (Prevent Duplicates & Allow Multiple Slots)
router.post("/create-slot", authMiddleware, async (req, res) => {

    if (req.user.role !== "mentor") {
      return res.status(403).json({ error: "Access Denied" });

    }
  
    const { day, time } = req.body;
  
    // Validate input
    if (!day || !time) {
      return res.status(400).json({ error: "Invalid input: day and time are required" });
    }
  
    // Calculate end time by adding 1 hour to the start time
    const startTime = time.trim();
    if (!startTime) {
        return res.status(400).json({ error: "Invalid input: time cannot be empty" });
    }
    const endTime = calculateEndTime(startTime); // Function to calculate end time
    
    try {
      const existingSlots = await MentorSlot.find({ mentorId: req.user._id, date: day, startTime: startTime }) || [];
  
      const newSlot = {
        mentorId: req.user._id,
        date: day,
        startTime,
        endTime,
        booked: false,
      };
  
      // Prevent duplicate slots
      if (existingSlots.some(slot => slot.startTime === startTime)) {
        return res.status(400).json({ error: "Slot already exists" });
      }
  
      await MentorSlot.create(newSlot);
      console.log("New Slot Created:", newSlot);
      res.status(201).json({ message: "Slot Created", slot: newSlot });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
  });

  // Get available mentor slots by weekday
router.get("/available-slots", async (req, res) => {
  try {
      const { date } = req.query; // Expecting "Monday", "Tuesday", etc.
      
      if (!date) {
          return res.status(400).json({ error: "Date (weekday) is required" });
      }

      const slots = await MentorSlot.find({ date, booked: false })
          .populate("mentorId", " prefix name expertise experience");

          console.log(slots);

      res.json(slots);
  } catch (error) {
      res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

  // ✅ Mentor Deletes a Slot
router.delete("/delete-slot", authMiddleware, async (req, res) => {
    if (req.user.role !== "mentor") {
      return res.status(403).json({ error: "Access Denied" });
    }
  
    const { day } = req.query;
  
    try {
      const slot = await MentorSlot.findOneAndDelete({ mentorId: req.user._id, date: day });
  
      if (!slot) {
        return res.status(404).json({ error: "No slot found for this day" });
      }
  
      res.json({ message: "Slot deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
  });

  // Update Mentor Details
router.put("/update", authMiddleware, async (req, res) => {
  const { mentorId } = req.query;
  const { prefix, name, surname, expertise, experience } = req.body;

  if (!mentorId) {
    return res.status(400).json({ message: "Mentor ID is required" });
  }

  try {
    // Find the mentor by ID and update their details
    const mentor = await User.findOneAndUpdate(
      { uid: mentorId },
      { prefix, name, surname, expertise, experience },
      { new: true } // Return the updated mentor object
    );

    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found" });
    }

    // Send the updated mentor details in the response
    res.status(200).json(mentor);
  } catch (error) {
    console.error("Error updating mentor details:", error);
    res.status(500).json({ message: "Server error" });
  }
});
  
  
  // Utility function to calculate end time (1 hour)
  const calculateEndTime = (startTime) => {
    const [hours, minutesAndPeriod] = startTime.split(":");
    const [minutes, period] = minutesAndPeriod.split(" ");
    let newHour = parseInt(hours, 10) + 1;
  
    if (newHour === 12 && period === "AM") {
      return `12:${minutes} PM`;
    } else if (newHour === 12 && period === "PM") {
      return `12:${minutes} AM`;
    } else {
      return `${newHour}:${minutes} ${period}`;
    }
  };

// ✅ Get Mentor's Slots (For Mentor Dashboard)
router.get("/slots", authMiddleware, async (req, res) => {
  try {
    const slots = await MentorSlot.find({ mentorId: req.user._id });
    res.json(slots);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

//fetch mentee bookings
router.get("/bookings", authMiddleware, async (req, res) => {
  try {
    // Ensure req.user is defined
    if (!req.user || req.user.role !== "mentor") {
      return res.status(403).json({ error: "Access Denied" });
    }

    // Convert mentorId to ObjectId (only if necessary)
    //const mentorId = new mongoose.Types.ObjectId(req.user._id);

    // Find bookings where mentorId matches and slot is booked
    const bookings = await MentorSlot.find({ mentorId: req.query.mentorId, booked: true })
  .populate("menteeId", "name"); // Fetch mentee's name from User DB

    if (!bookings.length) {
      return res.status(404).json({ message: "No bookings found." });
    }

    res.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({
      error: "Internal Server Error",
      details: error.message,
    });
  }
});


module.exports = router;
