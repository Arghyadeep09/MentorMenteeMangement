import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';         
import { auth } from "../firebaseConfig";
import axios from "axios";
import { BiShow, BiHide } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import { GoogleButton } from "react-google-button";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";

import "boxicons";

const Login = () => {
  const { googleSignIn } = UserAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem("email");
    const savedPassword = localStorage.getItem("password");
    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []); 
  const validateForm = () => {
    if (!email || !password) {
      toast.error("Both email and password are required.");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email address.");
      return false;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return false;
    }
    return true;
  };


  const handleLogin = async (e) => {
    e.preventDefault();
     if (!validateForm()) return;
    setError("");
    setLoading(true);
    
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("User Credential:", userCredential);
      const token = await userCredential.user.getIdToken();

      const response = await axios.post(
        "https://mentormenteemangement.onrender.com/api/auth/login",
        { token },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Login Response:", response.data);
      const {user}=response.data;
      if (user?.token || user?.role) {
        localStorage.setItem("token", token);
        localStorage.setItem("role", user?.role);

        if (rememberMe) {
          localStorage.setItem("email", email);
          localStorage.setItem("password", password);
        } else {
          localStorage.removeItem("email");
          localStorage.removeItem("password");
        }
        if (user?.role === "mentor") {
          navigate("/mentor-dashboard"); 
           toast.success("Login successful!");
        } else {
          navigate("/mentee-dashboard"); 
           toast.success("Login successful!");
        }
      } else {
        setError("Server error: Missing token or role"); 

      }
    } catch (error) {
      setError(error.message); 
         toast.error(error.message || "An error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();
      const email = result.user.email;
      
      
      // Fetch user details from MongoDB using the email
      const { data } = await axios.get(
        `https://mentormenteemangement.onrender.com/api/users/users?email=${email}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(data)
      const {user} = data;
      console.log("User Data:", user);
      if (user?.role) {
        localStorage.setItem("name", user.name);
        //localStorage.setItem("token", token);
        localStorage.setItem("token", token);
        localStorage.setItem("role", user.role);

        // Redirect based on role
        navigate(
          user?.role === "mentor" ? "/mentor-dashboard" : "/mentee-dashboard"
        ); 
          toast.success("Google sign-in successful!");
      } else {
        setError("Role not found. Please complete your profile."); 
         toast.error("Role not found. Please complete your profile.");
      }
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      setError("Email not found. Please sign up."); 
       toast.error("Email not found. Please sign up.");
    } finally {
      setLoading(false);
    }
  };

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-indigo-500 to-purple-500">
      <div className="bg-white bg-opacity-25 backdrop-blur-lg shadow-lg rounded-xl p-10 w-full max-w-lg">
        <h2 className="text-4xl font-bold text-blue-500 text-center mb-4">
          Welcome Back
        </h2>
        <p className="text-gray-500 text-center font-semibold mb-6">
          Log in to continue
        </p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-white bg-opacity-30 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-300 focus:outline-none cursor-pointer font-semibold"
            />
          </div>

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
          <div className="inline-flex items-center ">
            <label className="text-gray-500 font-medium p-2">RememberMe</label>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={handleRememberMeChange}
              className="w-5 h-4 accent-blue-700 cursor-pointer"
            />
          </div>
          <div className="flex justify-between items-center mt-6 space-x-4">
            <button
              type="submit"
              className="w-1/2 bg-blue-500 hover:bg-blue-900 text-white font-semibold py-3 rounded-lg transition duration-300 text-center cursor-pointer"
               disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            <span className="text-gray-500">or</span>
            <GoogleButton
              onClick={handleGoogleSignIn}
              className="w-1/2 flex justify-center font-semibold" 
               disabled={loading}
              label="Sign in with Google"
            />
          </div>
        </form>

        {error && (
          <p className="text-red-400 text-center font-semibold mt-4">{error}</p>
        )}

        {/* Don't have an account? Signup Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 font-semibold">
            Don't have an account?{" "}
            <span
              className="text-blue-400 hover:underline hover:text-blue-500  cursor-pointer"
              onClick={() => navigate("/signup")}
            >
              Create one
            </span>
          </p>
        </div> 
       
      </div>
        <ToastContainer />
    </div>
  );
};

export default Login;
