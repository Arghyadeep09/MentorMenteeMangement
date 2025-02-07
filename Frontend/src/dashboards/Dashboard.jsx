import React  from "react";
import { Link } from "react-router-dom"; 
import { motion } from "framer-motion";
import { FaUserGraduate, FaChalkboardTeacher, FaCalendarCheck, FaBookOpen } from "react-icons/fa";

import { FaBars, FaTimes } from "react-icons/fa";
import { Clock, Award, Headphones ,Calendar, Bell, MessageSquare} from 'lucide-react';
import { useState } from "react";
const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("mentee"); 
   const [menuOpen, setMenuOpen] = useState(false);
  const journey = {
    mentee: [
      { 
        title: "Step 1: Sign up & create profile",
        text: "Create your profile and tell us about your learning goals", 
        icon: <FaUserGraduate className="w-6 h-6 text-pink-500" />,
       
      },
      { 
        title: "Step 2: Find suitable mentors",
        text: "Browse through experienced mentors and find your perfect match", 
        icon: <FaChalkboardTeacher className="w-6 h-6 text-pink-500" />,
        
      },
      { 
        title: "Step 3: Schedule a session",
        text: "Book a time that works for both you and your mentor", 
        icon: <FaCalendarCheck className="w-6 h-6 text-pink-500" />,
      
      },
      { 
        title: "Step 4: Learn & grow",
        text: "Engage in meaningful sessions and achieve your goals", 
        icon: <FaBookOpen className="w-6 h-6 text-pink-500" />,
       
      },
    ],
    mentor: [
      { 
        title: "Step 1: Sign up & set expertise",
        text: "Create your profile and showcase your expertise", 
        icon: <FaUserGraduate className="w-6 h-6 text-blue-500" />,
     
      },
      { 
        title: "Step 2: Receive session requests",
        text: "Get matched with mentees who align with your expertise", 
        icon: <FaChalkboardTeacher className="w-6 h-6 text-blue-500" />,
       
      },
      { 
        title: "Step 3: Guide and mentor",
        text: "Share your knowledge and experience in scheduled sessions", 
        icon: <FaCalendarCheck className="w-6 h-6 text-blue-500" />,
       
      },
      { 
        title: "Step 4: Help others succeed",
        text: "Make a meaningful impact on your mentees' growth", 
        icon: <FaBookOpen className="w-6 h-6 text-blue-500" />,
    
      },
    ],
  };
  const features = [
    {
      title: "Easy Scheduling",
      description: "Book mentor-mentee sessions effortlessly.",
      icon: Calendar
    },
    {
      title: "Real-Time Updates",
      description: "Get notified about upcoming sessions.",
      icon: Bell
    },
    {
      title: "Seamless Communication",
      description: "Chat and collaborate with your mentor or mentee.",
      icon: MessageSquare
    }
  ];
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navbar */}
      <nav className="bg-gray-900 px-6 py-4">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <div className="text-3xl font-bold text-blue-400">MentorConnect</div>

        {/* Hamburger Menu for Mobile */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white focus:outline-none"
          >
            {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-4">
          <Link to="/signup">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-transform duration-300 transform hover:scale-105">
              Signup
            </button>
          </Link>
          <Link to="/login">
            <button className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-transform duration-300 transform hover:scale-105">
              Login
            </button>
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-4 flex flex-col space-y-2">
          <Link to="/signup">
            <button
              onClick={() => setMenuOpen(false)}
              className="w-full px-4 py-2 bg-blue-500 max-[383px]:text-sm text-white text-lg rounded-lg hover:bg-blue-600 transition-transform duration-300 transform hover:scale-105"
            >
              Signup
            </button>
          </Link>
          <Link to="/login">
            <button
              onClick={() => setMenuOpen(false)}
              className="w-full px-4 py-2 bg-gray-700 max-[383px]:text-sm text-lg text-white rounded-lg hover:bg-gray-600 transition-transform duration-300 transform hover:scale-105"
            >
              Login
            </button>
          </Link>
        </div>
      )}
    </nav>


      {/* Hero Section */}
      {/* <header className="text-center py-16">
        <h1 className="text-4xl font-bold text-blue-300">
          Welcome to MoogleMemini
        </h1>
        <p className="mt-4 text-lg text-gray-300">
          A Mentor-Mentee Scheduling System designed for seamless learning &
          collaboration.
        </p>
      </header> */}

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center p-10 mt-15">
        <h1 className="text-4xl font-bold mb-4">Empower Learning with the Right Mentorship</h1>
        <p className="text-lg mb-6">Connect with experienced mentors. Schedule sessions with ease.</p>
        <div className="flex space-x-4">
          <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg cursor-pointer transform hover:scale-110 transition-transform duration-300">Find a Mentor</button>
          <button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg cursor-pointer transform hover:scale-110 transition-transform duration-300">Become a Mentor</button>
        </div>
      </section>

      {/* About Section
      <section id="about" className="p-10 text-center">
        <h2 className="text-3xl font-semibold mb-4">What is MentorConnect?</h2>
        <p className="text-lg text-gray-300 mb-4">
          MentorConnect bridges the gap between mentors and mentees by offering
          an easy-to-use scheduling and booking system. Whether you're looking
          to share your expertise or seek guidance, our platform caters to all.
        </p>
        <p className="text-lg text-gray-300">
          Our platform is built to foster professional growth and collaboration,
          providing tools to track progress and enhance learning outcomes. Join
          us in building a community driven by knowledge-sharing and personal
          development.
        </p>
      </section> */}
      <div className="flex justify-center items-center  bg-gray-100 p-11">
  <div className="flex w-full max-w-2xl gap-[-80px]"> {/* Negative gap applied here */}
    
    {/* About Us card */}
    <div className="w-72 bg-gray-900 text-white p-8 rounded-3xl transform rotate-5">
      <h2 className="text-2xl font-bold mb-6">About Us</h2>
      <p className="text-sm mb-6 text-gray-200">
        MentorConnect bridges the gap between mentors and mentees by offering
        an easy-to-use scheduling and booking system. Whether you are looking
        to share your expertise or seek guidance, our platform caters to all.
      </p>
      <p className="text-sm mb-8 text-gray-200">
        Our platform is built to foster professional growth and collaboration,
        providing tools to track progress and enhance learning outcomes. Join
        us in building a community driven by knowledge-sharing and personal
        development.
      </p>
      <button className="bg-white text-slate-800 px-6 py-2 rounded-full text-sm font-semibold hover:bg-gray-100 transition-colors cursor-pointer transform hover:scale-110 transition-transform duration-300">
        Know how it works
      </button>
    </div>

    {/* Features card */}
    <div className="w-72 bg-white p-8 rounded-3xl shadow-xl">
      <h3 className="text-lg font-bold mb-6 text-slate-800">Why Choose Us</h3>
      
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Clock className="w-5 h-5 text-blue-600 transform hover:scale-110 transition-transform duration-300" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-800 mb-1">Experienced Mentors</h4>
            <p className="text-sm text-gray-500">Connect with expert mentors who have years of experience in your field to guide you in your career growth.</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Headphones className="w-5 h-5 text-blue-600 transform hover:scale-110 transition-transform duration-300" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-800 mb-1">Scheduled Support</h4>
            <p className="text-sm text-gray-500">Book personalized sessions to discuss challenges and receive valuable insights on your career path.</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Award className="w-5 h-5 text-blue-600 transform hover:scale-110 transition-transform duration-300" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-800 mb-1">Industry Certified</h4>
            <p className="text-sm text-gray-500">Work with mentors who are certified professionals in their industries.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>


