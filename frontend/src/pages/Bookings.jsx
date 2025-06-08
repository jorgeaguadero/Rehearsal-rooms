import Navbar from "../components/Navbar";
import { useLocation } from "react-router-dom";
import BookingForm from "../components/BookingForm";
import { useState, useEffect } from "react";
import api from "../services/api";

function Bookings() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const roomId = params.get("roomId");
  const [room, setRoom] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (roomId) {
      api.get(`/api/rooms/${roomId}`).then((res) => {
        setRoom(res.data);
        setShowForm(true);
      });
    }
  }, [roomId]);

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
      </div>
    </div>
  );
}

export default Bookings;
