import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import { AuthProvider } from "./context/AuthContext"; // Corrected the import path
import Dashboard from "./dashboards/dashboard";
import MenteeDashboard from "./dashboards/MenteeDashboard";
import MentorDashboard from "./dashboards/MentorDashboard";
function App() {
  return (
    <AuthProvider> {/* FIXED: Changed AuthContext to AuthProvider */}
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/mentee-dashboard" element={<MenteeDashboard />} />
           <Route path="/mentor-dashboard" element={<MentorDashboard />} />
           
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
