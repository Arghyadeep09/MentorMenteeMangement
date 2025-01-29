const Booking = require('../models/Booking');

const getMentorBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ mentorId: req.user.id });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: "Error fetching bookings" });
  }
};

module.exports = { getMentorBookings };
