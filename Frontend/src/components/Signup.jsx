import React, { useState } from "react";
import "./Signup.css";
import { Link } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';   
import { BiShow, BiHide } from "react-icons/bi";
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
  const [loading, setLoading] = useState(false); 
const [isPasswordVisible, setIsPasswordVisible] = useState(false); // New state
  const navigate = useNavigate(); 
 const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
   const validateForm = () => {
    let isValid = true;
    const nameRegex = /^[A-Za-z]+$/; // Regular expression to allow only letters
    if (!name.trim()) {
      toast.error("First Name is required.");
      isValid = false;
    } else if (!nameRegex.test(name)) {
      toast.error("First Name must contain only letters.");
      isValid = false;
     }
      if (experience < 0) {
    toast.error("Experience cannot be negative.");
    isValid = false;
  }
    if (!surname.trim()) {
      toast.error("Last Name is required.");
      isValid = false;
    } else if (!nameRegex.test(surname)) {
      toast.error("Last Name must contain only letters.");
      isValid = false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      toast.error("Email is required.");
      isValid = false;
    } else if (!emailRegex.test(email)) {
      toast.error("Invalid email format.");
      isValid = false;
    }
    if (!password) {
      toast.error("Password is required.");
      isValid = false;
    } else if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      isValid = false;
    }
    
    return isValid;
  };
  const handleSignup = async (e) => { 
  
    e.preventDefault();
      if (!validateForm()) return;
    setError(""); 
    setLoading(true);

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
        "https://mentormenteemangement.onrender.com/api/auth/signup",
        userData
      );

      console.log("Signup Response:", response.data);

      if (response.data.role === "mentor") {
        navigate("/mentor-dashboard"); 
          toast.success("Account created successfully!");
      } else {
        navigate("/mentee-dashboard"); 
          toast.success("Account created successfully!");
      }
    } catch (err) {
      console.error(
        "Signup Error:",
        err.response ? err.response.data : err.message
      );
      setError(
        err.response ? err.response.data.error || "Signup failed!" : err.message
      ); 
         toast.error(err.response ? err.response.data.error || "Signup failed!" : err.message);
    } 
    finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-purple-500 to-blue-500">
      <div className="bg-white bg-opacity-20 backdrop-blur-lg shadow-lg rounded-xl p-8 w-full max-w-md">
        <h2 className="text-4xl font-bold text-blue-500 text-center">
          Create Account
        </h2>
        <p className="text-gray-500 font-semibold text-center mb-4">
          Join us and start your journey
        </p>

        <form onSubmit={handleSignup} className="space-y-4">
          {/* Name Inputs */} 
           <div className="row flex gap-4">
          <select
            value={prefix}
            onChange={(e) => setPrefix(e.target.value)}
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
            
            {/* Add more options as needed */}
          </select> 
           {/* Role Selection */}
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-2 bg-white bg-opacity-30 border border-gray-300 rounded-lg text-gray-500 placeholder-gray-300 focus:outline-none cursor-pointer"
          >
            <option value="mentee">Mentee</option>
            <option value="mentor">Mentor</option>
            </select>
            </div>
         <div className="row flex gap-4">
  <input
    type="text"
    placeholder="First Name"
    value={name}
    onChange={(e) => setName(e.target.value)}
    className="w-full md:w-1/2 px-4 py-2 bg-white bg-opacity-30 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-300 focus:outline-none font-semibold"
  />
  <input
    type="text"
    placeholder="Surname"
    value={surname}
    onChange={(e) => setSurname(e.target.value)}
    className="w-full md:w-1/2 px-4 py-2 bg-white bg-opacity-30 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-300 focus:outline-none font-semibold"
  />
</div>


          {/* Email & Password */}
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 bg-white bg-opacity-30 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-300 focus:outline-none cursor-pointer font-semibold"
          />
          <div className="relative">
                      <input
                        type={isPasswordVisible ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 bg-white bg-opacity-30 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-300 focus:outline-none cursor-pointer font-semibold"
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-4 text-gray-600 cursor-pointer hover:text-gray-800"
                      >
                        {isPasswordVisible ? <BiShow /> : <BiHide />}
                      </button>
                    </div>

         

          {/* Mentor's Additional Fields (Expertise & Experience) */}
          {role === "mentor" && (
            <> 
              <div className="row flex gap-4">
              <input
                type="text"
                placeholder="Your Expertise "
                value={expertise}
                onChange={(e) => setExpertise(e.target.value)}
                className="w-full px-4 py-2 bg-white bg-opacity-30 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-300 focus:outline-none cursor-pointer font-semibold"
              />
              <input
                type="number"
                placeholder=" Experience"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full px-4 py-2 bg-white bg-opacity-30 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-300 focus:outline-none cursor-pointer font-semibold"
                /> 
                </div>
            </>
          )}

          {/* Signup Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-900 text-white 
            font-semibold px-4 py-2 
            border border-white  cursor-pointer rounded-lg transition duration-300" 
             disabled={loading}
          >
            {loading ? "Logging in..." : "Sign Up"}
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
      <ToastContainer />
    </div>
  );
};

export default Signup;
