import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { UserAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  UserCircle,
  CalendarDays,
  CalendarClock,
  User,
  Clock,
  LogOut,
} from "lucide-react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const MenteeDashboard = () => {
  const { user, googleSignIn, logout } = UserAuth();

  // State for fetching the mentee's details from MongoDB
  const [menteeDetails, setMenteeDetails] = useState(null);
  
  // Other state variables remain the same
  const [bookings, setBookings] = useState([]);
  const [bookedSlotIds, setBookedSlotIds] = useState([]);
  const [availableSessions, setAvailableSessions] = useState({});
  const [isBooked, setIsBooked] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);

  const navigate = useNavigate();

  // Define days of week to display sessions in order.
  const daysOfWeek = useMemo(() => [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ],[]);

  // Redirect to login if no user is available
  useEffect(() => {
    if (!user) {
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    }
  }, [user, navigate]);

  // Fetch mentee details from MongoDB using the user's UID (stored as uid in MongoDB)
  useEffect(() => {
    const fetchMenteeDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        // Use the correct property. Adjust this if your user object uses a different property.
        const menteeId = user?.uid || user?.id;
        if (!menteeId) {
          console.error("No mentee ID found in user object.");
          return;
        }
        const response = await axios.get(
          `https://mentormenteemangement.onrender.com/api/mentee/details?menteeId=${menteeId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMenteeDetails(response.data);
      } catch (error) {
        console.error("Error fetching mentee details:", error);
      }
    };

    if (user) {
      fetchMenteeDetails();
    }
  }, [user]);

  // Fetch bookings for the mentee (update bookedSlotIds based on returned bookings)
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You need to log in first!");
        return;
      }
      const response = await axios.get(
        "https://mentormenteemangement.onrender.com/api/mentee/bookings",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setBookings(response.data);
      console.log("Bookings:", response.data);

      // Assuming that each booking’s _id corresponds to the slot that was booked.
      const bookedSlots = response.data.map((booking) => booking._id);
      setBookedSlotIds(bookedSlots);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to fetch bookings. Please try again later.");
    }
  };

  // Fetch available sessions for all days and group them by mentor
  useEffect(() => {
    const fetchAvailableSessions = async () => {
      try {
        let allSlots = [];
        // Create an array of promises—one for each day
        const requests = daysOfWeek.map((day) =>
          axios
            .get(
              `https://mentormenteemangement.onrender.com/api/mentor/available-slots?date=${day}`
            )
            .then((response) => {
              // Ensure each slot object has the day (from the query parameter)
              return response.data.map((slot) => ({ ...slot, date: day }));
            })
            .catch((err) => {
              console.error(`Error fetching slots for ${day}:`, err);
              return [];
            })
        );
        const results = await Promise.all(requests);
        results.forEach((daySlots) => {
          allSlots.push(...daySlots);
        });

        // Group slots by day and then by mentor.
        const grouped = {};
        allSlots.forEach((slot) => {
          const day = slot.date;
          if (!grouped[day]) grouped[day] = {};
          // Use the mentor's unique id (ensure your populate returns an _id or id)
          const mentorId = slot.mentorId?._id || slot.mentorId?.id;
          if (!mentorId) return; // Skip if mentor info is missing

          if (!grouped[day][mentorId]) {
            grouped[day][mentorId] = {
              id: mentorId,
              name: slot.mentorId.name,
              prefix: slot.mentorId.prefix,
              slots: [],
            };
          }
          // Combine startTime and endTime into a time string.
          grouped[day][mentorId].slots.push({
            time: `${slot.startTime} - ${slot.endTime}`,
            slotId: slot._id,
          });
        });

        // Transform grouped data so that availableSessions[day] is an array of mentor objects.
        const sessionsByDay = {};
        daysOfWeek.forEach((day) => {
          sessionsByDay[day] = grouped[day] ? Object.values(grouped[day]) : [];
        });
        setAvailableSessions(sessionsByDay);
      } catch (error) {
        console.error("Error fetching available sessions:", error);
        toast.error("Failed to fetch available sessions. Please try again later.");
      }
    };

    fetchAvailableSessions();
  }, [daysOfWeek]);

  // Function to book a mentor session
  const bookSession = async (mentorId, slotTime, slotId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You need to log in first!")
        navigate("/login");
        return;
      }
      console.log("Booking Session:", { mentorId, slotTime });
      const response = await axios.post(
        "https://mentormenteemangement.onrender.com/api/mentee/book-slot",
        { mentorId, slot: slotTime },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Booking Response:", response.data);

      // Optionally update booking details (if returned by the API)
      setBookingDetails({
        startTime: response.data.startTime,
        endTime: response.data.endTime,
        menteeName: response.data.menteeName,
      });
      setIsBooked(true);
      // Mark this slot as booked by adding its slotId to the bookedSlotIds array.
      setBookedSlotIds((prevIds) => [...prevIds, slotId]);
      await fetchBookings();
      toast.success("Session booked successfully!");
    } catch (error) {
      console.error("Error booking session:", error);
      toast.error("Failed to book session. Please try again later.");
    }
  };

  // Handle logout
  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Navbar / Header Section */}
      <motion.div
        className="flex items-center justify-between bg-white shadow-lg p-4 rounded-2xl"
        whileHover={{ scale: 1.01 }}
      >
        <h1 className="text-2xl font-bold text-gray-500">
          Welcome
          {/* {menteeDetails
            ? `, ${menteeDetails.name}`
            : user
            ? `, ${user.name}`
            : "!"} */}
        </h1>
        {user ? (
          <div className="flex items-center space-x-4">
            <span className="text-lg">
              {menteeDetails ? menteeDetails.name : user.name}
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg shadow-lg transition-all duration-300"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={googleSignIn}
            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg shadow-lg transition-all duration-300"
          >
            Sign In
          </button>
        )}
      </motion.div>

      {/* Available Sessions by Day */}
      <div className="p-6 bg-white rounded-xl shadow-md">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <CalendarDays className="mr-2 text-blue-500" /> Available Sessions
        </h3>
        <div className="flex flex-col gap-6">
          {daysOfWeek.map((day) => (
            <div key={day} className="mb-4">
              <h4 className="text-lg font-bold mb-3 text-gray-700">{day}</h4>
              {availableSessions[day] && availableSessions[day].length > 0 ? (
                availableSessions[day].map((mentor) => (
                  <div
                    key={mentor.id}
                    className="p-5  rounded-xl shadow-md bg-gray-50 hover:bg-gray-100 hover:shadow-lg transition-all mb-3"
                  >
                    <p className="font-medium text-gray-800">
                      {mentor.prefix} {mentor.name}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      <strong>Expertise:</strong> {mentor.expertise}
                    </p>
                    <div className="flex flex-wrap gap-3 mt-3">
                      {mentor.slots.map((slot) => (
                        <button
                          key={`${mentor.id}-${slot.slotId}`}
                          className={`bg-blue-500 text-white px-4 py-2 rounded-md transition-all ${bookedSlotIds.includes(slot.slotId)
                            ? "bg-yellow-500 opacity-50 cursor-not-allowed"
                            : "hover:bg-blue-600 cursor-pointer"
                          }`}
                        onClick={() =>
                          bookedSlotIds.includes(slot.slotId)
                            ? null
                            : bookSession(mentor.id, slot.time, slot.slotId)
                        }
                        disabled={bookedSlotIds.includes(slot.slotId)}
                      >
                        {bookedSlotIds.includes(slot.slotId)
                          ? "Booked"
                          : slot.time}
                      </button>
                    ))}
                  </div>
                  </div>
               ))

              ) : (
                <p className="text-gray-400 text-center">
                  No available sessions for {day}.
                </p>
              )
              }
            </div>
          ))}
        </div>
      </div>

      {/* Booking History */}
      <div className="p-6 bg-white bg-opacity-20 backdrop-blur-md shadow-md rounded-xl mt-10 w-full max-w-5xl">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-black mb-3 flex items-center">
            <CalendarClock className="mr-2 text-blue-500" /> My Bookings
          </h3>
          <button
            onClick={fetchBookings}
            className="bg-blue-400 hover:bg-blue-500 text-white px-3 py-1 rounded-lg cursor-pointer shadow-md transition-all"
          >
            Refresh Bookings
          </button>
        </div>
        <ul className="space-y-2 mt-2">
          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <li
                key={booking._id}
                className="bg-white p-3 rounded-lg shadow-md border hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                <h4 className="text-lg font-semibold flex items-center text-gray-800">
                  <User className="mr-2 text-blue-500" />{" "}
                  <span className="font-medium text-blue-600">
                    {booking.mentorId?.prefix} {booking.mentorId?.name || "Unknown Mentor"}
                  </span>
                </h4>
                <p className="flex items-center mt-3 text-gray-600">
                  <Clock className="mr-2 text-blue-500" />{" "}
                  {booking.day || booking.date}, {booking.startTime} -{" "}
                  {booking.endTime}
                </p>
              </li>
            ))
          ) : (
            <p className="text-gray-400 text-center mt-6">No bookings yet.</p>
          )}
        </ul>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default MenteeDashboard;
