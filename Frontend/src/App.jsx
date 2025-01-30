import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
const Signup = React.lazy(() => import("./components/Signup"));
const Login = React.lazy(() => import("./components/Login"));
import { AuthProvider } from "./context/AuthContext"; // Corrected the import path
const Dashboard = React.lazy(() => import("./dashboards/Dashboard"));
const MenteeDashboard = React.lazy(() => import("./dashboards/MenteeDashboard"));
const MentorDashboard = React.lazy(() => import("./dashboards/MentorDashboard"));
function App() {
  return (
    <AuthProvider> {/* FIXED: Changed AuthContext to AuthProvider */}
      <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/mentee-dashboard" element={<MenteeDashboard />} />
           <Route path="/mentor-dashboard" element={<MentorDashboard />} />
           
        </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App;
