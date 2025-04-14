import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-xl font-bold">
          Rehearsal Rooms
        </Link>
        <div className="space-x-4">
          <Link to="/login" className="text-gray-300 hover:text-white">
            Login
          </Link>
          <Link to="/register" className="text-gray-300 hover:text-white">
            Register
          </Link>
          <Link to="/dashboard" className="text-gray-300 hover:text-white">
            Dashboard
          </Link>
          <Link to="/admin" className="text-gray-300 hover:text-white">
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
