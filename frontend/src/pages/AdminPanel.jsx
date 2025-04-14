import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function AdminPanel() {
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await api.get("/api/rooms");
        console.log("Respuesta /api/rooms:", response.data);
        setRooms(response.data);
      } catch (err) {
        setError(err.response?.data?.error || "Error al cargar las salas");
        console.error("Error:", err);
      }
    };
    fetchRooms();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Panel de Administración
        </h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Salas</h2>
        {rooms.length === 0 ? (
          <p className="text-gray-600">No hay salas registradas.</p>
        ) : (
          <div className="grid gap-6">
            {rooms.map((room) => (
              <div key={room.id} className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-800">
                  {room.name}
                </h3>
                <p className="text-gray-600">{room.description}</p>
                <p className="text-gray-600">Capacidad: {room.capacity}</p>
                <p className="text-gray-600">
                  Precio por hora: ${room.price_per_hour}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPanel;
