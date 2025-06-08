import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Bookings from "./pages/Bookings";
import AdminPanel from "./pages/AdminPanel";
import Rooms from "./pages/Rooms";
import Footer from "./components/Footer";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-[#07F5A6] via-[#07A6F5] to-[#075AF5]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/admin" element={<AdminPanel />} />{" "}
          {/*Implementar solo admin */}
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
