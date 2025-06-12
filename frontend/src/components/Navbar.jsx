import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faUser } from "@fortawesome/free-solid-svg-icons";

function Navbar() {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

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
      {/* Burger menu para mobile */}
      <button
        className="md:hidden text-black text-2xl focus:outline-none"
        onClick={() => setMenuOpen((open) => !open)}
        aria-label="Abrir menú"
      >
        <FontAwesomeIcon icon={faBars} />
      </button>
      {/* Menú normal en desktop, menú desplegable en mobile */}
      <div
        className={`${
          menuOpen
            ? "flex flex-col absolute top-16 left-0 w-full bg-[#68df9f] shadow-md md:static md:flex-row md:items-center md:gap-4"
            : "hidden md:flex md:gap-4 md:items-center"
        }`}
        style={{ zIndex: 100 }}
        onClick={() => setMenuOpen(false)}
      >
        {/* Mostrar enlace a Salas solo si NO es admin */}
        {(!user || user.role !== "admin") && (
          <Link
            to="/rooms"
            className="text-black font-semibold hover:underline px-4 py-2 md:p-0"
          >
            Salas
          </Link>
        )}
        {user ? (
          user.role === "admin" ? (
            <>
              <Link
                to="/bookings"
                className="text-black font-semibold hover:underline px-4 py-2 md:p-0"
              >
                Reservas
              </Link>
              <Link
                to="/users"
                className="text-black font-semibold hover:underline px-4 py-2 md:p-0"
              >
                Usuarios
              </Link>
              <Link
                to="/admin"
                className="text-black font-semibold hover:underline px-4 py-2 md:p-0"
              >
                Admin
              </Link>
              <Link
                to="/profile"
                className="text-black font-semibold hover:underline flex items-center gap-1 px-4 py-2 md:p-0"
              >
                <FontAwesomeIcon icon={faUser} /> Perfil
              </Link>
              <button
                onClick={handleLogout}
                className="text-black font-semibold hover:underline bg-transparent border-none cursor-pointer px-4 py-2 md:p-0"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/bookings"
                className="text-black font-semibold hover:underline px-4 py-2 md:p-0"
              >
                Reservas
              </Link>
              <Link
                to="/profile"
                className="text-black font-semibold hover:underline flex items-center gap-1 px-4 py-2 md:p-0"
              >
                <FontAwesomeIcon icon={faUser} /> Perfil
              </Link>
              <button
                onClick={handleLogout}
                className="text-black font-semibold hover:underline bg-transparent border-none cursor-pointer px-4 py-2 md:p-0"
              >
                Logout
              </button>
            </>
          )
        ) : (
          <>
            <Link
              to="/login"
              className="text-black font-semibold hover:underline px-4 py-2 md:p-0"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-black font-semibold hover:underline px-4 py-2 md:p-0"
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
