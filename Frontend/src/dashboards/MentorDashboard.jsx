import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { UserCircle, CalendarDays, CalendarClock, User, Clock, Menu, X } from "lucide-react";
import axios from "axios";
import { UserAuth } from "../context/AuthContext";
import { auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const timeSlots = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
];

const MentorDashboard = () => {
  const { user } = UserAuth();
  const [bookings, setBookings] = useState([]);
  const [bookedSlotIds, setBookedSlotIds] = useState([]);
  const [mentorDetails, setMentorDetails] = useState({
    prefix: "",
    name: "",
    surname: "",
    expertise: "",
    experience: "",
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [editableDetails, setEditableDetails] = useState({ ...mentorDetails });
  const [availability, setAvailability] = useState({});
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();


  // Update editable details whenever mentorDetails changes
  useEffect(() => {
    setEditableDetails({ ...mentorDetails });
  }, [mentorDetails]);

  // Fetch the mentor's bookings on component mount
  useEffect(() => {
    fetchBookings();
  }, []);

  // Fetch mentor details
  useEffect(() => {
    const fetchMentorDetails = async () => {
      if (!user || !user.id) return;

      try {
        const token = await auth.currentUser.getIdToken();
        const response = await axios.get(
          `https://mentormenteemangement.onrender.com/api/mentor/details?mentorId=${user.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Mentor Details:", response.data);
        setMentorDetails(response.data);
      } catch (error) {
        console.error("Error fetching mentor details:", error);
      }
    };

    fetchMentorDetails();
  }, [user]);

  // Fetch the mentor's current availability (slots)
  useEffect(() => {
    const fetchAvailability = async () => {
      if (!user || !user.id) return;

      try {
        const token = await auth.currentUser.getIdToken();
        const response = await axios.get(
          `https://mentormenteemangement.onrender.com/api/mentor/slots?mentorId=${user.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Fetched Slots:", response.data);
        // Assuming each slot object has a date and startTime.
        const availableSlots = response.data.reduce((acc, slot) => {
          acc[slot.date] = slot.startTime;
          return acc;
        }, {});
        setAvailability(availableSlots);
        console.log("Availability after fetch:", availableSlots);
      } catch (error) {
        console.error("Error fetching availability:", error);
      }
    };

    fetchAvailability();
  }, [user]);

  // Fetch bookings for the mentor
  const fetchBookings = async () => {
    try {
      const token = await auth.currentUser.getIdToken();
      const response = await axios.get(
        `https://mentormenteemangement.onrender.com/api/mentor/bookings?mentorId=${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Fetched Bookings:", response.data);
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to fetch bookings. Please try again later.");
    }
  };

  // Toggle availability for a given day and time slot
  const toggleAvailability = async (day, time) => {
    if (!user || !user.id) return;

    try {
      const token = await auth.currentUser.getIdToken();
      const updatedAvailability = { ...availability };

      // If there is already a slot set for that day, delete it first
      if (updatedAvailability[day]) {
        await axios.delete(
          `https://mentormenteemangement.onrender.com/api/mentor/delete-slot?mentorId=${user.id}&day=${day}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        delete updatedAvailability[day];
      }

      // Set the new slot
      updatedAvailability[day] = time;
      await axios.post(
        "https://mentormenteemangement.onrender.com/api/mentor/create-slot",
        { mentorId: user.id, day, time },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Availability updated successfully!");
      setAvailability(updatedAvailability);
    } catch (error) {
      console.error("Error updating availability:", error);
      toast.error("Failed to update availability. Please try again.");
    }
  };

  // Update the mentor's profile details
  const updateMentorDetails = async () => {
    try {
      const token = await auth.currentUser.getIdToken();
      const response = await axios.put(
        `https://mentormenteemangement.onrender.com/api/mentor/update?mentorId=${user.id}`,
        editableDetails,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Updated Mentor Details:", response.data);
      toast.success("Profile updated successfully!");
      setMentorDetails(editableDetails);
      setIsEditMode(false);
    } catch (error) {
      toast.error("Failed to update profile. Please try again later.");
      console.error("Error updating mentor details:", error);
    }
  };

  // Logout function
  const handleLogout = async () => {
    try {
      await auth.signOut();
      localStorage.clear();
      navigate("/login");
      toast.success("Logged out successfully!");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Logout failed");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Profile Section */}
      <motion.div
        className="flex items-center justify-between bg-white shadow-lg p-4 rounded-2xl"
        whileHover={{ scale: 1.01 }}
      >
        <div className="flex items-center space-x-4">
          <UserCircle size={52} className="text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold text-base sm:text-lg md:text-2xl">
              {mentorDetails.prefix || "Mr."} {mentorDetails.name || "Mentor Name"} {mentorDetails.surname || "Mentor Surname"}
            </h2>
            <p className="text-gray-500 text-sm md:text-base">{mentorDetails.expertise || "Expert in Web Development"}</p>
            <p className="text-gray-500 text-sm md:text-base">Experience: {mentorDetails.experience || "N/A"} years</p>
          </div>
        </div>
        <div className="relative">
          {/* Hamburger menu for smaller screens */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 bg-gray-200 rounded-lg focus:outline-none"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Menu Items - Shown in small screens when menu is open */}
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg p-2 flex flex-col space-y-2 md:hidden">
              <button
                className="text-blue-700 font-bold cursor-pointer bg-blue-100 py-2 px-4 rounded-lg hover:bg-blue-200 transition duration-300"
                onClick={() => {
                  setIsEditMode(!isEditMode);
                  setMenuOpen(false);
                }}
              >
                {isEditMode ? "Cancel" : "Edit Profile"}
              </button>
              <button
                className="text-red-700 font-bold cursor-pointer bg-red-100 py-2 px-4 rounded-lg hover:bg-red-200 transition duration-300"
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
              >
                Logout
              </button>
            </div>
          )}

          {/* Normal buttons for larger screens */}
          <div className="hidden md:flex space-x-4">
            <button
              className="text-blue-700 font-bold cursor-pointer bg-blue-100 py-2 px-4 rounded-lg hover:bg-blue-200 transform hover:scale-110 transition-transform duration-300"
              onClick={() => setIsEditMode(!isEditMode)}
            >
              {isEditMode ? "Cancel" : "Edit Profile"}
            </button>
            <button
              className="text-red-700 font-bold cursor-pointer bg-red-100 py-2 px-4 rounded-lg hover:bg-red-200 transform hover:scale-110 transition-transform duration-300"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </motion.div>

      {/* Edit Profile Section */}
      {isEditMode && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.1 }}
          className="bg-white shadow-lg p-4 rounded-2xl"
        >
          <h3 className="text-lg font-bold mb-3 cursor-pointer">Edit Profile</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              value={editableDetails.prefix}
              onChange={(e) => setEditableDetails({ ...editableDetails, prefix: e.target.value })}
              className="w-full px-4 py-2 bg-white bg-opacity-30 border border-gray-300 rounded-lg text-gray-400 placeholder-gray-600 focus:outline-none cursor-pointer font-semibold"
            >
              <option value="" disabled className="text-gray-200">
                Select Prefix
              </option>
              <option value="Mr.">Mr.</option>
              <option value="Mrs.">Mrs.</option>
              <option value="Ms.">Ms.</option>
              <option value="Dr.">Dr.</option>
              <option value="Prof.">Prof.</option>
            </select>
            <input
              type="text"
              placeholder="First Name"
              value={editableDetails.name}
              onChange={(e) => setEditableDetails({ ...editableDetails, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg cursor-pointer"
            />
            <input
              type="text"
              placeholder="Surname"
              value={editableDetails.surname}
              onChange={(e) => setEditableDetails({ ...editableDetails, surname: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg cursor-pointer"
            />
            <input
              type="text"
              placeholder="Expertise"
              value={editableDetails.expertise}
              onChange={(e) => setEditableDetails({ ...editableDetails, expertise: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg cursor-pointer"
            />
            <input
              type="number"
              placeholder="Experience (years)"
              value={editableDetails.experience}
              onChange={(e) => setEditableDetails({ ...editableDetails, experience: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg cursor-pointer"
            />
          </div>
          <div className="flex justify-end mt-4">
            <button
              className="bg-gray-400 text-white px-4 py-2 rounded-md mr-2 cursor-pointer hover:bg-grey-300 transition-transform duration-300 transform hover:scale-105"
              onClick={() => setIsEditMode(false)}
            >
              Cancel
            </button>
            <button
              className={`px-4 py-2 text-white rounded-md  ${Object.values(editableDetails).some(value => !value.trim())
                ? "bg-gray-400 cursor-not-allowed "
                : "bg-blue-500 text-white cursor-pointer hover:bg-blue-600 transition-transform duration-300 transform hover:scale-105"
                }`}
              onClick={updateMentorDetails}
              disabled={Object.values(editableDetails).some(value => !value.trim())}
            >
              Save Changes
            </button>
          </div>
        </motion.div>
      )}

      {/* Availability Section */}
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-3 flex items-center">
          <CalendarDays className="mr-2 text-blue-500" /> Select Your Available Slots
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {daysOfWeek.map((day) => (
            <div key={day} className="p-3 rounded-md transition duration-300 hover:shadow-2xl border border-gray-200">
              <h4 className="font-medium">{day}</h4>
              <div className="flex flex-wrap gap-2 mt-3">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    className={`text-xs cursor-pointer px-4 py-2 rounded-md transition 
                      ${availability[day] === time
                        ? "bg-blue-500 text-white shadow-md"
                        : "bg-gray-200 text-black hover:bg-gray-300"
                      }`}
                    onClick={() => toggleAvailability(day, time)}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* View Bookings Section */}
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-3 flex items-center">
          <CalendarClock className="mr-2 text-blue-500" /> View Bookings
        </h3>
        <ul className="space-y-2 mt-2">
          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <li
                key={booking._id}
                className="bg-white p-3 rounded-lg shadow-md border border-gray-200 transition duration-300 hover:shadow-xl"
              >
                <div className="flex justify-between items-center">
                  <h4 className="text-lg font-semibold flex items-center">
                    <User className="mr-2 text-blue-500" />{" "}
                    {booking.menteeId?.name || "Unknown Mentee"}
                  </h4>
                  {booking.bookedAt && (
                    <p className="text-sm text-gray-500">
                      {new Date(booking.bookedAt).toLocaleString()}
                    </p>
                  )}
                </div>
                <p className="mt-2 text-gray-600">
                  {booking.date && (
                    <span>
                      <strong>Date:</strong> {booking.date}
                      <br />
                    </span>
                  )}
                  <strong>Time:</strong> {booking.startTime} - {booking.endTime}
                </p>
              </li>
            ))
          ) : (
            <p className="text-gray-400">No bookings found.</p>
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

export default MentorDashboard;
