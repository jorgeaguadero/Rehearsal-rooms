import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Dashboard() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchBookings() {
      try {
        const res = await api.get("/api/bookings");
        setBookings(res.data);
      } catch {
        setError("Error al cargar las reservas");
      }
    }
    fetchBookings();
  }, []);

  const handleCancel = async (id) => {
    try {
      await api.delete(`/api/bookings/${id}`);
      setBookings((prev) => prev.filter((b) => b.id !== id));
    } catch {
      setError("No se pudo cancelar la reserva");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {bookings.length === 0 ? (
          <p className="mt-4 text-gray-600">No tienes reservas.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-4">
            {bookings.map((b) => {
              const start = new Date(b.start_time);
              const end = new Date(b.end_time);
              const dia = start.toLocaleDateString();
              const entrada = start.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });
              const salida = end.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });
              return (
                <div
                  key={b.id}
                  className="bg-white p-4 rounded-lg shadow-md flex flex-col justify-between h-full"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Sala: {b.room_name || b.room_id}
                    </h3>
                    <p className="text-gray-600 mb-1">Día: {dia}</p>
                    <p className="text-gray-600 mb-1">Entrada: {entrada}</p>
                    <p className="text-gray-600 mb-2">Salida: {salida}</p>
                  </div>
                  {b.status !== "cancelled" && (
                    <button
                      onClick={() => handleCancel(b.id)}
                      className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
