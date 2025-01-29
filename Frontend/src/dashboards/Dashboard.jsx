import React  from "react";
import { Link } from "react-router-dom";
import { Clock, Award, Headphones ,Calendar, Bell, MessageSquare} from 'lucide-react';
const Dashboard = () => {

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
      <nav className="flex justify-between items-center p-4 bg-gray-900  px-12 py-18">
        <div className="text-3xl font-bold text-blue-400">MentorConnect</div>
        <div>
          <Link to="/signup">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mx-2 cursor-pointer transform hover:scale-110 transition-transform duration-300">
              Signup
            </button>
          </Link>
          <Link to="/login">
            <button className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 cursor-pointer transform hover:scale-110 transition-transform duration-300">
              Login
            </button>
          </Link>
        </div>
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
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="relative flex w-full max-w-4xl">
        {/* Background image card */}
        <div className="relative w-72 h-[500px] rounded-3xl overflow-hidden">
          <img
            src="/api/placeholder/400/600"
            alt="Tools"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Main content card */}
        <div className="absolute left-56 top-8 w-72 bg-gray-900 text-white p-8 rounded-3xl transform rotate-3">
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
            know how it works
          </button>
        </div>

        {/* Features card */}
        <div className="absolute left-[460px] top-16 w-72 bg-white p-8 rounded-3xl shadow-xl">
          <h3 className="text-lg font-bold mb-6 text-slate-800">Why Choose Us</h3>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-800 mb-1"> Experienced Mentors</h4>
                <p className="text-sm text-gray-500">Connect with expert mentors who have years of experience in your field to guide you in your career growth.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Headphones className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-800 mb-1">Scheduled Support</h4>
                <p className="text-sm text-gray-500">Book personalized sessions to discuss challenges and receive valuable insights on your career path.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Award className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-800 mb-1">Industry Certified</h4>
                <p className="text-sm text-gray-500">Work with mentors who are certified professionals in their industries, </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

      {/* Features Section */}
      {/* <section className="grid grid-cols-1 md:grid-cols-3 gap-8 px-8 py-12">
        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-blue-400">
            Easy Scheduling
          </h3>
          <p className="mt-2 text-gray-300">
            Book mentor-mentee sessions effortlessly.
          </p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-blue-400">
            Real-Time Updates
          </h3>
          <p className="mt-2 text-gray-300">
            Get notified about upcoming sessions.
          </p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-blue-400">
            Seamless Communication
          </h3>
          <p className="mt-2 text-gray-300">
            Chat and collaborate with your mentor or mentee.
          </p>
        </div>
      </section> */}

<div className="flex gap-4 p-8 overflow-x-auto  justify-center">
      {features.map((feature, index) => (
        <div 
          key={index}
          className="flex-none w-72 p-6 rounded-3xl transition-all duration-300 bg-slate-600 hover:bg-slate-800 group  hover:scale-110"
        >
          <div className="flex flex-col items-start gap-4 ">
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
      <section id="how-it-works" className="p-10 bg-gray-800 text-center">
        <h2 className="text-3xl font-semibold mb-8">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { text: "Sign up as a Mentor or Mentee", image: "https://via.placeholder.com/150" },
            { text: "Explore available mentors or set your availability", image: "https://via.placeholder.com/150" },
            { text: "Schedule sessions in a few clicks", image: "https://via.placeholder.com/150" },
            { text: "Attend the sessions and grow your skills", image: "https://via.placeholder.com/150" },
          ].map((step, index) => (
            <div
              key={index}
              className="bg-gray-700 p-6 rounded-lg shadow-lg hover:shadow-xl transition flex flex-col items-center"
            >
              <img src={step.image} alt="Step" className="mb-4 w-20 h-20" />
              <p>{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="p-10 text-center">
        <h2 className="text-3xl font-semibold mb-6">Start Your Mentorship Journey Today!</h2>
        <button className="bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded-lg cursor-pointer transform hover:scale-110 transition-transform duration-300">Sign Up Now</button>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-400">
        © 2025 MentorConnect. All rights reserved.
      </footer>
    </div>
  );
};

export default Dashboard;
