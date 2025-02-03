import React, { useState } from "react";
import "./Signup.css";
import { Link } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [prefix, setPrefix] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("mentee");
  const [expertise, setExpertise] = useState(""); // New state for Mentor's Expertise
  const [experience, setExperience] = useState(""); // New state for Mentor's Experience
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    try {
      console.log("Sending Request:", { email, password, role });

      const authInstance = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        authInstance,
        email,
        password
      );
      console.log("User Credential:", userCredential);
      const uid = userCredential.user.uid;

      const userData = {
        prefix,
        uid,
        name,
        surname,
        email,
        password,
        role,
        ...(role === "mentor" && { expertise, experience }), // Add these fields only for mentors
      };

      const response = await axios.post(
        "https://mentormenteemangement-1.onrender.com//api/auth/signup",
        userData
      );

      console.log("Signup Response:", response.data);

      if (response.data.role === "mentor") {
        navigate("/mentor-dashboard");
      } else {
        navigate("/mentee-dashboard");
      }
    } catch (err) {
      console.error(
        "Signup Error:",
        err.response ? err.response.data : err.message
      );
      setError(
        err.response ? err.response.data.error || "Signup failed!" : err.message
      );
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-purple-500 to-blue-500">
      <div className="bg-white bg-opacity-20 backdrop-blur-lg shadow-lg rounded-xl p-8 w-full max-w-md">
        <h2 className="text-4xl font-bold text-blue-500 text-center">
          Create Account
        </h2>
        <p className="text-gray-500 font-semibold text-center mb-6">
          Join us and start your journey
        </p>

        <form onSubmit={handleSignup} className="space-y-4">
          {/* Name Inputs */}
          <select
            value={prefix}
            onChange={(e) => setPrefix(e.target.value)}
            className="w-full px-4 py-2 bg-white bg-opacity-30 border border-gray-300 rounded-lg text-gray-400 placeholder-gray-300 focus:outline-none cursor-pointer font-semibold"
          >
            <option value="" disabled className="text-gray-200">
              Select Prefix
            </option>
            <option value="Mr.">Mr.</option>
            <option value="Mrs.">Mrs.</option>
            <option value="Ms.">Ms.</option>
            <option value="Dr.">Dr.</option>
            <option value="Prof.">Prof.</option>
            
            {/* Add more options as needed */}
          </select>
          <input
            type="text"
            placeholder="First Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 bg-white bg-opacity-30 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-300 focus:outline-none cursor-pointer font-semibold"
          />
          <input
            type="text"
            placeholder="Surname"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            className="w-full px-4 py-2 bg-white bg-opacity-30 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-300 focus:outline-none cursor-pointer font-semibold"
          />

          {/* Email & Password */}
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 bg-white bg-opacity-30 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-300 focus:outline-none cursor-pointer font-semibold"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 bg-white bg-opacity-30 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-300 focus:outline-none cursor-pointer font-semibold"
          />

          {/* Role Selection */}
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-2 bg-white bg-opacity-30 border border-gray-300 rounded-lg text-gray-500 placeholder-gray-300 focus:outline-none cursor-pointer"
          >
            <option value="mentee">Mentee</option>
            <option value="mentor">Mentor</option>
          </select>

          {/* Mentor's Additional Fields (Expertise & Experience) */}
          {role === "mentor" && (
            <>
              <input
                type="text"
                placeholder="Your Expertise (e.g., React, Node.js)"
                value={expertise}
                onChange={(e) => setExpertise(e.target.value)}
                className="w-full px-4 py-2 bg-white bg-opacity-30 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-300 focus:outline-none cursor-pointer font-semibold"
              />
              <input
                type="number"
                placeholder="Years of Experience"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full px-4 py-2 bg-white bg-opacity-30 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-300 focus:outline-none cursor-pointer font-semibold"
              />
            </>
          )}

          {/* Signup Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-900 text-white 
            font-semibold px-4 py-2 
            border border-white  cursor-pointer rounded-lg transition duration-300"
          >
            Sign up
          </button>
        </form>

        {/* Error Message */}
        {error && <p className="text-red-400 text-center mt-4">{error}</p>}

        {/* Login Redirect */}
        <p className="mt-6 text-center text-gray-500 font-semibold">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-500 hover:text-blue-700 hover:underline"
          >
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
