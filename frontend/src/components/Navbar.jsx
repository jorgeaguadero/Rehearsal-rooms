import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

function Navbar() {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="w-full fixed top-0 left-0 z-50 bg-[#68df9f] flex items-center justify-between px-6 h-16 shadow-md">
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <span className="text-2xl font-bold text-black tracking-tight">
          Rehearsal Rooms
        </span>
      </div>
      <div className="flex gap-4 items-center">
        <Link to="/rooms" className="text-black font-semibold hover:underline">
          Salas
        </Link>
        {user ? (
          user.role === "admin" ? (
            <>
              <Link
                to="/bookings"
                className="text-black font-semibold hover:underline"
              >
                Reservas
              </Link>
              <Link
                to="/users"
                className="text-black font-semibold hover:underline"
              >
                Usuarios
              </Link>
              <Link
                to="/admin"
                className="text-black font-semibold hover:underline"
              >
                Admin
              </Link>
              <Link
                to="/profile"
                className="text-black font-semibold hover:underline"
              >
                Perfil
              </Link>
              <button
                onClick={handleLogout}
                className="text-black font-semibold hover:underline bg-transparent border-none cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/bookings"
                className="text-black font-semibold hover:underline"
              >
                Reservas
              </Link>
              <Link
                to="/profile"
                className="text-black font-semibold hover:underline"
              >
                Perfil
              </Link>
              <button
                onClick={handleLogout}
                className="text-black font-semibold hover:underline bg-transparent border-none cursor-pointer"
              >
                Logout
              </button>
            </>
          )
        ) : (
          <>
            <Link
              to="/login"
              className="text-black font-semibold hover:underline"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-black font-semibold hover:underline"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