<div className="flex gap-4 p-8 overflow-x-auto justify-center flex-wrap md:flex-nowrap">
  {features.map((feature, index) => (
    <div 
      key={index}
      className="flex-none w-full sm:w-90 md:w-72 p-6 rounded-3xl transition-all duration-300 bg-slate-600 hover:bg-slate-800 group hover:scale-90 cursor-pointer"
    >
      <div className="flex flex-col items-start gap-4">
        <div className="p-2 bg-slate-700/50 rounded-xl">
          <feature.icon className="w-6 h-6 text-gray-300 group-hover:text-white transition-colors" />
        </div>
        
        <div>
          <h3 className="text-xl font-semibold text-blue-400 group-hover:text-blue-300 transition-colors">
            {feature.title}
          </h3>
          <p className="mt-2 text-gray-300 group-hover:text-gray-200 transition-colors">
            {feature.description}
          </p>
        </div>
      </div>
    </div>
  ))}
</div>

      
      {/* Steps to Get Started */} 
   <section id="how-it-works" className="p-10 bg-gray-800 text-center flex flex-col items-center">
  <h2 className="text-3xl font-semibold mb-8">How It Works</h2>
  <div className="flex gap-4 mb-6 m-auto ">
    <button
    className={`px-4 py-2 rounded-lg max-[383px]:text-sm text-lg font-semibold transition-all cursor-pointer  ${
        activeTab === "mentee" 
          ? "bg-pink-500 text-white" 
          : "bg-gray-400 hover:bg-gray-300"
      }`}
      onClick={() => setActiveTab("mentee")}
      aria-label="View mentee journey"
    >
      For Mentees
    </button>
    <button
      className={`px-4 py-2 rounded-lg max-[383px]:text-sm text-lg font-semibold transition-all cursor-pointer ${
        activeTab === "mentor" 
          ? "bg-blue-500 text-white" 
          : "bg-gray-400 hover:bg-gray-300"
      }`}
      onClick={() => setActiveTab("mentor")}
      aria-label="View mentor journey"
    >
      For Mentors
    </button>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
    {journey[activeTab].map((step, index) => (
      <motion.div
        key={index}
        className="overflow-hidden hover:shadow-lg transition-shadow"
        initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }} // Added hover effect here
            transition={{ duration: 0.3 }}
        // Added hover effect here
      >
        <div className="relative">
          
          <div className="absolute top-4 left-4  bg-grey-900 p-2 rounded-full shadow-md">
            {step.icon}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold">{step.title}</h3>
          <p className="text-gray-600">{step.text}</p>
        </div>
      </motion.div>
    ))}
  </div>
</section>


      {/* Call to Action Section */}
      <section className="p-10 text-center">
        <h2 className="text-3xl font-semibold mb-6">Start Your Mentorship Journey Today!</h2>
          <Link to="/signup">
          <button className="bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded-lg cursor-pointer transform hover:scale-110 transition-transform duration-300">Sign Up Now</button>
          </Link>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-400">
        © 2025 MentorConnect. All rights reserved.
      </footer>
    </div>
  );
};

export default Dashboard;
