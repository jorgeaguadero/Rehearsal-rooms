import Navbar from "../components/Navbar";
import { useLocation } from "react-router-dom";
import BookingForm from "../components/BookingForm";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import api from "../services/api";

function Bookings() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const roomId = params.get("roomId");
  const [room, setRoom] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const { user } = useContext(UserContext);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (roomId) {
      api.get(`/api/rooms/${roomId}`).then((res) => {
        setRoom(res.data);
        setShowForm(true);
      });
    }
  }, [roomId]);

  useEffect(() => {
    if (!user) return;
    const fetchBookings = async () => {
      try {
        let res;
        if (user.role === "admin") {
          res = await api.get("/api/bookings"); // todas las reservas
        } else {
          res = await api.get(`/api/bookings/user/${user.id}`); // solo las del usuario
        }
        setBookings(res.data);
      } catch (err) {
        setError("Error al cargar reservas");
      }
    };
    fetchBookings();
  }, [user]);

  if (!user)
    return (
      <div className="text-center mt-10">
        Inicia sesión para ver tus reservas.
      </div>
    );

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800">Reservas</h1>
        {showForm && room && (
          <BookingForm
            room={room}
            onSuccess={() => setShowForm(false)}
            onError={() => {}}
          />
        )}
        {!roomId && (
          <p className="mt-4 text-gray-600">Gestiona tus reservas de salas.</p>
        )}
        <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Reservas</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#68df9f] text-white">
                <th className="p-2">ID</th>
                <th className="p-2">Sala</th>
                <th className="p-2">Usuario</th>
                <th className="p-2">Fecha</th>
                <th className="p-2">Estado</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-b">
                  <td className="p-2">{b.id}</td>
                  <td className="p-2">{b.room_id}</td>
                  <td className="p-2">{b.user_id || b.userId}</td>
                  <td className="p-2">
                    {new Date(b.start_time || b.start_date).toLocaleString()}
                  </td>
                  <td className="p-2">
                    {b.status ||
                      (b.pending_payment === 0 ? "Pagado" : "Pendiente")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {bookings.length === 0 && (
            <div className="text-center mt-4">No hay reservas.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Bookings;
