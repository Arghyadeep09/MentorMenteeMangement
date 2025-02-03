import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { UserCircle, CalendarDays } from "lucide-react";
import axios from "axios";
import { UserAuth } from "../context/AuthContext";
import { auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom"; // Add this for navigation
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CalendarClock,User,Clock} from "lucide-react";

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
  
  const navigate = useNavigate(); // Initialize the useNavigate hook

  useEffect(() => {
    setEditableDetails({ ...mentorDetails });
  }, [mentorDetails]);

  useEffect(() => {
      fetchBookings();
    }, []);

  useEffect(() => {
    const fetchMentorDetails = async () => {
      if (!user || !user.id) return;

      try {
        const token = await auth.currentUser.getIdToken();
        const response = await axios.get(
          `https://mentormenteemangement.onrender.com/api/mentor/details?mentorId=${user.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Mentor Details:", response.data); // Debugging: check fetched data
        setMentorDetails(response.data);
      } catch (error) {
        console.error("Error fetching mentor details:", error);
      }
    };

    fetchMentorDetails();
  }, [user]);

  useEffect(() => {
    const fetchAvailability = async () => {
      if (!user || !user.id) return;

      try {
        const token = await auth.currentUser.getIdToken();
        const response = await axios.get(
          `https://mentormenteemangement.onrender.com/api/mentor/slots?mentorId=${user.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Fetched Slots: ", response.data); // Debugging: check fetched data
        const availableSlots = response.data.reduce((acc, slot) => {
          acc[slot.date] = slot.startTime;
          return acc;
        }, {});
        setAvailability(availableSlots);
        console.log("Availability after fetch:", availableSlots); // Debugging: Check state after fetching
      } catch (error) {
        console.error("Error fetching availability:", error);
      }
    };

    fetchAvailability();
  }, [user]);

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
  
      console.log("Fetched Bookings:", response.data); // Debugging 
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
       toast.error("Failed to fetch bookings. Please try again later.");
    }
  };
  

  const toggleAvailability = async (day, time) => {
    console.log("User:", user); // Debugging: Check user object
    if (!user || !user.id) return;

    console.log("Clicked:", day, time); // Debugging: Check clicked day and time

    try {
      const token = await auth.currentUser.getIdToken();
      console.log("Token for Setting Slot: ", token); // Check token before API call
      const updatedAvailability = { ...availability };

      if (updatedAvailability[day]) {
        console.log("Deleting Slot for: ", day, updatedAvailability[day]); // Debugging: Check what is being deleted
        await axios.delete(
          `https://mentormenteemangement.onrender.com/api/mentor/delete-slot?mentorId=${user.id}&day=${day}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        delete updatedAvailability[day]; // Remove previous slot
      }

      console.log("Setting Slot for: ", day, time); // Debugging: Check new slot
      updatedAvailability[day] = time;
      console.log("Updated Availability:", updatedAvailability); // Debugging: Check updated state

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
      console.log("Slot created successfully"); // Debugging: Confirm slot creation
        toast.success("Availability updated successfully!");
      setAvailability(updatedAvailability); // Update the state with the new availability
    } catch (error) {
      console.error("Error updating availability:", error); // Debugging: Check error message 
       toast.error("Failed to update availability. Please try again.");
    }
  };

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
      setMentorDetails(editableDetails); // Update the mentor details in the state
      setIsEditMode(false); // Exit edit mode
    } catch (error) {
        toast.error("Failed to update profile. Please try again later.");
      console.error("Error updating mentor details:", error);
    }
  };

  // Logout function
  const handleLogout = async () => {
    try {
      await auth.signOut(); // Sign out the user from Firebase
       localStorage.clear();
      navigate("/login"); // Navigate to the login page after logout
    } catch (error) {
      console.error("Error logging out:", error); // Handle any errors during logout 
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
            <h2 className="text-2xl font-bold">
              {mentorDetails.prefix || "Mr."} {mentorDetails.name || "Mentor Name"} {mentorDetails.surname || "Mentor Surname"}
            </h2>
            <p className="text-gray-500">{mentorDetails.expertise || "Expert in Web Development"}</p>
            <p className="text-gray-500">Experience: {mentorDetails.experience || "N/A"} years</p>
          </div>
        </div>
        <div className="flex space-x-4">
          <button
            className="text-blue-700 text-bold cursor-pointer bg-blue-100 py-2 px-4 rounded-lg hover:bg-blue-200 transform hover:scale-110 transition-transform duration-300"
            onClick={() => setIsEditMode(!isEditMode)}
          >
            {isEditMode ? "Cancel" : "Edit Profile"}
          </button>
          <button
            className="text-red-700 text-bold cursor-pointer bg-red-100 py-2 px-4 rounded-lg hover:bg-red-200 transform hover:scale-110 transition-transform duration-300"
            onClick={handleLogout} // Logout on button click
          >
            Logout
          </button>
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
          <h3 className="text-lg cursor-pointer font-bold mb-3">Edit Profile</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Prefix"
              value={editableDetails.prefix}
              onChange={(e) => setEditableDetails({ ...editableDetails, prefix: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg cursor-pointer"
            />
            <input
              type="text"
              placeholder="First Name"
              value={editableDetails.name}
              onChange={(e) => setEditableDetails({ ...editableDetails, name: e.target.value })}
              className="w-full px-4 py-2 border cursor-pointer border-gray-300 rounded-lg"
            />
            <input
              type="text"
              placeholder="Surname"
              value={editableDetails.surname}
              onChange={(e) => setEditableDetails({ ...editableDetails, surname: e.target.value })}
              className="w-full px-4 py-2 border cursor-pointer border-gray-300 rounded-lg"
            />
            <input
              type="text"
              placeholder="Expertise"
              value={editableDetails.expertise}
              onChange={(e) => setEditableDetails({ ...editableDetails, expertise: e.target.value })}
              className="w-full px-4 py-2 border cursor-pointer border-gray-300 rounded-lg"
            />
            <input
              type="number"
              placeholder="Experience (years)"
              value={editableDetails.experience}
              onChange={(e) => setEditableDetails({ ...editableDetails, experience: e.target.value })}
              className="w-full px-4 py-2 border cursor-pointer border-gray-300 rounded-lg"
            />
          </div>
          <div className="flex justify-end mt-4">
            <button className="bg-gray-400 text-white px-4 py-2 rounded-md mr-2 cursor-pointer" onClick={() => setIsEditMode(false)}>
              Cancel
            </button>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer" onClick={updateMentorDetails}>
              Save Changes
            </button>
          </div>
        </motion.div>
      )}

      {/* Availability Section */}
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-3  flex items-center">
          <CalendarDays className="mr-2 text-blue-500" /> Select Your Available Slots
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {daysOfWeek.map((day) => (
            <div key={day} className="p-3 border rounded-md transition duration-300 hover:shadow-2xl border border-gray-200">
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
        <h3 className="text-lg font-semibold mb-3  flex items-center">
          <CalendarClock className="mr-2 text-blue-500" /> View Bookings
        </h3>
        {/* Add booking view functionality here */}
        <ul className="space-y-2 mt-2">
          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <li
                key={booking._id}
                className="bg-white p-3 rounded-lg shadow-md border border-gray-200 transition duration-300 hover:shadow-1xl"
              >
                <h4 className="text-lg font-semibold flex items-center">
                <User className="mr-2 text-blue-500" /> 
                {booking.menteeId?.name || "Unknown Mentee"}
              </h4>
              <p className="flex items-center mt-2 text-gray-600">
                <Clock className="mr-2 text-blue-500" /> {booking.startTime} - {booking.endTime}
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
