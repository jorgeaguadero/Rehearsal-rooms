import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import RoomCard from "../components/RoomCard";
import api from "../services/api";
import Navbar from "../components/Navbar";

function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await api.get("/api/rooms");
        setRooms(response.data);
      } catch (err) {
        setError("Error al cargar las salas");
        console.error("Error:", err);
      }
    };
    fetchRooms();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <Navbar />
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Salas de Ensayo</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {rooms.length === 0 ? (
        <p className="text-gray-600">No hay salas disponibles.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      )}
      <div className="mt-6 text-center">
        <p className="text-gray-600">
          ¿No tienes cuenta?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Regístrate
          </Link>{" "}
          o{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Rooms;
