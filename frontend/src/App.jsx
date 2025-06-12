import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Bookings from "./pages/Bookings";
import AdminPanel from "./pages/AdminPanel";
import Rooms from "./pages/Rooms";
import Profile from "./pages/Profile";
import Users from "./pages/Users";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  return (
    <UserProvider>
      <Router>
        <Navbar />
        <div className="min-h-screen bg-white">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/admin" element={<AdminPanel />} />{" "}
            {/*Implementar solo admin */}
            <Route path="/profile" element={<Profile />} />
            <Route path="/users" element={<Users />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </UserProvider>
  );
}

export default App;
